import { toast } from "sonner";
import { useCurrency } from "@aura/shared/context/AppContext";

export const ReferralCard = () => {
  const { formatPrice } = useCurrency();
  const code = "AURA-AARAV-2026";
  const link = `https://aurahotels.com/r/${code}`;
  const copy = async (val) => {
    try { await navigator.clipboard.writeText(val); toast.success("Copied to clipboard"); }
    catch (e) { toast.error("Copy failed"); }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Aura Hotels", text: "Try Aura Hotels with my referral — you get a bonus.", url: link }); }
      catch (e) { /* cancelled */ }
    } else { copy(link); }
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] p-8 md:p-10 bg-gradient-to-br from-brand-primary to-[#3730A3] text-white" data-testid="referral-card">
      <div aria-hidden="true" className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5"></div>
      <div aria-hidden="true" className="absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-brand-accent/15"></div>

      <p className="text-eyebrow text-brand-accent-hover relative z-10">Aura Circle Referral</p>
      <h3 className="mt-2 font-serif text-3xl md:text-4xl relative z-10">Give {formatPrice(60)}, get {formatPrice(60)}</h3>
      <p className="mt-2 text-white/80 max-w-lg relative z-10">Invite a friend to stay at Aura. When they book, you both receive a spa credit for your next visit.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        <div className="p-4 rounded-[16px] bg-white/8 border border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-white/60">Your code</p>
            <p className="mt-1 font-mono text-lg truncate">{code}</p>
          </div>
          <button onClick={() => copy(code)} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs" data-testid="referral-copy-code"><i className="fa-regular fa-copy text-[10px] mr-1.5"></i>Copy</button>
        </div>
        <div className="p-4 rounded-[16px] bg-white/8 border border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-white/60">Referral link</p>
            <p className="mt-1 font-mono text-xs truncate">{link}</p>
          </div>
          <button onClick={() => copy(link)} className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs" data-testid="referral-copy-link"><i className="fa-regular fa-copy text-[10px] mr-1.5"></i>Copy</button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
        <button onClick={share} className="px-6 py-3 rounded-full bg-brand-accent hover:bg-[#B08D1E] text-slate-900 text-sm font-medium" data-testid="referral-share">
          <i className="fa-solid fa-share-nodes text-[11px] mr-1.5"></i>Share invite
        </button>
        <span className="text-xs text-white/60">You've earned {formatPrice(180)} in referral credits.</span>
      </div>
    </section>
  );
};

export default ReferralCard;
