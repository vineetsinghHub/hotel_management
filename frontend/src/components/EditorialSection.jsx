import { Link } from "react-router-dom";

const articles = [
  {
    id: "arv",
    kicker: "Stories",
    title: "The story of Aravalli",
    excerpt: "How our palace was rescued from ruin and reborn as a living monument to Rajputana craft.",
    author: "Nikita Iyer", read: "6 min read",
    image: "https://images.unsplash.com/photo-1587302912306-cf1ed9c33146?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "chef",
    kicker: "Cuisine",
    title: "Chef Vikram's kitchen",
    excerpt: "A grand-mother's spice tin, an open flame, and the quiet obsession behind India's most poetic dal.",
    author: "Arjun Rao", read: "8 min read",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ritual",
    kicker: "Wellness",
    title: "Ritual of the seven waters",
    excerpt: "An Ayurveda journey that begins at moonrise — and doesn't end until the next monsoon.",
    author: "Dr. Meera Kapoor", read: "5 min read",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  },
];

const press = [
  { name: "Condé Nast Traveler", quote: "A quietly astonishing revival of Rajputana grandeur." },
  { name: "Travel + Leisure", quote: "Perhaps India's most confident new hotel." },
  { name: "Forbes Travel Guide", quote: "Five stars, and it earns every one of them." },
  { name: "The New York Times", quote: "A palace, yes — and a soul." },
  { name: "Financial Times", quote: "Where craft meets choreography." },
];

export const EditorialSection = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAFAF8]" data-testid="editorial-section">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-eyebrow text-[#C9A227]">The Aura Journal</p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl text-slate-900">Stories from behind the arches</h2>
            <p className="mt-3 text-slate-600 max-w-xl">Long-form dispatches from our kitchens, corridors and courtyards.</p>
          </div>
          <Link to="/gallery" className="text-sm text-slate-700 hover:text-slate-900 link-underline">All stories →</Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <article key={a.id} className={`group ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`} data-testid={`editorial-${a.id}`}>
              <div className={`overflow-hidden rounded-[20px] bg-slate-100 ${i === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
              <div className="mt-4">
                <p className="text-[10px] tracking-widest uppercase text-[#C9A227]">{a.kicker}</p>
                <h3 className={`mt-2 font-serif text-slate-900 ${i === 0 ? "text-3xl" : "text-xl"}`}>{a.title}</h3>
                <p className="mt-2 text-sm text-slate-600 max-w-md">{a.excerpt}</p>
                <p className="mt-3 text-[11px] text-slate-500">{a.author} · {a.read}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Press mentions */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <p className="text-eyebrow text-slate-500 text-center">Featured in</p>
          <div className="mt-6 overflow-hidden">
            <div className="flex gap-10 md:gap-16 justify-center flex-wrap" data-testid="press-mentions">
              {press.map((p) => (
                <figure key={p.name} className="max-w-xs text-center">
                  <blockquote className="font-serif italic text-slate-700 text-sm leading-relaxed">&ldquo;{p.quote}&rdquo;</blockquote>
                  <figcaption className="mt-2 text-[10px] tracking-widest uppercase text-slate-400">&mdash; {p.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
