import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { seedUsers } from "@/admin/adminAuth";
import { ROLES, roleColor, roleLabel } from "@/admin/roles";

// Modules exposed to the custom role builder — mirrors admin sidebar sections
const MODULE_GROUPS = [
  { label: "Operations", items: [
    { k: "dashboard", label: "Dashboard" }, { k: "front-desk", label: "Front Desk" },
    { k: "reservations", label: "Reservations" }, { k: "rooms", label: "Rooms" },
    { k: "guests", label: "Guests" }, { k: "housekeeping", label: "Housekeeping" },
  ]},
  { label: "Services", items: [
    { k: "restaurant", label: "Restaurant" }, { k: "spa", label: "Spa" },
    { k: "events", label: "Events" }, { k: "inventory", label: "Inventory" },
  ]},
  { label: "Revenue", items: [
    { k: "rate-manager", label: "Rate & Channel Manager" },
  ]},
  { label: "Business", items: [
    { k: "staff", label: "Staff" }, { k: "invoices", label: "Invoices" },
    { k: "marketing", label: "Marketing" }, { k: "reviews", label: "Reviews" },
  ]},
  { label: "Insights", items: [
    { k: "reports", label: "Reports" }, { k: "notifications", label: "Notifications" },
    { k: "settings", label: "Settings" },
  ]},
];

const emptyPermissions = () => {
  const p = {};
  MODULE_GROUPS.forEach((g) => g.items.forEach((it) => { p[it.k] = { read: false, write: false }; }));
  return p;
};

export default function Staff() {
  const [users, setUsers] = useState(seedUsers);
  const [customRoles, setCustomRoles] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", title: "", role: ROLES[3].key });

  const allRoles = [...ROLES, ...customRoles];

  const changeRole = (id, role) => {
    setUsers((s) => s.map((u) => u.id === id ? { ...u, role } : u));
    const label = allRoles.find((r) => r.key === role)?.label || roleLabel(role);
    toast.success("Role updated", { description: `${users.find((u) => u.id === id)?.name} is now ${label}` });
  };
  const toggleActive = (id) => { setUsers((s) => s.map((u) => u.id === id ? { ...u, active: !u.active } : u)); toast.success("Access updated"); };
  const removeUser = (id) => { setUsers((s) => s.filter((u) => u.id !== id)); toast.success("User removed"); };
  const addUser = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    const u = { id: `u${Date.now()}`, ...form, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=4F46E5&color=fff`, active: true };
    setUsers((s) => [u, ...s]);
    const label = allRoles.find((r) => r.key === u.role)?.label || roleLabel(u.role);
    toast.success(`${u.name} added as ${label}`);
    setAddOpen(false);
    setForm({ name: "", email: "", title: "", role: ROLES[3].key });
  };

  const saveCustomRole = (role) => {
    setCustomRoles((s) => [...s, role]);
    toast.success(`Custom role "${role.label}" created`, { description: `${role.moduleCount} modules configured` });
    setBuilderOpen(false);
  };

  return (
    <AdminLayout pageTitle="Staff & Roles">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Access Management</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Staff members ({users.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBuilderOpen(true)} className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm px-5 py-2.5 rounded-full" data-testid="role-builder-btn"><i className="fa-solid fa-shield-halved text-[10px] text-[#C9A227]"></i>Create custom role</button>
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm px-5 py-2.5 rounded-full" data-testid="add-staff-btn"><i className="fa-solid fa-plus text-[10px]"></i>Invite staff</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" data-testid="role-cards">
        {allRoles.slice(0, 4).map((r) => {
          const n = users.filter((u) => u.role === r.key).length;
          return (
            <div key={r.key} className="p-4 bg-white rounded-[14px] border border-slate-200">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span><span className="text-xs text-slate-500">{r.label}</span></div>
              <p className="mt-2 font-mono text-2xl text-slate-900">{n}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest uppercase text-slate-400 bg-slate-50">
            <tr><th className="text-left px-5 py-3 font-medium">Member</th><th className="text-left font-medium">Role</th><th className="text-left font-medium">Title</th><th className="text-center font-medium">Status</th><th className="text-right px-5 font-medium">Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50" data-testid={`staff-row-${u.id}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div><p className="text-slate-900">{u.name}</p><p className="text-[10px] text-slate-500 font-mono">{u.email}</p></div>
                  </div>
                </td>
                <td>
                  <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                    className="bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs outline-none focus:border-[#4F46E5]" data-testid={`role-select-${u.id}`}
                    style={{ color: allRoles.find((r) => r.key === u.role)?.color || roleColor(u.role) }}
                  >
                    {allRoles.map((r) => <option key={r.key} value={r.key}>{r.label}{r.custom ? " · custom" : ""}</option>)}
                  </select>
                </td>
                <td className="text-slate-600 text-xs">{u.title}</td>
                <td className="text-center">
                  <button onClick={() => toggleActive(u.id)} className={`text-[10px] px-2.5 py-1 rounded-full ${u.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`} data-testid={`toggle-active-${u.id}`}>{u.active ? "Active" : "Disabled"}</button>
                </td>
                <td className="px-5 text-right">
                  <button onClick={() => setEditUser(u)} className="text-xs text-slate-500 hover:text-slate-900 mr-3" data-testid={`edit-${u.id}`}><i className="fa-solid fa-pen text-[10px]"></i></button>
                  <button onClick={() => removeUser(u.id)} className="text-xs text-rose-500 hover:text-rose-700" data-testid={`remove-${u.id}`}><i className="fa-solid fa-trash text-[10px]"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role reference (built-in + custom) */}
      <div className="mt-8 bg-white rounded-[16px] border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <p className="text-eyebrow text-[#C9A227]">Role Reference</p>
          <p className="text-xs text-slate-500">{ROLES.length} built-in · {customRoles.length} custom</p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {ROLES.map((r) => (
            <div key={r.key} className="p-4 rounded-[12px] border border-slate-100 bg-[#FAFAF8]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span><span className="text-sm text-slate-900 font-medium">{r.label}</span></div>
              <p className="mt-2 text-xs text-slate-500">{r.desc}</p>
            </div>
          ))}
          {customRoles.map((r) => (
            <div key={r.key} className="p-4 rounded-[12px] border border-[#C9A227]/40 bg-[#C9A227]/5" data-testid={`custom-role-${r.key}`}>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span><span className="text-sm text-slate-900 font-medium">{r.label}</span><span className="text-[9px] tracking-widest uppercase text-[#C9A227] ml-auto">Custom</span></div>
              <p className="mt-2 text-xs text-slate-500">{r.desc}</p>
              <p className="mt-2 text-[10px] text-slate-500 font-mono">{r.moduleCount} modules · {r.writeCount} write · {r.readCount} read-only</p>
            </div>
          ))}
        </div>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" data-testid="add-staff-modal">
          <div className="bg-white w-full max-w-md rounded-[20px] p-8 relative">
            <button onClick={() => setAddOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
            <p className="text-eyebrow text-[#C9A227]">New staff</p>
            <h3 className="mt-1 font-serif text-2xl text-slate-900">Invite team member</h3>
            <div className="mt-5 space-y-4">
              <div><label className="text-eyebrow text-slate-500">Name</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="new-staff-name" /></div>
              <div><label className="text-eyebrow text-slate-500">Email</label><input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5] font-mono" data-testid="new-staff-email" /></div>
              <div><label className="text-eyebrow text-slate-500">Title</label><input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="new-staff-title" /></div>
              <div>
                <label className="text-eyebrow text-slate-500">Role</label>
                <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="new-staff-role">
                  {allRoles.map((r) => <option key={r.key} value={r.key}>{r.label}{r.custom ? " · custom" : ""}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setAddOpen(false)} className="px-5 py-2.5 rounded-full border border-slate-200 text-sm">Cancel</button>
              <button onClick={addUser} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm" data-testid="new-staff-submit">Send invitation</button>
            </div>
          </div>
        </div>
      )}

      {editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" data-testid="edit-staff-modal">
          <div className="bg-white w-full max-w-md rounded-[20px] p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditUser(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
            <div className="flex items-center gap-4">
              <img src={editUser.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
              <div>
                <h3 className="font-serif text-xl text-slate-900">{editUser.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{editUser.email}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-eyebrow text-slate-500">Assign role</label>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {allRoles.map((r) => (
                    <button key={r.key} onClick={() => { changeRole(editUser.id, r.key); setEditUser({...editUser, role: r.key}); }}
                      className={`w-full text-left p-3 rounded-[12px] border flex items-center gap-3 ${editUser.role === r.key ? "border-[#4F46E5] bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"}`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span>
                      <div className="flex-1"><p className="text-sm text-slate-900">{r.label}{r.custom && <span className="ml-2 text-[9px] tracking-widest uppercase text-[#C9A227]">Custom</span>}</p><p className="text-xs text-slate-500">{r.desc}</p></div>
                      {editUser.role === r.key && <i className="fa-solid fa-check text-[#4F46E5] text-xs"></i>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm">Done</button>
            </div>
          </div>
        </div>
      )}

      {builderOpen && (
        <CustomRoleBuilder onClose={() => setBuilderOpen(false)} onSave={saveCustomRole} />
      )}
    </AdminLayout>
  );
}

const CustomRoleBuilder = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#0EA5E9");
  const [perms, setPerms] = useState(emptyPermissions());

  const togglePerm = (k, mode) => {
    setPerms((s) => {
      const cur = s[k];
      const next = { ...cur };
      if (mode === "read") {
        next.read = !cur.read;
        if (!next.read) next.write = false; // cannot write without read
      } else {
        next.write = !cur.write;
        if (next.write) next.read = true; // write implies read
      }
      return { ...s, [k]: next };
    });
  };

  const bulk = (mode) => {
    const next = {};
    Object.keys(perms).forEach((k) => {
      if (mode === "all-read") next[k] = { read: true, write: false };
      else if (mode === "all-write") next[k] = { read: true, write: true };
      else next[k] = { read: false, write: false };
    });
    setPerms(next);
  };

  const readCount = Object.values(perms).filter((p) => p.read && !p.write).length;
  const writeCount = Object.values(perms).filter((p) => p.write).length;
  const moduleCount = Object.values(perms).filter((p) => p.read || p.write).length;

  const submit = () => {
    if (!name.trim()) { toast.error("Please name your role"); return; }
    if (moduleCount === 0) { toast.error("Grant access to at least one module"); return; }
    onSave({
      key: `custom_${Date.now()}`,
      label: name.trim(),
      desc: desc.trim() || `Custom role · ${moduleCount} modules`,
      color, custom: true, permissions: perms, moduleCount, readCount, writeCount,
    });
  };

  const COLORS = ["#0EA5E9", "#10B981", "#F97316", "#EC4899", "#8B5CF6", "#14B8A6", "#C9A227"];

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-sm" data-testid="role-builder-modal">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-t-[24px] md:rounded-[24px] p-8 relative shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-slate-50 grid place-items-center" data-testid="role-builder-close"><i className="fa-solid fa-xmark text-slate-500 text-sm"></i></button>
        <p className="text-eyebrow text-[#C9A227]">Custom Role</p>
        <h3 className="mt-1 font-serif text-3xl text-slate-900">Design a role</h3>
        <p className="mt-1 text-sm text-slate-500">Pick the modules this role can access and whether they can just read or also make changes.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-eyebrow text-slate-500">Role name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Night Manager" className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="role-name" />
          </div>
          <div>
            <label className="text-eyebrow text-slate-500">Description</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What this role can do..." className="mt-2 w-full bg-[#FAFAF8] border border-slate-200 rounded-[14px] px-4 py-3 text-sm outline-none focus:border-[#4F46E5]" data-testid="role-desc" />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-eyebrow text-slate-500 mb-2">Colour tag</p>
          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-slate-900" : ""}`} style={{ backgroundColor: c }} data-testid={`role-color-${c}`} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-2">
          <p className="text-eyebrow text-slate-500">Module permissions</p>
          <div className="flex items-center gap-2 text-xs">
            <button onClick={() => bulk("none")} className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="bulk-none">Clear all</button>
            <button onClick={() => bulk("all-read")} className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50" data-testid="bulk-read">Read all</button>
            <button onClick={() => bulk("all-write")} className="px-3 py-1.5 rounded-full bg-[#4F46E5] text-white" data-testid="bulk-write">Full access</button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {MODULE_GROUPS.map((g) => (
            <div key={g.label} className="border border-slate-100 rounded-[14px] overflow-hidden">
              <div className="px-4 py-2 bg-[#FAFAF8] border-b border-slate-100">
                <p className="text-eyebrow text-slate-500">{g.label}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {g.items.map((it) => {
                  const p = perms[it.k];
                  return (
                    <div key={it.k} className="px-4 py-3 flex items-center justify-between" data-testid={`perm-row-${it.k}`}>
                      <p className="text-sm text-slate-800">{it.label}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePerm(it.k, "read")}
                          className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border transition-all ${p.read ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                          data-testid={`perm-read-${it.k}`}
                        >
                          <i className={`fa-solid ${p.read ? "fa-check" : "fa-eye"} text-[9px] mr-1`}></i>Read
                        </button>
                        <button
                          onClick={() => togglePerm(it.k, "write")}
                          className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border transition-all ${p.write ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5]" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                          data-testid={`perm-write-${it.k}`}
                        >
                          <i className={`fa-solid ${p.write ? "fa-check" : "fa-pen"} text-[9px] mr-1`}></i>Write
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between p-4 rounded-[14px] bg-[#FAFAF8] border border-slate-100" data-testid="role-summary">
          <p className="text-xs text-slate-500">
            <span className="text-slate-900 font-mono">{moduleCount}</span> modules ·
            <span className="text-slate-900 font-mono ml-1">{writeCount}</span> can edit ·
            <span className="text-slate-900 font-mono ml-1">{readCount}</span> read-only
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-xs px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Cancel</button>
            <button onClick={submit} className="text-xs px-5 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white" data-testid="role-save">Save role</button>
          </div>
        </div>
      </div>
    </div>
  );
};
