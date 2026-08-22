import { ArrowLeft, Trash2, ExternalLink, ShoppingBag } from 'lucide-react';

export default function ListDetailPage({ listName, items, onBack, onRemove }) {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1.5rem',
          padding: '4px 0',
          transition: 'color 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={16} /> Back to My Lists
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>{listName}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {/* Empty list state */}
      {items.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '5rem 2rem',
          background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.08)',
        }}>
          <ShoppingBag size={48} style={{ color: 'var(--neon-purple)', opacity: 0.4, margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 500 }}>This list is empty</h3>
          <p style={{ color: 'var(--text-muted)', opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Go back to Search and save some products here.
          </p>
        </div>
      )}

      {/* Product grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {items.map((product, idx) => (
          <ListProductCard key={product.productUrl + idx} product={product} onRemove={() => onRemove(product.productUrl)} />
        ))}
      </div>
    </div>
  );
}

function ListProductCard({ product, onRemove }) {
  return (
    <div
      className="glass-panel"
      style={{
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'fadeIn 0.4s ease-out forwards',
        position: 'relative',
      }}
    >
      {/* Top accent */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--neon-purple), transparent)' }} />

      {/* Image */}
      <div style={{ height: '180px', backgroundColor: '#fff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <img
          src={product.imageUrl}
          alt={product.productName}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        {/* Source badge */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: 'rgba(0,0,0,0.75)', padding: '3px 8px',
          borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
          backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {product.source}
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          title="Remove from list"
          style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,80,80,0.3)',
            borderRadius: '8px', color: '#ff8080', cursor: 'pointer',
            padding: '5px', display: 'flex', alignItems: 'center',
            backdropFilter: 'blur(4px)', transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.25)'; e.currentTarget.style.color = '#ff4444'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.75)'; e.currentTarget.style.color = '#ff8080'; }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.productName}
        </h3>

        <div style={{ marginTop: 'auto' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</p>
          <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--neon-purple)', marginBottom: '1rem' }}>
            {product.currency}{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </p>

          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-main)', textDecoration: 'none',
              fontWeight: 500, fontSize: '0.875rem', transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            View on {product.source} <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
