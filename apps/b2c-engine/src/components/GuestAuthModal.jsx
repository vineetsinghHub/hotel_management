import { useState } from "react";
import { toast } from "sonner";
import { mockGuestLogin, mockGuestRegister } from "@aura/shared/lib/guestAuth";

// Slide-in glass login/register modal for guests. Any credentials work (mock).
export const GuestAuthModal = ({ open, onClose, onSuccess, reason }) => {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = (e) => {
    e?.preventDefault();
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      toast.error("Please fill in all fields");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const u = mode === "signin"
        ? mockGuestLogin({ email: form.email, password: form.password })
        : mockGuestRegister(form);
      setBusy(false);
      if (u) {
        toast.success(`Welcome ${u.name.split(" ")[0]}`, { description: "You're now signed in." });
        onSuccess?.(u);
        onClose();
      } else {
        toast.error("Something went wrong. Try again.");
      }
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
      data-testid="guest-auth-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md relative"
      >
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
          {/* Hero band */}
          <div className="relative px-8 py-8 bg-gradient-to-br from-slate-900 via-[#312E81] to-brand-primary text-white overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-accent/25 blur-3xl"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur grid place-items-center"
              aria-label="Close"
              data-testid="guest-auth-close"
            >
              <i className="fa-solid fa-xmark text-white/80"></i>
            </button>
            <p className="text-eyebrow text-brand-accent-hover">Aura Hotels</p>
            <h3 className="mt-1 font-serif text-2xl leading-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h3>
            <p className="mt-2 text-xs text-white/80 max-w-xs">
              {reason || "Sign in to reserve suites, unlock members-only rates and access your itinerary."}
            </p>
          </div>

          <form onSubmit={submit} className="px-8 py-6 space-y-3">
            {mode === "signup" && (
              <div>
                <label className="text-[10px] tracking-widest uppercase text-slate-500">Full name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Isabella Rossi"
                  className="mt-1 w-full bg-brand-surface border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
                  data-testid="guest-auth-name"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] tracking-widest uppercase text-slate-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1 w-full bg-brand-surface border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
                data-testid="guest-auth-email"
                required
              />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-slate-500">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="mt-1 w-full bg-brand-surface border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-brand-primary"
                data-testid="guest-auth-password"
                required
              />
              {mode === "signin" && (
                <p className="mt-1.5 text-[10px] text-slate-400">Any password works for this preview.</p>
              )}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full mt-4 py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium shadow-[0_10px_28px_rgba(79,70,229,0.28)] disabled:opacity-70 flex items-center justify-center gap-2"
              data-testid="guest-auth-submit"
            >
              {busy ? <><i className="fa-solid fa-spinner animate-spin text-xs"></i>Signing in…</> : mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
                className="text-xs text-slate-500 hover:text-slate-900"
                data-testid="guest-auth-toggle-mode"
              >
                {mode === "signin" ? "New to Aura? Create an account" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestAuthModal;
