import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../shared/ProductCard';

const SIZES = ['S', 'M', 'L', 'XL'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const [sp, setSp] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const initial = useMemo(
    () => ({
      sort: sp.get('sort') || 'newest',
      size: sp.get('size') || '',
      color: sp.get('color') || '',
      priceMin: sp.get('priceMin') || '',
      priceMax: sp.get('priceMax') || '',
      q: sp.get('q') || '',
    }),
    [sp],
  );

  const [filters, setFilters] = useState(initial);

  useEffect(() => {
    dispatch(fetchProducts(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply() {
    const next = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v != null),
    );
    setSp(next);
    dispatch(fetchProducts(next));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-brutalist-border pb-4 mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">
            All products
          </h1>
          <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">
            Filter and sort the products.
          </p>
        </div>

        {/* Desktop/Tablet sort actions (hidden on mobile) */}
        <div className="hidden sm:flex gap-3 items-center">
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="h-10 bg-brutalist-bg border border-brutalist-border px-4 text-xs font-barlow-cond uppercase tracking-wider text-brutalist-text cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={apply}
            className="h-10 bg-brutalist-orange text-white px-5 text-xs font-bold uppercase tracking-wider hover:opacity-90 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button (visible only on mobile) */}
      <div className="sm:hidden mb-6">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full h-10 border border-brutalist-border bg-[#111] text-xs font-bold uppercase tracking-widest text-brutalist-text flex items-center justify-center gap-2 cursor-pointer hover:bg-[#181818]"
        >
          {showMobileFilters ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`border border-brutalist-border bg-[#111] p-5 h-fit lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
          
          {/* Mobile Sort (visible only inside toggled sidebar on mobile) */}
          <div className="sm:hidden space-y-4 mb-6 pb-6 border-b border-brutalist-border">
            <div className="space-y-2">
              <p className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Sort By</p>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="h-10 w-full bg-brutalist-bg border border-brutalist-border px-4 text-xs font-barlow-cond uppercase tracking-wider text-brutalist-text cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                apply();
                setShowMobileFilters(false);
              }}
              className="h-10 w-full bg-brutalist-orange text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e63300] cursor-pointer"
            >
              Apply
            </button>
          </div>

          <h2 className="font-bebas text-lg tracking-wider text-brutalist-text uppercase">Filters</h2>

          {/* Size Filter */}
          <div className="mt-4">
            <p className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Size</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, size: f.size === s ? '' : s }))}
                  className={`w-9 h-9 border text-xs tracking-wider transition font-bold cursor-pointer ${
                    filters.size === s
                      ? 'bg-brutalist-orange text-white border-brutalist-orange'
                      : 'border-brutalist-border bg-brutalist-bg text-brutalist-muted hover:border-[#444] hover:text-brutalist-text'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filters */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Min ₹</p>
              <input
                value={filters.priceMin}
                onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
                className="mt-2 h-10 w-full bg-brutalist-bg border border-brutalist-border px-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
                inputMode="numeric"
              />
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Max ₹</p>
              <input
                value={filters.priceMax}
                onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
                className="mt-2 h-10 w-full bg-brutalist-bg border border-brutalist-border px-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Color Filter */}
          <div className="mt-5">
            <p className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Color</p>
            <input
              value={filters.color}
              onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))}
              placeholder="e.g. Black"
              className="mt-2 h-10 w-full bg-brutalist-bg border border-brutalist-border px-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2">
            {/* Desktop Apply (hidden on mobile, since mobile has its own apply) */}
            <button
              type="button"
              onClick={apply}
              className="hidden sm:block h-10 w-full bg-brutalist-orange text-white text-xs font-bold uppercase tracking-wider hover:opacity-80 cursor-pointer"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={() => {
                const cleared = { sort: 'newest', size: '', color: '', priceMin: '', priceMax: '', q: '' };
                setFilters(cleared);
                setSp({});
                dispatch(fetchProducts({ sort: 'newest' }));
                setShowMobileFilters(false);
              }}
              className="w-full h-10 border border-brutalist-border text-xs font-bold uppercase tracking-wider hover:bg-brutalist-card cursor-pointer text-brutalist-muted hover:text-brutalist-text"
            >
              Reset
            </button>
          </div>

        </aside>

        {/* Product Grid Results */}
        <section>
          {status === 'loading' ? (
            <div className="flex justify-center items-center py-20 text-brutalist-muted uppercase font-barlow-cond tracking-widest text-xs">
              Loading drops...
            </div>
          ) : error ? (
            <div className="border border-rose-900 bg-[#320c11] p-4 text-rose-300 text-xs uppercase tracking-wider font-bold">
              {error}
            </div>
          ) : items.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="border border-brutalist-border p-12 text-center text-brutalist-muted uppercase font-barlow-cond tracking-wider text-xs bg-[#111]">
              No products match your filters.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
