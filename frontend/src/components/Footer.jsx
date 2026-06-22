import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-brutalist-border bg-brutalist-bg text-brutalist-text font-barlow">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="hidden md:block select-none">
          <img src="/logo.svg" alt="HARD-WEAR Logo" className="h-8 w-auto opacity-45 hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-[14px] text-white-900 tracking-[1px]">
          <a href="https://instagram.com/hardwear.in" target="_blank" rel="noopener noreferrer" className="hover:text-brutalist-text transition">Instagram</a>
          <a href="#" className="hover:text-brutalist-text transition">Sizing</a>
          <Link to="/contact" className="hover:text-brutalist-text transition">Contact</Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-white-900 tracking-[1px]">
          © {new Date().getFullYear()} Hard-Wear
        </div>

      </div>
    </footer>
  );
}
