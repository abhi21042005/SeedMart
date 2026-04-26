import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getProducts, getWishlist, toggleWishlist as toggleWishlistApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Marketplace.css';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  useEffect(() => {
    if (isAuthenticated) {
      getWishlist().then(({ data }) => {
        setWishlistIds(data.products?.map(p => p._id || p) || []);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const params = { page, limit: 12 };
        if (search) params.search = search;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;

        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, category, minPrice, maxPrice, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    setSearchParams(params);
  };

  const handleWishlistToggle = async (productId) => {
    try {
      await toggleWishlistApi(productId);
      setWishlistIds(prev =>
        prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      );
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSort('');
    setPage(1); setSearchParams({});
  };

  return (
    <div className="marketplace-page page-wrapper">
      <div className="container">
        <div className="marketplace-header">
          <h1>Marketplace</h1>
          <p>{total} products available</p>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar" id="filters-bar">
          <form onSubmit={handleSearch} className="search-form">
            <FiSearch size={18} className="search-icon" />
            <input type="text" placeholder="Search seeds, fertilizers..." value={search} onChange={e => setSearch(e.target.value)} id="search-input" />
          </form>

          <div className="filter-controls">
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} id="filter-category">
              <option value="">All Categories</option>
              <option value="seeds">🌱 Seeds</option>
              <option value="fertilizers">🧪 Fertilizers</option>
            </select>

            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} id="filter-sort">
              <option value="">Sort: Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>

            <input type="number" placeholder="Min ₹" value={minPrice} onChange={e => { setMinPrice(e.target.value); setPage(1); }} className="price-input" />
            <input type="number" placeholder="Max ₹" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} className="price-input" />

            {(search || category || minPrice || maxPrice || sort) && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Clear</button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loader size="full" text="Loading products..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => setPage(1)} />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</p>
            <p style={{ fontSize: '1.1rem' }}>No products found matching your criteria.</p>
            <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: '1rem' }}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} isWishlisted={wishlistIds.includes(product._id)} onWishlistToggle={handleWishlistToggle} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination" id="pagination">
                <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <FiChevronLeft /> Prev
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
                    <button key={p} className={`page-num ${p === page ? 'page-active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
