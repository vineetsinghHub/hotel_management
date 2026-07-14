import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const quickActions = [
  { icon: "bell-concierge", label: "More towels" },
  { icon: "car", label: "Book taxi" },
  { icon: "moon", label: "Turn-down early" },
  { icon: "utensils", label: "Late breakfast" },
  { icon: "broom", label: "Housekeeping now" },
  { icon: "champagne-glasses", label: "Send champagne" },
];

const botReplies = {
  "more towels": "Certainly — fresh towels will be at your door within 12 minutes. Anything else?",
  "book taxi": "Where would you like to go, and for what time? I can also arrange the Aura Rolls-Royce.",
  "turn-down early": "Turn-down set for 6:30pm tonight. Chocolate truffle or almond biscotti with your pillow?",
  "late breakfast": "Extended breakfast to 11:30am today. Continental or full English in-suite?",
  "housekeeping now": "Sending a housekeeper right away. It should be about 8 minutes.",
  "send champagne": "Beautiful. Ruinart Blanc de Blancs on the veranda, chilled, in 20 minutes.",
  "pool": "The infinity pool is heated to 28°C — open until 9pm tonight. Cabana 4 is complimentary for you.",
  "wifi": "The Wi-Fi network is ‘Aura-Guest’ — password Palace1782. Speeds up to 1 Gbps everywhere.",
  "restaurant": "The Palace Table has a table at 8pm, or Chef's Table at 9pm — shall I secure one?",
};

const botAnswer = (text) => {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(botReplies)) if (t.includes(k)) return v;
  return "I've noted that. Our concierge will follow up in your suite within a few minutes.";
};

export const ConciergeChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: "m0", from: "bot", text: "Namaste, Aarav. I'm Ishaan, your Aura concierge. How may I make your stay unforgettable today?", time: "just now" },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, open]);

  // Cross-component "open concierge" hook — Dashboard's Quick Action button
  // dispatches `aura:open-concierge` and we pop the panel open here.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("aura:open-concierge", onOpen);
    return () => window.removeEventListener("aura:open-concierge", onOpen);
  }, []);

  const send = (payload) => {
    if (!payload.trim()) return;
    const mine = { id: `m${Date.now()}`, from: "me", text: payload, time: "now" };
    setMessages((s) => [...s, mine]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      const reply = { id: `m${Date.now() + 1}`, from: "bot", text: botAnswer(payload), time: "just now" };
      setMessages((s) => [...s, reply]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-36 right-6 z-[55] w-14 h-14 rounded-full bg-brand-primary text-white shadow-[0_12px_32px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 transition-all press-scale grid place-items-center print:hidden"
        aria-label="Open concierge chat"
        data-testid="concierge-open"
      >
        <i className="fa-solid fa-comments text-lg" aria-hidden="true"></i>
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-accent border-2 border-white text-[9px] text-slate-900 font-mono grid place-items-center">1</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-stretch sm:justify-end bg-slate-900/40 backdrop-blur-sm print:hidden" onClick={() => setOpen(false)} data-testid="concierge-panel">
          <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-white h-[85vh] sm:h-full rounded-t-[24px] sm:rounded-none flex flex-col shadow-[0_-20px_50px_rgba(15,23,42,0.25)]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Ishaan" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm text-slate-900 font-medium">Ishaan · Concierge</p>
                <p className="text-[11px] text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Available</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" aria-label="Close chat" data-testid="concierge-close">
                <i className="fa-solid fa-xmark text-slate-500" aria-hidden="true"></i>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="concierge-messages">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-[16px] text-sm leading-relaxed ${m.from === "me" ? "bg-brand-primary text-white rounded-br-[6px]" : "bg-brand-surface text-slate-800 rounded-bl-[6px]"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-[16px] bg-brand-surface text-slate-500 text-sm flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-100">
              <p className="text-[10px] tracking-widest uppercase text-slate-400 mb-2">Quick requests</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {quickActions.map((a) => (
                  <button key={a.label} onClick={() => send(a.label)} className="px-2.5 py-1.5 rounded-full bg-brand-surface border border-slate-100 hover:bg-slate-100 text-[11px] text-slate-700 flex items-center gap-1.5" data-testid={`quick-${a.icon}`}>
                    <i className={`fa-solid fa-${a.icon} text-[10px] text-brand-accent`} aria-hidden="true"></i>{a.label}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a request…"
                  className="flex-1 bg-brand-surface border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
                  data-testid="concierge-input"
                  aria-label="Message concierge"
                />
                <button type="submit" className="w-10 h-10 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white grid place-items-center" aria-label="Send" data-testid="concierge-send">
                  <i className="fa-solid fa-paper-plane text-xs" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConciergeChat;
