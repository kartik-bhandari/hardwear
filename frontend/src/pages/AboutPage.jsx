import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 text-brutalist-text font-barlow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-brutalist-border pb-6 mb-10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-wide uppercase text-brutalist-text">
            Our story <span className="text-brutalist-orange">///</span>
          </h1>
          <p className="text-xs sm:text-sm text-brutalist-muted uppercase tracking-widest mt-2">
            Heavy cotton. Sharp lines. Raw attitude.
          </p>
        </div>
        <Link 
          to="/products" 
          className="text-xs font-barlow-cond uppercase tracking-[2px] text-brutalist-muted hover:text-brutalist-text flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Shop the drop
        </Link>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Column: Brand Philosophy */}
        <div className="space-y-8">
          <div className="border border-brutalist-border bg-[#111] p-6 sm:p-8 space-y-4 relative overflow-hidden">
            {/* Background diagonal lines */}
            <div className="absolute inset-0 hw-diagonal-lines opacity-10 pointer-events-none"></div>
            
            <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-orange relative z-10">
              The Genesis
            </h2>
            <p className="text-sm text-brutalist-muted leading-relaxed relative z-10">
              Founded in 2026, HARD-WEAR was born out of frustration with thin, flimsy, overpriced streetwear blanks that shrink and fade after a single wash. We set out to create the ultimate heavy-weight streetwear that is built like a tank and fits like a shadow.
            </p>
            <p className="text-sm text-brutalist-muted leading-relaxed relative z-10">
              We don't do seasons. We don't do collections. We design individual drops of high-integrity streetwear garments. Each piece is numbered, curated, and produced in limited quantity runs.
            </p>
          </div>

          <div className="border border-brutalist-border bg-[#111] p-6 sm:p-8 space-y-4">
            <h2 className="font-bebas text-2xl tracking-wider uppercase text-brutalist-text">
              Our Philosophy
            </h2>
            <p className="text-sm text-brutalist-muted leading-relaxed">
              We believe garments should outlive trends. Our aesthetic draws heavy inspiration from industrial designs, brutalist architecture, and raw subcultures. Every stitching line is intentional, every seam reinforced. 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brutalist-border/30">
              {[
                '280 GSM Heavyweight Cotton',
                'Pre-Shrunk & Carbon Washed',
                'Industrial Double-Stitch',
                'Drop Shoulder Silhouette',
              ].map((spec) => (
                <div key={spec} className="flex items-center gap-2 text-xs font-barlow-cond uppercase tracking-wider text-brutalist-text">
                  <CheckCircle2 className="w-4 h-4 text-brutalist-orange shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Garment Specs Details */}
        <div className="border border-brutalist-border bg-[#111] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-bebas text-3xl tracking-wider uppercase text-brutalist-text border-b border-brutalist-border pb-3">
              Spec Sheet
            </h2>
            
            <div className="space-y-4 divide-y divide-brutalist-border/30 text-xs font-barlow-cond uppercase tracking-wider">
              <div className="flex justify-between py-2">
                <span className="text-brutalist-muted">Fabric Type</span>
                <span className="text-brutalist-text font-bold">100% French Terry Cotton</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-brutalist-muted">Garment Weight</span>
                <span className="text-brutalist-text font-bold">280 GSM / Heavyweight Knit</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-brutalist-muted">Dye Process</span>
                <span className="text-brutalist-text font-bold">Reactive Acid Washed</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-brutalist-muted">Fit Silhouette</span>
                <span className="text-brutalist-text font-bold">Boxy Over-Sized / Drop Shoulder</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-brutalist-muted">Rib Neckline</span>
                <span className="text-brutalist-text font-bold">1.2" Thick Heavy Spandex Rib</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-brutalist-muted">Seam Work</span>
                <span className="text-brutalist-text font-bold">Reinforced Flatlock Double-Needle</span>
              </div>
            </div>
          </div>

          <div className="bg-brutalist-bg border border-brutalist-border p-5 mt-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="absolute inset-0 hw-diagonal-lines opacity-10 pointer-events-none"></div>
            <div className="relative z-10 text-center sm:text-left">
              <div className="text-[10px] text-brutalist-darkMuted uppercase tracking-widest font-bold">Ready to wear</div>
              <div className="font-bebas text-2xl text-brutalist-text tracking-wide mt-1">Explore our latest drops</div>
            </div>
            <Link
              to="/products"
              className="relative z-10 bg-brutalist-orange text-white font-barlow-cond text-xs font-bold uppercase tracking-[2px] px-6 py-3 hover:bg-[#e63300] active:scale-[0.98] transition cursor-pointer"
            >
              Shop now
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
