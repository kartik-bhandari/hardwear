import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/ordersSlice';

export default function AccountOrdersPage() {
  const dispatch = useDispatch();
  const { mine } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">My orders</h1>
      <p className="text-sm text-slate-600 mt-1">Track status and order totals.</p>

      <div className="mt-8 grid gap-4">
        {mine.length ? (
          mine.map((o) => (
            <div key={o._id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">Order #{o._id.slice(-6).toUpperCase()}</p>
                <span className="text-xs font-semibold rounded-full border border-slate-200 px-3 py-1">
                  {String(o.status).toUpperCase()}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-600">
                <span>
                  Items: <span className="font-semibold text-slate-900">{o.items?.length || 0}</span>
                </span>
                <span>
                  Total: <span className="font-semibold text-slate-900">₹{o.total}</span>
                </span>
                <span className="text-slate-400">Placed {new Date(o.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">No orders yet.</div>
        )}
      </div>
    </div>
  );
}

