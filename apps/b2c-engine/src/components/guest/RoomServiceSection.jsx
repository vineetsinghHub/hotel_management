import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCurrency } from "@aura/shared/context/AppContext";

const menu = {
  Breakfast: [
    { id: "b1", name: "Continental Basket", desc: "Croissants, viennoiseries, seasonal fruit", price: 28, icon: "croissant" },
    { id: "b2", name: "Full English", desc: "Eggs, bacon, beans, mushrooms", price: 34, icon: "egg" },
    { id: "b3", name: "Aloo Paratha Thali", desc: "With curd, pickle, chai", price: 22, icon: "bowl-food" },
    { id: "b4", name: "Avocado Toast", desc: "Sourdough, chilli oil, poached egg", price: 24, icon: "bread-slice" },
  ],
  "All-day": [
    { id: "a1", name: "Lake Palace Club", desc: "Triple-decker, hand-cut fries", price: 32, icon: "burger" },
    { id: "a2", name: "Truffle Pasta", desc: "Tagliolini, Alba truffle in season", price: 58, icon: "utensils" },
    { id: "a3", name: "Kadai Paneer", desc: "With butter naan, jeera rice", price: 42, icon: "pepper-hot" },
    { id: "a4", name: "Chef's Salad", desc: "Baby leaves, feta, pomegranate", price: 28, icon: "leaf" },
  ],
  Beverages: [
    { id: "d1", name: "Masala Chai", desc: "Assam · cardamom · ginger", price: 8, icon: "mug-hot" },
    { id: "d2", name: "Cold Press Juice", desc: "Beetroot, ginger, apple", price: 12, icon: "glass-water" },
    { id: "d3", name: "Ruinart Blanc de Blancs", desc: "By the glass", price: 42, icon: "champagne-glasses" },
  ],
  Sweet: [
    { id: "s1", name: "Gulab Jamun", desc: "With saffron ice cream", price: 14, icon: "ice-cream" },
    { id: "s2", name: "Dark Chocolate Fondant", desc: "70% Valrhona, vanilla ice cream", price: 18, icon: "cake-candles" },
  ],
};

export const RoomServiceSection = ({ onAddToFolio }) => {
  const { formatPrice } = useCurrency();
  const [tab, setTab] = useState("Breakfast");
  const [cart, setCart] = useState({});
  const [tipPct, setTipPct] = useState(10);
  const [note, setNote] = useState("");

  const items = menu[tab];
  const cartItems = useMemo(() => {
    const all = Object.values(menu).flat();
    return Object.entries(cart).map(([id, qty]) => ({ ...all.find((x) => x.id === id), qty }));
  }, [cart]);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tip = Math.round(subtotal * tipPct / 100);
  const total = subtotal + tip;
  const eta = 20 + Math.min(35, Object.values(cart).reduce((a, b) => a + b, 0) * 3);

  const inc = (id) => setCart((s) => ({ ...s, [id]: (s[id] || 0) + 1 }));
  const dec = (id) => setCart((s) => {
    const q = (s[id] || 0) - 1;
    const next = { ...s };
    if (q <= 0) delete next[id]; else next[id] = q;
    return next;
  });

  const send = () => {
    if (!cartItems.length) { toast.error("Cart is empty"); return; }
    const label = `Room Service · ${cartItems.map((c) => `${c.name} ×${c.qty}`).join(", ")}`;
    onAddToFolio && onAddToFolio(label, total);
    toast.success("Order placed", { description: `ETA ${eta} min · ${formatPrice(total)} added to your folio` });
    setCart({});
    setNote("");
  };

  return (
    <section className="bg-white rounded-[28px] border border-slate-200 p-8 md:p-10" data-testid="room-service-section">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <p className="text-eyebrow text-brand-accent">In-Suite Dining</p>
          <h3 className="mt-1 font-serif text-3xl text-slate-900">Order Room Service</h3>
          <p className="text-sm text-slate-500 mt-1">24 hours a day. Delivered under the door within 30 minutes.</p>
        </div>
        <div className="inline-flex rounded-full bg-brand-surface p-1 gap-1" role="tablist">
          {Object.keys(menu).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all ${tab === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              data-testid={`menu-tab-${k.toLowerCase()}`}
              role="tab"
              aria-selected={tab === k}
            >{k}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((it) => (
            <div key={it.id} className="p-4 rounded-[16px] bg-brand-surface hover:bg-white border border-transparent hover:border-slate-200 flex items-center gap-4 transition-all" data-testid={`menu-item-${it.id}`}>
              <span className="w-11 h-11 rounded-full bg-brand-accent/12 text-brand-accent grid place-items-center"><i className={`fa-solid fa-${it.icon} text-sm`}></i></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 truncate">{it.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{it.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-900">{formatPrice(it.price)}</span>
                {cart[it.id] ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => dec(it.id)} className="w-7 h-7 rounded-full bg-white border border-slate-200 grid place-items-center" aria-label={`Remove one ${it.name}`} data-testid={`menu-dec-${it.id}`}><i className="fa-solid fa-minus text-[9px]"></i></button>
                    <span className="w-5 text-center font-mono text-xs">{cart[it.id]}</span>
                    <button onClick={() => inc(it.id)} className="w-7 h-7 rounded-full bg-brand-primary text-white grid place-items-center" aria-label={`Add one ${it.name}`} data-testid={`menu-inc-${it.id}`}><i className="fa-solid fa-plus text-[9px]"></i></button>
                  </div>
                ) : (
                  <button onClick={() => inc(it.id)} className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs" data-testid={`menu-add-${it.id}`}>Add</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className="p-5 rounded-[16px] bg-brand-ink text-white" data-testid="room-service-cart">
          <p className="text-eyebrow text-brand-accent-hover">Your Cart</p>
          {cartItems.length === 0 ? (
            <p className="mt-6 text-sm text-white/60">Add something delicious.</p>
          ) : (
            <>
              <ul className="mt-4 space-y-2 max-h-56 overflow-y-auto">
                {cartItems.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{c.qty}× {c.name}</span>
                    <span className="font-mono text-white/90">{formatPrice(c.price * c.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-white/10 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-white/70">Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-white/70">Tip ({tipPct}%)</span><span className="font-mono">{formatPrice(tip)}</span></div>
                <div className="flex justify-between pt-2 border-t border-white/10"><span>Total</span><span className="font-mono text-lg">{formatPrice(total)}</span></div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] tracking-widest uppercase text-white/50">Tip</p>
                <div className="mt-2 grid grid-cols-4 gap-1">
                  {[0, 5, 10, 15].map((p) => (
                    <button key={p} onClick={() => setTipPct(p)} className={`py-1.5 rounded-full text-xs ${tipPct === p ? "bg-brand-accent text-slate-900" : "bg-white/5 text-white/80"}`} data-testid={`tip-${p}`}>{p}%</button>
                  ))}
                </div>
              </div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Notes (allergies, timing…)" className="mt-4 w-full bg-white/5 border border-white/10 rounded-[12px] px-3 py-2 text-sm outline-none focus:border-brand-accent/60" data-testid="room-service-note" />
              <div className="mt-3 flex items-center justify-between text-xs text-white/60"><span><i className="fa-regular fa-clock mr-1"></i>ETA ≈ {eta} min</span><span>Charged to folio</span></div>
              <button onClick={send} className="mt-4 w-full py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="room-service-send">
                <i className="fa-solid fa-utensils text-[11px] mr-1.5"></i>Send order · <span className="font-mono">{formatPrice(total)}</span>
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
};

export default RoomServiceSection;
