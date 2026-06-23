import { useState } from 'react';
import { ArrowLeft, Mail, Instagram, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending message
    setSuccess(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 text-brutalist-text font-barlow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-wide uppercase text-brutalist-text">
            Get in touch <span className="text-brutalist-orange">///</span>
          </h1>
          <p className="text-xs sm:text-sm text-brutalist-muted uppercase tracking-widest mt-2">
            Order inquiries, business collaborations, or custom drop feedback.
          </p>
        </div>
        <Link 
          to="/products" 
          className="text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to drops
        </Link>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Left Column - Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-brutalist-border bg-[#111] p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 hw-diagonal-lines opacity-10 pointer-events-none"></div>
            
            <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange relative z-10 border-b border-brutalist-border pb-3">
              Direct Channels
            </h2>
            
            <div className="space-y-6 relative z-10">
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-brutalist-bg border border-brutalist-border flex items-center justify-center text-brutalist-orange rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-brutalist-darkMuted uppercase tracking-widest font-bold">Email support</div>
                  <a 
                    href="mailto:contact@hard-wear.in" 
                    className="text-sm font-semibold hover:text-brutalist-orange transition hover:underline mt-0.5 block"
                  >
                    contact@hard-wear.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-brutalist-bg border border-brutalist-border flex items-center justify-center text-brutalist-orange rounded-lg">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-brutalist-darkMuted uppercase tracking-widest font-bold">Direct message</div>
                  <a 
                    href="https://instagram.com/hardwear.live" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-semibold hover:text-brutalist-orange transition hover:underline mt-0.5 block"
                  >
                    @hardwear.live
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-brutalist-bg border border-brutalist-border flex items-center justify-center text-brutalist-orange rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-brutalist-darkMuted uppercase tracking-widest font-bold">Operating Hours</div>
                  <p className="text-sm font-semibold text-brutalist-text mt-0.5">
                    Mon - Fri: 10:00 - 18:00 IST
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:col-span-7 border border-brutalist-border bg-[#111] p-6 sm:p-8 space-y-6">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-text border-b border-brutalist-border pb-3">
            Send a message
          </h2>

          {success && (
            <div className="border border-emerald-950 bg-[#0c2214] p-4 text-emerald-300 text-xs uppercase tracking-wider font-bold flex items-center gap-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Message sent successfully! We will get back to you soon.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider outline-none focus:ring-1 focus:ring-brutalist-orange rounded-lg"
                required
              />
            </label>

            <label className="grid gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider outline-none focus:ring-1 focus:ring-brutalist-orange rounded-lg"
                required
              />
            </label>

            <label className="grid gap-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted">Subject</span>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider outline-none focus:ring-1 focus:ring-brutalist-orange rounded-lg"
                required
              />
            </label>

            <label className="grid gap-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brutalist-muted">Message</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full bg-brutalist-bg border border-brutalist-border px-4 py-3 text-xs text-brutalist-text font-barlow-cond uppercase tracking-wider outline-none focus:ring-1 focus:ring-brutalist-orange rounded-lg resize-none"
                required
              />
            </label>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-8 py-3.5 hover:opacity-80 active:scale-[0.98] transition cursor-pointer shadow-sm"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
