import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, clearLastOrder } from '../features/orders/ordersSlice';
import { fetchCart } from '../features/cart/cartSlice';
import { api } from '../app/apiClient';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.cart?.items || []);
  const { placing, placeError } = useSelector((s) => s.orders);

  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
    dispatch(clearLastOrder());
    dispatch(fetchCart());

    // Dynamically load Razorpay SDK
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate phone number to contain exactly 10 digits
    const cleanedPhone = form.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // Open confirmation modal
    setShowConfirmModal(true);
  };

  const processPayment = async () => {
    if (!window.Razorpay) {
      setError('Payment gateway is loading, please try again in a few seconds.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Create the order in backend DB first
      const order = await dispatch(placeOrder({ shippingAddress: form })).unwrap();
      if (!order || !order.total) {
        throw new Error('Invalid order response');
      }

      const amountInPaise = Math.round(order.total * 100);
      if (amountInPaise < 100) {
        throw new Error('Minimum order amount must be 100 paise (₹1)');
      }

      // 2. Request backend to create Razorpay Order
      const { data: rpOrder } = await api.post('/api/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        receipt: order._id,
      });

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: 'HARD-WEAR',
        description: `Order #${order._id.slice(-6).toUpperCase()}`,
        order_id: rpOrder.order_id,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            // 4. Verify signature on backend
            await api.post('/api/verify-payment', {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Clear and navigate
            dispatch(clearLastOrder());
            dispatch(fetchCart());
            navigate('/account/orders', { replace: true });
          } catch (err) {
            console.error('Verification error:', err);
            setError(err?.response?.data?.message || 'Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
        },
        theme: {
          color: '#3f1f72',
        },
        modal: {
          ondismiss: function () {
            setError('Payment cancelled by user.');
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(response.error.description || 'Payment failed. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout submit error:', err);
      setError(err?.message || err || 'Failed to initialize checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow relative">
      {/* Phone Number Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md border border-brutalist-border bg-[#111] p-6 space-y-6 shadow-[8px_8px_0px_#000] rounded-2xl">
            <h2 className="font-bebas text-2xl tracking-wider text-brutalist-text uppercase border-b border-brutalist-border pb-3">
              Confirm Phone Number
            </h2>
            <p className="text-sm text-brutalist-muted leading-relaxed">
              Please confirm your mobile number before proceeding to the payment gateway:
            </p>
            <div className="bg-brutalist-bg border border-brutalist-border p-4 text-center rounded-xl">
              <span className="font-bebas text-2xl tracking-widest text-brutalist-orange">
                +91 {form.phone}
              </span>
            </div>
            <p className="text-[11px] text-brutalist-muted uppercase tracking-wider">
              Razorpay will send transaction alerts and updates to this contact number.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  processPayment();
                }}
                className="flex-1 bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] py-3 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer rounded-lg"
              >
                Confirm & Pay
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-[#222] border border-brutalist-border text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] py-3 hover:bg-[#333] active:scale-[0.98] transition cursor-pointer rounded-lg"
              >
                Edit Number
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <section className="border border-brutalist-border bg-[#111] p-6 space-y-6 order-2 lg:order-1">
          <div>
            <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">Checkout</h1>
          </div>

          {placeError || error ? (
            <div className="border border-rose-900 bg-[#320c11] p-4 text-rose-300 text-xs uppercase tracking-wider font-bold">
              {placeError || error}
            </div>
          ) : null}

          <form className="grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {[
              ['fullName', 'Full name'],
              ['phone', 'Phone (10 digits)'],
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
                  disabled={placing === 'loading' || isProcessing}
                />
              </label>
            ))}

            <div className="sm:col-span-2 pt-4">
              <button
                disabled={placing === 'loading' || isProcessing || !items.length}
                className="w-full bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-8 py-3.5 hover:opacity-80 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
                type="submit"
              >
                {placing === 'loading' || isProcessing ? 'Processing…' : 'Place order'}
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
