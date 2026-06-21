import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeWishlistItem } from '../features/wishlist/wishlistSlice';
import { Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);
  const items = useSelector((s) => s.wishlist.wishlist?.items || []);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch, token]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-brutalist-border pb-4 mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">
            Wishlist
          </h1>
          <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">
            Save items for later.
          </p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-slate-900 hover:underline">
          Browse products
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {items.length ? (
          items.map((it) => {
            const pid = it.productId || it.product;
            return (
              <div key={pid} className="group relative block border border-zinc-800 bg-[#121214] hover:bg-[#161619] hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/40 overflow-hidden">
                {/* Floating Delete/Trash Button */}
                <button
                  type="button"
                  onClick={() => dispatch(removeWishlistItem({ productId: pid }))}
                  className="absolute top-2.5 right-2.5 z-30 p-2 bg-[#0c0c0e]/80 border border-zinc-800 rounded-full text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link to={`/products/${pid}`} className="block">
                  {/* Product Image Area */}
                  <div className="h-40 sm:h-48 md:h-52 bg-[#0c0c0e] relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
                    <div className="absolute inset-0 hw-diagonal-lines opacity-40"></div>
                    
                    {it.imageAtAdd ? (
                      <img
                        src={it.imageAtAdd}
                        alt={it.nameAtAdd}
                        className="absolute inset-0 h-full w-full object-cover z-10 opacity-90 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:opacity-100"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  {/* Product Details Info */}
                  <div className="p-3 flex flex-col justify-between">
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base text-zinc-200 group-hover:text-brutalist-orange transition-colors duration-200 truncate">
                      {it.nameAtAdd}
                    </h3>
                    
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="font-bold text-xs sm:text-sm md:text-base text-zinc-100">
                        ₹{it.priceAtAdd}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="border border-brutalist-border p-12 text-center text-brutalist-muted uppercase font-barlow-cond tracking-wider text-xs bg-[#111] col-span-2 lg:col-span-3">
            Your wishlist is empty.
          </div>
        )}
      </div>
    </div>
  );
}
