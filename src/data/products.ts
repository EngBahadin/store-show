import blurMap from "@/data/blur.json";
import type { Locale } from "@/lib/i18n/config";

/**
 * Placeholder prices and catalogue copy — edit this file, nothing else,
 * to correct or expand the catalogue.
 */

export type BrandId = "hoka" | "nike" | "jordan" | "adidas" | "skechers" | "other";
export type CategoryId = "running" | "lifestyle" | "basketball" | "skate" | "walking";
export type Gender = "men" | "women" | "unisex";
export type Localized = Record<Locale, string>;

export type Product = {
  slug: string; // matches basename in /public/products
  name: string; // Latin in all languages ("Bondi 8", "Air Jordan 4 SB")
  brand: BrandId;
  category: CategoryId;
  gender: Gender;
  code: string; // e.g. "RV-2418"
  price: number; // IQD. 0 means "داوای نرخ بکە" (Request price)
  compareAt?: number; // if set, shows discount percentage badge
  colorway: Localized;
  description: Localized;
  sizes: number[]; // EU sizes, e.g. [36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
  soldOutSizes?: number[]; // Sizes that are out of stock (crossed out)
  stock: number;
  rating: number; // 0-5
  reviews: number;
  addedAt: string; // ISO date for "newest" sorting
  popularity: number; // for "popular" sorting
  featured?: boolean;
  videoUrl?: string; // Optional video clip link
};

export const brands: { id: BrandId; name: string }[] = [
  { id: "hoka", name: "HOKA" },
  { id: "nike", name: "Nike" },
  { id: "jordan", name: "Air Jordan" },
  { id: "adidas", name: "Adidas" },
  { id: "skechers", name: "Skechers" },
  { id: "other", name: "Other" },
];

export const categories: { id: CategoryId; label: Localized }[] = [
  {
    id: "running",
    label: { en: "Running", ku: "ڕاکردن", ar: "جري" },
  },
  {
    id: "lifestyle",
    label: { en: "Lifestyle", ku: "شێوازی ژیان", ar: "لايف ستايل" },
  },
  {
    id: "basketball",
    label: { en: "Basketball", ku: "تۆپی باسکە", ar: "كرة سلة" },
  },
  {
    id: "skate",
    label: { en: "Skate", ku: "سکەیت", ar: "تزلج" },
  },
  {
    id: "walking",
    label: { en: "Walking", ku: "پیاسەکردن", ar: "مشي" },
  },
];

export const products: Product[] = [
  {
    slug: "adidas-x9000-l4-black-red",
    name: "Adidas X9000L4",
    brand: "adidas",
    category: "lifestyle",
    gender: "men",
    code: "RV-2418",
    price: 65000,
    colorway: {
      en: "Core Black / Solar Red",
      ku: "ڕەش و سوور",
      ar: "أسود وأحمر",
    },
    description: {
      en: "High-tech running-inspired sneaker with responsive Boost midsole and cyber-futuristic styling.",
      ku: "پێڵاوێکی پێشکەوتوو بە کفی بۆست و شێوازێکی مۆدێرن و نوێ بۆ بەکارهێنانی ڕۆژانە.",
      ar: "حذاء مستوحى من الجري بتقنية عالية مع نعل أوسط مريح وتصميم عصري مستقبلي.",
    },
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    soldOutSizes: [],
    stock: 15,
    rating: 4.8,
    reviews: 24,
    addedAt: "2026-09-14T10:00:00Z",
    popularity: 98,
    featured: true,
  },
  {
    slug: "skechers-arch-fit-olive",
    name: "Skechers Arch Fit",
    brand: "skechers",
    category: "walking",
    gender: "men",
    code: "RV-2431",
    price: 85000,
    compareAt: 110000,
    colorway: {
      en: "Olive Green",
      ku: "زەیتونی",
      ar: "زيتي",
    },
    description: {
      en: "Podiatrist-certified arch support system with removable cushioned insole for ultimate walking comfort.",
      ku: "سیستەمی پاڵپشتی کەوانەی پێی پزیشکی لەگەڵ کفی نەرم بۆ پیاسەکردنی درێژخایەن.",
      ar: "نظام دعم معتمد من أطباء القدم مع نعل داخلي مبطن قابل للإزالة لراحة استثنائية أثناء المشي.",
    },
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    soldOutSizes: [36, 37, 41],
    stock: 7,
    rating: 4.9,
    reviews: 31,
    addedAt: "2026-09-14T08:30:00Z",
    popularity: 94,
    featured: true,
  },
  {
    slug: "adidas-runfalcon-black",
    name: "Adidas Runfalcon 3.0",
    brand: "adidas",
    category: "running",
    gender: "men",
    code: "RV-2440",
    price: 0, // Ask for price in design ("داوای نرخ بکە")
    colorway: {
      en: "Core Black / Cloud White",
      ku: "ڕەش و سپی",
      ar: "أسود وأبيض",
    },
    description: {
      en: "Lightweight running shoes built for everyday miles, featuring Cloudfoam cushioning and breathable mesh.",
      ku: "ئەدیداس ڕەنفۆرس ڕەش و سپی مۆدێلی نوێی ئەمساڵ بۆ ڕاکردنی ڕۆژانە بە کفی کەفی نەرم.",
      ar: "حذاء جري خفيف الوزن مصمم للمسافات اليومية مع توسيد كلاود فوم وشبكة علوية قابلة للتنفس.",
    },
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    soldOutSizes: [36, 37, 38, 39, 40, 41, 42, 45], // Only 43 & 44 left (matches design screen 04)
    stock: 2,
    rating: 4.6,
    reviews: 18,
    addedAt: "2026-09-11T12:00:00Z",
    popularity: 88,
    featured: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    slug: "skechers-glide-step-cream",
    name: "Skechers Glide Step Cream",
    brand: "skechers",
    category: "walking",
    gender: "women",
    code: "RV-2402",
    price: 75000,
    colorway: {
      en: "Cream / Off-White",
      ku: "کرێم",
      ar: "بيج كريمي",
    },
    description: {
      en: "Glide-Step geometric midsole designed to provide natural momentum with every step.",
      ku: "گلاید-ستێپ بە کفی نەرم و پاشەکەوتکەری وزە بۆ ئاسوودەیی بەرز لە ڕۆیشتندا.",
      ar: "نعل أوسط هندسي يوفر اندفاعاً طبيعياً مع كل خطوة لراحة قصوى.",
    },
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    soldOutSizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45], // Fully sold out ("فرۆشراوە" in design)
    stock: 0,
    rating: 4.7,
    reviews: 20,
    addedAt: "2026-09-11T10:00:00Z",
    popularity: 85,
  },
  {
    slug: "hoka-bondi-8-black",
    name: "HOKA Bondi 8",
    brand: "hoka",
    category: "running",
    gender: "men",
    code: "RV-2405",
    price: 185000,
    compareAt: 225000,
    colorway: {
      en: "Triple Black",
      ku: "ڕەشی مات",
      ar: "أسود ملكي",
    },
    description: {
      en: "One of the hardest working shoes in the HOKA lineup, the Bondi 8 takes a bold step forward this season with softer, lighter foams.",
      ku: "باڵاترین ئاستی نەرمی و پاڵپشتی لە هۆکا، گونجاو بۆ ڕاکردنی مەودای درێژ و ڕۆژانە.",
      ar: "أحد أقوى أحذية هوكا توسيداً، يوفر أقصى درجات الراحة للجري والوقوف الطويل.",
    },
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    soldOutSizes: [38, 46],
    stock: 8,
    rating: 4.9,
    reviews: 42,
    addedAt: "2026-09-08T14:00:00Z",
    popularity: 97,
    featured: true,
  },
  {
    slug: "hoka-clifton-9-blue",
    name: "HOKA Clifton 9",
    brand: "hoka",
    category: "running",
    gender: "men",
    code: "RV-2406",
    price: 175000,
    colorway: {
      en: "Coastal Blue",
      ku: "شینی کەناراوی",
      ar: "أزرق ساحلي",
    },
    description: {
      en: "Eliminating weight while adding 3mm in stack height, the Clifton 9 delivers a revitalized underfoot experience with responsive new foam.",
      ku: "کێشی زۆر کەمکراوەتەوە لەگەڵ زیادکردنی بەرزی کەفەکە بۆ بەخشینی نەرمی بێ وێنە.",
      ar: "أخف وزناً مع زيادة التوسيد لتجربة جري حيوية واستجابة مذهلة.",
    },
    sizes: [39, 40, 41, 42, 43, 44, 45],
    soldOutSizes: [39, 45],
    stock: 6,
    rating: 4.8,
    reviews: 35,
    addedAt: "2026-09-07T09:00:00Z",
    popularity: 91,
    featured: true,
  },
  {
    slug: "jordan-4-sb-pine-green",
    name: "Air Jordan 4 Retro SB",
    brand: "jordan",
    category: "basketball",
    gender: "unisex",
    code: "RV-2407",
    price: 295000,
    colorway: {
      en: "Pine Green / Sail",
      ku: "سەوزی سنۆبەر و کرێم",
      ar: "أخضر صنوبري وبيج",
    },
    description: {
      en: "The classic Jordan 4 silhouette revamped for skateboarding with flexible plastics and Nike SB comfort.",
      ku: "مۆدێلی نەمرینی جۆردان 4 بە کوالێتی بەرز و پێکهاتەی بەهێزکراو بۆ ستایلی شەقام.",
      ar: "تصميم جوردان 4 الأيقوني المعاد تصميمه لراحة وثبات لا مثيل لهما.",
    },
    sizes: [38, 39, 40, 41, 42, 43, 44],
    soldOutSizes: [38],
    stock: 5,
    rating: 5.0,
    reviews: 58,
    addedAt: "2026-09-06T15:00:00Z",
    popularity: 99,
    featured: true,
  },
  {
    slug: "jordan-5-sail",
    name: "Air Jordan 5 Sail",
    brand: "jordan",
    category: "basketball",
    gender: "unisex",
    code: "RV-2408",
    price: 275000,
    colorway: {
      en: "Sail / Light Orewood",
      ku: "سەیڵ کرێمی",
      ar: "بيج شراع",
    },
    description: {
      en: "Premium materials and iconic toggle lace lock with visible Air cushioning.",
      ku: "چەرمی نایاب و کفی هەوایی پێشکەوتوو بە ستایلێکی ناوازەی جۆردان 5.",
      ar: "مواد فاخرة وتصميم جوردان 5 الكلاسيكي مع تقنية التوسيد الهوائي المرئية.",
    },
    sizes: [39, 40, 41, 42, 43, 44, 45],
    soldOutSizes: [40],
    stock: 4,
    rating: 4.8,
    reviews: 29,
    addedAt: "2026-09-05T11:00:00Z",
    popularity: 93,
    featured: true,
  },
  {
    slug: "nike-sb-dunk-low-volt",
    name: "Nike SB Dunk Low",
    brand: "nike",
    category: "skate",
    gender: "unisex",
    code: "RV-2409",
    price: 215000,
    compareAt: 245000,
    colorway: {
      en: "Brown / Volt",
      ku: "قاوەیی و فۆسفۆری",
      ar: "بني وفسفوري",
    },
    description: {
      en: "Low profile skateboard sneaker with Zoom Air insole and padded tongue for premium boardfeel.",
      ku: "پێڵاوی دەنک لۆوی بەناوبانگی نایکی بە ڕەنگی قاوەیی و لۆگۆی فۆسفۆری سەرنجڕاکێش.",
      ar: "حذاء سنيكرز لو الكلاسيكي من نايكي مع نعل زووم أير المريح وتفاصيل فوسفورية مميزة.",
    },
    sizes: [39, 40, 41, 42, 43, 44],
    soldOutSizes: [39],
    stock: 6,
    rating: 4.7,
    reviews: 26,
    addedAt: "2026-09-04T16:00:00Z",
    popularity: 89,
    featured: true,
  },
  {
    slug: "skechers-go-walk-navy",
    name: "Skechers Go Walk 5",
    brand: "skechers",
    category: "walking",
    gender: "men",
    code: "RV-2411",
    price: 110000,
    colorway: {
      en: "Navy Blue",
      ku: "شینی تۆخ",
      ar: "كحلي",
    },
    description: {
      en: "Features lightweight, responsive ULTRA GO cushioning and high-rebound COMFORT PILLAR TECHNOLOGY for walking ease.",
      ku: "پێڵاوێکی زۆر سووک بۆ پیاسەکردنی ڕۆژانە بە تەکنەلۆژیای پشکنراوی ئاڵترا گۆ.",
      ar: "يتميز بتوسيد خفيف الوزن وتكنولوجيا مريحة عالية الارتداد لتسهيل المشي طوال اليوم.",
    },
    sizes: [39, 40, 41, 42, 43, 44],
    soldOutSizes: [39, 44],
    stock: 9,
    rating: 4.6,
    reviews: 22,
    addedAt: "2026-09-03T10:00:00Z",
    popularity: 84,
  },
  {
    slug: "skechers-max-cushioning-tan",
    name: "Skechers Max Cushioning",
    brand: "skechers",
    category: "running",
    gender: "unisex",
    code: "RV-2413",
    price: 130000,
    compareAt: 155000,
    colorway: {
      en: "Tan / Brown",
      ku: "خاکی / تان",
      ar: "بيج رملي",
    },
    description: {
      en: "Maximum cushioned comfort platform designed for exceptional support on runs or walks.",
      ku: "ئەستوورترین کفی نەرم بۆ پاراستنی جومگەکان لە کاتی ڕاکردن و بەپێ ڕۆیشتنی زۆردا.",
      ar: "منصة توسيد قصوى مصممة لدعم استثنائي أثناء الجري أو المشي الطويل.",
    },
    sizes: [38, 39, 40, 41, 42, 43],
    soldOutSizes: [38],
    stock: 5,
    rating: 4.7,
    reviews: 19,
    addedAt: "2026-09-02T13:00:00Z",
    popularity: 82,
  },
  {
    slug: "retro-runner-sand",
    name: "Retro Runner",
    brand: "other",
    category: "lifestyle",
    gender: "unisex",
    code: "RV-2414",
    price: 105000,
    colorway: {
      en: "Sand / Cream",
      ku: "شینی کاڵ و لمی",
      ar: "رملي كريمي",
    },
    description: {
      en: "Vintage running sneaker aesthetic crafted with breathable canvas and textured suede overlays.",
      ku: "ستایلێکی کلاسیکی رێترۆ بە قوماشی هەناسەدەر و قەراغی پێستی جیر بۆ بەکارهێنانی ڕۆژانە.",
      ar: "تصميم كلاسيكي مستوحى من أحذية الجري القديمة مع قماش يسمح بالتهوية وطبقات سويدي فاخرة.",
    },
    sizes: [37, 38, 39, 40, 41, 42],
    soldOutSizes: [],
    stock: 11,
    rating: 4.5,
    reviews: 15,
    addedAt: "2026-09-01T12:00:00Z",
    popularity: 78,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function allProducts(): Product[] {
  return products;
}

export function featuredProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function newArrivals(): Product[] {
  return [...products].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );
}

export function onSaleProducts(): Product[] {
  return products.filter((p) => p.compareAt && p.compareAt > p.price);
}

export function relatedTo(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.brand === product.brand || p.category === product.category),
    )
    .slice(0, limit);
}

export function getBlur(slug: string): string | undefined {
  return (blurMap as Record<string, string>)[slug];
}

/**
 * Freshness window shared by the "New" badge on product cards and the admin's
 * stale-listing count.
 */
export const FRESHNESS_WINDOW_DAYS = 14;

/**
 * The reference "today" for freshness, taken from the catalogue's own most
 * recent `addedAt` rather than `Date.now()`.
 *
 * The site is statically exported: this markup is generated at build time and
 * hydrated in a browser much later. A clock read would give the two different
 * answers the moment a product crossed the 14-day line, and React would report
 * a hydration mismatch. Re-run the build (or edit `addedAt` above) to move it.
 */
export const catalogueDate: string = products.reduce(
  (latest, p) => (p.addedAt > latest ? p.addedAt : latest),
  products[0]?.addedAt ?? "1970-01-01T00:00:00Z",
);

const FRESHNESS_CUTOFF =
  new Date(catalogueDate).getTime() -
  FRESHNESS_WINDOW_DAYS * 24 * 60 * 60 * 1000;

/** Added within the freshness window — drives the "New" badge. */
export function isNewArrival(product: Pick<Product, "addedAt">): boolean {
  return new Date(product.addedAt).getTime() > FRESHNESS_CUTOFF;
}
