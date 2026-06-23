import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-brutalist-text font-barlow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-wide uppercase text-brutalist-text">
            Shipping & Delivery <span className="text-brutalist-orange">///</span>
          </h1>
          <p className="text-xs sm:text-sm text-brutalist-muted uppercase tracking-widest mt-2">
            Estimated delivery times, free shipping, and prepaid-only rules.
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
            1. Shipping Rates
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            We are proud to offer **FREE shipping on all orders** shipped within India. There is no minimum cart value threshold required to qualify for free delivery.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            2. Prepaid Orders Only
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            All orders placed on our website are processed **strictly as prepaid**. Cash on Delivery (COD) shipping is not supported. Your order will be queued for packaging only after payment confirmation.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            3. Processing & Dispatch Timelines
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            All orders are processed and dispatched within **24 to 48 hours** (excluding weekends and public holidays) after payment verification.
          </p>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            Once dispatched, a tracking number and delivery link will be sent to the contact mobile number provided during checkout.
          </p>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            4. Estimated Delivery Times
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            Estimated shipping times vary based on your location:
          </p>
          <ul className="list-disc list-inside text-sm text-brutalist-muted space-y-1.5 pl-2">
            <li><strong>Haryana & Delhi NCR</strong>: 2 - 3 Business Days</li>
            <li><strong>Metro Cities (Mumbai, Bengaluru, Kolkata, etc.)</strong>: 3 - 5 Business Days</li>
            <li><strong>Rest of India</strong>: 5 - 7 Business Days</li>
          </ul>
        </section>

        <section className="space-y-3 relative z-10">
          <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange border-b border-brutalist-border pb-2">
            5. Damaged or Lost Packages
          </h2>
          <p className="text-sm text-brutalist-muted leading-relaxed">
            HARD-WEAR is not responsible for transit delays caused by external courier services or customs holds. If your package arrives damaged or is lost, please contact us immediately at <a href="mailto:contact@hard-wear.in" className="text-brutalist-text underline hover:text-brutalist-orange">contact@hard-wear.in</a> with your tracking ID so we can file an official investigation.
          </p>
        </section>
      </div>
    </div>
  );
}
