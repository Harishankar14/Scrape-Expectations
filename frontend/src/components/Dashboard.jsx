import ProductCard from './ProductCard';

export default function Dashboard({ results }) {
  return (
    <div className="animate-fade-in">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Search Results</h2>
        <span style={{
          background: 'rgba(0, 243, 255, 0.1)',
          color: 'var(--neon-cyan)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          {results.length} Sources Found
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {results.map((product, idx) => (
          <ProductCard key={product.id || idx} product={product} delay={idx * 0.1} />
        ))}
      </div>
    </div>
  );
}
