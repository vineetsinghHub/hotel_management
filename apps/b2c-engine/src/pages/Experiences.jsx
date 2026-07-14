import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@aura/b2c-engine/components/Navbar";
import Footer from "@aura/b2c-engine/components/Footer";
import ServiceClosedBanner, { useServiceClosed } from "@aura/b2c-engine/components/guest/ServiceClosedBanner";
import { experiences } from "@aura/shared/data/mockData";

const banner = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=90";

export default function Experiences() {
  const [detail, setDetail] = useState(experiences[0]);
  const [open, setOpen] = useState(false);
  const closed = useServiceClosed("experiences");

  return (
    <div className="bg-brand-surface" data-testid="experiences-page">
      <Navbar transparent />

      <section className="relative h-[70vh] overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-16">
          <nav className="flex items-center gap-2 text-white/80 text-xs tracking-wider mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-white/40"></i>
            <span className="text-white">Experiences</span>
          </nav>
          <p className="text-eyebrow text-brand-accent-hover">Curated Journeys</p>
          <h1 className="mt-4 font-serif text-white text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            Six ways to <span className="italic font-light">wander</span>
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl">Custom-crafted experiences arranged by our concierge, from private historians to moonlit boat rides across Lake Pichola.</p>
        </div>
      </section>

      <ServiceClosedBanner service="experiences" />

      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((ex, i) => (
            <article
              key={ex.id}
              className="group bg-white rounded-[24px] overflow-hidden border border-slate-200 hover:shadow-[0_28px_60px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition-all duration-500 reveal-up"
              style={{ animationDelay: `${i * 70}ms` }}
              data-testid={`experience-card-${ex.id}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={ex.image} alt={ex.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 glass-dark text-white text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 rounded-full">{ex.tag}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-3xl">{ex.title}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs">
                    <span><i className="fa-regular fa-clock mr-1.5"></i>{ex.duration}</span>
                    <span className="font-mono">From ${ex.price}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 leading-relaxed">{ex.desc}</p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => { setDetail(ex); setOpen(true); }}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-900 text-sm py-3 rounded-full"
                    data-testid={`exp-details-${ex.id}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      if (closed) {
                        toast.error("Experiences are temporarily closed", {
                          description: "New bookings are paused. Please try again later.",
                        });
                        return;
                      }
                      toast.success("Experience reserved", { description: ex.name });
                    }}
                    disabled={closed}
                    className={`flex-1 text-sm py-3 rounded-full transition-all ${
                      closed
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                    data-testid={`exp-reserve-${ex.id}`}
                  >
                    {closed ? "Closed" : "Reserve"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Experience details modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm" data-testid="experience-modal">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative reveal-scale">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full glass grid place-items-center">
              <i className="fa-solid fa-xmark text-slate-700 text-sm"></i>
            </button>
            <div className="relative h-[380px]">
              <img src={detail.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <span className="glass-dark text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">{detail.tag}</span>
                <h2 className="mt-4 font-serif text-5xl">{detail.title}</h2>
              </div>
            </div>
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-slate-600 leading-relaxed">{detail.desc}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { i: "clock", l: "Duration", v: detail.duration },
                    { i: "user-group", l: "Group", v: "Private · up to 6" },
                    { i: "language", l: "Language", v: "English, Hindi, French" },
                    { i: "utensils", l: "Includes", v: "Refreshments" },
                  ].map((r) => (
                    <div key={r.l} className="p-4 rounded-[14px] bg-brand-surface">
                      <p className="text-[10px] tracking-widest uppercase text-slate-400"><i className={`fa-solid fa-${r.i} mr-1.5 text-brand-accent`}></i>{r.l}</p>
                      <p className="mt-2 font-serif text-lg text-slate-900">{r.v}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-eyebrow text-slate-500">What to bring</p>
                <ul className="mt-2 text-sm text-slate-600 space-y-1.5">
                  <li>· Comfortable shoes</li>
                  <li>· Light shawl for evening chills</li>
                  <li>· Curiosity, above all</li>
                </ul>
              </div>
              <div className="md:col-span-1">
                <div className="p-6 rounded-[20px] border border-slate-200 bg-brand-surface">
                  <p className="text-eyebrow text-slate-500">From</p>
                  <p className="font-mono text-4xl text-slate-900 mt-1">${detail.price}</p>
                  <p className="text-xs text-slate-500 mt-1">per guest, taxes included</p>
                  <button
                    onClick={() => {
                      if (closed) {
                        toast.error("Experiences are temporarily closed");
                        return;
                      }
                      toast.success("Experience reserved", { description: detail.name });
                    }}
                    disabled={closed}
                    className={`mt-5 w-full py-3 rounded-full text-sm transition-all ${
                      closed
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-brand-primary hover:bg-brand-primary-hover text-white"
                    }`}
                    data-testid="exp-modal-reserve"
                  >
                    {closed ? (
                      <><i className="fa-solid fa-lock mr-2 text-[11px]"></i>Currently closed</>
                    ) : (
                      "Reserve Experience"
                    )}
                  </button>
                  <button className="mt-3 w-full py-3 rounded-full border border-slate-200 hover:bg-white text-slate-900 text-sm">Chat with concierge</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
