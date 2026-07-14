import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { mockLogin, seedUsers } from "@aura/shared/admin/adminAuth";
import { roleLabel, roleColor, landingFor } from "@aura/shared/admin/roles";
import { getTenant } from "@aura/shared/tenants/tenantRegistry";

export default function AdminLogin() {
  const nav = useNavigate();
  const { slug: slugParam } = useParams();
  const slug = slugParam || "aura";
  const tenant = getTenant(slug);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tenantify = (path) => path.startsWith("/admin/") ? `/t/${slug}${path}` : path;

  const submit = (e) => {
    e?.preventDefault();
    const u = mockLogin(email);
    if (!u) { setError("No user with that email. Try one of the demo accounts below."); return; }
    toast.success(`Welcome, ${u.name}`, { description: roleLabel(u.role) });
    nav(tenantify(landingFor(u.role)));
  };

  const quickLogin = (u) => { setEmail(u.email); setTimeout(() => { mockLogin(u.email); toast.success(`Signed in as ${u.name}`); nav(tenantify(landingFor(u.role))); }, 100); };

  return (
    <div className="min-h-screen bg-brand-surface grid lg:grid-cols-2" data-testid="admin-login">
      {/* Left visual */}
      <div className="relative hidden lg:block">
        <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/45 to-slate-900/80"></div>
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-[12px] backdrop-blur border border-white/20 grid place-items-center font-serif text-xl"
              style={{ backgroundColor: tenant?.theme?.["brand-primary"] ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.10)" }}
            >
              {tenant?.brandName?.[0] || "A"}
            </span>
            <div>
              <p className="font-serif text-lg">{tenant?.brandName || "Aura"} Console</p>
              <p className="text-[10px] tracking-widest uppercase text-white/60">{tenant?.city || "Heritage Palace"} · Property Management</p>
            </div>
          </div>
          <div>
            <p className="text-eyebrow text-brand-accent-hover">Behind the Palace</p>
            <p className="mt-4 font-serif text-4xl leading-tight max-w-md">The quiet mastery of hospitality begins here.</p>
            <p className="mt-4 text-sm text-white/70 max-w-md">One console for reservations, front desk, spa, dining, staff and finance — all curated for a single heritage estate.</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <p className="text-eyebrow text-brand-accent">Staff Console</p>
          <h1 className="mt-2 font-serif text-4xl text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Use your @aurahotels.com email. Any password works in this demo.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-eyebrow text-slate-500">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@aurahotels.com" className="mt-2 w-full bg-white border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-brand-primary" data-testid="login-email" />
            </div>
            <div>
              <label className="text-eyebrow text-slate-500">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-2 w-full bg-white border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-brand-primary" data-testid="login-password" />
            </div>
            {error && <p className="text-xs text-rose-600" data-testid="login-error">{error}</p>}
            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white text-sm py-3.5 rounded-full shadow-[0_10px_28px_rgba(79,70,229,0.28)]" data-testid="login-submit">Sign in</button>
          </form>

          <div className="mt-8">
            <p className="text-eyebrow text-slate-500">Demo accounts · click to sign in</p>
            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
              {seedUsers.map((u) => (
                <button key={u.id} onClick={() => quickLogin(u)} className="w-full text-left flex items-center gap-3 p-3 rounded-[14px] bg-white border border-slate-200 hover:border-slate-300 transition-all" data-testid={`demo-${u.role}`}>
                  <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: roleColor(u.role) }}>{roleLabel(u.role)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
