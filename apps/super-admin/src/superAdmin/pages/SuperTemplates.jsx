import { useMemo, useState } from "react";
import { toast } from "sonner";
import SuperAdminLayout from "@aura/super-admin/superAdmin/SuperAdminLayout";
import {
  BUILT_IN_TEMPLATES,
  TEMPLATE_BASES,
  CURSOR_OPTIONS,
  BUTTON_OPTIONS,
  INPUT_OPTIONS,
  ANIMATION_OPTIONS,
} from "@aura/shared/templates/templateRegistry";
import {
  useAllTemplates,
  useTemplateStore,
} from "@aura/shared/templates/templateStore";

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  base: "luxury",
  previewImage: "",
  published: true,
  defaults: { cursor: "default", button: "pill", input: "underline", animation: "subtle" },
};

export default function SuperTemplates() {
  const templates = useAllTemplates();
  const addTemplate = useTemplateStore((s) => s.addTemplate);
  const updateTemplate = useTemplateStore((s) => s.updateTemplate);
  const removeTemplate = useTemplateStore((s) => s.removeTemplate);
  const publishTemplate = useTemplateStore((s) => s.publishTemplate);

  const [editing, setEditing] = useState(null);        // template id or "new"
  const [form, setForm] = useState(EMPTY_FORM);

  const openNew = () => { setEditing("new"); setForm({ ...EMPTY_FORM, id: `custom-${Date.now()}` }); };
  const openEdit = (t) => { setEditing(t.id); setForm({ ...EMPTY_FORM, ...t, defaults: { ...EMPTY_FORM.defaults, ...(t.defaults || {}) } }); };
  const close = () => { setEditing(null); setForm(EMPTY_FORM); };

  const save = () => {
    if (!form.name.trim()) { toast.error("Template name is required"); return; }
    if (!TEMPLATE_BASES.includes(form.base)) { toast.error("Pick a base"); return; }
    if (editing === "new") {
      addTemplate(form);
      toast.success("Template created", { description: form.published ? "Published to all hotels." : "Saved as draft." });
    } else {
      updateTemplate(editing, form);
      toast.success("Template updated");
    }
    close();
  };

  const built = useMemo(() => templates.filter((t) => t.builtIn), [templates]);
  const custom = useMemo(() => templates.filter((t) => !t.builtIn), [templates]);

  return (
    <SuperAdminLayout pageTitle="Design Templates">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-eyebrow text-[#E6C868]">Design catalogue</p>
          <h1 className="mt-1 font-serif text-4xl text-white">Templates</h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">Curated design systems every hotel can adopt. Publish new templates to make them available across the platform; unpublish to hide from selectors.</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm flex items-center gap-2 shadow-[0_10px_28px_rgba(79,70,229,0.35)]" data-testid="new-template">
          <i className="fa-solid fa-plus text-[10px]"></i>Add template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((t) => (
          <div key={t.id} className="rounded-[18px] bg-white/5 border border-white/10 overflow-hidden group" data-testid={`template-card-${t.id}`}>
            <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${t.previewImage})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${t.published !== false ? "bg-emerald-500/25 text-emerald-300" : "bg-slate-500/30 text-slate-300"}`}>
                  {t.published !== false ? "Published" : "Draft"}
                </span>
                {t.builtIn && <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#C9A227]/25 text-[#E6C868]">Built-in</span>}
              </div>
              <div className="absolute bottom-3 left-3">
                <p className="text-[10px] tracking-widest uppercase text-white/70">Base · {t.base}</p>
                <h3 className="font-serif text-white text-xl leading-tight">{t.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{t.description}</p>
              <div className="mt-3 grid grid-cols-4 gap-1.5 text-[9px]">
                {["cursor", "button", "input", "animation"].map((k) => (
                  <div key={k} className="p-1.5 rounded bg-white/5 text-center">
                    <p className="text-slate-500 uppercase tracking-widest">{k}</p>
                    <p className="text-slate-200 mt-0.5">{t.defaults?.[k] || "—"}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                {!t.builtIn && (
                  <button
                    onClick={() => publishTemplate(t.id, !(t.published !== false))}
                    className="px-3 py-1.5 rounded-full text-[10px] bg-white/5 hover:bg-white/10 text-slate-300"
                    data-testid={`publish-${t.id}`}
                  >
                    {t.published !== false ? "Unpublish" : "Publish"}
                  </button>
                )}
                <button onClick={() => openEdit(t)} className="px-3 py-1.5 rounded-full text-[10px] bg-white/5 hover:bg-white/10 text-slate-300" data-testid={`edit-${t.id}`}>
                  {t.builtIn ? "View" : "Edit"}
                </button>
                {!t.builtIn && (
                  <button
                    onClick={() => { if (confirm(`Delete ${t.name}?`)) { removeTemplate(t.id); toast.success("Template deleted"); } }}
                    className="ml-auto px-3 py-1.5 rounded-full text-[10px] bg-rose-500/15 hover:bg-rose-500/25 text-rose-300"
                    data-testid={`delete-${t.id}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md" onClick={close} data-testid="template-editor">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-[20px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl text-white">{editing === "new" ? "New template" : "Edit template"}</h2>
              <button onClick={close} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 grid place-items-center text-slate-400" data-testid="editor-close"><i className="fa-solid fa-xmark text-sm"></i></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-slate-400">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Modern · Sunset" className="mt-1 w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]" data-testid="tpl-name" />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-slate-400">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1 w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none focus:border-[#4F46E5]" data-testid="tpl-desc" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-slate-400">Base CSS</label>
                  <select value={form.base} onChange={(e) => setForm({ ...form, base: e.target.value })} className="mt-1 w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none" data-testid="tpl-base">
                    {TEMPLATE_BASES.map((b) => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-slate-400">Preview image URL</label>
                  <input value={form.previewImage} onChange={(e) => setForm({ ...form, previewImage: e.target.value })} placeholder="https://…" className="mt-1 w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white outline-none" data-testid="tpl-image" />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <p className="text-[10px] tracking-widest uppercase text-slate-400 mb-2">Default sub-options</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["cursor", CURSOR_OPTIONS],
                    ["button", BUTTON_OPTIONS],
                    ["input", INPUT_OPTIONS],
                    ["animation", ANIMATION_OPTIONS],
                  ].map(([key, opts]) => (
                    <div key={key}>
                      <label className="text-[9px] tracking-widest uppercase text-slate-500">{key}</label>
                      <select value={form.defaults[key]} onChange={(e) => setForm({ ...form, defaults: { ...form.defaults, [key]: e.target.value } })} className="mt-1 w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-xs text-white outline-none" data-testid={`tpl-default-${key}`}>
                        {opts.map((o) => <option key={o.key} value={o.key} className="bg-slate-900">{o.label} · {o.tier}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} data-testid="tpl-published" />
                Publish to all hotels immediately
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
              <button onClick={close} className="px-4 py-2 rounded-full text-sm text-slate-300 hover:bg-white/5">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm shadow-[0_10px_28px_rgba(79,70,229,0.35)]" data-testid="tpl-save">
                {editing === "new" ? "Create template" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
