import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceClosedBanner, { useServiceClosed } from "@/components/guest/ServiceClosedBanner";
import { spaTreatments } from "@/data/mockData";

const banner = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2200&q=90";

const timeSlots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

export default function Spa() {
  const [selected, setSelected] = useState(spaTreatments[0].id);
  const [slot, setSlot] = useState("15:00");
  const closed = useServiceClosed("spa");

  return (
    <div className="bg-[#FAFAF8]" data-testid="spa-page">
      <Navbar transparent />

      <section className="relative h-[80vh] overflow-hidden">
        <img src={banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-end pb-16">
          <nav className="flex items-center gap-2 text-white/80 text-xs tracking-wider mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-white/40"></i>
            <span className="text-white">Spa</span>
          </nav>
          <p className="text-eyebrow text-[#E6C868]">The Wellness Sanctuary</p>
          <h1 className="mt-4 font-serif text-white text-5xl md:text-7xl leading-[1.05] max-w-4xl">
            The <span className="italic font-light">Aura</span> Spa
          </h1>
          <p className="mt-5 text-white/80 text-lg max-w-2xl">Twelve treatment suites carved from local marble, a rose hammam, and therapists whose hands remember what modern lives forget.</p>
        </div>
      </section>

      <ServiceClosedBanner service="spa" />

      <section className="py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Treatments */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-2">
              <p className="text-eyebrow text-[#C9A227]">Signature Rituals</p>
              <h2 className="mt-2 font-serif text-4xl text-slate-900">Choose your ceremony</h2>
            </div>
            {spaTreatments.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`w-full text-left rounded-[20px] border transition-all p-6 flex items-start gap-6 ${
                  selected === t.id ? "border-[#4F46E5] bg-white shadow-[0_16px_40px_rgba(79,70,229,0.10)]" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                data-testid={`treatment-${t.id}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-16 h-16 rounded-[14px] bg-[#C9A227]/10 grid place-items-center flex-shrink-0">
                  <i className="fa-solid fa-spa text-[#C9A227] text-xl"></i>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl text-slate-900">{t.name}</h3>
                    <div className="text-right">
                      <p className="font-mono text-2xl text-slate-900">${t.price}</p>
                      <p className="text-xs text-slate-500">{t.duration}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{t.benefits}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span>Therapist · {t.therapist}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Reserve card */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-white rounded-[24px] border border-slate-200 p-6" data-testid="spa-reserve-card">
              <p className="text-eyebrow text-[#C9A227]">Reservation</p>
              <h3 className="mt-2 font-serif text-2xl text-slate-900">Available Slots</h3>
              <p className="text-xs text-slate-500 mt-1">Nov 12, 2025 · The Aura Spa</p>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {timeSlots.map((t) => {
                  const disabled = closed || t === "09:00" || t === "18:00";
                  return (
                    <button
                      key={t}
                      onClick={() => !disabled && setSlot(t)}
                      disabled={disabled}
                      className={`py-2.5 rounded-[10px] text-xs font-mono transition-all ${
                        disabled ? "bg-slate-50 text-slate-300 line-through cursor-not-allowed" :
                        slot === t ? "bg-[#4F46E5] text-white" : "bg-[#FAFAF8] text-slate-700 hover:bg-slate-100"
                      }`}
                      data-testid={`slot-${t}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Treatment</span><span className="font-serif text-slate-900">{spaTreatments.find((x) => x.id === selected)?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-mono">{slot}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Therapist</span><span>{spaTreatments.find((x) => x.id === selected)?.therapist}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-eyebrow text-slate-500">Total</span>
                <span className="font-mono text-3xl text-slate-900">${spaTreatments.find((x) => x.id === selected)?.price}</span>
              </div>

              <button
                onClick={() => {
                  if (closed) {
                    toast.error("The spa is temporarily closed", {
                      description: "New reservations are paused. Please try again later.",
                    });
                    return;
                  }
                  toast.success("Appointment reserved", {
                    description: `${spaTreatments.find((x) => x.id === selected)?.name} at ${slot}.`,
                  });
                }}
                disabled={closed}
                className={`mt-5 w-full py-3.5 rounded-full text-sm transition-all ${
                  closed
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                }`}
                data-testid="reserve-appointment-btn"
              >
                {closed ? (
                  <><i className="fa-solid fa-lock mr-2 text-[11px]"></i>Currently closed</>
                ) : (
                  "Reserve Appointment"
                )}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-3">
                {closed
                  ? "New spa reservations are paused. Please check back soon."
                  : "Charged to your suite · complimentary cancellation up to 4h prior."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Journal / benefits */}
      <section className="py-20 px-6 md:px-10 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-eyebrow text-[#C9A227]">The Aura Method</p>
          <h2 className="mt-3 font-serif text-4xl text-slate-900">Ancient wisdom, quiet science</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { i: "leaf", t: "Botanical apothecary", d: "Every oil is pressed on the estate from herbs grown in our Mughal gardens." },
              { i: "hand-holding-heart", t: "Six-year training", d: "Every therapist trains for six years before touching a guest." },
              { i: "moon", t: "Post-treatment ritual", d: "Rose-petal bath, silk robe, silence. The stay after the ritual is where the real work happens." },
            ].map((p) => (
              <div key={p.t}>
                <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A227]/10 text-[#C9A227] grid place-items-center">
                  <i className={`fa-solid fa-${p.i} text-lg`}></i>
                </div>
                <h3 className="mt-5 font-serif text-xl text-slate-900">{p.t}</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
