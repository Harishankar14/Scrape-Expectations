import { useState, useMemo } from 'react';
import './index.css';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import ListsPage from './pages/ListsPage';
import ListDetailPage from './pages/ListDetailPage';
import { useLists } from './hooks/useLists';
import SortDropdown from './components/SortDropdown';
import { sortProducts } from './hooks/sortProducts';

function App() {
  const [page, setPage] = useState('search'); // 'search' | 'lists' | 'list-detail'
  const [activeList, setActiveList] = useState(null); // name of list being viewed
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortKey, setSortKey] = useState('');

  const { lists, createList, deleteList, addToList, removeFromList } = useLists();

  // Creates a list AND immediately saves the product to it
  const handleCreateAndAdd = (name, product) => {
    const result = createList(name);
    if (!result.ok) return result;
    addToList(name.trim(), product);
    return { ok: true };
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) return;
    setPage('search');
    setQuery(searchQuery);
    setLoading(true);
    setResults([]);
    setSearched(false);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.success && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const openList = (name) => {
    setActiveList(name);
    setPage('list-detail');
  };
  
  const sortedResults = useMemo(() => {
    return sortProducts(results, sortKey);
  }, [results, sortKey]);

  const listCount = Object.keys(lists).length;
  const headerShifted = page !== 'search' || searched || loading;

  return (
    <div className="min-h-screen">
      <Navbar page={page} setPage={setPage} listCount={listCount} />

      {/* Search page */}
      {page === 'search' && (
        <>
          <header style={{
            padding: '2rem',
            textAlign: 'center',
            marginTop: headerShifted ? '5rem' : '18vh',
            paddingTop: '80px',
            transition: 'all 0.5s ease-out'
          }}>
            <h1 className="title-glow" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
              Scrape-Expectations
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              The multi-source product tracker. Powered by Bright Data.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              "align-items": 'center',
              width: '100%',
              gap: '12px'
            }}>
              {/* Dummy spacer to mirror the dropdown width and force SearchBar to absolute center */}
              <div style={{ visibility: 'hidden', flexShrink: 0 }}>
                <SortDropdown currentSort={sortKey} onSortChange={setSortKey} />
              </div>

              <SearchBar onSearch={handleSearch} loading={loading} />

              <div style={{ flexShrink: 0 }}>
                <SortDropdown currentSort={sortKey} onSortChange={setSortKey} />
              </div>
            </div>
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
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>
                  Scraping the web for the best deals…
                </p>
              </div>
            )}

            {results.length > 0 && !loading && (
              <Dashboard
                results={results}
                lists={lists}
                onAddToList={addToList}
                onCreateAndAdd={handleCreateAndAdd}
              />
            )}

            {searched && results.length === 0 && !loading && (
              <NotFound />
            )}
          </main>
        </>
      )}

      {/* Lists page */}
      {page === 'lists' && (
        <div style={{ paddingTop: '80px' }}>
          <ListsPage
            lists={lists}
            onCreateList={createList}
            onDeleteList={deleteList}
            onOpenList={openList}
          />
        </div>
      )}

      {/* List detail page */}
      {page === 'list-detail' && activeList && (
        <div style={{ paddingTop: '80px' }}>
          <ListDetailPage
            listName={activeList}
            items={lists[activeList] || []}
            onBack={() => setPage('lists')}
            onRemove={(productUrl) => removeFromList(activeList, productUrl)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
