import { useState, useEffect, useRef, createContext, useContext } from "react";
import { ChevronDown, Heart, Star, MessageCircle, Cake, Cookie, Sparkles, Clock, X, ChevronLeft, ChevronRight, UtensilsCrossed, IceCream, CircleDot, Palette } from "lucide-react";

/* ─── Lightbox Context ─── */
const LightboxContext = createContext<{
  open: (images: { src: string; label: string }[], index: number) => void;
}>({ open: () => {} });

function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<{ src: string; label: string }[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = (imgs: { src: string; label: string }[], idx: number) => {
    setImages(imgs);
    setIndex(idx);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setIndex((i) => (i < images.length - 1 ? i + 1 : 0));

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
          >
            <X className="size-8" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 md:left-6 text-white/70 hover:text-white p-2 z-10"
              >
                <ChevronLeft className="size-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 md:right-6 text-white/70 hover:text-white p-2 z-10"
              >
                <ChevronRight className="size-10" />
              </button>
            </>
          )}
          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[index]?.src}
              alt={images[index]?.label}
              className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white/90 text-base md:text-lg font-[Playfair_Display] mt-4">
              {images[index]?.label}
            </p>
            {images.length > 1 && (
              <p className="text-white/50 text-sm mt-1">
                {index + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

/* ─── Intersection Observer hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `all 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO — WARM & INVITING
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="hero-section">
      <img
        src="/images/hero.webp"
        alt="Beautiful custom cakes and cookies"
        className="hero-bg"
      />

      <div className="hero-content w-full pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-40 h-40 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center logo-glow">
              <img
                src="/images/logo.jpg"
                alt="The Bum Steer Bakery"
                className="w-[90%] h-[90%] object-contain"
              />
            </div>
          </div>

          {/* Tagline */}
          <h1 className="font-[Dancing_Script] text-4xl md:text-6xl lg:text-7xl text-[var(--brand-charcoal)] mb-3">
            Made with Love,
          </h1>
          <p className="font-[Playfair_Display] text-2xl md:text-3xl lg:text-4xl text-[var(--brand-rose)] mb-6 font-semibold">
            Baked to Perfection
          </p>
          <p className="font-[Inter] text-base md:text-lg text-[var(--brand-text)] max-w-xl mx-auto mb-10">
            Custom cakes &amp; decorated cookies for every celebration. 
            Handcrafted with love in every detail.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://app.bakegenie.co/enquiry/thebumsteerbakery" target="_blank" rel="noopener noreferrer" className="cta-primary">
              <Cake className="size-5" />
              Order Your Treat
            </a>
            <a href="#treats" className="cta-secondary">
              See Our Creations
              <Sparkles className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUST BAR
   ═══════════════════════════════════════════════════════════ */
function TrustBar() {
  const items = [
    { icon: <Cake className="size-4" />, text: "Custom Cakes" },
    { icon: <Cookie className="size-4" />, text: "Decorated Cookies" },
    { icon: <Sparkles className="size-4" />, text: "Cupcakes" },
    { icon: <Star className="size-4" />, text: "Est. 2022" },
    { icon: <Heart className="size-4" />, text: "Made with Love" },
  ];

  return (
    <div className="relative bg-[var(--brand-blush)] py-5 shimmer-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-center gap-x-10 gap-y-3">
        {items.map((item) => (
          <span
            key={item.text}
            className="flex items-center gap-2 text-sm text-[var(--brand-text-light)] font-medium"
          >
            <span className="text-[var(--brand-pink)]">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT — MEET COREY
   ═══════════════════════════════════════════════════════════ */
function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-20 md:py-28 bg-[var(--brand-warm-white)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <FadeIn>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-[var(--brand-pink-light)] rounded-2xl opacity-30" />
              <img
                src="/images/baking-scene.webp"
                alt="Corey's baking kitchen"
                className="relative rounded-2xl shadow-lg w-full aspect-[4/3] object-cover"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-2">
                <Heart className="size-5 text-[var(--brand-pink)] fill-[var(--brand-pink)]" />
                <span className="font-[Playfair_Display] font-semibold text-[var(--brand-charcoal)]">Baked Fresh</span>
              </div>
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn delay={200}>
            <div>
              <div className="accent-line mb-6" />
              <h2 className="font-[Dancing_Script] text-4xl md:text-5xl text-[var(--brand-charcoal)] mb-2">
                Meet the Baker
              </h2>
              <p className="font-[Playfair_Display] text-xl text-[var(--brand-rose)] mb-6 font-semibold">
                Hi, I'm Corey!
              </p>
              <p className="text-[var(--brand-text-light)] text-base md:text-lg leading-relaxed mb-5">
                What started as a passion for baking for family and friends has 
                blossomed into The Bum Steer Bakery. Every cake I create and every 
                cookie I decorate is made with the same love and attention to detail 
                as if it were for my own family.
              </p>
              <p className="text-[var(--brand-text-light)] text-base md:text-lg leading-relaxed mb-8">
                I specialize in custom cakes and beautifully decorated cookies for 
                birthdays, weddings, baby showers, holidays, and every sweet 
                moment in between. No box mixes here — everything is made from 
                scratch with quality ingredients.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-6 border-t border-[var(--brand-pink-light)]/40 pt-6">
                {[
                  { num: "100%", label: "From Scratch" },
                  { num: "Est.", label: "2022" },
                  { num: "∞", label: "Love" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-[Playfair_Display] text-2xl md:text-3xl font-bold text-[var(--brand-pink)]">
                      {s.num}
                    </div>
                    <div className="text-xs text-[var(--brand-text-light)] mt-1 uppercase tracking-wider font-medium">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TREATS GALLERY — WHAT WE MAKE
   ═══════════════════════════════════════════════════════════ */
function TreatsSection() {
  const treats = [
    {
      img: "/images/cake-custom.webp",
      title: "Custom Cakes",
      desc: "Fairy gardens, princess castles, themed masterpieces — every cake is designed from scratch to bring your vision to life.",
      icon: <Cake className="size-6" />,
    },
    {
      img: "/images/cookies.webp",
      title: "Decorated Cookies",
      desc: "Royal icing sugar cookies that are almost too pretty to eat. Custom shapes, intricate details, and designs for any theme.",
      icon: <Cookie className="size-6" />,
    },
    {
      img: "/images/cake-sculpted.webp",
      title: "Sculpted Cakes",
      desc: "From adorable animals to jaw-dropping 3D creations — cakes that double as works of art and taste incredible too.",
      icon: <Star className="size-6" />,
    },
    {
      img: "/images/cupcakes.webp",
      title: "Cupcakes",
      desc: "Beautifully decorated cupcakes with hand-piped details, fondant toppers, and flavors your guests will rave about.",
      icon: <Sparkles className="size-6" />,
    },
    {
      img: "/images/cake-birthday.webp",
      title: "Birthday Cakes",
      desc: "Make their special day unforgettable. Themed birthday cakes for kids and adults, designed just for your celebration.",
      icon: <Heart className="size-6" />,
    },
    {
      img: "/images/cake-specialty.webp",
      title: "Specialty & Event Cakes",
      desc: "Retirements, graduations, showers, and milestones. Creative custom cakes that tell a story and steal the show.",
      icon: <MessageCircle className="size-6" />,
    },
  ];

  return (
    <section id="treats" className="scroll-mt-20 py-20 md:py-28 bg-[var(--brand-blush)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <FadeIn className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl lg:text-6xl text-[var(--brand-charcoal)] mb-4">
            Our Sweet Creations
          </h2>
          <p className="text-[var(--brand-text-light)] max-w-xl mx-auto text-base md:text-lg">
            Every treat is a work of art — handcrafted with premium ingredients 
            and decorated with love.
          </p>
        </FadeIn>

        {/* 3x2 grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {treats.map((treat, i) => (
            <FadeIn key={treat.title} delay={i * 100}>
              <div className="gallery-card bg-white group h-full">
                <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                  <img src={treat.img} alt={treat.title} loading="lazy" />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--brand-blush)] text-[var(--brand-pink)]">
                      {treat.icon}
                    </div>
                    <h3 className="font-[Playfair_Display] text-lg md:text-xl font-bold text-[var(--brand-charcoal)]">
                      {treat.title}
                    </h3>
                  </div>
                  <p className="text-[var(--brand-text-light)] text-sm leading-relaxed">
                    {treat.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO GALLERY — EXPANDED WORK SHOWCASE
   ═══════════════════════════════════════════════════════════ */
function PortfolioGallery() {
  const [showAll, setShowAll] = useState(false);
  const { open } = useContext(LightboxContext);

  const photos = [
    { src: "/images/portfolio-wedding.webp", label: "Naked Wedding Cake" },
    { src: "/images/portfolio-farm-cookies.webp", label: "Farm Animal Cookies" },
    { src: "/images/portfolio-jellyfish.webp", label: "Jellyfish Sculpted Cake" },
    { src: "/images/portfolio-mermaid.webp", label: "Mermaid Tail Cake" },
    { src: "/images/portfolio-golf.webp", label: "Golf Birthday Cookies" },
    { src: "/images/portfolio-gatsby.webp", label: "40 & Radiant Vintage Cake" },
    { src: "/images/portfolio-cat.webp", label: "Cat Cake" },
    { src: "/images/portfolio-bluey.webp", label: "Bluey Birthday Cake" },
    { src: "/images/portfolio-gothic.webp", label: "Til Death Bridal Cookies" },
    { src: "/images/portfolio-toystory.webp", label: "Toy Story Cake" },
    { src: "/images/portfolio-western.webp", label: "Western Wrangler Cookies" },
    { src: "/images/portfolio-alexis.webp", label: "30th Birthday Cake" },
    { src: "/images/portfolio-garden-cupcakes.webp", label: "Garden Fairy Cupcakes" },
    { src: "/images/portfolio-farm.webp", label: "Farm Birthday Cake" },
    { src: "/images/portfolio-dino-cookies.webp", label: "Dinosaur Cookies" },
    { src: "/images/portfolio-dark-romance.webp", label: "Gothic Romance Cake" },
    { src: "/images/portfolio-superhero.webp", label: "Superhero Cake & Cookies" },
    { src: "/images/portfolio-grad.webp", label: "Graduation Cookies" },
    { src: "/images/portfolio-pony.webp", label: "Pony Birthday Cake" },
    { src: "/images/portfolio-stadium.webp", label: "Football Stadium Cake" },
    { src: "/images/portfolio-cow-cupcakes.webp", label: "Cow Cupcakes" },
    { src: "/images/portfolio-dino-party.webp", label: "Dino Tea Party Cake" },
    { src: "/images/portfolio-taco.webp", label: "Kawaii Taco Cake" },
    { src: "/images/portfolio-wicked.webp", label: "Wicked Musical Cookies" },
  ];

  const visible = showAll ? photos : photos.slice(0, 12);

  return (
    <section className="py-20 md:py-28 bg-[var(--brand-warm-white)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-14">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl lg:text-6xl text-[var(--brand-charcoal)] mb-4">
            More of Our Work
          </h2>
          <p className="text-[var(--brand-text-light)] max-w-xl mx-auto text-base md:text-lg">
            Every order is one of a kind. Here are some of our favorites.
          </p>
        </FadeIn>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 md:gap-4">
          {visible.map((photo, i) => (
            <FadeIn key={photo.src} delay={i < 12 ? i * 50 : 0}>
              <button
                onClick={() => open(photos, photos.indexOf(photo))}
                className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 w-full cursor-pointer mb-3 md:mb-4 break-inside-avoid"
              >
                <img
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  className="w-full h-auto rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-3 md:p-4">
                  <span className="text-white text-sm md:text-base font-[Playfair_Display] font-semibold drop-shadow-md">
                    {photo.label}
                  </span>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>

        {!showAll && (
          <FadeIn className="text-center mt-10">
            <button
              onClick={() => setShowAll(true)}
              className="cta-secondary inline-flex items-center gap-2"
            >
              <ChevronDown className="size-5" />
              Load More
            </button>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   QUOTE BAND — FULL IMAGE
   ═══════════════════════════════════════════════════════════ */
function QuoteBand() {
  return (
    <div className="image-band">
      <img
        src="/images/quote-band.webp"
        alt="Elegant wedding cake"
        loading="lazy"
      />
      <div className="image-band-content text-center px-4 max-w-3xl">
        <h2 className="font-[Dancing_Script] text-4xl md:text-5xl lg:text-6xl text-[var(--brand-charcoal)] mb-4">
          Life is what you bake it
        </h2>
        <p className="text-[var(--brand-text-light)] text-lg md:text-xl mb-8 font-[Playfair_Display]">
          Every celebration deserves something special — let us make it sweet.
        </p>
        <a href="https://app.bakegenie.co/enquiry/thebumsteerbakery" target="_blank" rel="noopener noreferrer" className="cta-primary">
          <MessageCircle className="size-5" />
          Start Your Order
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLAVORS MODAL
   ═══════════════════════════════════════════════════════════ */
function FlavorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cakeFlavors = [
    "White / Vanilla", "Chocolate", "Yellow", "Funfetti", "Marble",
    "Red Velvet", "Lemon", "Strawberry", "Cookies n Cream", "Coconut",
    "White Chocolate Raspberry"
  ];
  const fillingFlavors = [
    "Raspberry Jam", "Strawberry Jam", "Blueberry Jam", "Lemon Curd",
    "Chocolate Ganache", "White Chocolate Ganache", "S'mores",
    "Cookies n Cream", "Coffee Ganache", "Salted Caramel",
    "Brownie Crumble", "Strawberry Crunch"
  ];
  const frostingFlavors = [
    "Raspberry Buttercream", "Strawberry Buttercream", "Blueberry Buttercream",
    "Lemon Buttercream", "White Chocolate Buttercream",
    "Cream Cheese Buttercream", "Cookies n Cream Buttercream",
    "Mocha Buttercream", "Peppermint Buttercream", "Coconut Buttercream",
    "Salted Caramel Buttercream"
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-[var(--brand-cream)] rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[var(--brand-charcoal)] transition-colors z-10"
        >
          <X className="size-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="accent-line mx-auto mb-4" />
            <h3 className="font-[Dancing_Script] text-3xl md:text-4xl text-[var(--brand-charcoal)] mb-2">
              Our Flavors
            </h3>
            <p className="text-[var(--brand-text-light)] text-sm">
              Mix and match to create your perfect treat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Cake Flavors */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Cake className="size-5 text-[var(--brand-pink)]" />
                <h4 className="font-[Playfair_Display] font-bold text-[var(--brand-charcoal)]">Cake Flavors</h4>
              </div>
              <ul className="space-y-1.5">
                {cakeFlavors.map(f => (
                  <li key={f} className="text-sm text-[var(--brand-text)] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-pink-light)] mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Filling Flavors */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <IceCream className="size-5 text-[var(--brand-pink)]" />
                <h4 className="font-[Playfair_Display] font-bold text-[var(--brand-charcoal)]">Filling Flavors</h4>
              </div>
              <ul className="space-y-1.5">
                {fillingFlavors.map(f => (
                  <li key={f} className="text-sm text-[var(--brand-text)] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-pink-light)] mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Frosting Flavors */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="size-5 text-[var(--brand-pink)]" />
                <h4 className="font-[Playfair_Display] font-bold text-[var(--brand-charcoal)]">Frosting Flavors</h4>
              </div>
              <ul className="space-y-1.5">
                {frostingFlavors.map(f => (
                  <li key={f} className="text-sm text-[var(--brand-text)] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-pink-light)] mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-xs text-[var(--brand-text-light)] mt-6 italic">
            These flavors are also available for cake pops and cupcakes
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRICING SECTION — TABBED CATEGORIES
   ═══════════════════════════════════════════════════════════ */
type PricingTab = "cakes" | "sheet" | "cookies" | "macarons" | "cupcakes" | "cakepops";

function PricingSection() {
  const [tab, setTab] = useState<PricingTab>("cakes");
  const [flavorsOpen, setFlavorsOpen] = useState(false);

  const tabs: { id: PricingTab; label: string; icon: React.ReactNode }[] = [
    { id: "cakes", label: "Cakes", icon: <Cake className="size-4" /> },
    { id: "sheet", label: "Sheet Cakes", icon: <UtensilsCrossed className="size-4" /> },
    { id: "cookies", label: "Cookies", icon: <Cookie className="size-4" /> },
    { id: "macarons", label: "Macarons", icon: <CircleDot className="size-4" /> },
    { id: "cupcakes", label: "Cupcakes", icon: <Sparkles className="size-4" /> },
    { id: "cakepops", label: "Cake Pops", icon: <IceCream className="size-4" /> },
  ];

  return (
    <section id="pricing" className="scroll-mt-20 py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-12">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl lg:text-6xl text-[var(--brand-charcoal)] mb-4">
            Pricing
          </h2>
          <p className="text-[var(--brand-text-light)] max-w-xl mx-auto text-base md:text-lg">
            Base prices before decor, details, and custom flavors. Every creation is unique!
          </p>
        </FadeIn>

        {/* Tabs */}
        <FadeIn>
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-hide justify-center flex-wrap">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  tab === t.id
                    ? "bg-[var(--brand-pink)] text-white shadow-md"
                    : "bg-[var(--brand-blush)] text-[var(--brand-text)] hover:bg-[var(--brand-pink-light)] hover:text-[var(--brand-charcoal)]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Tab Content */}
        <FadeIn key={tab}>
          <div className="bg-[var(--brand-cream)] rounded-3xl p-6 md:p-8 shadow-sm">
            {tab === "cakes" && (
              <div>
                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-1">Round Cakes</h3>
                <p className="text-xs text-[var(--brand-text-light)] mb-5 italic">Prices vary based on flavors and design</p>
                <div className="space-y-3">
                  {[
                    { size: '6 inch', price: "$65" },
                    { size: '8 inch', price: "$85" },
                    { size: '10 inch', price: "$110" },
                  ].map(r => (
                    <div key={r.size} className="flex items-center justify-between py-2.5 px-4 bg-white rounded-xl">
                      <span className="font-medium text-[var(--brand-charcoal)]">{r.size}</span>
                      <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)] text-lg">{r.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "sheet" && (
              <div>
                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-1">Sheet Cakes</h3>
                <p className="text-xs text-[var(--brand-text-light)] mb-5 italic">Perfect for any celebration</p>
                <div className="hidden md:grid grid-cols-4 gap-2 text-xs font-semibold text-[var(--brand-text-light)] uppercase tracking-wide px-4 mb-2">
                  <span>Size</span>
                  <span className="text-center">Serves</span>
                  <span className="text-center">Single Layer</span>
                  <span className="text-center">Two Layer</span>
                </div>
                <div className="space-y-3">
                  {[
                    { size: '1/4 Sheet', dims: '9" x 13"', serves: "12-15", single: "$75+", double: "$105+" },
                    { size: '1/2 Sheet', dims: '12" x 18"', serves: "18-24", single: "$100+", double: "$140+" },
                    { size: 'Full Sheet', dims: '18" x 26"', serves: "36-48", single: "$155+", double: "$210+" },
                  ].map(r => (
                    <div key={r.size} className="md:grid md:grid-cols-4 md:gap-2 bg-white rounded-xl py-3 px-4">
                      <div>
                        <span className="font-medium text-[var(--brand-charcoal)]">{r.size}</span>
                        <span className="text-xs text-[var(--brand-text-light)] ml-1">({r.dims})</span>
                      </div>
                      <span className="text-[var(--brand-text)] md:text-center text-sm">
                        <span className="md:hidden text-[var(--brand-text-light)]">Serves </span>{r.serves}
                      </span>
                      <div className="md:text-center mt-1 md:mt-0">
                        <span className="md:hidden text-xs text-[var(--brand-text-light)]">Single: </span>
                        <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)]">{r.single}</span>
                      </div>
                      <div className="md:text-center mt-1 md:mt-0">
                        <span className="md:hidden text-xs text-[var(--brand-text-light)]">Two Layer: </span>
                        <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)]">{r.double}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "cookies" && (
              <div>
                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-5">Custom Sugar Cookies</h3>
                <div className="space-y-3">
                  {[
                    { name: "Simple Design", desc: "2 colors and 2 designs", price: "$36 / doz" },
                    { name: "Detailed Design", desc: "Up to 4 colors and 3 designs", price: "$48 / doz" },
                    { name: "Elaborate Design", desc: "More than 4 colors, 4+ designs", price: "$60 / doz" },
                  ].map(r => (
                    <div key={r.name} className="flex items-center justify-between py-3 px-4 bg-white rounded-xl gap-4">
                      <div>
                        <span className="font-medium text-[var(--brand-charcoal)]">{r.name}</span>
                        <p className="text-xs text-[var(--brand-text-light)]">{r.desc}</p>
                      </div>
                      <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)] text-lg whitespace-nowrap">{r.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "macarons" && (
              <div>
                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-5">Macarons</h3>
                <div className="space-y-3">
                  {[
                    { name: "Basic Flavors", desc: "Buttercream filling", price: "$30 / doz" },
                    { name: "Gourmet Flavors", desc: "Premium flavor combinations", price: "$36 / doz" },
                    { name: "Custom Decorated", desc: "Gourmet flavors with custom decor", price: "$48-$52 / doz" },
                  ].map(r => (
                    <div key={r.name} className="flex items-center justify-between py-3 px-4 bg-white rounded-xl gap-4">
                      <div>
                        <span className="font-medium text-[var(--brand-charcoal)]">{r.name}</span>
                        <p className="text-xs text-[var(--brand-text-light)]">{r.desc}</p>
                      </div>
                      <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)] text-lg whitespace-nowrap">{r.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "cupcakes" && (
              <div>
                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-1">Cupcakes</h3>
                <p className="text-xs text-[var(--brand-text-light)] mb-5 italic">Prices vary based on design and custom details</p>
                <div className="space-y-3">
                  {[
                    { name: "Standard Cupcakes", price: "$30 / doz" },
                    { name: "Gourmet Cupcakes", price: "$36 / doz" },
                    { name: "Custom Decorated", price: "$48+ / doz" },
                  ].map(r => (
                    <div key={r.name} className="flex items-center justify-between py-3 px-4 bg-white rounded-xl">
                      <span className="font-medium text-[var(--brand-charcoal)]">{r.name}</span>
                      <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)] text-lg whitespace-nowrap">{r.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "cakepops" && (
              <div>
                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-5">Cake Pops</h3>
                <div className="space-y-3">
                  {[
                    { name: "1 Dozen", price: "$30" },
                    { name: "2 Dozen", price: "$55" },
                    { name: "3 Dozen", price: "$78" },
                    { name: "Custom Decorated (Detailed)", price: "$40+ / doz" },
                  ].map(r => (
                    <div key={r.name} className="flex items-center justify-between py-3 px-4 bg-white rounded-xl">
                      <span className="font-medium text-[var(--brand-charcoal)]">{r.name}</span>
                      <span className="font-[Playfair_Display] font-bold text-[var(--brand-rose)] text-lg whitespace-nowrap">{r.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Flavors CTA */}
        <FadeIn className="text-center mt-8">
          <button
            onClick={() => setFlavorsOpen(true)}
            className="cta-secondary inline-flex items-center gap-2"
          >
            <Palette className="size-5" />
            View Our Flavors
          </button>
        </FadeIn>
      </div>

      <FlavorsModal isOpen={flavorsOpen} onClose={() => setFlavorsOpen(false)} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOW TO ORDER — 3 SIMPLE STEPS
   ═══════════════════════════════════════════════════════════ */
function HowToOrder() {
  const steps = [
    {
      num: "01",
      icon: <MessageCircle className="size-8 text-[var(--brand-pink)]" />,
      title: "Tell Us Your Vision",
      desc: "Reach out and share the details — the occasion, theme, colors, flavors, and any inspiration photos you love. We'll help bring your dream treat to life.",
    },
    {
      num: "02",
      icon: <Sparkles className="size-8 text-[var(--brand-pink)]" />,
      title: "We Design & Bake",
      desc: "Corey will craft your custom creation from scratch using quality ingredients and meticulous decoration. Every detail matters.",
    },
    {
      num: "03",
      icon: <Heart className="size-8 text-[var(--brand-pink)]" />,
      title: "Enjoy & Celebrate!",
      desc: "Pick up your gorgeous treat or have it delivered right to your door (delivery available for a fee). The best part? It tastes even better than it looks.",
    },
  ];

  return (
    <section id="order" className="scroll-mt-20 py-20 md:py-28 bg-[var(--brand-warm-white)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl text-[var(--brand-charcoal)] mb-4">
            How to Order
          </h2>
          <p className="text-[var(--brand-text-light)] max-w-lg mx-auto">
            Getting your perfect custom treat is easy as 1-2-3
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 200}>
              <div className="relative text-center p-8 md:p-10 bg-white rounded-2xl shadow-[0_2px_16px_rgba(139,111,94,0.06)] hover:shadow-[0_8px_30px_rgba(139,111,94,0.12)] transition-all duration-300">
                {/* Step number watermark */}
                <div className="font-[Playfair_Display] text-7xl md:text-8xl text-[var(--brand-pink-light)] opacity-40 mb-2 leading-none font-bold">
                  {step.num}
                </div>

                <div className="mb-4 flex justify-center">{step.icon}</div>

                <h3 className="font-[Playfair_Display] text-xl font-bold text-[var(--brand-charcoal)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--brand-text-light)] text-sm leading-relaxed">
                  {step.desc}
                </p>

                {/* Arrow between steps (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 z-10 text-[var(--brand-pink)] text-2xl">
                    →
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={600} className="text-center mt-12">
          <a href="https://app.bakegenie.co/enquiry/thebumsteerbakery" target="_blank" rel="noopener noreferrer" className="cta-primary text-lg px-8 py-4">
            <MessageCircle className="size-5" />
            Start Your Order
          </a>
          <p className="text-[var(--brand-text-light)] text-sm mt-4">
            Please order at least <strong>2 weeks in advance</strong> for custom cakes
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHAT MAKES US SPECIAL
   ═══════════════════════════════════════════════════════════ */
function WhyUsSection() {
  const reasons = [
    {
      icon: <Heart className="size-6" />,
      title: "Made with Love",
      desc: "Every treat is crafted with genuine care and passion. This isn't a factory — it's a labor of love.",
    },
    {
      icon: <Star className="size-6" />,
      title: "100% From Scratch",
      desc: "No box mixes, no shortcuts. Real butter, real vanilla, real ingredients you can taste in every bite.",
    },
    {
      icon: <Sparkles className="size-6" />,
      title: "Custom Designs",
      desc: "Your vision, our artistry. From elegant wedding cakes to fun birthday cookies — if you can dream it, we can bake it.",
    },
    {
      icon: <Clock className="size-6" />,
      title: "Always Fresh",
      desc: "Baked to order, never sitting on a shelf. Your treats are made fresh for your special day.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[var(--brand-blush)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl text-[var(--brand-charcoal)] mb-4">
            What Makes Us Special
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <FadeIn key={r.title} delay={i * 100}>
              <div className="text-center p-6 md:p-8 bg-white rounded-2xl shadow-[0_2px_12px_rgba(139,111,94,0.05)] hover:shadow-[0_6px_24px_rgba(139,111,94,0.1)] transition-all duration-300 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--brand-blush)] text-[var(--brand-pink)] mb-5">
                  {r.icon}
                </div>
                <h3 className="font-[Playfair_Display] text-lg font-bold text-[var(--brand-charcoal)] mb-2">
                  {r.title}
                </h3>
                <p className="text-[var(--brand-text-light)] text-sm leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVIEWS (copied word for word from Facebook)
   ═══════════════════════════════════════════════════════════ */
function ReviewsSection() {
  const [showAll, setShowAll] = useState(false);
  const reviews = [
    {
      name: "Elizabeth C.",
      text: "I ordered a box of goodies for a celebration to share with my family members. Every single person tried something different and each of them raved about their choices. My husband said the snickerdoodle was the best he's ever had!! Thank you so much!!",
    },
    {
      name: "Courtney D.",
      text: "Beautiful cupcakes! I ordered 2 dozen cupcakes for a joint birthday party, half axolotl and half trains and we could not be more pleased with how they turned out. The kids loved the designs and they tasted great! Thank you so much again, and we will definitely be using The Bum Steer Bakery in the future 😊",
    },
    {
      name: "Karen M.",
      text: "Corey has made several cakes / cupcakes for me. I've never been disappointed. She is the absolute best! Very professional and talented. It amazes me how creative she is. I highly recommend Corey with The Bum Steer Bakery for all your sweet treat needs!",
    },
    {
      name: "Alyssa T.",
      text: "I purchased the funfetti cookies and cream cake pops for my kiddos and they were so good they refused to share a bite with me!! Will definitely purchase more again!!",
    },
    {
      name: "Amy W.",
      text: "This is the first time I've ordered from this bakery. My experience was beyond amazing! The cake was beautiful and delicious! Corey did an amazing job! I will definitely order from her again.",
    },
    {
      name: "Lucia L.",
      text: "Corey nailed every single detail I asked for, and I couldn't be happier with how everything turned out!",
    },
    {
      name: "Brittney E.",
      text: "She made sugar cookies for our gender reveal that were cute and delicious! All of our guests said how good they taste.",
    },
    {
      name: "Heather C.",
      text: "Absolutely amazing to work with and amazing cakes! It's not just all looks the flavor of the cake and icing is delicious!",
    },
    {
      name: "Mercedes W.",
      text: "The cookies & cream cakesicles are so good! The macarons are great too🥰",
    },
    {
      name: "Stiffany T.",
      text: "Delicious cake that's not overly sweet. Great care and attention to detail!",
    },
    {
      name: "Tara C.",
      text: "The flavor and design of the cake were top tier!",
    },
    {
      name: "Brittany F.",
      text: "We got two of their mini loaf cakes and they were amazing!! Super nice people too!",
    },
    {
      name: "Candy P.",
      text: "She makes the best cookies and cakes in town! With love!",
    },
    {
      name: "Alisha H.",
      text: "The cake I ordered was awesome! Everyone loved it and it was delicious!",
    },
    {
      name: "Amber W.",
      text: "All of their desserts taste amazing and look awesome! Highly recommend!",
    },
    {
      name: "Judy W.",
      text: "the cakes for my Great Granddaughter were beautiful and delicious . Definitely recommended this bakery",
    },
    {
      name: "Suzette K.",
      text: "Ms Racheal 1st birthday cake was beautiful and taste amazing. Will definitely order again.",
    },
    {
      name: "Carol W.",
      text: "They melt in your mouth very good so good I need to order more",
    },
  ];
  const visible = showAll ? reviews : reviews.slice(0, 6);

  return (
    <section id="reviews" className="scroll-mt-20 py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-16">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl text-[var(--brand-charcoal)] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[var(--brand-text-light)] text-base md:text-lg">
            100% recommend on Facebook (20 reviews)
          </p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {visible.map((r, i) => (
            <FadeIn key={r.name} delay={(i % 3) * 100} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <figure className="p-6 md:p-8 bg-[var(--brand-warm-white)] rounded-2xl shadow-[0_2px_12px_rgba(139,111,94,0.05)] h-full">
                <Heart className="size-6 text-[var(--brand-pink)] mb-4" />
                <blockquote className="text-[var(--brand-charcoal)] leading-relaxed mb-4">
                  {r.text}
                </blockquote>
                <figcaption className="font-[Playfair_Display] font-bold text-[var(--brand-charcoal)]">
                  {r.name}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!showAll && (
            <button type="button" onClick={() => setShowAll(true)} className="cta-primary">
              Read More Reviews
            </button>
          )}
          <a
            href="https://www.facebook.com/profile.php?id=61568907998361"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-secondary"
          >
            Find Us on Facebook
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════ */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--brand-pink-light)]/40">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-[Playfair_Display] text-base md:text-lg font-semibold text-[var(--brand-charcoal)] group-hover:text-[var(--brand-rose)] transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`size-5 text-[var(--brand-pink)] shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-6 -mt-1">
          <p className="text-[var(--brand-text-light)] text-sm md:text-base leading-relaxed max-w-2xl">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "How far in advance should I order?",
      a: "For custom cakes, please reach out at least 2 weeks before your event. For decorated cookie sets, 2-3 weeks is ideal. During busy seasons (holidays, graduation, wedding season), earlier is always better!",
    },
    {
      q: "What flavors do you offer?",
      a: "Our most popular cake flavors include vanilla, chocolate, strawberry, lemon, red velvet, and funfetti. We also love creating unique flavor combinations! Our cookies are classic vanilla sugar cookies with royal icing.",
    },
    {
      q: "Do you deliver?",
      a: "Yes! We offer both pickup and delivery. Delivery is available for a fee — just let us know your location when you place your order and we'll get you a quote. We make sure every treat is packed safely so it arrives looking as good as it tastes.",
    },
    {
      q: "Can you accommodate dietary restrictions?",
      a: "We do our best! Please let us know about any allergies or dietary needs when you reach out, and we'll work together to find a delicious solution.",
    },
    {
      q: "How do I place an order?",
      a: "Simply reach out to us with your event date, the type of treat you want, your theme or design ideas, and any flavor preferences. We'll get back to you with details and pricing!",
    },
    {
      q: "Do you do tastings?",
      a: "For wedding cakes and larger orders, we offer tasting consultations so you can find your perfect flavor combination before the big day.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-28 bg-[var(--brand-warm-white)]">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-12">
          <div className="accent-line mx-auto mb-6" />
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl text-[var(--brand-charcoal)]">
            Common Questions
          </h2>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="border-t border-[var(--brand-pink-light)]/40">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT / FINAL CTA
   ═══════════════════════════════════════════════════════════ */
function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 py-20 md:py-28 bg-[var(--brand-blush)]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <FadeIn>
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-lg overflow-hidden mx-auto mb-6 flex items-center justify-center logo-glow">
            <img
              src="/images/logo.jpg"
              alt="The Bum Steer Bakery"
              className="w-[90%] h-[90%] object-contain"
            />
          </div>
          <h2 className="font-[Dancing_Script] text-4xl md:text-5xl lg:text-6xl text-[var(--brand-charcoal)] mb-4">
            Ready to Order?
          </h2>
          <p className="text-[var(--brand-text-light)] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Let's make your next celebration unforgettable. Reach out today 
            and let's create something sweet together!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://app.bakegenie.co/enquiry/thebumsteerbakery"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary text-lg px-8 py-4"
            >
              <Cake className="size-5" />
              Place Your Order
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61568907998361"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-secondary text-lg px-8 py-4"
            >
              Find Us on Facebook
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[var(--brand-text-light)] text-sm mb-4">
            <a href="tel:541-613-7951" className="hover:text-[var(--brand-rose)] transition-colors">
              541-613-7951
            </a>
            <span className="hidden sm:inline">·</span>
            <a href="mailto:Thebumsteerbakery22@gmail.com" className="hover:text-[var(--brand-rose)] transition-colors">
              Thebumsteerbakery22@gmail.com
            </a>
          </div>

          <p className="text-[var(--brand-text-light)] text-sm">
            Custom cakes · Decorated cookies · Cupcakes &amp; more
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[var(--brand-charcoal)] text-white/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.jpg"
                alt="The Bum Steer Bakery"
                className="h-14 w-14 rounded-full object-cover bg-white shadow-sm"
                loading="lazy"
              />
              <span className="font-[Dancing_Script] text-xl font-bold text-white">
                The Bum Steer Bakery
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Custom cakes and decorated cookies, handcrafted with love for 
              every sweet celebration. Est. 2022.
            </p>
          </div>

          {/* What We Make */}
          <div>
            <h4 className="text-sm text-[var(--brand-pink)] uppercase tracking-widest mb-4 font-semibold">
              What We Make
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Custom Birthday Cakes</li>
              <li>Wedding & Event Cakes</li>
              <li>Decorated Sugar Cookies</li>
              <li>Cupcakes</li>
              <li>Smash Cakes</li>
              <li>Holiday Treats</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm text-[var(--brand-pink)] uppercase tracking-widest mb-4 font-semibold">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li>
                <a
                  href="tel:541-613-7951"
                  className="text-white/70 hover:text-[var(--brand-pink)] transition-colors"
                >
                  541-613-7951
                </a>
              </li>
              <li>
                <a
                  href="mailto:Thebumsteerbakery22@gmail.com"
                  className="text-white/70 hover:text-[var(--brand-pink)] transition-colors"
                >
                  Thebumsteerbakery22@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61568907998361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[var(--brand-pink)] transition-colors"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white/30">
            © {new Date().getFullYear()} The Bum Steer Bakery. All rights reserved.
          </span>
          <span className="text-xs text-white/30 flex items-center gap-1">
            Made with <Heart className="size-3 text-[var(--brand-pink)] fill-[var(--brand-pink)]" /> Est. 2022
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export function PublicLandingPage() {
  return (
    <LightboxProvider>
      <div className="flex-1 flex flex-col">
        <HeroSection />
        <TrustBar />
        <AboutSection />
        <TreatsSection />
        <PortfolioGallery />
        <QuoteBand />
        <PricingSection />
        <HowToOrder />
        <WhyUsSection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </LightboxProvider>
  );
}
