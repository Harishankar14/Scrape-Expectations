import { BookMarked, Search } from 'lucide-react';

export default function Navbar({ page, setPage, listCount }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: '60px',
      background: 'rgba(10, 10, 15, 0.7)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Logo */}
      <span
        onClick={() => setPage('search')}
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer',
          letterSpacing: '-0.5px',
          userSelect: 'none',
        }}
      >
        Scrape-Expectations
      </span>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <NavButton
          icon={<Search size={16} />}
          label="Search"
          active={page === 'search'}
          onClick={() => setPage('search')}
        />
        <NavButton
          icon={<BookMarked size={16} />}
          label={`My Lists${listCount > 0 ? ` (${listCount})` : ''}`}
          active={page === 'lists' || page === 'list-detail'}
          onClick={() => setPage('lists')}
        />
      </div>
    </nav>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 16px',
        borderRadius: '20px',
        border: active ? '1px solid rgba(0,243,255,0.4)' : '1px solid transparent',
        background: active ? 'rgba(0,243,255,0.08)' : 'transparent',
        color: active ? 'var(--neon-cyan)' : 'var(--text-muted)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={e => { if (!active) e.currentTarget.style.color = 'var(--text-main)'; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)'; }}
    >
      {icon}
      {label}
    </button>
  );
}
