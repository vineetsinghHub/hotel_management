import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { rooms, upsells } from "@/data/mockData";

const room = rooms[0];

const countries = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore", "France", "Italy", "Japan"];

export default function Booking() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "Aarav",
    lastName: "",
    email: "aarav@example.com",
    phone: "+91 98200 12345",
    country: "India",
    arrival: "16:00",
    requests: "Sunset boat ride upon arrival, please. Vegetarian preferences.",
  });
  const [selectedUpsells, setSelectedUpsells] = useState(["breakfast"]);
  const [terms, setTerms] = useState(true);
  const [openAccordion, setOpenAccordion] = useState("policies");
  const [promoCode, setPromoCode] = useState("AURA24");

  const toggle = (id) => setSelectedUpsells((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const nights = 3;
  const nightly = room.price;
  const roomTotal = nightly * nights;
  const addOnsTotal = selectedUpsells.reduce((sum, id) => sum + (upsells.find((u) => u.id === id)?.price || 0), 0);
  const taxes = Math.round((roomTotal + addOnsTotal) * 0.18);
  const discount = promoCode === "AURA24" ? Math.round(roomTotal * 0.12) : 0;
  const grand = roomTotal + addOnsTotal + taxes - discount;

  const lastNameError = !form.lastName;

  return (
    <div className="bg-[#FAFAF8] min-h-screen" data-testid="booking-page">
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs tracking-wider text-slate-500 mb-8">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-slate-300"></i>
            <Link to="/rooms" className="hover:text-slate-900">Rooms</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-slate-300"></i>
            <span className="text-slate-900">Reservation</span>
          </nav>

          {/* Progress */}
          <div className="flex items-center justify-between mb-10 max-w-2xl">
            {[
              { n: 1, l: "Guest Details", active: true },
              { n: 2, l: "Payment" },
              { n: 3, l: "Confirmation" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-mono ${s.active ? "bg-[#4F46E5] text-white" : "bg-white border border-slate-200 text-slate-500"}`}>{s.n}</div>
                <p className={`text-sm ${s.active ? "text-slate-900 font-medium" : "text-slate-500"}`}>{s.l}</p>
                {i < 2 && <div className="flex-1 h-px bg-slate-200 ml-2"></div>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8" data-testid="guest-details-card">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-eyebrow text-[#C9A227]">Step 1</p>
                    <h2 className="mt-2 font-serif text-3xl text-slate-900">Guest Details</h2>
                  </div>
                  <span className="text-xs text-slate-500">Reservation held for <span className="font-mono text-slate-900">14:59</span></span>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="First Name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} testid="input-first-name" />
                  <Field
                    label="Last Name"
                    value={form.lastName}
                    onChange={(v) => setForm({ ...form, lastName: v })}
                    error={lastNameError ? "Please enter a last name to continue" : ""}
                    testid="input-last-name"
                  />
                  <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="input-email" type="email" />
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} testid="input-phone" />
                  <Select label="Country" value={form.country} options={countries} onChange={(v) => setForm({ ...form, country: v })} testid="input-country" />
                  <Field label="Arrival Time" value={form.arrival} onChange={(v) => setForm({ ...form, arrival: v })} testid="input-arrival" hint="Approximate — we'll adjust for you." />
                  <div className="md:col-span-2">
                    <label className="text-eyebrow text-slate-500">Special Requests</label>
                    <textarea
                      value={form.requests}
                      onChange={(e) => setForm({ ...form, requests: e.target.value })}
                      rows={3}
                      className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]"
                      data-testid="input-requests"
                    />
                  </div>
                </div>
              </div>

              {/* Upsells */}
              <div className="bg-white rounded-[24px] border border-slate-200 p-8" data-testid="upsells-card">
                <div>
                  <p className="text-eyebrow text-[#C9A227]">Curate your stay</p>
                  <h2 className="mt-2 font-serif text-3xl text-slate-900">Enhancements</h2>
                  <p className="mt-2 text-sm text-slate-500">Refined additions to elevate your visit — selectable now or later.</p>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upsells.map((u) => {
                    const isOn = selectedUpsells.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => toggle(u.id)}
                        className={`text-left rounded-[18px] border transition-all overflow-hidden group ${
                          isOn ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/15 shadow-[0_10px_28px_rgba(79,70,229,0.15)]" : "border-slate-200 hover:border-slate-300"
                        }`}
                        data-testid={`upsell-${u.id}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={u.image} alt={u.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          {isOn && (
                            <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#4F46E5] text-white grid place-items-center">
                              <i className="fa-solid fa-check text-xs"></i>
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-serif text-lg text-slate-900">{u.title}</h3>
                            <span className="font-mono text-sm text-slate-900">+${u.price}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{u.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accordion */}
              <div className="bg-white rounded-[24px] border border-slate-200 divide-y divide-slate-100" data-testid="accordion-card">
                {[
                  { id: "policies", title: "Booking Policies", body: (
                    <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
                      <p><strong className="text-slate-900">Cancellation:</strong> Complimentary cancellation up to 48 hours before arrival. Within 48 hours, one night is charged.</p>
                      <p><strong className="text-slate-900">Check-in / out:</strong> Check-in from 14:00. Check-out by 12:00. Early check-in and late check-out on request.</p>
                      <p><strong className="text-slate-900">Payment:</strong> A one-night pre-authorization is placed at booking. The balance is settled at check-out.</p>
                      <p><strong className="text-slate-900">Children:</strong> Children of all ages are warmly welcomed.</p>
                    </div>
                  )},
                  { id: "terms", title: "Terms & Conditions" },
                  { id: "privacy", title: "Privacy" },
                ].map((row) => (
                  <div key={row.id}>
                    <button
                      onClick={() => setOpenAccordion(openAccordion === row.id ? "" : row.id)}
                      className="w-full flex items-center justify-between px-8 py-5 text-left"
                      data-testid={`accordion-${row.id}`}
                    >
                      <span className="font-serif text-xl text-slate-900">{row.title}</span>
                      <i className={`fa-solid fa-chevron-down text-xs text-slate-500 transition-transform ${openAccordion === row.id ? "rotate-180" : ""}`}></i>
                    </button>
                    {openAccordion === row.id && row.body && (
                      <div className="px-8 pb-6">{row.body}</div>
                    )}
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer" data-testid="terms-checkbox">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#4F46E5]"
                />
                <span>I have read and accept the booking policies, terms and privacy notice.</span>
              </label>
            </div>

            {/* RIGHT — Sticky booking summary */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 bg-white rounded-[24px] border border-slate-200 overflow-hidden" data-testid="booking-summary">
                <div className="relative aspect-[16/9]">
                  <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 glass-dark text-white text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">{room.tag}</span>
                </div>
                <div className="p-6">
                  <p className="text-eyebrow text-[#C9A227]">Your Reservation</p>
                  <h3 className="mt-2 font-serif text-2xl text-slate-900">{room.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{room.view} · {room.bed}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-[14px] bg-[#FAFAF8]">
                      <p className="text-[10px] tracking-widest uppercase text-slate-400">Check-in</p>
                      <p className="font-serif text-lg text-slate-900 mt-1">Nov 12</p>
                      <p className="text-[10px] text-slate-500">Wed · 14:00</p>
                    </div>
                    <div className="p-3 rounded-[14px] bg-[#FAFAF8]">
                      <p className="text-[10px] tracking-widest uppercase text-slate-400">Check-out</p>
                      <p className="font-serif text-lg text-slate-900 mt-1">Nov 15</p>
                      <p className="text-[10px] text-slate-500">Sat · 12:00</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between p-3 rounded-[14px] bg-[#FAFAF8]">
                    <span className="text-sm text-slate-600">Guests</span>
                    <span className="text-sm font-mono text-slate-900">2 Adults · 1 Suite</span>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600"><span>${nightly} × {nights} nights</span><span className="font-mono">${roomTotal}</span></div>
                    {selectedUpsells.map((id) => {
                      const u = upsells.find((x) => x.id === id);
                      return <div key={id} className="flex justify-between text-slate-600"><span>{u.title}</span><span className="font-mono">+${u.price}</span></div>;
                    })}
                    <div className="flex justify-between text-slate-600"><span>Taxes & service</span><span className="font-mono">+${taxes}</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Promo AURA24</span><span className="font-mono">−${discount}</span></div>}
                  </div>

                  <div className="mt-4 flex items-center gap-2 p-2 rounded-full border border-slate-200">
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo code"
                      className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none font-mono tracking-wider"
                      data-testid="promo-input"
                    />
                    <button className="text-xs bg-slate-900 text-white px-4 py-2 rounded-full" data-testid="apply-promo">Apply</button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <p className="text-eyebrow text-slate-500">Grand Total</p>
                      <p className="text-[10px] text-slate-400 mt-1">inclusive of taxes</p>
                    </div>
                    <p className="font-mono text-3xl text-slate-900">${grand}</p>
                  </div>

                  <button
                    onClick={() => nav("/payment")}
                    disabled={!terms || lastNameError}
                    className="mt-6 w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-4 rounded-full shadow-[0_10px_28px_rgba(79,70,229,0.32)]"
                    data-testid="book-now-btn"
                  >
                    Book Now · Secure Payment
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-3">
                    <i className="fa-solid fa-lock text-[9px]"></i> Encrypted end-to-end · PCI DSS
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const Field = ({ label, value, onChange, error, hint, testid, type = "text" }) => (
  <div>
    <label className="text-eyebrow text-slate-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`mt-2 w-full bg-[#FAFAF8] border rounded-[14px] px-4 py-3 text-sm outline-none transition-colors ${
        error ? "border-rose-400 bg-rose-50/50 focus:border-rose-500" : "border-slate-200 focus:border-[#4F46E5]"
      }`}
      data-testid={testid}
    />
    {error && <p className="mt-2 text-xs text-rose-500 flex items-center gap-1.5" data-testid={`${testid}-error`}><i className="fa-solid fa-circle-exclamation text-[10px]"></i>{error}</p>}
    {hint && !error && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
  </div>
);

const Select = ({ label, value, options, onChange, testid }) => (
  <div>
    <label className="text-eyebrow text-slate-500">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full appearance-none bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]"
        data-testid={testid}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 absolute right-4 top-1/2 mt-1 pointer-events-none"></i>
    </div>
  </div>
);
