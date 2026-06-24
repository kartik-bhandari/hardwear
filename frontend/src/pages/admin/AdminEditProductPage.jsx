import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../app/apiClient';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Grey', 'Orange', 'Green'];

export default function AdminEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    price: 999,
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [],
    images: [''],
    stock: 0,
    isFeatured: false,
    category: 'T-Shirts',
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function getProductDetails() {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name || '',
          price: p.price || 0,
          description: p.description || '',
          sizes: p.sizes || ['S', 'M', 'L', 'XL'],
          colors: p.colors || [],
          images: p.images && p.images.length > 0 ? p.images : [''],
          stock: p.stock || 0,
          isFeatured: !!p.isFeatured,
          category: p.category || 'T-Shirts',
        });
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    }
    getProductDetails();
  }, [id]);

  async function handleImageUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErr(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.urls && data.urls.length > 0) {
        setForm((f) => ({
          ...f,
          images: [...f.images.filter(Boolean), ...data.urls],
        }));
      }
    } catch (err) {
      setErr(err?.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  }

  async function update() {
    setBusy(true);
    setErr(null);
    setSuccess(false);
    try {
      await api.put(`/api/products/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to update product');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setErr(null);
    try {
      await api.delete(`/api/products/${id}`);
      navigate('/admin/products');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to delete product');
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40 text-brutalist-muted uppercase font-barlow-cond tracking-widest text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-brutalist-orange mr-2" />
        Loading product details...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 text-brutalist-text font-barlow">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-brutalist-border pb-4 mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">
            Admin · Edit Product
          </h1>
          <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">
            Modify product specs, pricing, and assets.
          </p>
        </div>
        <Link 
          to="/admin/products" 
          className="text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to list
        </Link>
      </div>

      {err && (
        <div className="mb-6 border border-rose-900 bg-[#320c11] p-4 text-rose-300 text-xs uppercase tracking-wider font-bold">
          {err}
        </div>
      )}

      {success && (
        <div className="mb-6 border border-emerald-800 bg-[#072412] p-4 text-emerald-300 text-xs uppercase tracking-wider font-bold">
          Product updated successfully! Redirecting...
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-[#111] border border-brutalist-border p-6 sm:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">
              Product Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
              placeholder="e.g. Graphic Tee"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">
              Category
            </label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
              placeholder="T-Shirts"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">
              Price (₹)
            </label>
            <input
              type="text"
              required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
              inputMode="numeric"
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">
              Stock Count
            </label>
            <input
              type="text"
              required
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
              inputMode="numeric"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted block">
            Colors
          </label>
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

        {/* Images Manager */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted block">
            Product Images
          </label>

          {/* Thumbnail Previews Grid */}
          {form.images.filter(Boolean).length > 0 ? (
            <div className="grid grid-cols-4 gap-2 border border-brutalist-border bg-brutalist-bg p-3">
              {form.images.filter(Boolean).map((img, idx) => (
                <div key={idx} className="relative aspect-square border border-zinc-800 bg-[#0c0c0e] rounded-lg overflow-hidden">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = form.images.filter((_, i) => i !== idx);
                      setForm(f => ({ ...f, images: updated.length ? updated : [''] }));
                    }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center cursor-pointer text-[10px] font-black z-20 transition border border-black shadow-[1.5px_1.5px_0px_#000]"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-zinc-800 bg-[#0c0c0e] p-4 text-center text-xs uppercase tracking-wider text-brutalist-darkMuted rounded-lg">
              No images added yet
            </div>
          )}

          {/* Upload Action */}
          <div className="flex gap-2">
            <label className="flex-1 border border-dashed border-zinc-700 bg-brutalist-bg hover:bg-zinc-900 transition px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider cursor-pointer text-center flex items-center justify-center min-h-[44px] select-none">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? 'Uploading images...' : 'Upload multiple images'}
            </label>
          </div>

          {/* Or add manually via URL */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brutalist-darkMuted">Or add image by URL</span>
            <div className="flex gap-2">
              <input
                id="manual-url-input-edit"
                type="text"
                className="flex-1 bg-brutalist-bg border border-brutalist-border px-3 py-2 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted outline-none"
                placeholder="https://..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (val) {
                      setForm(f => ({ ...f, images: [...f.images.filter(Boolean), val] }));
                      e.target.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('manual-url-input-edit');
                  const val = input?.value?.trim();
                  if (val) {
                    setForm(f => ({ ...f, images: [...f.images.filter(Boolean), val] }));
                    if (input) input.value = '';
                  }
                }}
                className="bg-brutalist-bg border border-brutalist-border hover:bg-zinc-900 px-3 py-2 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full min-h-28 bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider"
            placeholder="Product details here..."
          />
        </div>

        {/* Checkbox */}
        <div>
          <label className="flex items-center gap-2 text-xs uppercase font-barlow-cond tracking-wider text-brutalist-text select-none cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              className="accent-brutalist-orange"
            />
            <span>Featured on Homepage</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-brutalist-border">
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-rose-900 text-rose-500 font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-6 py-3.5 hover:bg-[#320c11] hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> Delete Product
          </button>

          <button
            type="button"
            disabled={busy || uploading || !form.name}
            onClick={update}
            className="bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-8 py-3.5 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteConfirm && (
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
                  remove();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 bg-rose-600 text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] py-3 hover:bg-rose-700 active:scale-[0.98] transition cursor-pointer"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
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
