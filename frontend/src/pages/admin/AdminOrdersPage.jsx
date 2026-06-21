import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/ordersSlice';

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.adminAll || []);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">
            Admin · Orders
          </h1>
          <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">
            Update order status.
          </p>
        </div>
        <Link to="/admin" className="text-sm font-semibold text-slate-900 hover:underline self-end sm:self-auto">
          Back
        </Link>
      </div>

      <div className="mt-8 grid gap-6">
        {orders.length ? (
          orders.map((o) => (
            <div key={o._id} className="border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 font-barlow-cond uppercase tracking-[1px] truncate">
                    Order #{o._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 break-words">
                    {o.user?.name} · {o.user?.email} · {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="font-black text-slate-900 text-lg">₹{o.total}</p>
                  <select
                    value={o.status}
                    disabled={saving === o._id}
                    onChange={async (e) => {
                      const status = e.target.value;
                      setSaving(o._id);
                      await dispatch(updateOrderStatus({ id: o._id, status }));
                      setSaving(null);
                    }}
                    className="h-9 bg-white border border-slate-200 px-3 text-xs text-slate-900 font-barlow-cond uppercase tracking-wider outline-none cursor-pointer"
                  >
                    <option value="pending">PENDING</option>
                    <option value="shipped">SHIPPED</option>
                    <option value="delivered">DELIVERED</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 border-t border-slate-200 pt-4 grid gap-2 text-md font-bold text-slate-300 min-w-0">
                {(o.items || []).slice(0, 3).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 min-w-0">
                    <span className="block truncate">
                      {it.name} · {it.size} · {it.color} · Qty {it.qty}
                    </span>
                    <span className="font-semibold text-slate-900 shrink-0">₹{it.price}</span>
                  </div>
                ))}
                {o.items?.length > 3 ? (
                  <p className="text-xs text-slate-500">
                    + {o.items.length - 3} more items…
                  </p>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="border border-slate-200 bg-white p-12 text-center text-slate-600 uppercase font-barlow-cond tracking-wider text-xs">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}

