import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { fetchAllOrders } from '../../features/orders/ordersSlice';

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items || []);
  const orders = useSelector((s) => s.orders.adminAll || []);

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'newest' }));
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const pending = orders.filter((o) => o.status === 'pending').length;
  const shipped = orders.filter((o) => o.status === 'shipped').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: products.length },
          { label: 'Orders', value: orders.length },
          { label: 'Pending', value: pending },
          { label: 'Delivered', value: delivered || shipped },
        ].map((c) => (
          <div key={c.label} className="border border-brutalist-border bg-[#111] p-5">
            <p className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted">{c.label}</p>
            <p className="mt-2 text-4xl font-bebas tracking-wider text-brutalist-text">{c.value}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}
