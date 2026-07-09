import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { arrivals, statusColor } from "@/admin/adminMockData";

const seedExtras = (id) => ([
  { id: "e1", label: "Room service · À la carte lunch", amount: 6800 },
  { id: "e2", label: "Spa · Rose Hammam", amount: 38000 },
  { id: "e3", label: "Mini-bar · Champagne", amount: 12000 },
  { id: "e4", label: "Laundry & pressing", amount: 4000 },
]).map((e) => ({ ...e, ref: id }));

export default function FrontDesk() {
  const [rows, setRows] = useState(arrivals);
  const [checkoutRow, setCheckoutRow] = useState(null);
  const check = (id, to) => { setRows((s) => s.map((r) => r.id === id ? { ...r, status: to } : r)); toast.success(`Reservation ${id} → ${to.replace("_"," ")}`); };
  return (
    <AdminLayout pageTitle="Front Desk">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Arrivals today", v: 12, c: "#4F46E5" },
          { l: "Departures today", v: 7, c: "#F43F5E" },
          { l: "Awaiting check-in", v: 4, c: "#C9A227" },
          { l: "Walk-ins", v: 2, c: "#10B981" },
        ].map((k) => <div key={k.l} className="p-4 bg-white rounded-[14px] border border-slate-200"><p className="text-[10px] tracking-widest uppercase text-slate-500">{k.l}</p><p className="mt-2 font-mono text-3xl text-slate-900" style={{ color: k.c }}>{k.v}</p></div>)}
      </div>
      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100"><p className="text-eyebrow text-[#C9A227]">Today&apos;s activity</p><h3 className="mt-1 font-serif text-xl text-slate-900">Arrivals & Departures</h3></div>
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400"><tr><th className="text-left px-5 py-3 font-medium">Guest</th><th className="text-left font-medium">Room</th><th className="text-left font-medium">Dates</th><th className="text-left font-medium">Status</th><th className="text-right px-5 font-medium">Action</th></tr></thead>
          <tbody>
            {rows.map((a) => { const st = statusColor(a.status); return (
              <tr key={a.id} className="border-t border-slate-100" data-testid={`fd-row-${a.id}`}>
                <td className="px-5 py-3"><p className="text-slate-900">{a.guest}</p><p className="text-[10px] text-slate-500 font-mono">{a.id}</p></td>
                <td><p className="text-slate-900">{a.room}</p><p className="text-[10px] text-slate-500">{a.roomType}</p></td>
                <td className="text-slate-600 text-xs">{a.checkIn} — {a.checkOut}</td>
                <td><span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span></td>
                <td className="px-5 text-right space-x-2">
                  {a.status === "confirmed" && <button onClick={() => check(a.id, "checked_in")} className="text-xs px-3 py-1.5 rounded-full bg-[#4F46E5] text-white" data-testid={`checkin-${a.id}`}>Check in</button>}
                  {a.status === "checked_in" && <button onClick={() => setCheckoutRow(a)} className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white" data-testid={`checkout-${a.id}`}>Check out</button>}
                  <button onClick={() => setCheckoutRow(a)} className="text-xs px-3 py-1.5 rounded-full border border-slate-200" data-testid={`folio-${a.id}`}>Folio</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
      {checkoutRow && (
        <CheckoutModal row={checkoutRow} onClose={() => setCheckoutRow(null)} onComplete={() => { check(checkoutRow.id, "checked_out"); setCheckoutRow(null); }} />
      )}
    </AdminLayout>
  );
}

const CheckoutModal = ({ row, onClose, onComplete }) => {
  const [extras, setExtras] = useState(seedExtras(row.id));
  const [deposit] = useState(Math.round(row.total * 0.25)); // 25% deposit paid at booking
  const [payments, setPayments] = useState([{ id: "p0", label: "Booking deposit", method: "Visa •4242", amount: Math.round(row.total * 0.25) }]);
  const [payOpen, setPayOpen] = useState(false);
  const [payForm, setPayForm] = useState({ method: "Visa •4242", amount: 0 });

  const room = row.total; // Room + taxes total from booking
  const extrasTotal = extras.reduce((s, e) => s + e.amount, 0);
  const grand = room + extrasTotal;
  const paid = payments.reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(0, grand - paid);
  const cleared = balance === 0;

  const removeExtra = (id) => setExtras((s) => s.filter((e) => e.id !== id));
  const addPayment = () => {
    if (!payForm.amount || payForm.amount <= 0) { toast.error("Enter a valid amount"); return; }
    setPayments((s) => [...s, { id: `p${Date.now()}`, label: "Payment", method: payForm.method, amount: Math.min(payForm.amount, balance) }]);
    toast.success(`₹${Math.min(payForm.amount, balance).toLocaleString()} charged`);
    setPayOpen(false); setPayForm({ method: "Visa •4242", amount: 0 });
  };
  const payAll = () => { if (balance > 0) { setPayments((s) => [...s, { id: `p${Date.now()}`, label: "Balance settlement", method: "Visa •4242", amount: balance }]); toast.success(`₹${balance.toLocaleString()} balance settled`); } };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm" data-testid="checkout-modal">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-[24px] md:rounded-[24px] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.35)] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="checkout-close"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
        <p className="text-eyebrow text-[#C9A227]">Check-out</p>
        <h3 className="mt-1 font-serif text-3xl text-slate-900">Guest Folio</h3>
        <p className="mt-1 text-sm text-slate-500">{row.guest} · Room {row.room} · {row.checkIn} — {row.checkOut} · <span className="font-mono">{row.id}</span></p>

        {/* Charges */}
        <div className="mt-6">
          <p className="text-eyebrow text-slate-500 mb-3">Charges</p>
          <div className="border border-slate-100 rounded-[14px] divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3"><i className="fa-solid fa-bed text-[#C9A227]"></i><div><p className="text-sm text-slate-900">Room & taxes</p><p className="text-xs text-slate-500">{row.roomType} · 3 nights</p></div></div>
              <span className="font-mono text-sm text-slate-900">₹{room.toLocaleString()}</span>
            </div>
            {extras.map((e) => (
              <div key={e.id} className="p-4 flex items-center justify-between" data-testid={`checkout-extra-${e.id}`}>
                <div className="flex items-center gap-3"><i className="fa-solid fa-receipt text-slate-400"></i><p className="text-sm text-slate-900">{e.label}</p></div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-900">+₹{e.amount.toLocaleString()}</span>
                  <button onClick={() => removeExtra(e.id)} className="text-slate-400 hover:text-rose-500" data-testid={`checkout-remove-${e.id}`}><i className="fa-solid fa-xmark text-xs"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-eyebrow text-slate-500">Payments received</p>
            <button onClick={() => setPayOpen(true)} disabled={cleared} className="text-xs text-[#4F46E5] hover:underline disabled:text-slate-300 disabled:no-underline disabled:cursor-not-allowed" data-testid="add-payment-btn">+ Add payment</button>
          </div>
          <div className="border border-slate-100 rounded-[14px] divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between" data-testid={`payment-${p.id}`}>
                <div className="flex items-center gap-3"><i className="fa-solid fa-credit-card text-emerald-600"></i><div><p className="text-sm text-slate-900">{p.label}</p><p className="text-xs text-slate-500">{p.method}</p></div></div>
                <span className="font-mono text-sm text-emerald-700">−₹{p.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mt-6 p-5 rounded-[16px] bg-[#FAFAF8] border border-slate-100 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600"><span>Grand total</span><span className="font-mono text-slate-900">₹{grand.toLocaleString()}</span></div>
          <div className="flex justify-between text-slate-600"><span>Total paid</span><span className="font-mono text-emerald-700">−₹{paid.toLocaleString()}</span></div>
          <div className="flex justify-between pt-2 border-t border-slate-200 mt-2 items-baseline">
            <span className="text-eyebrow text-slate-500">Balance due</span>
            <span className={`font-mono text-3xl ${cleared ? "text-emerald-600" : "text-rose-600"}`} data-testid="checkout-balance">₹{balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6 flex flex-wrap items-center gap-3 justify-end">
          <button onClick={() => toast.success("Folio emailed to guest")} className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm"><i className="fa-regular fa-envelope mr-1.5"></i>Email folio</button>
          {!cleared && <button onClick={payAll} className="px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#B08D1E] text-slate-900 text-sm font-medium" data-testid="settle-balance-btn"><i className="fa-solid fa-lock text-[10px] mr-1.5"></i>Settle ₹{balance.toLocaleString()} & continue</button>}
          <button
            onClick={onComplete}
            disabled={!cleared}
            className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm"
            data-testid="complete-checkout-btn"
            title={cleared ? "" : "Clear the outstanding balance before check-out"}
          >
            {cleared ? "Complete check-out" : `Balance ₹${balance.toLocaleString()} due`}
          </button>
        </div>

        {!cleared && <p className="mt-3 text-xs text-rose-600 text-right"><i className="fa-solid fa-triangle-exclamation mr-1"></i>The guest cannot check out until the folio is fully paid.</p>}

        {/* Add payment inline */}
        {payOpen && (
          <div className="mt-6 p-5 rounded-[14px] border border-slate-200 bg-white" data-testid="add-payment-form">
            <p className="text-eyebrow text-[#C9A227]">Add payment</p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-eyebrow text-slate-500">Method</label>
                <select value={payForm.method} onChange={(e) => setPayForm({...payForm, method: e.target.value})} className="mt-1 w-full bg-[#FAFAF8] border border-slate-200 rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[#4F46E5]" data-testid="pay-method">
                  {["Visa •4242", "Mastercard •1029", "UPI", "Cash", "Bank transfer"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-eyebrow text-slate-500">Amount (₹)</label>
                <input type="number" value={payForm.amount || ""} onChange={(e) => setPayForm({...payForm, amount: parseInt(e.target.value || "0", 10)})} placeholder={balance.toString()} className="mt-1 w-full bg-[#FAFAF8] border border-slate-200 rounded-[12px] px-3 py-2 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="pay-amount" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 justify-end">
              <button onClick={() => setPayOpen(false)} className="text-xs px-4 py-2 rounded-full border border-slate-200">Cancel</button>
              <button onClick={addPayment} className="text-xs px-4 py-2 rounded-full bg-[#4F46E5] text-white" data-testid="pay-submit">Charge</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
