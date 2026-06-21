import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { api } from '../../app/apiClient';
import { Pencil, Trash2 } from 'lucide-react';

const COLORS = ['Black', 'White', 'Red', 'Blue', 'Grey', 'Orange', 'Green'];

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items || []);
  const [form, setForm] = useState({
    name: '',
    price: 999,
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    images: [''],
    stock: 25,
    isFeatured: true,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'newest' }));
  }, [dispatch]);

  async function create() {
    setBusy(true);
    setErr(null);
    try {
      await api.post('/api/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
      });
      setForm((f) => ({ ...f, name: '', description: '', images: [''] }));
      setShowCreateForm(false);
      dispatch(fetchProducts({ sort: 'newest' }));
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to create');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    setBusy(true);
    setErr(null);
    try {
      await api.delete(`/api/products/${id}`);
      dispatch(fetchProducts({ sort: 'newest' }));
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">
            Admin · Products
          </h1>
          <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">
            Add and manage the catalog.
          </p>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-8 px-3.5 bg-brutalist-orange text-white text-[10px] font-bold uppercase tracking-[1.5px] active:scale-[0.98] transition cursor-pointer"
          >
            {showCreateForm ? 'Cancel' : 'add'}
          </button>
          <Link 
            to="/admin" 
            className="text-sm font-semibold text-slate-900 hover:underline"
          >
            Back
          </Link>
        </div>
      </div>

      {err && (
        <div className="mb-6 border border-rose-900 bg-[#320c11] p-4 text-rose-300 text-xs uppercase tracking-wider font-bold">
          {err}
        </div>
      )}

      {/* Create Product Modal Overlay */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <section className="relative w-full max-w-md border border-brutalist-border bg-[#111] p-6 space-y-6 my-auto">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-brutalist-muted hover:text-brutalist-text cursor-pointer transition"
            >
              ✕ Close
            </button>

            <h2 className="font-bebas text-xl tracking-wider text-brutalist-text uppercase">
              Add product
            </h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                  placeholder="Product Name"
                />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Price (₹)</span>
                <input
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                  inputMode="numeric"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Stock</span>
                <input
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                  inputMode="numeric"
                />
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted block">Colors</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2 border border-brutalist-border bg-brutalist-bg p-3">
                  {COLORS.map((col) => {
                    const checked = form.colors.includes(col);
                    return (
                      <label key={col} className="flex items-center gap-2 text-xs uppercase font-barlow-cond tracking-wider text-brutalist-text select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const nextColors = checked
                              ? form.colors.filter((c) => c !== col)
                              : [...form.colors, col];
                            setForm((f) => ({ ...f, colors: nextColors }));
                          }}
                          className="accent-brutalist-orange"
                        />
                        <span>{col}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Image URL</span>
                <input
                  value={form.images[0] || ''}
                  onChange={(e) => setForm((f) => ({ ...f, images: [e.target.value] }))}
                  className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                  placeholder="https://…"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full min-h-24 bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                  placeholder="Product details..."
                />
              </div>

              {/* Featured */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs uppercase font-barlow-cond tracking-wider text-brutalist-text select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="accent-brutalist-orange"
                  />
                  <span>Featured on homepage</span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="button"
                  disabled={busy || !form.name}
                  onClick={create}
                  className="w-full bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-8 py-3.5 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Create product'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Main Content (Product List) */}
      <div className="mt-8">
        <section className="space-y-4 h-fit">
          {products.length ? (
            products.map((p) => (
              <div key={p._id} className="border border-zinc-800 bg-[#121214] p-6 rounded-2xl flex gap-6">
                <div className="h-28 w-28 bg-[#0c0c0e] border border-zinc-800 rounded-xl shrink-0 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 hw-diagonal-lines opacity-20 pointer-events-none"></div>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="h-full w-full object-cover relative z-10" />
                  ) : (
                    <span className="text-[10px] font-bebas text-brutalist-darkMuted">NO IMG</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-brutalist-text font-barlow-cond uppercase tracking-[1px] truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-brutalist-muted uppercase tracking-wider mt-1">
                        ₹{p.price} · Stock {p.stock} · {p.isFeatured ? 'Featured' : '—'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="p-2.5 border border-zinc-800 bg-brutalist-bg text-brutalist-orange hover:bg-brutalist-orange hover:text-white transition flex items-center justify-center cursor-pointer rounded-lg"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setDeleteConfirmId(p._id)}
                        className="p-2.5 border border-zinc-800 bg-brutalist-bg text-rose-600 hover:bg-rose-600 hover:text-white transition flex items-center justify-center cursor-pointer disabled:opacity-50 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Details (Description) */}
                  {p.description && (
                    <p className="text-xs text-brutalist-muted line-clamp-2 uppercase tracking-wide my-1">
                      {p.description}
                    </p>
                  )}

                  {/* Sizes and Colors */}
                  <div className="text-[10px] text-brutalist-darkMuted uppercase tracking-wider flex flex-wrap gap-x-4 gap-y-1 my-1">
                    {p.sizes?.length > 0 && <span>Sizes: {p.sizes.join(' · ')}</span>}
                    {p.colors?.length > 0 && <span>Colors: {p.colors.join(' · ')}</span>}
                  </div>
                  
                  <p className="text-[10px] text-brutalist-darkMuted tracking-wider font-mono truncate">
                    /{p.slug}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-brutalist-border p-12 text-center text-brutalist-muted uppercase font-barlow-cond tracking-wider text-xs bg-[#111]">
              No products yet. Add products to populate the catalogue.
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <section className="relative w-full max-w-sm border border-brutalist-border bg-[#111] p-6 space-y-6 my-auto text-center">
            <h3 className="font-bebas text-2xl tracking-wider text-rose-600 uppercase">
              Warning
            </h3>
            
            <p className="text-xs text-brutalist-text uppercase tracking-wider font-barlow-cond">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  remove(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 bg-rose-600 text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] py-3 hover:bg-rose-700 active:scale-[0.98] transition cursor-pointer"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border border-brutalist-border text-brutalist-text hover:text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] py-3 hover:bg-[#222] active:scale-[0.98] transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
