import { ExternalLink } from 'lucide-react';
import SaveToListButton from './SaveToListButton';

export default function ProductCard({ product, delay = 0, lists = {}, onAddToList, onCreateAndAdd }) {
  const trustColor = 'var(--neon-cyan)';

  return (
    <div 
      className="glass-panel"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: `fadeIn 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
        transform: 'translateY(20px)',
        position: 'relative'
      }}
    >
      {/* Accent Top Border */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${trustColor}, transparent)` }}></div>
      
      {/* Product Image */}
      <div style={{ position: 'relative', height: '220px', backgroundColor: '#fff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={product.imageUrl} 
          alt={product.productName} 
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.7)',
          padding: '4px 10px',
          borderRadius: '16px',
          fontSize: '0.8rem',
          fontWeight: '600',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {product.source}
        </div>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>
          {product.productName}
        </h3>
        

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</p>
            <p style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--neon-purple)' }}>
              {product.currency}{product.price.toFixed(2)}
            </p>
          </div>
        </div>
        
        <a 
          href={product.productUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'var(--text-main)',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          View on {product.source} <ExternalLink size={16} />
        </a>

        {onAddToList && (
          <SaveToListButton
            product={product}
            lists={lists}
            onAddToList={onAddToList}
            onCreateAndAdd={onCreateAndAdd}
          />
        )}
      </div>
    </div>
  );
}
