import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeCartItem, updateCartItem } from '../features/cart/cartSlice';
import { getCartProductId } from '../lib/normalize';

function subtotal(items) {
  return (items || []).reduce((sum, it) => sum + Number(it.priceAtAdd || 0) * Number(it.qty || 1), 0);
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);
  const cart = useSelector((s) => s.cart.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, token]);

  const items = cart?.items || [];
  const sub = useMemo(() => subtotal(items), [items]);
  const shipping = sub >= 1999 ? 0 : items.length ? 99 : 0;
  const total = sub + shipping;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Cart</h1>
          <p className="text-sm text-slate-600 mt-1">Review items before checkout.</p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-slate-900 hover:underline">
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <section className="grid gap-4">
          {items.length ? (
            items.map((it) => {
              const pid = getCartProductId(it);
              return (
                <div key={`${pid}_${it.size}_${it.color}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex gap-4">
                    <Link
                      to={`/products/${pid}`}
                      className="h-24 w-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 block hover:opacity-90 transition-opacity"
                    >
                      {it.imageAtAdd ? (
                        <img src={it.imageAtAdd} alt={it.nameAtAdd} className="h-full w-full object-cover" />
                      ) : null}
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/products/${pid}`}
                            className="font-semibold text-slate-900 hover:underline block"
                          >
                            {it.nameAtAdd}
                          </Link>
                          <p className="text-xs text-slate-600 mt-1">
                            Size: <span className="text-slate-900 font-semibold">{it.size}</span> · Color:{' '}
                            <span className="text-slate-900 font-semibold">{it.color}</span>
                          </p>
                        </div>
                        <p className="font-bold text-slate-900">₹{it.priceAtAdd}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateCartItem({
                                  productId: pid,
                                  size: it.size,
                                  color: it.color,
                                  qty: Math.max(1, Number(it.qty) - 1),
                                }),
                              )
                            }
                            className="h-9 w-9 grid place-items-center text-slate-700 hover:bg-slate-50 rounded-l-full"
                          >
                            −
                          </button>
                          <div className="w-10 text-center text-sm font-semibold">{it.qty}</div>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(updateCartItem({ productId: pid, size: it.size, color: it.color, qty: Number(it.qty) + 1 }))
                            }
                            className="h-9 w-9 grid place-items-center text-slate-700 hover:bg-slate-50 rounded-r-full"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => dispatch(removeCartItem({ productId: pid, size: it.size, color: it.color }))}
                          className="text-sm font-semibold text-rose-700 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
              Your cart is empty.
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 h-fit">
          <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold">₹{sub}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="font-semibold">{shipping ? `₹${shipping}` : 'Free'}</span>
            </div>
            <div className="h-px bg-slate-200 my-2" />
            <div className="flex justify-between text-base">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-black text-slate-900">₹{total}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!items.length}
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full h-12 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-40 disabled:hover:bg-slate-900"
          >
            Checkout
          </button>

          {!token ? (
            <p className="mt-4 text-xs text-slate-500">
              You can checkout after logging in. Your cart is saved locally.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

