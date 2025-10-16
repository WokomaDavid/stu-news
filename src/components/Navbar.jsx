import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const items = [
    { label: 'Home', to: '/' },
    { label: 'Events', to: '/events' },
    { label: 'Announcements', to: '/announcements' },
    { label: 'Results', to: '/results' },
    { label: 'Archive', to: '/archive' },
    { label: 'Admin', to: '/admin' },
  ];

  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-primary to-accent text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-bold">stunews</h1>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <ul className="flex gap-3 text-sm font-medium items-center">
            {items
              .filter((it) => !(it.label === 'Home' && location.pathname === '/'))
              .map((it) => (
                <li key={it.to}>
                  <Link to={it.to} className="px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
                    {it.label}
                  </Link>
                </li>
              ))}
          </ul>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button aria-label="Toggle menu" onClick={() => setOpen((s) => !s)} className="p-2 rounded-md hover:bg-white/10">
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gradient-to-b from-primary/90 to-accent/90 px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {items.map((it) => (
              <li key={it.to}>
                <Link to={it.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md">{it.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
};

export default Navbar;
