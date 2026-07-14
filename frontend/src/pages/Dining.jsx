import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceClosedBanner, { useServiceClosed } from "@/components/guest/ServiceClosedBanner";
import { menu } from "@/data/mockData";

const banner = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=90";

const restaurantGallery = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1200&q=85",
];

const reviews = [
  { n: "Andrea F.", r: 5, t: "The Chef&apos;s Table was the most memorable dinner of our travels this year. Extraordinary." },
  { n: "Ravi K.", r: 5, t: "Every dish arrived like a piece of theatre — thoughtful, precise, deeply local." },
  { n: "Elise B.", r: 5, t: "The rose kulfi is worth the journey alone. A true palace of flavours." },
];

export default function Dining() {
  const cats = Object.keys(menu);
  const [cat, setCat] = useState(cats[0]);
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("19:30");
  const [date, setDate] = useState("Nov 12");
  const closed = useServiceClosed("dining");

  return (
    <div className="bg-[#FAFAF8]" data-testid="dining-page">
      <Navbar transparent />

      <section className="relative h-[80vh] overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-16">
          <nav className="flex items-center gap-2 text-white/80 text-xs tracking-wider mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-white/40"></i>
            <span className="text-white">Dining</span>
          </nav>
          <p className="text-eyebrow text-[#E6C868]">Three Restaurants · One Palace</p>
          <h1 className="mt-4 font-serif text-white text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            The <span className="italic font-light">Royal</span> Kitchens
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl">A living archive of Rajput recipes, kept alive by a family of chefs whose lineage stretches back to the palace&apos;s founding.</p>
        </div>
      </section>

      <ServiceClosedBanner service="dining" />

      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chef recommendation */}
          <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-200 overflow-hidden" data-testid="chef-recommendation">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[320px]">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85" alt="Chef" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <p className="text-eyebrow text-[#C9A227]">Chef&apos;s Recommendation</p>
                <h2 className="mt-3 font-serif text-3xl text-slate-900">Chef Vikram Singh</h2>
                <p className="text-xs text-slate-500 tracking-widest uppercase mt-1">Executive Chef · 24 years</p>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  &ldquo;Our kitchen is not a place of invention — it is a place of memory. We cook with what the season gives, in the way it was given to us.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-[#FAFAF8] rounded-full">
                    <i className="fa-solid fa-award text-[#C9A227]"></i>Michelin recognized
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-[#FAFAF8] rounded-full">
                    <i className="fa-solid fa-star text-[#C9A227]"></i>4.98 rating
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reserve card */}
          <div className="lg:col-span-1 bg-white rounded-[24px] border border-slate-200 p-6" data-testid="reserve-table-card">
            <p className="text-eyebrow text-[#C9A227]">Reserve a Table</p>
            <h3 className="mt-2 font-serif text-2xl text-slate-900">The Palace Table</h3>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-eyebrow text-slate-500">Date</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" />
              </div>
              <div>
                <label className="text-eyebrow text-slate-500">Time</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((t) => (
                    <button key={t} onClick={() => setTime(t)}
                      className={`py-2.5 rounded-[10px] text-xs font-mono ${time === t ? "bg-[#4F46E5] text-white" : "bg-[#FAFAF8] text-slate-700 hover:bg-slate-100"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-eyebrow text-slate-500">Guests</label>
                <div className="mt-2 flex items-center justify-between p-3 bg-[#FAFAF8] rounded-[14px]">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-slate-200">−</button>
                  <span className="font-mono">{guests} guests</span>
                  <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 rounded-full border border-slate-200">+</button>
                </div>
              </div>
              <button
                onClick={() => {
                  if (closed) {
                    toast.error("The restaurant is temporarily closed", {
                      description: "New table reservations are paused. Please try again later.",
                    });
                    return;
                  }
                  toast.success("Table reserved", {
                    description: `${date} · ${time} · ${guests} guest${guests === 1 ? "" : "s"}.`,
                  });
                }}
                disabled={closed}
                className={`w-full py-3 rounded-full text-sm mt-2 transition-all ${
                  closed
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                }`}
                data-testid="reserve-table-btn"
              >
                {closed ? (
                  <><i className="fa-solid fa-lock mr-2 text-[11px]"></i>Currently closed</>
                ) : (
                  "Reserve Table"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="py-20 px-6 md:px-10 bg-white border-y border-slate-200" data-testid="menu-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-eyebrow text-[#C9A227]">The Menu</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl text-slate-900">Seasonal Selections</h2>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-6 py-2.5 rounded-full text-sm transition-all ${cat === c ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-[#FAFAF8]"}`}
                data-testid={`menu-tab-${c.toLowerCase()}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            {menu[cat].map((d) => (
              <div key={d.name} className="flex items-start justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="font-serif text-2xl text-slate-900">{d.name}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-md">{d.desc}</p>
                </div>
                <p className="font-mono text-lg text-slate-900 whitespace-nowrap">${d.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-eyebrow text-[#C9A227]">Gallery</p>
          <h2 className="mt-3 font-serif text-4xl text-slate-900">From the palace kitchens</h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {restaurantGallery.map((g, i) => (
              <div key={i} className={`rounded-[18px] overflow-hidden ${i === 0 ? "md:row-span-2 md:col-span-2 aspect-square" : "aspect-square"}`}>
                <img src={g} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-6 md:px-10 bg-slate-900 text-white" data-testid="reviews-section">
        <div className="max-w-6xl mx-auto">
          <p className="text-eyebrow text-[#E6C868]">Guest Reviews</p>
          <h2 className="mt-3 font-serif text-4xl">In their own words</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r.n} className="glass-dark p-8 rounded-[20px]">
                <div className="flex text-[#E6C868] gap-1">
                  {[...Array(r.r)].map((_, i) => <i key={i} className="fa-solid fa-star text-xs"></i>)}
                </div>
                <p className="mt-4 font-serif text-lg leading-relaxed">&ldquo;{r.t}&rdquo;</p>
                <p className="mt-6 text-eyebrow text-white/60">{r.n}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
