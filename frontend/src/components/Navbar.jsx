import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, User, Shield, LogOut, ChevronDown, Search, Menu, X } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

function countItems(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
}

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => countItems(s.cart.cart?.items));
  const wishlistCount = useSelector((s) => (s.wishlist.wishlist?.items || []).length);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lock body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-brutalist-border bg-brutalist-bg text-brutalist-text font-barlow">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 relative">

        {/* Full Width Search Overlay */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="absolute inset-0 bg-brutalist-bg px-4 sm:px-6 flex items-center gap-4 z-[51]"
          >
            <Search className="h-5 w-5 text-brutalist-orange shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drops, tees, tags..."
              className="h-10 flex-1 bg-transparent border-b border-brutalist-border text-xs sm:text-sm font-barlow-cond uppercase tracking-wider text-brutalist-text outline-none px-1"
              autoFocus
            />
            <button
              type="submit"
              className="text-xs font-bold font-barlow-cond uppercase text-brutalist-orange hover:text-white cursor-pointer transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-xs font-bold font-barlow-cond uppercase text-brutalist-muted hover:text-brutalist-text cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </form>
        )}

        <Link to="/" className="transition hover:opacity-85" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.svg" alt="HARD-WEAR Logo" className="h-10 w-auto sm:h-14 sm:w-auto" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          {user?.role === 'admin' ? (
            <button
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text transition"
              onClick={() => navigate('/admin')}
              type="button"
            >
              <Shield className="h-3.5 w-3.5 text-brutalist-orange" />
              Admin
            </button>
          ) : null}

          {/* Search Icon Trigger */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen(true);
              setMobileMenuOpen(false);
            }}
            className="text-brutalist-muted hover:text-brutalist-text transition cursor-pointer bg-transparent border-none focus:outline-none flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Cart Button */}
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="border border-[#f0ede6] text-brutalist-text font-barlow-cond text-xs tracking-[1px] sm:tracking-[2px] uppercase px-3 sm:px-4 py-1.5 hover:bg-[#111] hover:text-white hover:bg-brutalist-orange hover:border-brutalist-bg transition font-bold rounded-full hw-cart-btn-rounded"
            aria-label="Cart"
          >
            <span className="hidden sm:inline">Cart ({cartCount})</span>
            <span className="sm:hidden flex items-center gap-1">
              <ShoppingBag className="h-4 w-4 inline" />({cartCount})
            </span>
          </Link>

          {/* Desktop/Tablet User Profile Dropdown (hidden on mobile) */}
          {user ? (
            <div className="hidden sm:block relative" ref={dropdownRef}>
              <button
                className="inline-flex items-center align-middle gap-1.5 text-sm sm:text-base font-barlow-cond tracking-[2px] text-brutalist-muted hover:text-brutalist-text transition cursor-pointer focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <User className="h-5.5 w-5.5" />
                <span className="font-bold">{user.name}</span>
                <ChevronDown className={`h-4 w-4 text-brutalist-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 border border-brutalist-border bg-brutalist-bg py-4 z-50 origin-top-right shadow-lg">
                  <div className="px-6 py-3 border-b border-brutalist-border mb-3">
                    <p className="text-base font-bold text-brutalist-text truncate">{user.name}</p>
                    <p className="text-sm text-brutalist-muted truncate mt-0.5">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-6 py-3 text-base font-barlow-cond uppercase tracking-wider text-brutalist-muted hover:text-brutalist-text hover:bg-brutalist-card transition-colors w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-5 h-5 text-brutalist-orange" />
                    My Profile
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center justify-between px-6 py-3 text-base font-barlow-cond uppercase tracking-wider text-brutalist-muted hover:text-brutalist-text hover:bg-brutalist-card transition-colors w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-brutalist-orange" />
                      My Wishlist
                    </span>
                    {wishlistCount ? (
                      <span className="bg-brutalist-orange text-white text-[10px] font-bold px-2 py-0.5">
                        {wishlistCount}
                      </span>
                    ) : null}
                  </Link>

                  <Link
                    to="/account/orders"
                    className="flex items-center gap-3 px-6 py-3 text-base font-barlow-cond uppercase tracking-wider text-brutalist-muted hover:text-brutalist-text hover:bg-brutalist-card transition-colors w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShoppingBag className="w-5 h-5 text-brutalist-orange" />
                    My Orders
                  </Link>

                  <button
                    type="button"
                    className="flex items-center gap-3 px-6 py-3 text-base font-barlow-cond uppercase tracking-wider text-red-500 hover:bg-brutalist-card transition-colors w-full text-left font-bold border-t border-brutalist-border mt-3 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      dispatch(logout());
                      navigate('/');
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text transition"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          )}

          {/* Hamburger Menu Toggle Button (visible only on mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden flex items-center justify-center text-brutalist-muted hover:text-brutalist-text transition cursor-pointer bg-transparent border-none focus:outline-none relative z-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-brutalist-bg pt-24 px-8 pb-8 z-45 sm:hidden flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
            <div className="flex flex-col gap-6 text-lg tracking-[2px] font-barlow-cond uppercase">
              <Link to="/products" className="text-brutalist-text font-bold hover:text-brutalist-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/about" className="text-brutalist-text font-bold hover:text-brutalist-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>

              <div className="border-t border-brutalist-border my-2"></div>

              {user ? (
                <>
                  <Link to="/profile" className="text-brutalist-muted hover:text-brutalist-text" onClick={() => setMobileMenuOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/wishlist" className="text-brutalist-muted hover:text-brutalist-text flex items-center justify-between" onClick={() => setMobileMenuOpen(false)}>
                    <span className="flex items-center gap-2">
                      My Wishlist
                      <Heart className="w-4 h-4 text-brutalist-muted" />
                    </span>
                    {wishlistCount ? (
                      <span className="bg-brutalist-orange text-white text-[10px] font-bold px-2 py-0.5">
                        {wishlistCount}
                      </span>
                    ) : null}
                  </Link>
                  <Link to="/account/orders" className="text-brutalist-muted hover:text-brutalist-text" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-brutalist-orange font-bold hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <Link to="/login" className="text-brutalist-text font-bold hover:text-brutalist-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>

            {user && (
              <div className="border-t border-brutalist-border pt-6">
                <button
                  type="button"
                  className="w-full bg-red-700 text-white text-xs font-bold uppercase tracking-[2px] py-4 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    dispatch(logout());
                    navigate('/');
                  }}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
