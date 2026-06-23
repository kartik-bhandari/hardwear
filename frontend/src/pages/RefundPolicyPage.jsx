import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-brutalist-text font-barlow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-wide uppercase text-brutalist-text">
            Refunds & Exchanges <span className="text-brutalist-orange">///</span>
          </h1>
          <p className="text-xs sm:text-sm text-brutalist-muted uppercase tracking-widest mt-2">
            No returns, no cancellations, prepaid transactions only.
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
            1. All Sales Are Final
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            At HARD-WEAR, we operate on limited drops and premium product standards. Because of this, **we do not accept any returns, refunds, or exchanges** under any circumstances once a transaction is successfully completed.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            2. Cancellation Policy
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            Once an order is placed on our storefront, **it cannot be cancelled or modified**. Processing begins instantly to secure packaging and rapid courier dispatch.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            3. Prepaid Payments Only
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            To prevent fraud and maintain the integrity of our drop model, we **only accept prepaid orders** (processed securely via Razorpay using UPI, cards, net banking, or digital wallets). Cash on Delivery (COD) is strictly unavailable.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            4. Support Queries
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            For further queries, size assistance, or order status concerns, please contact us directly via email at <a href="mailto:contact@hard-wear.in" className="text-brutalist-text underline hover:text-brutalist-orange">contact@hard-wear.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
