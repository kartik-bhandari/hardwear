import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-brutalist-text font-barlow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-wide uppercase text-brutalist-text">
            Privacy Policy <span className="text-brutalist-orange">///</span>
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
            1. Information We Collect
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            We collect information you provide directly to us when creating an account, placing an order, subscribing to our newsletter, or communicating with us. This includes your name, email address, billing address, shipping address, phone number, and purchase history.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            2. How We Use Your Information
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            We use the information we collect to process checkouts, arrange shipping, fulfill orders, send transaction notifications (OTP, order confirmations), improve storefront interface performance, and send newsletters or marketing updates if consented.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            3. Sharing of Information
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            We do not sell your personal data. We only share information with trusted third-party service providers who assist us in operating our site and conducting business:
          </p>
          <ul className="list-disc list-inside text-sm text-brutalist-muted space-y-1.5 pl-2">
            <li><strong>Payment Gateways (Razorpay)</strong>: To secure transaction authorization.</li>
            <li><strong>Shipping Providers</strong>: To route package delivery to your address.</li>
            <li><strong>Communication Platforms (Resend)</strong>: To deliver transactional alerts and codes.</li>
          </ul>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            4. Cookies & Trackers
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            We use local storage cookies to retain active checkout sessions, items in the cart, wishlist choices, and dashboard JWT tokens. We do not use third-party behavioral advertising cookies.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            5. Contact Information
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            If you have questions about our privacy policies, please reach out directly via email to <a href="mailto:contact@hard-wear.in" className="text-brutalist-text underline hover:text-brutalist-orange">contact@hard-wear.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
