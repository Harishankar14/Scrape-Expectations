import { useState } from 'react';
import { Plus, Trash2, ChevronRight, BookMarked, ShoppingBag } from 'lucide-react';

export default function ListsPage({ lists, onCreateList, onDeleteList, onOpenList }) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const listNames = Object.keys(lists);

  const handleCreate = () => {
    setError('');
    const result = onCreateList(newName);
    if (!result.ok) { setError(result.error); return; }
    setNewName('');
    setCreating(false);
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>My Lists</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>
            {listNames.length === 0 ? 'Save products from search results to a list.' : `${listNames.length} list${listNames.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            border: 'none', color: '#fff', fontWeight: 600,
            fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0,243,255,0.2)',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} /> New List
        </button>
      </div>

      {/* Create new list inline panel */}
      {creating && (
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', animation: 'fadeIn 0.2s ease-out' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Name your new list</p>
          <input
            autoFocus
            type="text"
            placeholder="e.g. Holiday Gifts, Work Gear..."
            value={newName}
            onChange={e => { setNewName(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            style={{
              width: '100%', padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: error ? '1px solid rgba(255,80,80,0.5)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', color: 'var(--text-main)',
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', outline: 'none',
              marginBottom: error ? '6px' : '12px',
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: '#ff6060', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCreate}
              style={{ flex: 1, padding: '9px', borderRadius: '8px', border: 'none', background: 'var(--neon-cyan)', color: '#000', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Create List
            </button>
            <button
              onClick={() => { setCreating(false); setError(''); setNewName(''); }}
              style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {listNames.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.08)',
        }}>
          <BookMarked size={48} style={{ color: 'var(--neon-purple)', opacity: 0.5, margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 500 }}>No lists yet</h3>
          <p style={{ color: 'var(--text-muted)', opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Hit "New List" or save a product from a search result to get started.
          </p>
        </div>
      )}

      {/* List cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {listNames.map(name => {
          const items = lists[name] || [];
          return (
            <div
              key={name}
              className="glass-panel"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onClick={() => onOpenList(name)}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(0,243,255,0.2)'; e.currentTarget.style.background = 'rgba(0,243,255,0.04)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(20,20,30,0.6)'; }}
            >
              {/* Icon */}
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(188,19,254,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingBag size={20} color="var(--neon-purple)" />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '1.05rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={e => { e.stopPropagation(); setConfirmDelete(name); }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}
                onMouseOver={e => { e.currentTarget.style.color = '#ff6060'; e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                title="Delete list"
              >
                <Trash2 size={16} />
              </button>

              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </div>
          );
        })}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.15s ease-out',
        }} onClick={() => setConfirmDelete(null)}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '360px', width: '90%', animation: 'fadeIn 0.2s ease-out' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '0.75rem' }}>Delete "{confirmDelete}"?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This will permanently remove the list and all {(lists[confirmDelete] || []).length} saved items.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { onDeleteList(confirmDelete); setConfirmDelete(null); }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#ff4444', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
