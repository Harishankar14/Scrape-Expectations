import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [val, setVal] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch(val);
  };

  return (
    <form 
      onSubmit={submit} 
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '0 auto',
        maxWidth: '600px',
        position: 'relative'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '8px 16px',
          borderRadius: '50px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          animation: 'pulseGlow 3s infinite'
        }}
      >
        <Search color="var(--neon-cyan)" size={24} style={{ marginRight: '12px' }} />
        <input 
          type="text" 
          placeholder="What product are you looking for?" 
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '1.1rem',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            marginLeft: '12px',
            background: 'var(--gradient-neon)',
            border: 'none',
            borderRadius: '30px',
            padding: '10px 24px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Scraping...' : 'Compare'}
        </button>
      </div>
    </form>
  );
}
