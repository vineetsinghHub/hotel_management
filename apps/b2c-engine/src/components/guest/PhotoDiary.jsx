import { useMemo } from "react";
import { toast } from "sonner";

const poolPhotos = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1587874522487-fbc7a3aa4e0f?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
];

export const PhotoDiary = ({ stay }) => {
  const nights = Math.max(1, Math.round((new Date(stay.checkOut) - new Date(stay.checkIn)) / 86400000));
  const photos = useMemo(() => poolPhotos.slice(0, Math.min(8, Math.max(6, nights * 2))), [nights]);
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "My Aura stay", text: `A wonderful ${nights} nights at ${stay.suite}.`, url: window.location.href }); }
      catch (e) {}
    } else { toast.success("Album link copied"); }
  };

  return (
    <section className="bg-white rounded-[28px] border border-slate-200 p-8 md:p-10" data-testid="photo-diary">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-eyebrow text-brand-accent">Your Aura Journal</p>
          <h3 className="mt-1 font-serif text-3xl text-slate-900">A stay in {nights} chapters</h3>
          <p className="text-sm text-slate-500 mt-1">Auto-curated moments from your visit — share, print or save.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={share} className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm" data-testid="diary-share"><i className="fa-solid fa-share-nodes text-[11px] mr-1.5"></i>Share album</button>
          <button onClick={() => toast.success("Album downloaded")} className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm text-slate-700" data-testid="diary-download"><i className="fa-regular fa-arrow-down-to-line text-[11px] mr-1.5"></i>Download</button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((src, i) => (
          <div key={i} className={`group relative overflow-hidden rounded-[16px] ${i === 0 || i === 3 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`} data-testid={`diary-photo-${i}`}>
            <img src={src} alt={`Stay memory ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <p className="absolute bottom-2 left-3 text-white text-[10px] tracking-widest uppercase">Day {Math.floor(i / 2) + 1}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoDiary;
