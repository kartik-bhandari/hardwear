import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../features/auth/authSlice';
import { fetchCart } from '../features/cart/cartSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || '/';

  const { token, status, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!token) return;
    dispatch(fetchCart());
    dispatch(fetchWishlist());
    navigate(from, { replace: true });
  }, [dispatch, from, navigate, token]);

  useEffect(() => {
    const scriptId = 'google-gsi-client';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initGoogleSignIn();
    }

    function initGoogleSignIn() {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1008657618956-dummyclientid.apps.googleusercontent.com',
        callback: (res) => {
          if (res.credential) {
            dispatch(googleLogin(res.credential));
          }
        },
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 grid place-items-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7">
        <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Login to checkout and manage orders.</p>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</div>
        ) : null}

        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(login({ email, password }));
          }}
        >
          <label className="grid gap-2">
            <span className="text-xs font-semibold text-slate-600">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              autoComplete="email"
              type="email"
              required
            />
          </label>

          <label className="grid gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Password</span>
              <Link to="/forgot-password" className="text-xs font-semibold text-brutalist-orange hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
              autoComplete="current-password"
              type="password"
              required
            />
          </label>

          <button
            disabled={status === 'loading'}
            className="h-11 rounded-2xl bg-brutalist-orange text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            type="submit"
          >
            {status === 'loading' ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Or continue with</span>
        </div>

        <div className="flex justify-center">
          <div id="google-signin-button" className="w-full" style={{ minHeight: '44px', borderRadius: '0.5rem' }} />
        </div>

        <p className="mt-6 text-sm text-slate-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

