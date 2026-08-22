import { useState, useRef, useEffect } from 'react';
import { Bookmark, Check, Plus, ChevronDown } from 'lucide-react';

export default function SaveToListButton({ product, lists, onAddToList, onCreateAndAdd }) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(null); // list name just saved to
  const ref = useRef(null);

  const listNames = Object.keys(lists);
  const savedInLists = listNames.filter(name =>
    (lists[name] || []).some(p => p.productUrl === product.productUrl)
  );
  const isSavedAnywhere = savedInLists.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSave = (listName) => {
    if (savedInLists.includes(listName)) return;
    onAddToList(listName, product);
    setSavedFeedback(listName);
    setTimeout(() => setSavedFeedback(null), 1500);
  };

  const handleCreate = () => {
    setError('');
    const result = onCreateAndAdd(newListName, product);
    if (!result.ok) { setError(result.error); return; }
    setNewListName('');
    setCreating(false);
    setSavedFeedback(newListName.trim());
    setTimeout(() => setSavedFeedback(null), 1500);
  };

  return (
    <div ref={ref} style={{ position: 'relative', marginTop: '0.75rem' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          padding: '10px 12px',
          background: isSavedAnywhere ? 'rgba(0,243,255,0.1)' : 'rgba(255,255,255,0.04)',
          border: isSavedAnywhere ? '1px solid rgba(0,243,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          color: isSavedAnywhere ? 'var(--neon-cyan)' : 'var(--text-muted)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={e => { if (!isSavedAnywhere) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-main)'; }}}
        onMouseOut={e => { if (!isSavedAnywhere) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
      >
        <Bookmark size={15} fill={isSavedAnywhere ? 'var(--neon-cyan)' : 'none'} />
        {isSavedAnywhere ? `Saved (${savedInLists.length})` : 'Save to List'}
        <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: 'rgba(18, 18, 28, 0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '0.5rem',
          zIndex: 200,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {listNames.length === 0 && !creating && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}>
              No lists yet. Create one below!
            </p>
          )}

          {listNames.map(name => {
            const inThis = savedInLists.includes(name);
            const justSaved = savedFeedback === name;
            return (
              <button
                key={name}
                onClick={() => handleSave(name)}
                disabled={inThis}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 10px',
                  background: justSaved ? 'rgba(0,243,255,0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: inThis ? 'var(--neon-cyan)' : 'var(--text-main)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  cursor: inThis ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  opacity: inThis ? 0.7 : 1,
                }}
                onMouseOver={e => { if (!inThis) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseOut={e => { if (!inThis) e.currentTarget.style.background = 'transparent'; }}
              >
                {inThis ? <Check size={14} color="var(--neon-cyan)" /> : <Bookmark size={14} />}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                {inThis && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Saved</span>}
              </button>
            );
          })}

          {/* Divider */}
          {listNames.length > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.4rem 0' }} />}

          {/* Create new list */}
          {creating ? (
            <div style={{ padding: '4px 2px' }}>
              <input
                autoFocus
                type="text"
                placeholder="List name..."
                value={newListName}
                onChange={e => { setNewListName(e.target.value); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: error ? '1px solid rgba(255,80,80,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: 'var(--text-main)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  outline: 'none',
                  marginBottom: error ? '4px' : '6px',
                }}
              />
              {error && <p style={{ color: '#ff6060', fontSize: '0.75rem', marginBottom: '6px', padding: '0 2px' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleCreate} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: 'var(--neon-cyan)', color: '#000', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                  Create & Save
                </button>
                <button onClick={() => { setCreating(false); setError(''); setNewListName(''); }} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', padding: '8px 10px',
                background: 'transparent', border: 'none', borderRadius: '8px',
                color: 'var(--neon-cyan)', fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(0,243,255,0.06)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <Plus size={14} /> Create new list
            </button>
          )}
        </div>
      )}
    </div>
  );
}
