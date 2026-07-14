import { Link } from "react-router-dom";
import Navbar from "@aura/b2c-engine/components/Navbar";
import Footer from "@aura/b2c-engine/components/Footer";
import { rooms, property } from "@aura/shared/data/mockData";

const room = rooms[0];

export default function Confirmation() {
  return (
    <div className="bg-brand-surface min-h-screen" data-testid="confirmation-page">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs tracking-wider text-slate-500 mb-8">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-slate-300"></i>
            <span className="text-slate-900">Confirmation</span>
          </nav>

          {/* Header celebration */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-10 md:p-14 reveal-in">
            {/* SVG illustration */}
            <div className="absolute -right-10 -top-10 opacity-30">
              <svg width="360" height="360" viewBox="0 0 200 200">
                <defs>
                  <radialGradient id="g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E6C868" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#E6C868" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="100" fill="url(#g)" />
                <g fill="none" stroke="#E6C868" strokeWidth="0.5" opacity="0.7">
                  {[...Array(24)].map((_, i) => (
                    <line key={i} x1="100" y1="100" x2={100 + 90 * Math.cos((i * Math.PI) / 12)} y2={100 + 90 * Math.sin((i * Math.PI) / 12)} />
                  ))}
                </g>
              </svg>
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-3 glass-dark px-4 py-2 rounded-full text-xs tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Reservation Confirmed
              </div>
              <h1 className="mt-6 font-serif text-5xl md:text-6xl leading-tight max-w-3xl">
                We look forward to <em className="italic text-brand-accent-hover font-light">hosting</em> you, Aarav.
              </h1>
              <p className="mt-5 text-white/80 text-lg max-w-2xl">Your stay at Aura Hotels has been secured. Every detail is being prepared to make your arrival effortless.</p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-eyebrow text-brand-accent-hover">Reservation ID</p>
                  <p className="font-mono text-2xl mt-2">AH-9F27C1</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <p className="text-eyebrow text-brand-accent-hover">Arrival</p>
                  <p className="font-serif text-2xl mt-2">Nov 12, 2025</p>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <p className="text-eyebrow text-brand-accent-hover">Nights</p>
                  <p className="font-mono text-2xl mt-2">03</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
              {/* Timeline */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8">
                <p className="text-eyebrow text-brand-accent">Journey Timeline</p>
                <h3 className="mt-2 font-serif text-2xl text-slate-900">Your arrival, choreographed.</h3>

                <ol className="mt-8 relative border-l border-slate-200 ml-3">
                  {[
                    { t: "Reservation confirmed", d: "Just now", done: true, i: "check" },
                    { t: "Pre-arrival concierge", d: "3 days before · a personal note from your butler", done: true, i: "envelope" },
                    { t: "Chauffeured arrival", d: "Nov 12 · 12:00 · Mercedes-Maybach", done: false, i: "car" },
                    { t: "Suite check-in", d: "Nov 12 · 14:00 · welcome ritual", done: false, i: "key" },
                    { t: "Departure", d: "Nov 15 · 12:00", done: false, i: "arrow-right" },
                  ].map((s, i) => (
                    <li key={i} className="ml-6 pb-6 last:pb-0">
                      <span className={`absolute -left-[9px] w-[18px] h-[18px] rounded-full grid place-items-center ${s.done ? "bg-emerald-500" : "bg-white border border-slate-300"}`}>
                        <i className={`fa-solid fa-${s.i} text-[9px] ${s.done ? "text-white" : "text-slate-500"}`}></i>
                      </span>
                      <p className={`font-serif text-lg ${s.done ? "text-slate-900" : "text-slate-500"}`}>{s.t}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.d}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Guest & Room */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[24px] border border-slate-200 p-8">
                  <p className="text-eyebrow text-brand-accent">Guest Details</p>
                  <h3 className="mt-2 font-serif text-xl text-slate-900">Primary guest</h3>
                  <div className="mt-5 space-y-3 text-sm">
                    <Row label="Name" v="Aarav Mehta" />
                    <Row label="Email" v="aarav@example.com" mono />
                    <Row label="Phone" v="+91 98200 12345" mono />
                    <Row label="Guests" v="2 Adults · 1 Suite" />
                    <Row label="Arrival" v="16:00 (approx.)" />
                  </div>
                </div>
                <div className="bg-white rounded-[24px] border border-slate-200 p-8">
                  <p className="text-eyebrow text-brand-accent">Room Summary</p>
                  <div className="mt-4 flex items-center gap-4">
                    <img src={room.images[0]} className="w-24 h-24 rounded-[14px] object-cover" alt="" />
                    <div>
                      <h3 className="font-serif text-xl text-slate-900">{room.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{room.view} · {room.bed}</p>
                      <p className="text-xs text-slate-500">{room.size} sq.ft · Up to {room.guests} guests</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2 text-sm">
                    <Row label="Dates" v="Nov 12 → Nov 15" />
                    <Row label="Nights" v="3" mono />
                    <Row label="Total paid" v="$4,460" mono strong />
                  </div>
                </div>
              </div>

              {/* Directions */}
              <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8">
                    <p className="text-eyebrow text-brand-accent">Directions</p>
                    <h3 className="mt-2 font-serif text-2xl text-slate-900">Finding us</h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{property.address}</p>
                    <div className="mt-5 space-y-3 text-sm text-slate-700">
                      <div className="flex gap-3"><i className="fa-solid fa-plane-arrival text-brand-accent mt-1"></i><span>Maharana Pratap Airport (UDR) · 22 km · 35 min</span></div>
                      <div className="flex gap-3"><i className="fa-solid fa-train text-brand-accent mt-1"></i><span>Udaipur City Railway · 6 km · 15 min</span></div>
                    </div>
                    <button className="mt-6 inline-flex items-center gap-2 text-sm text-slate-900 border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-full">
                      Get directions <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </button>
                  </div>
                  <div className="relative min-h-[240px] bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" className="absolute inset-0 w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-slate-900/20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white grid place-items-center shadow-lg">
                      <i className="fa-solid fa-location-dot text-brand-primary"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Weather */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-6" data-testid="weather-widget">
                <p className="text-eyebrow text-brand-accent">Weather at Arrival</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <p className="font-serif text-5xl text-slate-900">28°</p>
                  <p className="text-slate-500 text-sm">Sunny · Nov 12</p>
                </div>
                <i className="fa-solid fa-sun text-brand-accent text-4xl mt-2"></i>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {["Wed", "Thu", "Fri"].map((d, i) => (
                    <div key={d} className="p-3 rounded-[12px] bg-brand-surface">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">{d}</p>
                      <i className={`${i === 0 ? "fa-solid fa-sun text-brand-accent" : "fa-solid fa-cloud-sun text-slate-400"} text-lg mt-1`}></i>
                      <p className="font-mono text-sm mt-1">{28 - i}°</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel Contact */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-6">
                <p className="text-eyebrow text-brand-accent">Hotel Contact</p>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <a href={`tel:${property.phone}`} className="flex items-center gap-3 hover:text-slate-900">
                    <i className="fa-solid fa-phone text-brand-accent"></i><span className="font-mono">{property.phone}</span>
                  </a>
                  <a href={`mailto:${property.email}`} className="flex items-center gap-3 hover:text-slate-900">
                    <i className="fa-regular fa-envelope text-brand-accent"></i><span className="font-mono">{property.email}</span>
                  </a>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-comments text-brand-accent"></i><span>WhatsApp concierge · 24/7</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-6 space-y-3">
                <button className="w-full py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm">
                  <i className="fa-solid fa-download mr-2"></i>Download Invoice
                </button>
                <button className="w-full py-3 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 text-sm">
                  <i className="fa-regular fa-envelope mr-2 text-brand-accent"></i>Email Invoice
                </button>
                <button className="w-full py-3 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 text-sm">
                  <i className="fa-regular fa-calendar-plus mr-2 text-brand-accent"></i>Add to Calendar
                </button>
                <button className="w-full py-3 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 text-sm">
                  <i className="fa-solid fa-diamond-turn-right mr-2 text-brand-accent"></i>Get Directions
                </button>
                <Link to="/experiences" className="w-full block text-center py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm">
                  Book Experiences <i className="fa-solid fa-arrow-right text-[10px] ml-1"></i>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const Row = ({ label, v, mono, strong }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className={`${mono ? "font-mono" : ""} ${strong ? "text-slate-900 font-medium" : "text-slate-800"}`}>{v}</span>
  </div>
);
