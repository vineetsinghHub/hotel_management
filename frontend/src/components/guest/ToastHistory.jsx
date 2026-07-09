import { useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";

// Very small ambient toast recorder. Wraps sonner globally by monkey-patching
// its `toast()` so every toast is captured into localStorage.
const KEY = "aura_toast_history";

const readHistory = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
};
const writeHistory = (arr) => {
  try { localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40))); } catch (e) {}
};

let installed = false;
const installRecorder = () => {
  if (installed) return;
  installed = true;
  const record = (kind, msg, opts = {}) => {
    const entry = {
      id: `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
      kind,
      title: String(msg || ""),
      desc: opts?.description || "",
      ts: Date.now(),
    };
    const arr = [entry, ...readHistory()];
    writeHistory(arr);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: entry }));
  };
  const origSuccess = sonnerToast.success;
  const origError = sonnerToast.error;
  const origInfo = sonnerToast.info || sonnerToast.message;
  const origBase = sonnerToast;
  try {
    sonnerToast.success = (msg, opts) => { record("success", msg, opts); return origSuccess.call(sonnerToast, msg, opts); };
  } catch (e) {}
  try {
    sonnerToast.error = (msg, opts) => { record("error", msg, opts); return origError.call(sonnerToast, msg, opts); };
  } catch (e) {}
};

export const ToastHistoryBell = () => {
  const [items, setItems] = useState(() => readHistory());
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => { installRecorder(); }, []);
  useEffect(() => {
    const onT = (e) => {
      setItems((s) => [e.detail, ...s].slice(0, 40));
      setUnread((n) => n + 1);
    };
    window.addEventListener("aura-toast", onT);
    const onDoc = (evt) => { if (ref.current && !ref.current.contains(evt.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => {
      window.removeEventListener("aura-toast", onT);
      document.removeEventListener("mousedown", onDoc);
    };
  }, []);

  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const clear = () => { setItems([]); writeHistory([]); };

  return (
    <div ref={ref} className="relative" data-testid="toast-history-wrap">
      <button onClick={() => { setOpen((v) => !v); setUnread(0); }} className="w-9 h-9 rounded-full border border-slate-200 hover:bg-white grid place-items-center relative" aria-label="Recent notifications" data-testid="toast-history-toggle">
        <i className="fa-regular fa-bell text-xs text-slate-600"></i>
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-mono grid place-items-center">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] z-40" data-testid="toast-history-panel">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="font-serif text-lg text-slate-900">Recent</p>
            <button onClick={clear} className="text-[10px] text-slate-500 hover:text-slate-900" data-testid="toast-history-clear">Clear</button>
          </div>
          {items.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">No recent notifications</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {items.map((it) => (
                <li key={it.id} className="px-4 py-3 border-t border-slate-100 flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full grid place-items-center text-[10px] ${it.kind === "error" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}><i className={`fa-solid fa-${it.kind === "error" ? "triangle-exclamation" : "check"}`}></i></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900 truncate">{it.title}</p>
                    {it.desc && <p className="text-xs text-slate-500 truncate">{it.desc}</p>}
                    <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(it.ts)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ToastHistoryBell;
