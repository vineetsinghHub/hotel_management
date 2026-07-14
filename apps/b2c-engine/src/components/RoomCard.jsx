import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist, useCurrency } from "@aura/shared/context/AppContext";
import { useTenantPath } from "@aura/shared/hooks/useTenantPath";
import { toast } from "sonner";

export const RoomCard = ({ room, onDetails, index = 0 }) => {
  const nav = useNavigate();
  const t = useTenantPath();
  const [i, setI] = useState(0);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const saved = isWishlisted(`room-${room.id}`);
  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(`room-${room.id}`);
    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist", { description: room.name });
  };
  return (
    <article
      className="group bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_28px_60px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition-all duration-500 reveal-up"
      style={{ animationDelay: `${index * 80}ms` }}
      data-testid={`room-card-${room.id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={room.images[i]}
          alt={room.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-out"
        />
        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full glass grid place-items-center transition-all press-scale ${saved ? "text-rose-500" : "text-slate-700 hover:text-rose-500"}`}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          data-testid={`wishlist-${room.id}`}
        >
          <i className={`fa-${saved ? "solid" : "regular"} fa-heart text-sm`}></i>
        </button>
        {/* Tag */}
        <span className="absolute top-4 left-4 glass-dark text-white text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 rounded-full">
          {room.tag}
        </span>
        {/* Breakfast pill */}
        {room.breakfast && (
          <span className="absolute top-16 right-4 bg-brand-accent text-white text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full">
            Breakfast
          </span>
        )}
        {/* Carousel controls */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
          {room.images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setI(idx); }}
              className={`h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-6" : "bg-white/60 w-2"}`}
            />
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setI((i - 1 + room.images.length) % room.images.length); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fa-solid fa-chevron-left text-slate-800 text-xs"></i>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setI((i + 1) % room.images.length); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fa-solid fa-chevron-right text-slate-800 text-xs"></i>
        </button>
      </div>

      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl text-slate-900 leading-tight">{room.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{room.view} · {room.bed}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-widest uppercase text-slate-400">From</p>
            <p className="font-mono text-2xl text-slate-900 leading-none mt-1">{formatPrice(room.price)}</p>
            <p className="text-[11px] text-slate-500 mt-1">per night</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="py-2.5 rounded-[12px] bg-brand-surface border border-slate-100">
            <i className="fa-solid fa-user-group text-brand-accent text-xs"></i>
            <p className="text-xs text-slate-700 mt-1">{room.guests} Guests</p>
          </div>
          <div className="py-2.5 rounded-[12px] bg-brand-surface border border-slate-100">
            <i className="fa-solid fa-expand text-brand-accent text-xs"></i>
            <p className="text-xs text-slate-700 mt-1">{room.size} ft²</p>
          </div>
          <div className="py-2.5 rounded-[12px] bg-brand-surface border border-slate-100">
            <i className="fa-solid fa-bed text-brand-accent text-xs"></i>
            <p className="text-xs text-slate-700 mt-1">{room.bed.split(" ")[0]}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-shield-halved text-emerald-500"></i>{room.cancellation}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-wifi text-slate-400"></i>Wi-Fi</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-mug-hot text-slate-400"></i>Breakfast</span>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => onDetails(room)}
            className="flex-1 border border-slate-200 text-slate-900 hover:bg-slate-50 text-sm py-3 rounded-full transition-colors"
            data-testid={`room-details-${room.id}`}
          >
            View Details
          </button>
          <button
            onClick={() => nav(t("booking"))}
            className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-brand-primary-fg text-sm py-3 rounded-full transition-colors"
            data-testid={`room-reserve-${room.id}`}
          >
            Reserve Now
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
