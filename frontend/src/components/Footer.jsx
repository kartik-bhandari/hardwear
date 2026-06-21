export default function Footer() {
  return (
    <footer className="border-t border-brutalist-border bg-brutalist-bg text-brutalist-text font-barlow">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="hidden md:block font-bebas text-lg tracking-[4px] text-brutalist-darkMuted select-none">
          HARD-WEAR
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-[14px] text-white-900 tracking-[1px]">
          <a href="https://instagram.com/hardwear.in" target="_blank" className="hover:text-brutalist-text transition">Instagram</a>
          <a href="#" className="hover:text-brutalist-text transition">Sizing</a>
          <a href="#" className="hover:text-brutalist-text transition">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-white-900 tracking-[1px]">
          © {new Date().getFullYear()} Hard-Wear
        </div>

      </div>
    </footer>
  );
}
