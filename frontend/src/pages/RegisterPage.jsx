import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, googleLogin, verifyOTP } from '../features/auth/authSlice';
import { fetchCart } from '../features/cart/cartSlice';
import { fetchWishlist } from '../features/wishlist/wishlistSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, status, error } = useSelector((s) => s.auth);

  const [step, setStep] = useState('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (!token) return;
    dispatch(fetchCart());
    dispatch(fetchWishlist());
    navigate('/', { replace: true });
  }, [dispatch, navigate, token]);

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
        document.getElementById('google-signup-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [dispatch]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setStep('verify');
        setResendTimer(120);
      }
    });
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    dispatch(register({ name, email, password })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setResendTimer(120);
      }
    });
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email, otp }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 grid place-items-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7">
        {step === 'register' ? (
          <>
            <h1 className="text-2xl font-black tracking-tight">Create account</h1>
            <p className="mt-1 text-sm text-slate-600">Fast checkout and order tracking.</p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</div>
            ) : null}

            <form className="mt-6 grid gap-4" onSubmit={handleRegisterSubmit}>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-600">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  autoComplete="name"
                  required
                />
              </label>

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
                <span className="text-xs font-semibold text-slate-600">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  autoComplete="new-password"
                  type="password"
                  required
                  minLength={6}
                />
              </label>

              <button
                disabled={status === 'loading'}
                className="h-11 rounded-2xl bg-brutalist-orange text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                type="submit"
              >
                {status === 'loading' ? 'Creating…' : 'Create account'}
              </button>
            </form>

            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold">Or continue with</span>
            </div>

            <div className="flex justify-center">
              <div id="google-signup-button" className="w-full" style={{ minHeight: '44px' }} />
            </div>

            <p className="mt-6 text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                Login
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black tracking-tight">Verify Email</h1>
            <p className="mt-1 text-sm text-slate-600">We've sent a 6-digit verification code to <strong>{email}</strong>.</p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</div>
            ) : null}

            <form className="mt-6 grid gap-4" onSubmit={handleVerifySubmit}>
              <label className="grid gap-2">
                <span className="text-xs font-semibold text-slate-600">Verification Code</span>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 000000"
                  maxLength={6}
                  className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 text-center tracking-[4px] font-bold"
                  required
                />
              </label>

              <button
                disabled={status === 'loading'}
                className="h-11 rounded-2xl bg-brutalist-orange text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50"
                type="submit"
              >
                {status === 'loading' ? 'Verifying…' : 'Verify Code'}
              </button>
            </form>

            <div className="mt-6 flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => setStep('register')}
                className="text-slate-600 hover:text-slate-900 font-semibold hover:underline"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || status === 'loading'}
                className="text-brutalist-orange hover:underline font-semibold disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend Code (${formatTime(resendTimer)})` : 'Resend Code'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
