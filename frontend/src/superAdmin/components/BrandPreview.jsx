// Live preview panel used inside the SuperProvision wizard (Brand step).
// Renders a mini Home hero + mini RoomCard that live-updates as the operator
// tweaks the brand tokens (primary / accent / surface / template). Purely
// presentational — no external state, no navigation.

const TEMPLATE_LOOK = {
  luxury: {
    radius: 22,
    serif: "'Cormorant Garamond', serif",
    heroOverlay: "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.55) 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    eyebrow: "TIMELESS · LUXURY",
    roomImage:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60",
  },
  heritage: {
    radius: 10,
    serif: "'Cormorant Garamond', serif",
    heroOverlay: "linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.65) 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=60",
    eyebrow: "RAJPUTANA HERITAGE",
    roomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=60",
  },
  basic: {
    radius: 14,
    serif: "'Plus Jakarta Sans', sans-serif",
    heroOverlay: "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.40) 100%)",
    heroImage:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=60",
    eyebrow: "BOUTIQUE STAY",
    roomImage:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60",
  },
};

export default function BrandPreview({
  brandName = "Your hotel",
  tagline = "Where every stay becomes a story",
  primary = "#4F46E5",
  accent = "#C9A227",
  surface = "#FAFAF8",
  template = "luxury",
  tier = "basic",
  className = "",
}) {
  const look = TEMPLATE_LOOK[template] || TEMPLATE_LOOK.luxury;
  const displayName = brandName?.trim() || "Your hotel";

  return (
    <div
      className={`sticky top-4 ${className}`}
      data-testid="brand-preview-panel"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-[10px] tracking-[0.22em] uppercase text-slate-400">Live preview</p>
        </div>
        <p className="text-[10px] text-slate-500 font-mono capitalize">{template} · {tier}</p>
      </div>

      {/* Browser chrome */}
      <div
        className="rounded-[14px] overflow-hidden bg-slate-950 border border-white/10 shadow-[0_30px_80px_rgba(2,6,23,0.55)]"
        data-testid="brand-preview-browser"
      >
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/70 border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70"></span>
          <div className="ml-3 flex-1 text-[10px] text-slate-500 font-mono truncate">
            aurahotels.com/t/{displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 22) || "your-hotel"}
          </div>
        </div>

        {/* Stage — themed to the operator's picks */}
        <div style={{ backgroundColor: surface }}>
          {/* Mini navbar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: `${primary}18` }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full grid place-items-center text-[8px] font-serif"
                style={{ backgroundColor: primary, color: "#fff", fontFamily: look.serif }}
              >
                {displayName[0]?.toUpperCase() || "A"}
              </span>
              <span
                className="text-[10px] font-medium truncate max-w-[90px]"
                style={{ color: "#0F172A", fontFamily: look.serif }}
              >
                {displayName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-slate-500">
              <span>Home</span><span>Rooms</span><span>Dining</span>
            </div>
            <span
              className="px-2 py-1 rounded-full text-[8px] text-white"
              style={{ backgroundColor: primary }}
            >
              Book stay
            </span>
          </div>

          {/* Mini hero */}
          <div
            className="relative h-[150px] bg-cover bg-center"
            style={{
              backgroundImage: `${look.heroOverlay}, url(${look.heroImage})`,
              borderRadius: 0,
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
              <p
                className="text-[8px] tracking-[0.22em] mb-1"
                style={{ color: accent }}
              >
                {look.eyebrow}
              </p>
              <p
                className="font-serif text-lg leading-tight truncate"
                style={{ fontFamily: look.serif }}
              >
                {displayName}
              </p>
              <p className="text-[9px] text-white/80 mt-0.5 line-clamp-1">{tagline}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className="px-2.5 py-1 rounded-full text-[8px] font-medium"
                  style={{ backgroundColor: primary, color: "#fff", borderRadius: look.radius }}
                >
                  Reserve
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[8px] font-medium bg-white/15 backdrop-blur border border-white/30"
                  style={{ borderRadius: look.radius }}
                >
                  Explore
                </span>
              </div>
            </div>
          </div>

          {/* Mini room card */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-serif"
                style={{ color: "#0F172A", fontFamily: look.serif }}
              >
                Featured suites
              </p>
              <span className="text-[8px] text-slate-500">3 available</span>
            </div>
            <div
              className="overflow-hidden bg-white border shadow-sm"
              style={{
                borderRadius: look.radius,
                borderColor: `${primary}20`,
              }}
              data-testid="brand-preview-roomcard"
            >
              <div
                className="h-[80px] bg-cover bg-center"
                style={{ backgroundImage: `url(${look.roomImage})` }}
              ></div>
              <div className="p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-serif truncate"
                      style={{ color: "#0F172A", fontFamily: look.serif }}
                    >
                      Palace View Suite
                    </p>
                    <p className="text-[8px] text-slate-500 truncate">2 guests · King · Lake-facing</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-[10px] font-mono"
                      style={{ color: primary }}
                    >
                      ₹32,000
                    </p>
                    <p className="text-[7px] text-slate-400">/ night</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[7px]"
                    style={{ backgroundColor: `${accent}22`, color: accent }}
                  >
                    ★ 4.98
                  </span>
                  <span
                    className="ml-auto text-[8px] font-medium px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: primary, borderRadius: look.radius }}
                  >
                    View
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token legend */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-[9px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: primary }}></span>
          <span className="font-mono truncate">{primary}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: accent }}></span>
          <span className="font-mono truncate">{accent}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-white/10" style={{ backgroundColor: surface }}></span>
          <span className="font-mono truncate">{surface}</span>
        </div>
      </div>
    </div>
  );
}
