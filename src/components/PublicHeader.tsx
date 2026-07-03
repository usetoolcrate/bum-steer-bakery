import { useEffect, useState } from "react";

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(255,250,245,0.95)] backdrop-blur-xl shadow-[0_2px_20px_rgba(139,111,94,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo + Name */}
        <a href="#" className="flex items-center gap-3">
          <img
            src="/images/logo.jpg"
            alt="The Bum Steer Bakery"
            className="h-14 md:h-16 w-14 md:w-16 rounded-full object-cover bg-white shadow-sm"
          />
          <span className="hidden sm:block font-[Dancing_Script] text-xl md:text-2xl font-bold text-[var(--brand-charcoal)]">
            The Bum Steer Bakery
          </span>
        </a>

        {/* Nav links — hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: "Treats", href: "#treats" },
            { label: "About", href: "#about" },
            { label: "Pricing", href: "#pricing" },
            { label: "How to Order", href: "#order" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[var(--brand-text-light)] hover:text-[var(--brand-rose)] transition-colors tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://app.bakegenie.co/enquiry/thebumsteerbakery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-pink)] text-white text-sm font-semibold rounded-full hover:bg-[var(--brand-rose)] transition-all shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <span>Order Now</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-[var(--brand-charcoal)] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[var(--brand-charcoal)] transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[var(--brand-charcoal)] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[rgba(255,250,245,0.98)] backdrop-blur-xl border-t border-[var(--brand-pink-light)]/30 pb-6 px-6">
          {[
            { label: "Treats", href: "#treats" },
            { label: "About", href: "#about" },
            { label: "Pricing", href: "#pricing" },
            { label: "How to Order", href: "#order" },
            { label: "FAQ", href: "#faq" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-[var(--brand-text)] hover:text-[var(--brand-rose)] transition-colors border-b border-[var(--brand-pink-light)]/20 last:border-0"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
