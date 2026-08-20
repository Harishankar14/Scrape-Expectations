import { useState } from 'react';
import './index.css';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) return;
    setQuery(searchQuery);
    setLoading(true);
    setResults([]);

    try {
      // Direct integration to our backend API!
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header style={{ padding: '2rem', textAlign: 'center', marginTop: results.length ? '2rem' : '15vh', transition: 'all 0.5s ease-out' }}>
        <h1 className="title-glow" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Scrape-Expectations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          The multi-source product tracker. Powered by Bright Data.
        </p>
        
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>
      
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div className="loader" style={{
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--neon-cyan)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        
        {results.length > 0 && !loading && (
           <Dashboard results={results} />
        )}
      </main>
    </div>
  );
}

export default App;
