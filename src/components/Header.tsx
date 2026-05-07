import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  'All Projects',
  'Selected Work',
  'Narrative',
  'Music Videos',
  'Commercials',
];

const roles = ['DIRECTOR', 'EDITOR'];

interface HeaderProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedRole: string | null;
  onSelectRole: (role: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedCategory, onSelectCategory, selectedRole, onSelectRole }) => {
  const [manual, setManual] = useState(false);
  const [animating, setAnimating] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const idxRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // Idle animation: cycle [+, DIRECTOR, EDITOR] starting with +
  useEffect(() => {
    if (manual) {
      setAnimating(false);
      return;
    }

    const seq: (string | null)[] = [null, 'DIRECTOR', 'EDITOR'];
    idxRef.current = 0;
    onSelectRole(seq[idxRef.current]);
    setAnimating(true);

    intervalRef.current = window.setInterval(() => {
      idxRef.current = (idxRef.current + 1) % seq.length;
      onSelectRole(seq[idxRef.current]);
    }, 2400); // slower, more deliberate

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setAnimating(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual]); // re-run only if manual changes

  const handleRoleClick = (role: string | null) => {
    // user interaction stops idle animation
    setManual(true);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAnimating(false);
    onSelectRole(role);
  };

  return (
    <>
      {/* Mobile-only styles: only affect <= 768px; desktop layout unchanged */}
      <style>{`
        @media (max-width: 768px) {
          .header-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 10px;
            align-items: start;
          }
          .header-grid .text-left { display: none !important; } /* hide desktop left nav */
          .header-grid .text-right { display: none !important; } /* hide desktop right info link */
          /* ensure center column is centered on mobile */
          .header-center { order: 2; padding: 0 12px; text-align: center !important; }
          .header-center h1 { margin-left: 0 !important; margin-right: 0 !important; }
          .mobile-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
          .mobile-hamburger { display: inline-flex; align-items: center; justify-content: center; padding: 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #EDEDED; }
          .mobile-nav { display: ${mobileOpen ? 'block' : 'none'}; padding: 8px 12px 0 12px; }
          .mobile-nav button { width: 100%; text-align: left; padding: 10px 12px; background: transparent; border: none; color: #cfcfcf; font-weight: 500; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; }
          .header-center h1 { font-size: clamp(1.05rem, 5.6vw, 1.75rem); line-height: 1.05; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: keep-all; }
          .role-toggle { margin-top: 6px; display: flex; gap: 12px; justify-content: center; }
        }
        @media (min-width: 769px) {
          .mobile-hamburger, .mobile-nav { display: none !important; }
        }
      `}</style>

      <header className="header-grid px-8 py-6 text-white" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        {/* Left column (desktop categories) */}
        <div className="text-left space-y-1 text-xs uppercase tracking-wide">
          {categories.map((cat, i) => (
            <p
              key={i}
              className={`cursor-pointer hover:opacity-60 ${selectedCategory === cat ? 'font-bold' : ''}`}
              onClick={() => { onSelectCategory(cat); setMobileOpen(false); }}
            >
              {cat}
            </p>
          ))}
        </div>

        {/* Center column (title + roles) */}
        <div className="header-center text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* mobile top row: hamburger + title + info (only visible on mobile) */}
          <div className="mobile-top" style={{ width: '100%', display: 'none' /* default hidden, shown via media query */ }}>
            <button
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((s) => !s)}
              className="mobile-hamburger"
              style={{ display: 'none' }}
            >
              <span style={{ display: 'block', width: 16, height: 2, background: '#EDEDED', marginBottom: 3 }} />
              <span style={{ display: 'block', width: 16, height: 2, background: '#EDEDED', marginBottom: 3 }} />
              <span style={{ display: 'block', width: 16, height: 2, background: '#EDEDED' }} />
              <span className="sr-only">Toggle menu</span>
            </button>

            {/* Keep title centered */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h1 className="text-3xl md:text-4xl font-serif">MIGUEL HILARIO VERDUZCO</h1>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link to="/info" aria-label="Information" style={{ color: '#EDEDED', textDecoration: 'none', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }}>
                Info
              </Link>
            </div>
          </div>

          {/* default center title for desktop (keeps original look) */}
          <h1 className="text-3xl md:text-4xl font-serif" style={{ margin: '0.1rem 0' }}>MIGUEL HILARIO VERDUZCO</h1>

          <div className="role-toggle mt-2" aria-hidden={false}>
            <span
              role="button"
              tabIndex={0}
              onClick={() => handleRoleClick(selectedRole === 'DIRECTOR' ? null : 'DIRECTOR')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick(selectedRole === 'DIRECTOR' ? null : 'DIRECTOR'); }}
              className={`select-none cursor-pointer hover:opacity-60 ${selectedRole === 'DIRECTOR' ? 'role-active' : ''}`}
              aria-pressed={selectedRole === 'DIRECTOR'}
              style={{ marginRight: 10 }}
            >
              DIRECTOR
            </span>

            <span
              role="button"
              tabIndex={0}
              onClick={() => handleRoleClick(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick(null); }}
              className={`select-none plus cursor-pointer hover:opacity-60 ${selectedRole === null ? 'all-active' : ''} ${animating ? 'animating' : ''}`}
              aria-pressed={selectedRole === null}
              aria-label="Show all roles"
              style={{ margin: '0 10px' }}
            >
              +
            </span>

            <span
              role="button"
              tabIndex={0}
              onClick={() => handleRoleClick(selectedRole === 'EDITOR' ? null : 'EDITOR')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick(selectedRole === 'EDITOR' ? null : 'EDITOR'); }}
              className={`select-none cursor-pointer hover:opacity-60 ${selectedRole === 'EDITOR' ? 'role-active' : ''}`}
              aria-pressed={selectedRole === 'EDITOR'}
              style={{ marginLeft: 10 }}
            >
              EDITOR
            </span>
          </div>
        </div>

        {/* Right column (desktop info link) */}
        <div
          className="text-right space-y-1 text-xs uppercase tracking-wide"
          // align to the top of the grid cell (matches left nav start)
          style={{ alignSelf: 'start', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}
        >
          <Link
            to="/info"
            className="font-bold cursor-pointer hover:opacity-60"
            style={{ textDecoration: 'none', display: 'inline-block', color: '#EDEDED' } as React.CSSProperties}
            aria-label="Information"
          >
            Information
          </Link>
        </div>
      </header>

      {/* Mobile nav panel (collapsed left categories) */}
      <nav id="mobile-nav" className="mobile-nav" aria-hidden={!mobileOpen} style={{ display: mobileOpen ? 'block' : 'none' }}>
        <div style={{ padding: 12 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { onSelectCategory(cat); setMobileOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                background: 'transparent',
                border: 'none',
                color: selectedCategory === cat ? '#fff' : '#cfcfcf',
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;