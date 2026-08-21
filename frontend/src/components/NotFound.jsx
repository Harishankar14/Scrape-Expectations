import React from 'react';
import { SearchX } from 'lucide-react';
import '../index.css';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      marginTop: '2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <SearchX size={64} style={{ color: 'var(--neon-cyan)', marginBottom: '1.5rem', opacity: 0.8 }} />
      <h2 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#fff',
        letterSpacing: '-0.02em'
      }}>
        404: Scrape Not Found
      </h2>
      <p style={{
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
        maxWidth: '500px',
        lineHeight: '1.6'
      }}>
        These aren't the products you're looking for. <br />
        <span style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem', display: 'block' }}>
          (Either the site blocked our scraper bots, or the product simply doesn't exist in this universe)
        </span>
      </p>
    </div>
  );
};

export default NotFound;
