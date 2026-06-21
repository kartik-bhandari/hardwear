import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../shared/ProductCard';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((s) => s.products);
  const [activeSize, setActiveSize] = useState('S');

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, sort: 'newest' }));
  }, [dispatch]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="bg-brutalist-bg text-brutalist-text font-barlow">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b border-brutalist-border min-h-[480px]">
        
        {/* Hero Left */}
        <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-brutalist-border">
          <div>
            <div className="bg-brutalist-orange text-white text-[15px] font-barlow-cond font-bold uppercase tracking-[3px] px-3 py-1 w-fit mb-6">
              SS 2025 Drop 01
            </div>
            
            <h1 className="font-bebas text-7xl sm:text-7xl md:text-8xl lg:text-[150px] leading-[0.9] tracking-[2px] text-brutalist-text uppercase">
              Wear the<br /><span className="text-brutalist-orange">noise.</span>
            </h1>
            
            <p className="mt-6 text-sm sm:text-lg text-brutalist-muted font-barlow-cond uppercase tracking-[1.5px] leading-relaxed max-w-sm">
              Built heavy. Worn raw. No filler. No fluff.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/products')}
              className="border border-[#333] hover:border-brutalist-muted text-brutalist-text font-barlow-cond text-sm uppercase tracking-[2px] px-8 py-3.5 transition cursor-pointer "
            >
              Shop the drop
            </button>
            <button
              onClick={() => navigate('/about')}
              className="bg-brutalist-orange text-white font-barlow-cond text-sm font-bold uppercase tracking-[2px] px-8 py-3.5 hover:bg-white hover:text-brutalist-orange active:scale-[0.98] transition cursor-pointer"
            >
              Our story
            </button>
          </div>
        </div>

        {/* Hero Right Mockup */}
        <div className="bg-[#111] flex flex-col items-center justify-center p-12 relative overflow-hidden min-h-[360px] md:min-h-0">
          {/* Repeat line pattern */}
          <div className="absolute inset-0 hw-lines z-0 pointer-events-none"></div>

          {/* Size Selectors */}
          <div className="absolute top-6 left-6 flex gap-1.5 z-20">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setActiveSize(sz)}
                className={`w-8 h-8 flex items-center justify-center font-barlow-cond text-xs tracking-wider transition font-bold border border-[#222] cursor-pointer ${
                  activeSize === sz
                    ? 'bg-brutalist-orange text-white border-brutalist-orange'
                    : 'text-brutalist-muted hover:border-[#444] hover:text-brutalist-text'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* SVG T-Shirt */}
          <svg className="w-48 h-56 relative z-10 select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 20 L20 60 L45 70 L40 180 H140 L135 70 L160 60 L120 20 Q100 35 60 20Z" fill="#1a1a1a" stroke="#2e2e2e" strokeWidth="1"/>
            <path d="M78 20 Q90 32 102 20" fill="none" stroke="#2e2e2e" strokeWidth="1"/>
            <text x="90" y="115" fontFamily="'Bebas Neue', sans-serif" fontSize="28" fill="#3b1676" textAnchor="middle" letterSpacing="4">HW</text>
            <text x="90" y="132" fontFamily="'Barlow Condensed', sans-serif" fontSize="12" fill="#ffffff" textAnchor="middle" letterSpacing="4">HARD-WEAR</text>
          </svg>

          {/* Pricing Tag */}
          <div className="absolute bottom-6 right-6 text-right z-20 select-none">
            <div className="text-[12px] text-brutalist-darkMuted uppercase tracking-[2px] font-bold">Starting at</div>
            <div className="font-bebas text-4xl text-brutalist-text leading-none">₹999</div>
          </div>
        </div>

      </section>

      {/* Marquee Scrolling Ticker Strip */}
      <section className="bg-brutalist-orange py-3 overflow-hidden border-b border-brutalist-border select-none pointer-events-none">
        <div className="hw-ticker-inner whitespace-nowrap flex">
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            Free shipping above ₹1499 <span className="opacity-50 px-2">///</span>
          </span>
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            New drop every Friday <span className="opacity-50 px-2">///</span>
          </span>
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            100% cotton. Zero compromise <span className="opacity-50 px-2">///</span>
          </span>
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            Sizes XS to XL <span className="opacity-50 px-2">///</span>
          </span>
          {/* Duplicate for seamless infinite marquee loop */}
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            Free shipping above ₹1499 <span className="opacity-50 px-2">///</span>
          </span>
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            New drop every Friday <span className="opacity-50 px-2">///</span>
          </span>
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            100% cotton. Zero compromise <span className="opacity-50 px-2">///</span>
          </span>
          <span className="font-bebas text-sm text-white tracking-[4px] px-10">
            Sizes XS to XL <span className="opacity-50 px-2">///</span>
          </span>
        </div>
      </section>

      {/* Latest Drops Product Grid */}
      <section className="px-6 py-12 md:py-16 mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between border-b border-brutalist-border pb-4 mb-8">
          <h2 className="font-bebas text-3xl tracking-[3px] text-brutalist-text uppercase">
            Latest drops
          </h2>
          <Link
            to="/products"
            className="font-barlow-cond text-xs font-bold uppercase tracking-[2px] text-brutalist-orange hover:text-white transition flex items-center gap-1 group"
          >
            View all 
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {status === 'loading' ? (
          <div className="flex justify-center items-center py-20 text-brutalist-muted uppercase font-barlow-cond tracking-widest text-xs">
            Loading drops...
          </div>
        ) : items.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {items.slice(0, 6).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="border border-brutalist-border p-12 text-center text-brutalist-muted uppercase font-barlow-cond tracking-wider text-xs">
            No products found. Seed database or add products in admin portal.
          </div>
        )}
      </section>

      {/* Promo Features Banner */}
      <section className="bg-[#111] border-t border-b border-brutalist-border grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-brutalist-border">
        
        {/* Banner 1 */}
        <div className="p-6 flex items-center gap-4">
          <div className="bg-brutalist-orange text-white w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-barlow-cond text-xs font-bold uppercase tracking-[1.5px] text-brutalist-text">
              Free shipping
            </div>
            <div className="text-[12px] text-brutalist-muted uppercase tracking-[1px] mt-0.5">
              On orders above ₹1499
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="p-6 flex items-center gap-4">
          <div className="bg-brutalist-orange text-white w-10 h-10 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="font-barlow-cond text-xs font-bold uppercase tracking-[1.5px] text-brutalist-text">
              Easy returns
            </div>
            <div className="text-[12px] text-brutalist-muted uppercase tracking-[1px] mt-0.5">
              7-day no-questions policy
            </div>
          </div>
        </div>

        {/* Banner 3 */}
        <div className="p-6 flex items-center gap-4">
          <div className="bg-brutalist-orange text-white w-10 h-10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-barlow-cond text-xs font-bold uppercase tracking-[1.5px] text-brutalist-text">
              Drop every Friday
            </div>
            <div className="text-[12px] text-brutalist-muted uppercase tracking-[1px] mt-0.5">
              New styles, weekly
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
