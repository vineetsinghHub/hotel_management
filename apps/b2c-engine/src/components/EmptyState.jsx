// Elegant empty states with subtle SVG illustrations. Consumers pass a variant
// or a custom icon + copy.
//   <EmptyState variant="search" title="No matches" desc="Try..."
//               action={<button>Reset</button>} />

const svgs = {
  search: (
    <svg viewBox="0 0 200 160" className="w-40 h-32" aria-hidden="true">
      <circle cx="85" cy="70" r="38" fill="none" stroke="#C9A227" strokeWidth="2.5" opacity="0.6" />
      <line x1="115" y1="98" x2="148" y2="128" stroke="#C9A227" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <circle cx="85" cy="70" r="18" fill="#4F46E5" opacity="0.15" />
      <path d="M75 65 q10 -12 20 0" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 200 160" className="w-40 h-32" aria-hidden="true">
      <rect x="36" y="48" width="128" height="84" rx="14" fill="none" stroke="#C9A227" strokeWidth="2.5" opacity="0.6" />
      <path d="M36 90 h44 l10 14 h20 l10 -14 h44" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="100" cy="46" r="10" fill="#C9A227" opacity="0.6" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 200 160" className="w-40 h-32" aria-hidden="true">
      <rect x="36" y="36" width="128" height="104" rx="14" fill="none" stroke="#C9A227" strokeWidth="2.5" opacity="0.6" />
      <line x1="36" y1="64" x2="164" y2="64" stroke="#C9A227" strokeWidth="2" opacity="0.6" />
      <line x1="70" y1="28" x2="70" y2="48" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
      <line x1="130" y1="28" x2="130" y2="48" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="100" r="14" fill="#4F46E5" opacity="0.2" />
    </svg>
  ),
  wishlist: (
    <svg viewBox="0 0 200 160" className="w-40 h-32" aria-hidden="true">
      <path d="M100 132 C 40 92, 40 40, 70 40 C 88 40, 100 56, 100 56 C 100 56, 112 40, 130 40 C 160 40, 160 92, 100 132 Z" fill="#4F46E5" opacity="0.12" stroke="#C9A227" strokeWidth="2" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 200 160" className="w-40 h-32" aria-hidden="true">
      <path d="M40 40 h20 l16 68 h72 l16 -48 h-92" fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinejoin="round" opacity="0.7" />
      <circle cx="84" cy="128" r="8" fill="#4F46E5" opacity="0.6" />
      <circle cx="140" cy="128" r="8" fill="#4F46E5" opacity="0.6" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 200 160" className="w-40 h-32" aria-hidden="true">
      <path d="M40 44 h100 a14 14 0 0 1 14 14 v40 a14 14 0 0 1 -14 14 h-56 l-24 20 v-20 h-20 a14 14 0 0 1 -14 -14 v-40 a14 14 0 0 1 14 -14 z" fill="none" stroke="#C9A227" strokeWidth="2.5" opacity="0.6" />
      <circle cx="70" cy="78" r="4" fill="#4F46E5" />
      <circle cx="96" cy="78" r="4" fill="#4F46E5" />
      <circle cx="122" cy="78" r="4" fill="#4F46E5" />
    </svg>
  ),
};

export const EmptyState = ({ variant = "search", icon, title, desc, action, className = "", testid = "empty-state" }) => {
  const graphic = icon || svgs[variant] || svgs.search;
  return (
    <div className={`text-center py-10 px-6 ${className}`} data-testid={testid}>
      <div className="mx-auto opacity-80">{graphic}</div>
      {title && <p className="mt-4 font-serif text-2xl text-slate-900">{title}</p>}
      {desc && <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{desc}</p>}
      {action && <div className="mt-5 inline-flex">{action}</div>}
    </div>
  );
};

export default EmptyState;
