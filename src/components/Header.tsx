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
    <header className="header-grid px-8 py-6 text-white">
      {/* keep categories visible on desktop, hide on narrow screens to simplify mobile */}
      <div className="text-left space-y-1 text-xs uppercase tracking-wide hidden sm:block">
        {categories.map((cat, i) => (
          <p
            key={i}
            className={`cursor-pointer hover:opacity-60 ${selectedCategory === cat ? 'font-bold' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </p>
        ))}
      </div>

      <div className="header-center text-center">
        {/* smaller on mobile, original size on tablet+ */}
        <h1 className="text-3xl md:text-4xl font-serif">MIGUEL HILARIO VERDUZCO</h1>

        <div className="role-toggle mt-2" aria-hidden={false}>
          <span
            role="button"
            tabIndex={0}
            onClick={() => handleRoleClick(selectedRole === 'DIRECTOR' ? null : 'DIRECTOR')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRoleClick(selectedRole === 'DIRECTOR' ? null : 'DIRECTOR'); }}
            className={`select-none cursor-pointer hover:opacity-60 ${selectedRole === 'DIRECTOR' ? 'role-active' : ''}`}
            aria-pressed={selectedRole === 'DIRECTOR'}
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
          >
            EDITOR
          </span>
        </div>
      </div>

      <div className="text-right space-y-1 text-xs uppercase tracking-wide">
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
  );
};

export default Header;