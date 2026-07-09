import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import RoomCard from "@/components/RoomCard";
import RoomDetailModal from "@/components/RoomDetailModal";
import VideoHero from "@/components/VideoHero";
import EditorialSection from "@/components/EditorialSection";
import { property, highlights, rooms, testimonials, galleryImages, experiences } from "@/data/mockData";

const heroImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90";
const heroSources = [
  { src: "https://cdn.pixabay.com/video/2020/07/14/44093-441382541_large.mp4", type: "video/mp4" },
];

export default function Home() {
  const [modalRoom, setModalRoom] = useState(null);
  const [testimIndex, setTestimIndex] = useState(0);

  return (
    <div className="bg-[#FAFAF8]" data-testid="home-page">
      <Navbar transparent />

      {/* HERO */}
      <VideoHero poster={heroImage} sources={heroSources} className="" data-testid="hero-section">
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-40 md:pt-48 pb-32">
          <div className="max-w-3xl reveal-up">
            <p className="text-eyebrow text-[#E6C868] flex items-center gap-3">
              <span className="w-8 h-px bg-[#E6C868]"></span>
              Est. {property.established} · {property.location}
            </p>
            <h1 className="mt-6 font-serif text-white text-5xl sm:text-6xl md:text-[84px] leading-[1.02] tracking-tight">
              Experience <em className="text-[#E6C868] not-italic font-light">Timeless</em>
              <br />
              Heritage <span className="italic font-light">&</span> Luxury
            </h1>
            <p className="mt-8 text-white/80 text-lg max-w-xl leading-relaxed">
              A living heritage retreat on the shores of Lake Pichola, where two-and-a-half centuries of Rajput craftsmanship meet the quiet mastery of modern hospitality.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-4 rounded-full shadow-[0_14px_36px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 transition-all"
                data-testid="hero-book-cta"
              >
                Book Your Stay
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
              <Link
                to="/rooms"
                className="inline-flex items-center gap-3 glass text-slate-900 px-8 py-4 rounded-full hover:bg-white transition-all"
                data-testid="hero-explore-cta"
              >
                Explore Rooms
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-[#E6C868]">
                  {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star text-xs"></i>)}
                </div>
                <span className="font-mono">{property.rating}</span>
                <span className="text-white/50">· {property.reviews.toLocaleString()} reviews</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <i className="fa-solid fa-award text-[#E6C868]"></i>
                <span>Condé Nast Gold List, 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-[0.25em] uppercase flex flex-col items-center gap-3">
          <span>Scroll</span>
          <span className="w-px h-10 bg-white/40"></span>
        </div>
      </VideoHero>

      {/* FLOATING BOOKING WIDGET */}
      <section className="relative -mt-24 md:-mt-28 z-20 px-4 md:px-8 pb-16">
        <BookingWidget variant="floating" showOpenStates />
      </section>

      {/* PROPERTY HIGHLIGHTS */}
      <section className="py-24 md:py-32 px-6 md:px-10" data-testid="highlights-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl reveal-up">
              <p className="text-eyebrow text-[#C9A227]">The Property</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-slate-900 leading-[1.05] tracking-tight">
                Discover Royal Splendor
              </h2>
              <p className="mt-5 text-slate-600 text-[15px] leading-relaxed">
                Immerse yourself in a world where legendary service, spectacular architecture, and meticulous attention to detail create an unforgettable sanctuary.
              </p>
            </div>
            <Link to="/gallery" className="text-sm text-slate-900 flex items-center gap-2 link-underline">
              View the estate <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
            {highlights.map((h, i) => (
              <div
                key={h.title}
                className="group p-8 bg-white rounded-[20px] border border-slate-200 hover:border-[#C9A227]/40 hover:-translate-y-1 transition-all duration-500 reveal-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center group-hover:bg-[#C9A227] group-hover:text-white transition-colors">
                  <i className={`fa-solid fa-${h.icon} text-lg`}></i>
                </div>
                <h3 className="mt-5 font-serif text-xl text-slate-900">{h.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-white border-y border-slate-200" data-testid="featured-rooms">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-eyebrow text-[#C9A227]">Accommodations</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-slate-900 tracking-tight">Chambers of Royalty</h2>
              <p className="mt-5 text-slate-600 text-[15px] leading-relaxed">Twenty-two suites and pavilions, each a private world of hand-block prints, mirrored ceilings, and lakeside repose.</p>
            </div>
            <Link to="/rooms" className="text-sm text-slate-900 flex items-center gap-2 link-underline">
              View all suites <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((r, idx) => (
              <RoomCard key={r.id} room={r} onDetails={setModalRoom} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCES STRIP */}
      <section className="py-24 md:py-32 px-6 md:px-10" data-testid="home-experiences">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-[#C9A227]">Curated Journeys</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-slate-900 tracking-tight">Unforgettable Experiences</h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {["Royal Weddings", "Heritage Walk", "Fine Dining", "Holistic Spa"].map((title, i) => {
              const ex = [experiences[0], experiences[0], experiences[1], experiences[1]];
              const imgs = [
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85",
                "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85",
              ];
              return (
                <Link
                  to={i === 0 ? "/experiences" : i === 2 ? "/dining" : i === 3 ? "/spa" : "/experiences"}
                  key={title}
                  className="group relative rounded-[20px] overflow-hidden aspect-[4/5]"
                  data-testid={`experience-tile-${i}`}
                >
                  <img src={imgs[i]} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-2xl text-white">{title}</h3>
                    <p className="mt-1 text-xs text-white/80 flex items-center gap-2 tracking-wider">
                      Discover <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-slate-900 text-white relative overflow-hidden" data-testid="testimonials">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-eyebrow text-[#E6C868]">Guest Journal</p>
          <div className="mt-8">
            <i className="fa-solid fa-quote-left text-[#E6C868] text-3xl"></i>
            <p className="mt-6 font-serif text-3xl md:text-4xl leading-[1.25] italic text-white/95">
              {testimonials[testimIndex].quote}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <img src={testimonials[testimIndex].avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="text-left">
                <p className="font-serif text-lg">{testimonials[testimIndex].name}</p>
                <p className="text-xs text-white/60 tracking-wider">{testimonials[testimIndex].location}</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === testimIndex ? "bg-[#E6C868] w-10" : "bg-white/25 w-3"}`}
                  data-testid={`testimonial-dot-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="py-24 md:py-32 px-6 md:px-10" data-testid="ig-gallery">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow text-[#C9A227]">@aurahotels</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-slate-900 tracking-tight">A Photographic Diary</h2>
            </div>
            <a href="#" className="text-sm text-slate-900 flex items-center gap-2 link-underline">
              <i className="fa-brands fa-instagram"></i> Follow our journal
            </a>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {galleryImages.slice(0, 10).map((img, i) => (
              <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-[14px]">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center">
                  <i className="fa-brands fa-instagram text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <EditorialSection />

      <Footer />

      {/* Modal */}

      <RoomDetailModal open={!!modalRoom} onClose={() => setModalRoom(null)} room={modalRoom || rooms[0]} />
    </div>
  );
}
