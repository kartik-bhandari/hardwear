import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { fetchAllOrders } from '../../features/orders/ordersSlice';
import { fetchUsers } from '../../features/auth/authSlice';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items || []);
  const orders = useSelector((s) => s.orders.adminAll || []);
  const users = useSelector((s) => s.auth.users || []);

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'newest' }));
    dispatch(fetchAllOrders());
    dispatch(fetchUsers());
  }, [dispatch]);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const totalOrdersCount = orders.length;

  const pendingPct = totalOrdersCount > 0 ? (pendingCount / totalOrdersCount) * 100 : 0;
  const deliveredPct = totalOrdersCount > 0 ? (deliveredCount / totalOrdersCount) * 100 : 0;

  // Total Sales Revenue (summing up total of all paid orders)
  const paidOrders = orders.filter((o) => o.payment?.isPaid === true);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  // Active Customer Counter (unique emails who placed orders)
  const uniqueEmails = new Set();
  orders.forEach((o) => {
    if (o.user?.email) {
      uniqueEmails.add(o.user.email);
    } else if (o.shippingAddress?.phone) {
      uniqueEmails.add(o.shippingAddress.phone);
    }
  });
  const activeCustomersCount = uniqueEmails.size;

  // Top Selling Products Leaderboard
  const productSales = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const key = item.product || item.name;
      if (!productSales[key]) {
        productSales[key] = {
          name: item.name,
          image: item.image,
          qty: 0,
          revenue: 0,
        };
      }
      productSales[key].qty += item.qty;
      productSales[key].revenue += item.qty * item.price;
    });
  });

  const topSelling = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Low stock alert: products with stock <= 5
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-8">
        <div>
          <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text">Admin Panel</h1>
          <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mt-1">Products and orders overview.</p>
        </div>
        
        {/* Responsive buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            to="/admin/products" 
            className="h-10 px-6 bg-brutalist-orange text-white text-xs font-bold uppercase tracking-[2px] transition flex items-center justify-center text-center cursor-pointer"
          >
            Manage products
          </Link>
          <Link 
            to="/admin/orders" 
            className="h-10 px-6 border border-[#333] hover:border-brutalist-muted text-brutalist-text text-xs font-bold uppercase tracking-[2px] transition flex items-center justify-center text-center cursor-pointer"
          >
            Manage orders
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}` },
          { label: 'Active Users', value: users.length },
          { label: 'Active Customers', value: activeCustomersCount },
          { label: 'Total Products', value: products.length },
          { label: 'Total Orders', value: orders.length },
          { label: 'Pending Orders', value: pendingCount },
        ].map((c) => (
          <div key={c.label} className="border border-brutalist-border bg-[#111] p-5 relative overflow-hidden">
            <div className="absolute inset-0 hw-diagonal-lines opacity-5 pointer-events-none"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-bebas tracking-wider text-brutalist-text">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Fulfillment Pipeline */}
      <div className="border border-brutalist-border bg-[#111] p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 hw-diagonal-lines opacity-5 pointer-events-none"></div>
        <h3 className="font-bebas text-lg tracking-wider uppercase text-brutalist-text mb-4">
          Fulfillment Pipeline <span className="text-brutalist-orange">///</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-brutalist-muted mb-3">
          <div>Delivered: <span className="text-emerald-500  font-extrabold">{deliveredCount}</span> ({deliveredPct.toFixed(1)}%)</div>
          <div>Pending: <span className="text-violet-500 font-extrabold">{pendingCount}</span> ({pendingPct.toFixed(1)}%)</div>
        </div>

        {/* Multi-segmented progress bar */}
        <div className="w-full h-4 bg-brutalist-border flex overflow-hidden">
          {deliveredPct > 0 && (
            <div 
            style={{ width: `${deliveredPct}%` }} 
            className="bg-emerald-700 transition-all duration-500" 
            title={`Delivered: ${deliveredCount} orders`}
            />
          )}
          {pendingPct > 0 && (
            <div 
              style={{ width: `${pendingPct}%` }} 
              className="bg-violet-800  transition-all duration-500" 
              title={`Pending: ${pendingCount} orders`}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 text-[10px] uppercase font-bold tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 block"></span>
            <span className="text-brutalist-muted">Delivered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-violet-500 block"></span>
            <span className="text-brutalist-muted">Pending</span>
          </div>
        </div>
      </div>

      {/* Inventory Stock Alerts */}
      <div className="border border-brutalist-border bg-[#111] p-6 mb-8 relative">
        <h3 className="font-bebas text-lg tracking-wider uppercase text-brutalist-text mb-4">
          Inventory Stock Alerts <span className="text-brutalist-orange">///</span>
        </h3>
        
        {lowStockProducts.length === 0 ? (
          <div className="flex items-center gap-2 border border-emerald-950/50 bg-[#0c2214] p-4 text-emerald-300 text-xs uppercase tracking-wider font-bold rounded-lg">
            <span className="text-emerald-400">✓</span> All products are fully stocked (stock &gt; 5).
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div 
                key={p._id} 
                className={`border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-lg ${
                  p.stock === 0 
                    ? 'border-red-900 bg-red-950/20 text-red-300' 
                    : 'border-amber-900/60 bg-amber-950/10 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brutalist-border shrink-0 overflow-hidden flex items-center justify-center border border-brutalist-border">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-brutalist-muted">N/A</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brutalist-text">{p.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-brutalist-muted">Category: {p.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border ${
                    p.stock === 0 
                      ? 'border-red-800 bg-red-950/40 text-red-400' 
                      : 'border-amber-800 bg-amber-950/30 text-amber-400'
                  }`}>
                    {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} REMAINING`}
                  </span>
                  
                  <Link 
                    to={`/admin/products`}
                    className="text-[10px] font-bold uppercase tracking-wider text-brutalist-muted hover:text-brutalist-text underline"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Selling Products Leaderboard */}
      <div className="border border-brutalist-border bg-[#111] p-6 relative">
        <h3 className="font-bebas text-lg tracking-wider uppercase text-brutalist-text mb-4 border-b border-brutalist-border pb-3">
          Top Selling Products <span className="text-brutalist-orange">///</span>
        </h3>
        
        {topSelling.length === 0 ? (
          <p className="text-xs uppercase tracking-wider text-brutalist-muted py-4">No order items found yet to calculate sales leaderboards.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-wider">
              <thead>
                <tr className="border-b border-brutalist-border text-brutalist-muted text-[10px] font-bold">
                  <th className="pb-3 w-14">Preview</th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3 text-right">Units Sold</th>
                  <th className="pb-3 text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brutalist-border/50">
                {topSelling.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#151515] transition-colors">
                    <td className="py-3">
                      <div className="w-8 h-8 bg-brutalist-border overflow-hidden border border-brutalist-border">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[8px] text-brutalist-muted flex items-center justify-center h-full">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-brutalist-text">
                      {item.name}
                    </td>
                    <td className="py-3 text-right font-bold text-brutalist-text">
                      {item.qty}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
}
