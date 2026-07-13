import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SUPER_ADMINS, mockSuperLogin } from "@/superAdmin/superAdminAuth";

export default function SuperLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    const u = mockSuperLogin(email);
    if (!u) { setError("Unknown platform operator. Try one of the demo accounts."); return; }
    toast.success(`Welcome ${u.name.split(" ")[0]}`);
    nav("/super-admin/overview");
  };

  const quickLogin = (u) => { mockSuperLogin(u.email); toast.success(`Signed in as ${u.name}`); nav("/super-admin/overview"); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100" data-testid="super-login-page">
      {/* Left panel — brand */}
      <div className="hidden lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#312E81] via-slate-950 to-black"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#4F46E5]/30 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#C9A227]/20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-between p-14">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4F46E5] to-[#C9A227] grid place-items-center">
              <i className="fa-solid fa-bolt text-slate-900"></i>
            </span>
            <div>
              <p className="font-serif text-2xl">Aura Ops</p>
              <p className="text-[10px] tracking-widest uppercase text-slate-400 mt-0.5">Multi-tenant control plane</p>
            </div>
          </div>
          <div>
            <p className="text-eyebrow text-[#E6C868]">Platform status</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight">Every hotel, one console.</h2>
            <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
              Provision new properties, meter usage, gate premium features, respond to support tickets — all from one place. Read-only for support, full write for platform admins.
            </p>
            <ul className="mt-8 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-400 text-[10px]"></i>SOC 2 Type II · ISO 27001</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-400 text-[10px]"></i>Multi-region · 99.98% uptime SLA</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-400 text-[10px]"></i>Impersonation with full audit trail</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 md:p-14">
        <div className="w-full max-w-md">
          <p className="text-eyebrow text-[#C9A227]">Restricted access</p>
          <h1 className="mt-1 font-serif text-3xl text-white">Sign in to Aura Ops</h1>
          <p className="mt-2 text-sm text-slate-400">Platform operations — not for tenant staff. Use `/admin/login` for hotel-level access.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-[10px] tracking-widest uppercase text-slate-500">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@aurahotels.com" className="mt-1 w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white outline-none focus:border-[#4F46E5]" data-testid="super-login-email" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-slate-500">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1 w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white outline-none focus:border-[#4F46E5]" data-testid="super-login-password" />
            </div>
            {error && <p className="text-xs text-rose-400" data-testid="super-login-error">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium shadow-[0_10px_28px_rgba(79,70,229,0.35)]" data-testid="super-login-submit">
              Sign in
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5">
            <p className="text-eyebrow text-slate-500 mb-3">Demo operators</p>
            <div className="space-y-2">
              {SUPER_ADMINS.map((u) => (
                <button key={u.id} onClick={() => quickLogin(u)} className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/5 hover:bg-white/10 transition-colors text-left" data-testid={`super-demo-${u.role}`}>
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{u.email} · {u.role}</p>
                  </div>
                  <i className="fa-solid fa-arrow-right text-slate-500 text-[10px]"></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
