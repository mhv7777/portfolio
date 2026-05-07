import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Project } from '../types';
import { getVimeoEmbedUrl } from '../utils/video';
import CreditsList from '../components/CreditsList';
import PlayerLib from '@vimeo/player';

type LocationState = { project?: Project };

const VideoWrapper: React.FC<{ src?: string; title?: string; autoplay?: boolean }> = ({ src, title, autoplay = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const lastVolumeRef = useRef<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(true);
  const [hasPlayer, setHasPlayer] = useState<boolean>(false);

  const safePlayer = () => playerRef.current;

  useEffect(() => {
    const container = containerRef.current;
    if (!src || !container) return;
    let mounted = true;
    let player: any = null;
    const mount = document.createElement('div');
    mount.style.position = 'absolute';
    mount.style.inset = '0';
    // clear and append mount
    container.innerHTML = '';
    container.appendChild(mount);

    (async () => {
      try {
        // instantiate player using SDK (let it create the iframe)
        player = new (PlayerLib as any)(mount, {
          url: src as any,
          autoplay: Boolean(autoplay),
          muted: true, // start muted to satisfy autoplay policies
          loop: true,
          controls: false,
          playsinline: true,
        });

        playerRef.current = player;

        // wait for player to be ready before using API
        try { await player.ready(); } catch (err) { console.warn('player.ready() warning', err); }

        if (!mounted) return;

        setHasPlayer(true);

        // initial state
        try {
          const d = await player.getDuration();
          setDuration(Math.floor(d || 0));
        } catch {}

        try {
          const t = await player.getCurrentTime();
          setTime(Math.floor(t || 0));
        } catch {}

        try {
          const paused = await player.getPaused();
          setIsPlaying(!paused);
        } catch {}

        try {
          const vol = await player.getVolume();
          lastVolumeRef.current = typeof vol === 'number' ? vol : lastVolumeRef.current || 1;
          setMuted(lastVolumeRef.current === 0);
        } catch {}

        // attach event handlers (no polling)
        try {
          player.on('play', () => { if (mounted) setIsPlaying(true); });
          player.on('pause', () => { if (mounted) setIsPlaying(false); });
          player.on('timeupdate', (data: any) => { if (mounted) setTime(Math.floor(data.seconds || 0)); });
          player.on('ended', async () => {
            if (!mounted) return;
            try { await player.setCurrentTime(0); await player.play(); } catch {}
          });
        } catch (e) {
          console.warn('player event attach failed', e);
        }
      } catch (err) {
        console.error('Failed to initialize Vimeo Player', err);
      }
    })();

    return () => {
      mounted = false;
      try {
        if (player) {
          player.off && player.off('play');
          player.off && player.off('pause');
          player.off && player.off('timeupdate');
          player.off && player.off('ended');
          if (typeof player.unload === 'function') {
            try { player.unload(); } catch {}
          }
        }
      } catch (e) { /* ignore */ }
      playerRef.current = null;
      try { container.innerHTML = ''; } catch {}
    };
  }, [src, autoplay]);

  const togglePlay = async () => {
    const p = safePlayer();
    if (!p) return;
    try {
      await p.ready();
      const paused = await p.getPaused();
      if (paused) await p.play();
      else await p.pause();
    } catch (e) {
      console.error('togglePlay error', e);
    }
  };

  const toggleMute = async () => {
    const p = safePlayer();
    if (!p) {
      setMuted(prev => !prev);
      return;
    }
    try {
      await p.ready();
      const curVol = await p.getVolume();
      lastVolumeRef.current = (typeof curVol === 'number' && curVol > 0) ? curVol : lastVolumeRef.current || 1;
      if (muted) {
        await p.setVolume(lastVolumeRef.current || 1);
        try { await p.play(); } catch {}
        setMuted(false);
      } else {
        await p.setVolume(0);
        setMuted(true);
      }
    } catch (e) {
      console.error('toggleMute error', e);
      setMuted(prev => !prev);
    }
  };

  const handleFullscreen = async () => {
    const iframe = containerRef.current?.querySelector('iframe') as HTMLIFrameElement | null;
    const el = iframe || containerRef.current;
    if (!el) return;
    try {
      if ((el as any).requestFullscreen) { await (el as any).requestFullscreen(); return; }
      const anyEl: any = el;
      if (anyEl.webkitRequestFullscreen) anyEl.webkitRequestFullscreen();
    } catch (e) { console.error('fullscreen failed', e); }
  };

  const seek = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const p = safePlayer();
    if (!p) return;
    try {
      await p.ready();
      const pct = Number(ev.target.value);
      const t = (pct / 100) * (duration || 0);
      await p.setCurrentTime(t);
    } catch (e) { console.error('seek failed', e); }
  };

  const progressPercent = duration ? Math.min(100, Math.round((time / duration) * 100)) : 0;

  return (
    <div style={{ width: '80%', maxWidth: 1200, margin: '0 auto 1.25rem' }}>
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', overflow: 'hidden' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:10 }}>
        <button onClick={togglePlay} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#EDEDED', padding: '6px 10px', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.12em' }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button onClick={toggleMute} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#EDEDED', padding: '6px 10px', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.12em' }}>
          {muted ? 'Unmute' : 'Mute'}
        </button>

        <button onClick={handleFullscreen} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#EDEDED', padding: '6px 10px', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.12em' }}>
          Fullscreen
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={progressPercent}
          onChange={() => {}}
          aria-hidden
          style={{
            flex: 1,
            accentColor: '#ff4d4f',
            height: 6,
            pointerEvents: 'none',
            background: 'transparent',
            WebkitAppearance: 'none',
            appearance: 'none'
          }}
        />

        <div style={{ color:'#bdbdbd', minWidth: 64, textAlign: 'right' }}>{duration ? `${time}/${duration}s` : '--/--'}</div>
      </div>
    </div>
  );
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation<LocationState>();
  const [project, setProject] = useState<Project | null>(location.state?.project ?? null);
  const [loading, setLoading] = useState<boolean>(!project);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) return;
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const raw = await res.json();
        const normalized: Project = {
          ...raw,
          createdAt: raw.createdAt ? new Date(raw.createdAt) : raw.createdAt,
          updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : raw.updatedAt,
          videoUrl: raw.videoUrl ?? raw.originalVideoLink ?? raw.link ?? raw.videoUrl,
          link: raw.link ?? raw.videoUrl ?? raw.originalVideoLink ?? raw.link,
        };
        if (mounted) setProject(normalized);
      } catch (err) {
        if (mounted) setError('Failed to load project.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, project]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (error) return <div style={{ padding: 40 }}>{error}</div>;
  if (!project) return <div style={{ padding: 40 }}>Project not found.</div>;

  const videoSrcRaw = (project as any).videoUrl || (project as any).originalVideoLink || (project as any).link || '';
  const videoSrc = getVimeoEmbedUrl(videoSrcRaw);

  return (
    <main style={{ padding: '3rem 4rem', textAlign: 'center' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#EDEDED', textDecoration: 'none' }}>
        ← Back
      </Link>

      <VideoWrapper src={videoSrc || (project.thumbnail ?? '')} title={project.title} autoplay />

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', color: '#ddd' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#EDEDED', margin: '0 0 1rem 0' }}>{project.title}</h1>

        <div style={{ color: '#bdbdbd', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {project.category ?? 'All Projects'}{project.role ? ` — ${project.role}` : ''}
        </div>

        {project.description ? <p style={{ marginTop: 12, lineHeight: 1.6 }}>{project.description}</p> : null}

        <CreditsList credits={project.credits} />
      </div>

      <section style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#bdbdbd', marginBottom: '0.75rem' }}>
          INFO
        </h3>

        {Array.isArray((project as any).assets) && (project as any).assets.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {(project as any).assets.map((a: any, i: number) => (
              <div key={i} style={{ background: '#111', padding: 8 }}>
                {a.type === 'video' ? (
                  <iframe
                    src={getVimeoEmbedUrl(a.src)}
                    title={`asset-${i}`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: 120 }}
                  />
                ) : (
                  <img src={a.src} alt={a.label || `asset-${i}`} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#8f8f8f' }}>No extra assets. Add photos / bts / other videos in the admin panel.</div>
        )}
      </section>
    </main>
  );
};

export default ProjectDetail;