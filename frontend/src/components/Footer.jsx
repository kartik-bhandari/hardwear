import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-brutalist-border bg-brutalist-bg text-brutalist-text font-barlow">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col items-center gap-6">
        
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="hidden md:block select-none">
            <img src="/logo.png" alt="HARD-WEAR Logo" className="h-8 w-auto hover:opacity-50 transition-opacity duration-300" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-[14px] text-white-900 tracking-[1px]">
            <a href="https://instagram.com/hardwear.live" target="_blank" rel="noopener noreferrer" className="hover:text-brutalist-text transition">Instagram</a>
            <a href="#" className="hover:text-brutalist-text transition">Sizing</a>
            <Link to="/contact" className="hover:text-brutalist-text transition">Contact</Link>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-white-900 tracking-[1px]">
            © {new Date().getFullYear()} HardWear
          </div>
        </div>

        {/* Bottom Section - Legal Policies */}
        <div className="w-full border-t border-brutalist-border/30 pt-4 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[11px] text-brutalist-muted tracking-[0.5px]">
          <Link to="/privacy" className="hover:text-brutalist-text transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-brutalist-text transition">Terms of Service</Link>
          <Link to="/refunds" className="hover:text-brutalist-text transition">Refunds & Cancellations</Link>
          <Link to="/shipping" className="hover:text-brutalist-text transition">Shipping & Delivery</Link>
        </div>

      </div>
    </footer>
  );
}
