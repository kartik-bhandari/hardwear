import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-brutalist-text font-barlow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-wide uppercase text-brutalist-text">
            Terms of Service <span className="text-brutalist-orange">///</span>
          </h1>
          <p className="text-xs sm:text-sm text-brutalist-muted uppercase tracking-widest mt-2">
            Last Updated: June 23, 2026
          </p>
        </div>
        <Link 
          to="/" 
          className="text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      {/* Content Block */}
      <div className="border border-brutalist-border bg-[#111] p-6 sm:p-8 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 hw-diagonal-lines opacity-10 pointer-events-none"></div>
        
        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            1. Overview
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            This website is operated by HARD-WEAR. Throughout the site, the terms "we", "us" and "our" refer to HARD-WEAR. By visiting our site and/or purchasing products from us, you engage in our "Service" and agree to be bound by the following terms and conditions.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            2. Store & Purchase Terms
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.
          </p>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            We reserve the right to refuse service or cancel orders in cases of suspected fraud, stock errors, pricing inaccuracies, or violation of store parameters.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            3. Prices & Modifications
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue any drop item or service segment without liability.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            4. Payment Processing
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            All credit cards, debit cards, UPI, and wallet payments are processed securely via third-party gateways (Razorpay). By completing a transaction, you authorize us to charge the selected payment method for the checkout subtotal, taxes, and shipping fees.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            5. Governing Law
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Haryana/New Delhi.
          </p>
        </section>
      </div>
    </div>
  );
}
