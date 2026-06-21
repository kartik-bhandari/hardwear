import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { fetchProduct } from '../features/products/productsSlice';
import { addCartItem } from '../features/cart/cartSlice';
import { addWishlistItem, removeWishlistItem } from '../features/wishlist/wishlistSlice';

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);
  const { active: product, activeStatus, activeError } = useSelector((s) => s.products);
  const wishlistItems = useSelector((s) => s.wishlist.wishlist?.items || []);

  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProduct(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (!product) return;
    setImgIdx(0);
    setSize(product.sizes?.[0] || 'M');
    setColor(product.colors?.[0] || '');
    setQty(1);
  }, [product?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isWished = useMemo(() => {
    const pid = product?._id;
    if (!pid) return false;
    return wishlistItems.some((it) => (it.productId || it.product) === pid);
  }, [product?._id, wishlistItems]);

  if (activeStatus === 'loading') return <div className="mx-auto max-w-6xl px-4 py-10">Loading…</div>;
  if (activeError)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">{activeError}</div>
      </div>
    );
  if (!product) return null;

  const mainImg = product.images?.[imgIdx] || product.images?.[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-sm text-slate-600">
        <Link to="/products" className="hover:underline">
          Products
        </Link>{' '}
        / <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square overflow-hidden border border-slate-200 bg-slate-100">
            {mainImg ? (
              <img src={mainImg} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-slate-400">No image</div>
            )}
          </div>
          {product.images?.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-auto pb-2">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`h-20 w-20 overflow-hidden border ${
                    i === imgIdx ? 'border-slate-900' : 'border-slate-200'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight">{product.name}</h1>
          <p className="mt-2 text-slate-600">{product.category || 'T-Shirts'}</p>
          <p className="mt-2 text-xl text-gray-300 font-black">₹{product.price}</p>

          <div className="mt-8 grid gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-600">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.sizes || []).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`h-10 px-4 border text-sm font-semibold ${
                      size === s
                        ? 'border-slate-900 bg-brutalist-orange text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.colors || []).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-10 px-4  border text-sm font-semibold ${
                      color === c
                        ? 'border-slate-900 bg-brutalist-orange text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
            <p className="text-xs font-semibold text-slate-600">Qty</p>
            <div className="flex mt-2
          
            items-center gap-3">
              <div className="inline-flex items-center border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 grid place-items-center text-slate-700 hover:bg-slate-50 "
                >
                  −
                </button>
                <div className="w-12 text-center text-sm font-semibold">{qty}</div>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-10 w-10 grid place-items-center text-slate-700 hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (!token) {
                  navigate('/login');
                  return;
                }
                dispatch(
                  addCartItem({
                    productId: product._id,
                    qty,
                    size,
                    color,
                    productSnapshot: { name: product.name, price: product.price, image: product.images?.[0] || '' },
                  }),
                );
              }}
              className="h-12 bg-brutalist-orange text-white px-6 text-sm font-semibold hover:bg-brutalist-orange"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                if (!token) {
                  navigate('/login');
                  return;
                }
                dispatch(
                  isWished
                    ? removeWishlistItem({ productId: product._id })
                    : addWishlistItem({
                        productId: product._id,
                        productSnapshot: { name: product.name, price: product.price, image: product.images?.[0] || '' },
                      }),
                );
              }}
              className="h-12 border border-slate-200 bg-white px-5 text-sm font-semibold hover:bg-slate-50 inline-flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isWished ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>

          <div className="mt-10 border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-900">Description</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {product.description || 'No description provided yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

