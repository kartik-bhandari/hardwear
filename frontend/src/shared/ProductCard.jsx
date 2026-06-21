import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const img = product.images?.[0];
  const firstWord = product.name?.split(' ')?.[0]?.toUpperCase() || 'TEE';
  
  // Custom badges based on stock/type
  const getBadge = () => {
    if (product.countInStock === 0) {
      return { text: 'Sold out', className: 'bg-brutalist-border text-brutalist-muted' };
    }
    // Generate hot/new badges pseudo-randomly or from features
    if (product.featured) {
      return { text: 'Hot', className: 'bg-brutalist-orange text-white' };
    }
    if (new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return { text: 'New', className: 'bg-brutalist-text text-brutalist-bg font-semibold' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group overflow-hidden"
    >
      {/* Product Image Area */}
      <div className="h-40 sm:h-48 md:h-52 bg-[#0c0c0e] relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
        {/* Diagonal striped lines pattern */}
        <div className="absolute inset-0 hw-diagonal-lines opacity-40"></div>
        
        {/* Background text decoration */}
        <div className="absolute font-bebas text-3xl sm:text-4xl tracking-[4px] text-zinc-900 select-none z-0">
          {firstWord}
        </div>

        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 font-barlow-cond text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full z-20 font-bold ${badge.className}`}>
            {badge.text}
          </span>
        )}

        {/* Actual Image */}
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover z-10 opacity-90 transition-transform duration-500 ease-out group-hover:scale-108 group-hover:opacity-100"
            loading="lazy"
          />
        ) : null}
      </div>

      {/* Product Details Info */}
      <div className="p-3 flex flex-col justify-between">
        <h3 className="font-semibold text-xs sm:text-sm md:text-base text-zinc-200 truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 truncate mt-0.5">
            {product.description}
          </p>
        )}
        
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="font-bold text-xs sm:text-sm md:text-base text-zinc-100">
            ₹{product.price}
          </p>
          
          {/* Colors */}
          <div className="flex gap-1">
            {product.colors && product.colors.length > 0 ? (
              product.colors.slice(0, 3).map((col, idx) => (
                <div 
                  key={idx} 
                  className="w-2.5 h-2.5 rounded-full border border-zinc-800" 
                  style={{ backgroundColor: col }}
                />
              ))
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full border border-zinc-800 bg-[#222]" />
                <div className="w-2.5 h-2.5 rounded-full border border-zinc-800 bg-brutalist-orange" />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
