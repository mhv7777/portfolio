import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Project } from '../types';
import { getVimeoEmbedUrl } from '../utils/video';
import CreditsList from '../components/CreditsList';

type LocationState = { project?: Project };

const VideoWrapper: React.FC<{ src?: string; title?: string; autoplay?: boolean }> = ({ src, title, autoplay = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const pollRef = useRef<number | null>(null);
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
    let localPlayer: any = null;
    let localPoll: number | null = null;

    const extractVimeoId = (u: string) => {
      try {
        const m = u.match(/(?:vimeo\.com\/(?:.*?\/)?|player\.vimeo\.com\/video\/)(\d+)/);
        return m ? m[1] : null;
      } catch {
        return null;
      }
    };

    const applyIframeStyles = (frame: HTMLIFrameElement | null) => {
      try {
        if (!frame) return;
        frame.style.position = 'absolute';
        frame.style.top = '0';
        frame.style.left = '0';
        frame.style.width = '100%';
        frame.style.height = '100%';
        frame.style.border = '0';
      } catch {}
    };

    (async () => {
      const cleanupPlayerListeners = (p: any) => {
        try {
          p?.off && typeof p.off === 'function' && p.off('play') && p.off('pause') && p.off('timeupdate') && p.off('ended');
        } catch {}
      };

      try {
        const mod = await import('@vimeo/player');
        const Player = (mod as any).default ?? (mod as any).Player ?? (mod as any);

        // clear any previous content
        container.innerHTML = '';

        // prefer numeric Vimeo id when possible
        const vid = extractVimeoId(String(src));
        if (vid) {
          localPlayer = new Player(container, {
            id: Number(vid),
            autoplay,
            controls: false,
            playsinline: true,
            loop: true,
          });
        } else {
          // fallback to using the full url
          localPlayer = new Player(container, {
            url: src as any,
            autoplay,
            controls: false,
            playsinline: true,
            loop: true,
          });
        }

        playerRef.current = localPlayer;

        // ensure iframe fills container after player creates it
        const forceFill = () => {
          try {
            const frame = container.querySelector('iframe') as HTMLIFrameElement | null;
            applyIframeStyles(frame);
            // ensure container has positioning so absolute iframe fits
            if (container instanceof HTMLElement) {
              if (!container.style.position) container.style.position = 'relative';
            }
          } catch {}
        };
        forceFill();
        try { await localPlayer.ready(); forceFill(); } catch {}

        // initial volume state
        try {
          const vol = await localPlayer.getVolume();
          lastVolumeRef.current = typeof vol === 'number' ? vol : 1;
          setMuted(lastVolumeRef.current === 0);
        } catch { lastVolumeRef.current = 1; }

        if (autoplay) {
          try { await localPlayer.setVolume(0); } catch {}
          setMuted(true);
          try { await localPlayer.play(); } catch {}
        } else {
          try {
            const paused = await localPlayer.getPaused();
            setIsPlaying(!paused);
          } catch {}
        }

        setHasPlayer(true);

        // attach events
        try {
          localPlayer.on('play', () => { if (mounted) setIsPlaying(true); });
          localPlayer.on('pause', () => { if (mounted) setIsPlaying(false); });
          localPlayer.getDuration().then((d: number) => { if (mounted) setDuration(Math.floor(d || 0)); }).catch(()=>{});
          localPlayer.on('timeupdate', (data: any) => { if (mounted) setTime(Math.floor(data.seconds || 0)); });
          localPlayer.on('ended', async () => {
            try { if (!mounted) return; await localPlayer.setCurrentTime(0); await localPlayer.play(); } catch {}
          });
        } catch (e) { /* non-fatal */ }

        // polling for conservative updates (keeps UI in sync)
        if (localPoll) window.clearInterval(localPoll);
        localPoll = window.setInterval(async () => {
          if (!mounted || !localPlayer) return;
          try {
            const t = await localPlayer.getCurrentTime();
            const d = await localPlayer.getDuration();
            const paused = await localPlayer.getPaused();
            if (mounted) {
              setTime(Math.floor(t || 0));
              setDuration(Math.floor(d || 0));
              setIsPlaying(!paused);
              try {
                const v = await localPlayer.getVolume();
                setMuted((typeof v === 'number' && v === 0));
              } catch {}
            }
          } catch {}
        }, 500);
        pollRef.current = localPoll;
      } catch (err) {
        // fallback: inject iframe and attempt to attach a Player to the iframe element
        try {
          container.innerHTML = '';
          const sep = String(src).includes('?') ? '&' : '?';
          const iframe = document.createElement('iframe');
          iframe.src = `${src}${sep}autoplay=${autoplay ? '1' : '0'}&muted=1&playsinline=1&controls=0&loop=1`;
          iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
          iframe.allowFullscreen = true;
          applyIframeStyles(iframe);
          container.appendChild(iframe);
          setMuted(true);

          // try to attach player API to the iframe
          try {
            const mod2 = await import('@vimeo/player');
            const Player2 = (mod2 as any).default ?? (mod2 as any).Player ?? (mod2 as any);
            localPlayer = new Player2(iframe);
            playerRef.current = localPlayer;
            setHasPlayer(true);

            // attach events and polling same as above
            try {
              await localPlayer.ready();
            } catch {}
            localPlayer.on && localPlayer.on('timeupdate', (data: any) => { if (mounted) setTime(Math.floor(data.seconds || 0)); });
            if (localPoll) window.clearInterval(localPoll);
            localPoll = window.setInterval(async () => {
              if (!mounted || !localPlayer) return;
              try {
                const t = await localPlayer.getCurrentTime();
                const d = await localPlayer.getDuration();
                const paused = await localPlayer.getPaused();
                if (mounted) {
                  setTime(Math.floor(t || 0));
                  setDuration(Math.floor(d || 0));
                  setIsPlaying(!paused);
                }
              } catch {}
            }, 500);
            pollRef.current = localPoll;
          } catch (e) {
            // nothing else we can do — iframe will play but API may not be available
          }
        } catch (e) {
          // final fallback: leave container empty
        }
      }
    })();

    return () => {
      mounted = false;
      if (localPoll) window.clearInterval(localPoll);
      const toUnload = localPlayer ?? playerRef.current;
      if (toUnload && typeof toUnload.unload === 'function') {
        try { toUnload.unload(); } catch {}
      }
      try {
        // attempt to remove event listeners if available
        (playerRef.current as any)?.off && (playerRef.current as any).off('play');
        (playerRef.current as any)?.off && (playerRef.current as any).off('pause');
        (playerRef.current as any)?.off && (playerRef.current as any).off('timeupdate');
        (playerRef.current as any)?.off && (playerRef.current as any).off('ended');
      } catch {}
      playerRef.current = null;
      pollRef.current = null;
      if (container) {
        try { container.innerHTML = ''; } catch {}
      }
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
    } catch (e) { console.error('togglePlay error', e); }
  };

  const toggleMute = async () => {
    const p = safePlayer();
    // allow mute/unmute attempt regardless; button always enabled visually
    if (!p) {
      // if no player, just flip UI state for consistency
      setMuted(prev => !prev);
      return;
    }
    try {
      await p.ready();
      const curVol = await p.getVolume();
      lastVolumeRef.current = (typeof curVol === 'number' && curVol > 0) ? curVol : lastVolumeRef.current || 1;
      if (muted) {
        // unmute: restore volume and attempt to play to satisfy mobile user-gesture policy
        await p.setVolume(lastVolumeRef.current || 1);
        try { await p.play(); } catch (e) { /* ignore play rejection */ }
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

  // styled range: red visual, non-interactive (visual only)
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
          // visual-only: disable pointer interaction
          onChange={() => {}}
          aria-hidden
          style={{
            flex: 1,
            accentColor: '#ff4d4f', /* modern browsers will color track/thumb */
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

        {/* render structured credits */}
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