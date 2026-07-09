// Aura Hotels — mock content for the single heritage luxury property
export const property = {
  name: "Aura Hotels",
  tagline: "Timeless Heritage & Luxury",
  location: "Udaipur, Rajasthan",
  established: 1782,
  rating: 4.98,
  reviews: 2841,
  address: "Palace Road, Lake Pichola, Udaipur, Rajasthan 313001, India",
  phone: "+91 294 428 8000",
  email: "reservations@aurahotels.com",
};

export const highlights = [
  { icon: "landmark", title: "Heritage Palace", desc: "18th-century Rajput architecture restored to perfection." },
  { icon: "bed", title: "Luxury Suites", desc: "Expansive chambers with authentic period furnishings." },
  { icon: "waves", title: "Infinity Pool", desc: "Temperature-controlled infinity edge overlooking Lake Pichola." },
  { icon: "utensils", title: "Fine Dining", desc: "Three restaurants led by Michelin-trained royal chefs." },
  { icon: "flower", title: "Mughal Gardens", desc: "Eleven acres of manicured landscapes and lotus fountains." },
  { icon: "sparkles", title: "Grand Events", desc: "Majestic venues for weddings and private celebrations." },
  { icon: "wifi", title: "Complimentary Wi-Fi", desc: "High-speed fibre throughout the property." },
  { icon: "car", title: "Valet Parking", desc: "Attended secure parking with premium car detailing." },
];

export const rooms = [
  {
    id: "maharajah-suite",
    name: "The Maharajah Suite",
    tag: "Signature",
    price: 1200,
    guests: 3,
    size: 1200,
    bed: "King Bed",
    view: "Garden View",
    breakfast: true,
    cancellation: "Free cancellation",
    description: "Once the private chambers of royalty, this expansive suite offers a mesmerizing blend of history and contemporary luxury. Featuring original frescoes, a private terrace overlooking the Mughal gardens, and a spectacular marble bath.",
    amenities: ["24/7 Butler Service", "Complimentary Breakfast", "Airport Transfers", "Evening Canapés", "Bvlgari Toiletries", "High-Speed Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    id: "courtyard-grand",
    name: "Courtyard Grand Room",
    tag: "Popular",
    price: 850,
    guests: 2,
    size: 850,
    bed: "King or Twin",
    view: "Courtyard View",
    breakfast: true,
    cancellation: "Free cancellation",
    description: "A serene retreat overlooking our jasmine-scented central courtyard, offering the perfect balance of heritage character and modern comforts.",
    amenities: ["Butler on Request", "Complimentary Breakfast", "Marble Bath", "Nespresso Machine", "Egyptian Cotton Linen", "High-Speed Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    id: "lake-pavilion",
    name: "Lake Pavilion",
    tag: "Waterfront",
    price: 1650,
    guests: 3,
    size: 1450,
    bed: "King Bed",
    view: "Lake View",
    breakfast: true,
    cancellation: "Free cancellation",
    description: "Perched at the very edge of Lake Pichola, this pavilion features a private plunge pool and cinematic sunset views from every window.",
    amenities: ["Private Plunge Pool", "Personal Butler", "In-Suite Dining", "Complimentary Boat Ride", "Silk Robes", "High-Speed Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85",
    ],
  },
  {
    id: "royal-heritage",
    name: "Royal Heritage Suite",
    tag: "Presidential",
    price: 2400,
    guests: 4,
    size: 2100,
    bed: "King + Living",
    view: "Palace & Lake",
    breakfast: true,
    cancellation: "Free cancellation",
    description: "Our most exclusive residence — a two-bedroom palace within the palace, complete with dedicated staff, private dining pavilion, and heirloom art.",
    amenities: ["24/7 Butler Service", "Private Chef", "Chauffeured Rolls-Royce", "Spa in-suite", "Curated Bar", "Priority Everything"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85",
    ],
  },
];

export const experiences = [
  {
    id: "heritage-walk",
    title: "Heritage Walk",
    duration: "2 hours",
    price: 65,
    tag: "Cultural",
    desc: "Trace 240 years of history through hidden passages and royal ateliers with our resident historian.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "royal-dinner",
    title: "Royal Dinner",
    duration: "3 hours",
    price: 240,
    tag: "Culinary",
    desc: "A ten-course tasting of Rajput royal cuisine served on the palace ramparts under candlelight.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "village-tour",
    title: "Village Tour",
    duration: "4 hours",
    price: 95,
    tag: "Immersive",
    desc: "A jeep expedition through artisan villages — block-printers, silversmiths, and puppet masters.",
    image: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "photography",
    title: "Photography Session",
    duration: "90 min",
    price: 180,
    tag: "Signature",
    desc: "A private shoot at golden hour with our on-property photographer across three heritage vignettes.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "cultural-performance",
    title: "Cultural Performance",
    duration: "75 min",
    price: 120,
    tag: "Evening",
    desc: "Kalbelia dancers and dhol maestros perform in the moonlit Diwan-i-Khas courtyard.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=85",
  },
  {
    id: "boating",
    title: "Sunset Boating",
    duration: "60 min",
    price: 140,
    tag: "Lakeside",
    desc: "Board a restored royal barge for a private sail across Lake Pichola at last light.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
  },
];

export const testimonials = [
  {
    name: "Eleanor R.",
    location: "London, United Kingdom",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote: "An absolute masterpiece of hospitality. The architecture is breathtaking, and the service anticipates your every need before you even realize it. A true royal experience.",
  },
  {
    name: "Kenji Tanaka",
    location: "Kyoto, Japan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "The stillness at dawn, the taste of the saffron kheer, the silence of the courtyard — a stay measured not in nights but in memories.",
  },
  {
    name: "Isabella Rossi",
    location: "Milan, Italy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    quote: "We arrived as guests and left as family. Every detail — the flowers, the letters, the private terrace at sunset — was a quiet act of love.",
  },
];

export const spaTreatments = [
  { id: "abhyanga", name: "Royal Abhyanga", duration: "90 min", price: 240, benefits: "Deep muscle relief · Circulation · Balance", therapist: "Meera K." },
  { id: "shirodhara", name: "Shirodhara Ritual", duration: "75 min", price: 320, benefits: "Nervous system · Sleep · Clarity", therapist: "Anjali V." },
  { id: "hammam", name: "Rose Hammam", duration: "120 min", price: 380, benefits: "Exfoliation · Radiance · Detox", therapist: "Priya S." },
  { id: "couples", name: "Couple's Retreat", duration: "150 min", price: 620, benefits: "Together · Slow · Timeless", therapist: "Team of 2" },
];

export const menu = {
  Breakfast: [
    { name: "Saffron Kheer Porridge", desc: "Steel-cut oats, saffron milk, roasted almonds, honey.", price: 24 },
    { name: "Palace Kachori Platter", desc: "Three heritage kachoris with tamarind & coriander chutneys.", price: 22 },
    { name: "The Aura Omelette", desc: "Three-egg herb omelette, aged cheddar, sourdough toast.", price: 26 },
  ],
  Lunch: [
    { name: "Laal Maas", desc: "Slow-cooked lamb in mathania chilli, ghee, and cardamom.", price: 48 },
    { name: "Palak Paneer Nouveau", desc: "Charred spinach velouté, house-made paneer, black garlic.", price: 34 },
    { name: "Dal Baati Churma", desc: "The house ceremonial platter, served on brass thali.", price: 42 },
  ],
  Dinner: [
    { name: "Royal Thali", desc: "Twelve courses across three regions, curated nightly.", price: 92 },
    { name: "Tandoor Selections", desc: "Aged lamb chops, saffron prawns, malai broccoli.", price: 68 },
    { name: "Chef's Table Tasting", desc: "Ten courses in the palace kitchen. Reservation required.", price: 240 },
  ],
  Desserts: [
    { name: "Rose & Cardamom Kulfi", desc: "Slow-set kulfi, rose petal glass, pistachio praline.", price: 18 },
    { name: "Warm Gulab Jamun Soufflé", desc: "A reinterpretation with rose ice cream.", price: 22 },
  ],
  Wine: [
    { name: "Aura Reserve Champagne", desc: "Blanc de Blancs, Grand Cru, exclusive to the property.", price: 240 },
    { name: "Sula Rasa Shiraz 2019", desc: "Nashik Valley, decanted tableside.", price: 88 },
  ],
};

export const galleryImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1400&q=85",
];

export const faqs = [
  { q: "What is the check-in and check-out time?", a: "Check-in is from 14:00 and check-out is by 12:00. Early check-in and late check-out can be requested and are subject to availability." },
  { q: "Do you offer airport transfers?", a: "Yes. Our chauffeured Mercedes-Maybach and Rolls-Royce services are available on request from Maharana Pratap Airport (UDR)." },
  { q: "Is the property child-friendly?", a: "Absolutely. We offer a dedicated children's programme, adjoining suites, and complimentary amenities for young guests." },
  { q: "What is your cancellation policy?", a: "Complimentary cancellation up to 48 hours before arrival. Cancellations within 48 hours are charged one night." },
  { q: "Do you accommodate dietary restrictions?", a: "Our royal kitchens accommodate all preferences, including vegan, gluten-free, kosher and Jain menus." },
];

export const upsells = [
  { id: "breakfast", title: "In-Suite Breakfast", desc: "Served on your private terrace at sunrise.", price: 45, image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80" },
  { id: "airport", title: "Airport Pickup", desc: "Chauffeured Mercedes-Maybach transfer.", price: 120, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" },
  { id: "spa", title: "Spa Ritual", desc: "90-min signature Abhyanga treatment.", price: 240, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80" },
  { id: "hightea", title: "High Tea", desc: "Curated by the palace patisserie.", price: 68, image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80" },
  { id: "photo", title: "Photography Tour", desc: "Private shoot at golden hour.", price: 180, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80" },
  { id: "late", title: "Late Checkout", desc: "Guaranteed 4pm departure.", price: 90, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80" },
];
