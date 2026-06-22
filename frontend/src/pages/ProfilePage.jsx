import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Shield, 
  ShoppingBag, 
  Heart, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { updateProfile } from '../features/auth/authSlice';
import { fetchMyOrders } from '../features/orders/ordersSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((s) => s.auth);
  const { mine } = useSelector((s) => s.orders);
  const { wishlist } = useSelector((s) => s.wishlist);
  const cart = useSelector((s) => s.cart.cart);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [prevUser, setPrevUser] = useState(user);

  // Status message states
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Sync state with user profile changes during render to avoid synchronous useEffect warnings
  if (user !== prevUser) {
    setPrevUser(user);
    setName(user?.name || '');
    setEmail(user?.email || '');
  }

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(false);

    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email cannot be empty.');
      return;
    }
    if (password) {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        setErrorMsg('Password must contain both letters and numbers.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    try {
      const resultAction = await dispatch(updateProfile({ name, email, password })).unwrap();
      if (resultAction) {
        setSuccessMsg(true);
        setPassword('');
        setConfirmPassword('');
        // Hide success message after 4 seconds
        setTimeout(() => setSuccessMsg(false), 4000);
      }
    } catch (err) {
      setErrorMsg(err || 'Failed to update profile.');
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-brutalist-text font-barlow">
      
      {/* Header Banner */}
      <div className="border border-brutalist-border bg-[#111] p-6 sm:p-8 relative overflow-hidden mb-8">
        <div className="absolute inset-0 hw-lines opacity-20 pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="w-20 h-20 bg-brutalist-bg border border-brutalist-border flex items-center justify-center font-bebas text-3xl text-brutalist-orange select-none">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
              <h1 className="font-bebas text-4xl tracking-wide uppercase text-brutalist-text">{user?.name}</h1>
              <span className="inline-flex items-center gap-1 border border-brutalist-border bg-brutalist-bg px-2.5 py-0.5 text-[12px] font-barlow-cond uppercase tracking-widest text-brutalist-orange w-fit mx-auto sm:mx-0 font-bold">
                <Shield className="w-3.5 h-3.5" />
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>
            <p className="text-brutalist-muted text-xs font-barlow-cond tracking-wider mt-1">{user?.email}</p>
            
            <div className="flex items-center gap-2 mt-4 text-[12px] uppercase font-barlow-cond tracking-wider text-brutalist-muted justify-center sm:justify-start">
              <Calendar className="w-4 h-4 text-brutalist-orange" />
              <span>Hardwear Member since June 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Stats / Links */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-brutalist-border p-6">
            <h2 className="font-bebas text-xl tracking-wider text-brutalist-text uppercase mb-4">Account Summary</h2>
            <div className="space-y-3">
              
              <Link 
                to="/account/orders" 
                className="group flex items-center justify-between p-4 bg-brutalist-bg border border-brutalist-border hover:bg-[#181818] transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brutalist-orange text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-barlow-cond uppercase tracking-wider text-brutalist-text">My Orders</p>
                    <p className="text-[12px] text-brutalist-muted">{mine?.length || 0} order(s) placed</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brutalist-muted group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                to="/wishlist" 
                className="group flex items-center justify-between p-4 bg-brutalist-bg border border-brutalist-border hover:bg-[#181818] transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brutalist-orange text-white">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-barlow-cond uppercase tracking-wider text-brutalist-text">Wishlist</p>
                    <p className="text-[12px] text-brutalist-muted">{(wishlist?.items || []).length} item(s) saved</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brutalist-muted group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link 
                to="/cart" 
                className="group flex items-center justify-between p-4 bg-brutalist-bg border border-brutalist-border hover:bg-[#181818] transition duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brutalist-orange text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-barlow-cond uppercase tracking-wider text-brutalist-text">Shopping Cart</p>
                    <p className="text-[12px] text-brutalist-muted">
                      {cart?.items?.length || 0} unique item(s) pending
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brutalist-muted group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>
          </div>
        </div>

        {/* Right Column: Update Profile Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#111] border border-brutalist-border p-6 sm:p-8">
            <h2 className="font-bebas text-2xl tracking-wider text-brutalist-text uppercase mb-1">Personal Settings</h2>
            <p className="text-xs text-brutalist-muted uppercase tracking-wider mb-6">Update your account information and login password.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form feedback status alerts */}
              {successMsg && (
                <div className="flex items-center gap-3 border border-emerald-800 bg-[#072412] p-4 text-emerald-300 text-xs uppercase tracking-wider font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-3 border border-rose-900 bg-[#320c11] p-4 text-rose-300 text-xs uppercase tracking-wider font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name-input" className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-brutalist-muted" />
                    Full Name
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                    placeholder="Enter name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-[12px] font-bold uppercase tracking-widest text-brutalist-muted flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brutalist-muted" />
                    Email Address
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="border-t border-brutalist-border my-6"></div>

              <h3 className="text-xs font-bold uppercase tracking-widest text-brutalist-text mb-1">Security Update</h3>
              <p className="text-[12px] text-brutalist-muted uppercase tracking-wider mb-4">Leave password fields blank if you do not want changes.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="password-input" className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brutalist-muted" />
                    New Password
                  </label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                    placeholder="Min. 6 characters"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirm-password-input" className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brutalist-muted" />
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider placeholder-brutalist-darkMuted"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-8 py-3.5 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
