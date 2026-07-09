import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import { seedUsers } from "@/admin/adminAuth";
import { ROLES, roleColor, roleLabel } from "@/admin/roles";

export default function Staff() {
  const [users, setUsers] = useState(seedUsers);
  const [editUser, setEditUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", title: "", role: ROLES[3].key });

  const changeRole = (id, role) => {
    setUsers((s) => s.map((u) => u.id === id ? { ...u, role } : u));
    toast.success("Role updated", { description: `${users.find((u) => u.id === id)?.name} is now ${roleLabel(role)}` });
  };
  const toggleActive = (id) => { setUsers((s) => s.map((u) => u.id === id ? { ...u, active: !u.active } : u)); toast.success("Access updated"); };
  const removeUser = (id) => { setUsers((s) => s.filter((u) => u.id !== id)); toast.success("User removed"); };
  const addUser = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    const u = { id: `u${Date.now()}`, ...form, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=4F46E5&color=fff`, active: true };
    setUsers((s) => [u, ...s]);
    toast.success(`${u.name} added as ${roleLabel(u.role)}`);
    setAddOpen(false);
    setForm({ name: "", email: "", title: "", role: ROLES[3].key });
  };

  return (
    <AdminLayout pageTitle="Staff & Roles">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-eyebrow text-[#C9A227]">Access Management</p>
          <h2 className="mt-1 font-serif text-2xl text-slate-900">Staff members ({users.length})</h2>
        </div>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm px-5 py-2.5 rounded-full" data-testid="add-staff-btn"><i className="fa-solid fa-plus text-[10px]"></i>Invite staff</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" data-testid="role-cards">
        {ROLES.slice(0, 4).map((r) => {
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
                    style={{ color: roleColor(u.role) }}
                  >
                    {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
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

      {/* Role reference */}
      <div className="mt-8 bg-white rounded-[16px] border border-slate-200 p-6">
        <p className="text-eyebrow text-[#C9A227]">Role Reference</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {ROLES.map((r) => (
            <div key={r.key} className="p-4 rounded-[12px] border border-slate-100 bg-[#FAFAF8]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span><span className="text-sm text-slate-900 font-medium">{r.label}</span></div>
              <p className="mt-2 text-xs text-slate-500">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
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
                  {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
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
          <div className="bg-white w-full max-w-md rounded-[20px] p-8 relative">
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
                  {ROLES.map((r) => (
                    <button key={r.key} onClick={() => { changeRole(editUser.id, r.key); setEditUser({...editUser, role: r.key}); }}
                      className={`w-full text-left p-3 rounded-[12px] border flex items-center gap-3 ${editUser.role === r.key ? "border-[#4F46E5] bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"}`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></span>
                      <div className="flex-1"><p className="text-sm text-slate-900">{r.label}</p><p className="text-xs text-slate-500">{r.desc}</p></div>
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
    </AdminLayout>
  );
}
