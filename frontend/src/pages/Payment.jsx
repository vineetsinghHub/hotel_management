import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { rooms } from "@/data/mockData";

const room = rooms[0];

const methods = [
  { id: "card", label: "Credit Card", icon: "fa-regular fa-credit-card" },
  { id: "upi", label: "UPI", icon: "fa-solid fa-indian-rupee-sign" },
  { id: "netbanking", label: "Net Banking", icon: "fa-solid fa-building-columns" },
  { id: "gpay", label: "Google Pay", icon: "fa-brands fa-google-pay" },
  { id: "apple", label: "Apple Pay", icon: "fa-brands fa-apple-pay" },
];

const ConfettiPiece = ({ i }) => {
  const colors = ["#C9A227", "#4F46E5", "#10B981", "#F43F5E", "#E6C868"];
  return (
    <div
      className="confetti-piece"
      style={{
        left: `${(i * 5.2) % 100}%`,
        background: colors[i % colors.length],
        animationDelay: `${(i % 10) * 0.15}s`,
        transform: `rotate(${i * 20}deg)`,
      }}
    />
  );
};

export default function Payment() {
  const nav = useNavigate();
  const [method, setMethod] = useState("card");
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({ number: "4242 4242 4242 4242", name: "AARAV MEHTA", expiry: "08 / 28", cvc: "•••" });
  const [coupon, setCoupon] = useState("AURA24");

  const total = 4460;

  return (
    <div className="bg-[#FAFAF8] min-h-screen" data-testid="payment-page">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs tracking-wider text-slate-500 mb-6">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-slate-300"></i>
            <Link to="/booking" className="hover:text-slate-900">Reservation</Link>
            <i className="fa-solid fa-chevron-right text-[8px] text-slate-300"></i>
            <span className="text-slate-900">Payment</span>
          </nav>

          {/* Steps */}
          <div className="flex items-center justify-between mb-10 max-w-2xl">
            {[
              { n: 1, l: "Guest Details", done: true },
              { n: 2, l: "Payment", active: true },
              { n: 3, l: "Confirmation" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-mono ${
                  s.done ? "bg-emerald-500 text-white" : s.active ? "bg-[#4F46E5] text-white" : "bg-white border border-slate-200 text-slate-500"
                }`}>
                  {s.done ? <i className="fa-solid fa-check text-[10px]"></i> : s.n}
                </div>
                <p className={`text-sm ${s.active || s.done ? "text-slate-900 font-medium" : "text-slate-500"}`}>{s.l}</p>
                {i < 2 && <div className="flex-1 h-px bg-slate-200 ml-2"></div>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Payment Container */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[24px] border border-slate-200 p-8 md:p-10" data-testid="payment-card">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-eyebrow text-[#C9A227]">Step 2</p>
                    <h2 className="mt-2 font-serif text-3xl text-slate-900">Payment</h2>
                    <p className="text-slate-500 text-sm mt-1">Encrypted end-to-end · PCI DSS certified</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <i className="fa-solid fa-lock text-[10px]"></i>SSL Secure
                    </span>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`p-4 rounded-[18px] border text-center transition-all ${
                        method === m.id ? "border-[#4F46E5] bg-indigo-50/40 shadow-[0_6px_20px_rgba(79,70,229,0.12)]" : "border-slate-200 hover:border-slate-300"
                      }`}
                      data-testid={`pay-method-${m.id}`}
                    >
                      <i className={`${m.icon} text-2xl ${method === m.id ? "text-[#4F46E5]" : "text-slate-700"}`}></i>
                      <p className="mt-2 text-xs text-slate-700">{m.label}</p>
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {method === "card" && (
                  <div className="mt-10">
                    <p className="text-eyebrow text-slate-500 mb-4">Card details</p>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-6">
                        <label className="text-eyebrow text-slate-500">Card Number</label>
                        <div className="relative mt-2">
                          <input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })}
                            className="w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5] font-mono tracking-wider" data-testid="card-number"/>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <i className="fa-brands fa-cc-visa text-2xl text-slate-400"></i>
                            <i className="fa-brands fa-cc-mastercard text-2xl text-slate-300"></i>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-eyebrow text-slate-500">Cardholder Name</label>
                        <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}
                          className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5]" data-testid="card-name"/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-eyebrow text-slate-500">Expiry</label>
                        <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                          className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="card-expiry"/>
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-eyebrow text-slate-500">CVC</label>
                        <input value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                          className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5] font-mono text-center" data-testid="card-cvc"/>
                      </div>
                    </div>

                    {/* Billing */}
                    <p className="text-eyebrow text-slate-500 mt-8 mb-4">Billing address</p>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <input placeholder="Street address" defaultValue="122 Marine Drive"
                        className="md:col-span-6 bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5]" />
                      <input placeholder="City" defaultValue="Mumbai"
                        className="md:col-span-2 bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5]" />
                      <input placeholder="State" defaultValue="Maharashtra"
                        className="md:col-span-2 bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5]" />
                      <input placeholder="Postal" defaultValue="400020"
                        className="md:col-span-2 bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5] font-mono" />
                    </div>
                  </div>
                )}

                {method === "upi" && (
                  <div className="mt-10">
                    <p className="text-eyebrow text-slate-500 mb-4">UPI ID</p>
                    <input defaultValue="aarav@okhdfcbank"
                      className="w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3.5 text-sm outline-none focus:border-[#4F46E5] font-mono" />
                    <p className="text-xs text-slate-500 mt-3">You will receive a payment prompt on your UPI app.</p>
                  </div>
                )}

                {method === "netbanking" && (
                  <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["HDFC", "ICICI", "Axis", "SBI", "Kotak", "Yes", "IDFC", "Federal"].map((b) => (
                      <button key={b} className="p-4 rounded-[14px] bg-[#FAFAF8] border border-slate-200 hover:border-slate-300 text-sm text-slate-800">{b} Bank</button>
                    ))}
                  </div>
                )}

                {(method === "gpay" || method === "apple") && (
                  <div className="mt-10 py-16 grid place-items-center bg-[#FAFAF8] rounded-[20px]">
                    <i className={`${method === "gpay" ? "fa-brands fa-google-pay" : "fa-brands fa-apple-pay"} text-6xl text-slate-800`}></i>
                    <p className="text-sm text-slate-500 mt-4">Tap the button below to open your wallet.</p>
                  </div>
                )}

                {/* Coupon */}
                <div className="mt-10 p-5 rounded-[18px] bg-[#FAFAF8] border border-slate-200 flex items-center gap-4">
                  <i className="fa-solid fa-ticket text-[#C9A227]"></i>
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    className="flex-1 bg-transparent text-sm outline-none font-mono tracking-wider" data-testid="coupon-input"/>
                  <button className="text-xs bg-slate-900 text-white px-4 py-2 rounded-full">Apply</button>
                </div>

                {/* Trust marks */}
                <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100">
                  {[
                    { i: "fa-solid fa-shield-halved", t: "PCI DSS Level 1" },
                    { i: "fa-solid fa-lock", t: "256-bit SSL" },
                    { i: "fa-solid fa-fingerprint", t: "3D Secure" },
                    { i: "fa-solid fa-user-shield", t: "GDPR Compliant" },
                  ].map((b) => (
                    <span key={b.t} className="inline-flex items-center gap-2 text-xs text-slate-500">
                      <i className={`${b.i} text-emerald-500`}></i>{b.t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSuccess(true)}
                  className="mt-8 w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-base py-4 rounded-full shadow-[0_14px_36px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all"
                  data-testid="pay-securely-btn"
                >
                  <i className="fa-solid fa-lock text-xs mr-2"></i>
                  Pay Securely · <span className="font-mono">${total}</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 bg-white rounded-[24px] border border-slate-200 overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img src={room.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-slate-900">{room.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Nov 12 → Nov 15 · 3 nights · 2 guests</p>
                  <div className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600"><span>Room · 3 nights</span><span className="font-mono">$3,600</span></div>
                    <div className="flex justify-between text-slate-600"><span>Breakfast</span><span className="font-mono">+$45</span></div>
                    <div className="flex justify-between text-slate-600"><span>Taxes & service</span><span className="font-mono">+$946</span></div>
                    <div className="flex justify-between text-emerald-600"><span>AURA24</span><span className="font-mono">−$131</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-eyebrow text-slate-500">Total</span>
                    <span className="font-mono text-3xl text-slate-900">${total}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" data-testid="payment-success-modal">
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(60)].map((_, i) => <ConfettiPiece key={i} i={i} />)}
          </div>

          <div className="relative bg-white rounded-[28px] max-w-lg w-full p-10 reveal-scale text-center shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto grid place-items-center">
              <i className="fa-solid fa-check text-emerald-600 text-2xl"></i>
            </div>
            <p className="text-eyebrow text-[#C9A227] mt-6">Payment Successful</p>
            <h3 className="mt-3 font-serif text-3xl text-slate-900">Your reservation is confirmed.</h3>
            <p className="mt-2 text-slate-500 text-sm">A confirmation has been sent to your email.</p>

            <div className="mt-6 p-5 rounded-[18px] bg-[#FAFAF8] border border-slate-200 flex items-center gap-5">
              <div className="w-20 h-20 rounded-[12px] bg-white border border-slate-200 grid place-items-center">
                {/* Fake QR */}
                <svg viewBox="0 0 40 40" className="w-16 h-16">
                  {[...Array(64)].map((_, k) => {
                    const seed = (k * 9301 + 49297) % 233280 / 233280;
                    return seed > 0.55 ? <rect key={k} x={(k % 8) * 5} y={Math.floor(k / 8) * 5} width="5" height="5" fill="#0F172A" /> : null;
                  })}
                  <rect x="0" y="0" width="10" height="10" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                  <rect x="30" y="0" width="10" height="10" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                  <rect x="0" y="30" width="10" height="10" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-eyebrow text-slate-500">Reservation Number</p>
                <p className="mt-2 font-mono text-2xl text-slate-900">AH-9F27C1</p>
                <p className="text-xs text-slate-500 mt-1">Present at check-in</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="p-3 rounded-full border border-slate-200 text-sm text-slate-800 hover:bg-slate-50">
                <i className="fa-solid fa-file-invoice mr-2 text-[#C9A227]"></i>Invoice
              </button>
              <button className="p-3 rounded-full border border-slate-200 text-sm text-slate-800 hover:bg-slate-50">
                <i className="fa-regular fa-envelope mr-2 text-[#C9A227]"></i>Email
              </button>
              <button className="p-3 rounded-full border border-slate-200 text-sm text-slate-800 hover:bg-slate-50">
                <i className="fa-regular fa-calendar-plus mr-2 text-[#C9A227]"></i>Calendar
              </button>
              <button onClick={() => nav("/confirmation")} className="p-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm">
                View Booking <i className="fa-solid fa-arrow-right text-[10px] ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
