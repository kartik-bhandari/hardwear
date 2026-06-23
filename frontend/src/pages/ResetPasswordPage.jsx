import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../app/apiClient';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link: Verification token is missing.');
      setStatus('failed');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    setMessage(null);

    // Validate matching passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setStatus('failed');
      return;
    }

    // Validate password strength (min 6 characters, must contain both letters and numbers)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    if (password.length < 6 || !passwordRegex.test(password)) {
      setError('Password must be at least 6 characters long and contain both letters and numbers.');
      setStatus('failed');
      return;
    }

    try {
      const { data } = await api.post('/api/auth/reset-password', {
        token,
        password,
      });
      setMessage(data.message);
      setStatus('succeeded');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.');
      setStatus('failed');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 grid place-items-center font-barlow text-brutalist-text">
      <div className="w-full max-w-md rounded-3xl border border-brutalist-border bg-[#111] p-7 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 hw-diagonal-lines opacity-10 pointer-events-none"></div>

        <h1 className="font-bebas text-3xl tracking-wide uppercase text-brutalist-text relative z-10">
          New Password <span className="text-brutalist-orange">///</span>
        </h1>
        <p className="mt-2 text-xs text-brutalist-muted uppercase tracking-wider relative z-10">
          Enter a secure password containing both letters and numbers.
        </p>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-950 bg-rose-950/20 p-4 text-xs uppercase tracking-wider font-bold text-rose-300 flex items-start gap-2.5 relative z-10">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : null}

        {message ? (
          <div className="mt-5 rounded-2xl border border-emerald-950 bg-emerald-950/20 p-4 text-xs uppercase tracking-wider font-bold text-emerald-300 flex items-start gap-2.5 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        ) : null}

        {status !== 'succeeded' && token && (
          <form className="mt-6 grid gap-4 relative z-10" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brutalist-muted">New Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider outline-none focus:ring-1 focus:ring-brutalist-orange rounded-lg"
                type="password"
                required
                disabled={status === 'loading'}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brutalist-muted">Confirm Password</span>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider outline-none focus:ring-1 focus:ring-brutalist-orange rounded-lg"
                type="password"
                required
                disabled={status === 'loading'}
              />
            </label>

            <button
              disabled={status === 'loading'}
              className="mt-2 w-full bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] py-3.5 hover:opacity-80 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              type="submit"
            >
              {status === 'loading' ? 'Updating password…' : 'Update password'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-brutalist-border flex justify-between relative z-10">
          <Link 
            to="/login" 
            className="text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
