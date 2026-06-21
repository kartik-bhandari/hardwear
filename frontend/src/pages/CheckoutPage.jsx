import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../features/orders/ordersSlice';
import { fetchCart } from '../features/cart/cartSlice';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.cart?.items || []);
  const { placing, placeError, lastOrder } = useSelector((s) => s.orders);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!lastOrder) return;
    dispatch(fetchCart());
    navigate('/account/orders', { replace: true });
  }, [dispatch, lastOrder, navigate]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <section className="border border-brutalist-border bg-[#111] p-6 space-y-6 order-2 lg:order-1">
          <div>
            <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">Checkout</h1>
            {/* <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">Mock payment — place order to create it in DB.</p> */}
          </div>

          {placeError ? (
            <div className="border border-rose-900 bg-[#320c11] p-4 text-rose-300 text-xs uppercase tracking-wider font-bold">{placeError}</div>
          ) : null}

          <form
            className="grid sm:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(placeOrder({ shippingAddress: form }));
            }}
          >
            {[
              ['fullName', 'Full name'],
              ['phone', 'Phone'],
              ['line1', 'Address line 1'],
              ['line2', 'Address line 2 (optional)'],
              ['city', 'City'],
              ['state', 'State'],
              ['postalCode', 'Postal code'],
              ['country', 'Country'],
            ].map(([key, label]) => (
              <label key={key} className={`grid gap-1 ${key === 'line1' || key === 'line2' ? 'sm:col-span-2' : ''}`}>
                <span className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">{label}</span>
                <input
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted outline-none focus:ring-1 focus:ring-brutalist-orange"
                  required={key !== 'line2'}
                />
              </label>
            ))}

            <div className="sm:col-span-2 pt-4">
              <button
                disabled={placing === 'loading' || !items.length}
                className="w-full bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-8 py-3.5 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                type="submit"
              >
                {placing === 'loading' ? 'Placing…' : 'Place order'}
              </button>
              {!items.length ? <p className="mt-2 text-xs text-brutalist-muted uppercase tracking-wider">Your cart is empty.</p> : null}
            </div>
          </form>
        </section>

        <aside className="border border-brutalist-border bg-[#111] p-6 h-fit order-1 lg:order-2">
          <h2 className="font-bebas text-xl tracking-wider text-brutalist-text uppercase">Items</h2>
          <div className="mt-4 grid gap-3">
            {items.map((it) => (
              <div key={`${it.productId || it.product}_${it.size}_${it.color}`} className="flex items-center gap-3">
                <div className="h-12 w-12 bg-brutalist-bg border border-brutalist-border shrink-0 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 hw-diagonal-lines opacity-20 pointer-events-none"></div>
                  {it.imageAtAdd ? (
                    <img src={it.imageAtAdd} alt="" className="h-full w-full object-cover relative z-10" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brutalist-text font-barlow-cond uppercase tracking-[1px] truncate">{it.nameAtAdd}</p>
                  <p className="text-xs text-brutalist-muted uppercase tracking-wider">
                    {it.size} · {it.color} · Qty {it.qty}
                  </p>
                </div>
                <p className="text-sm font-bebas text-brutalist-text">₹{it.priceAtAdd}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

