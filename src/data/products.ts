import blurMap from "@/data/blur.json";
import type { Locale } from "@/lib/i18n/config";

/**
 * Placeholder prices and catalogue copy — edit this file, nothing else,
 * to correct or expand the catalogue.
 */

export type BrandId =
  | "hoka"
  | "nike"
  | "jordan"
  | "adidas"
  | "skechers"
  | "new-balance"
  | "other";
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
  photoType?: "lifestyle" | "studio";
};

export const brands: { id: BrandId; name: string }[] = [
  { id: "hoka", name: "HOKA" },
  { id: "nike", name: "Nike" },
  { id: "jordan", name: "Air Jordan" },
  { id: "adidas", name: "Adidas" },
  { id: "skechers", name: "Skechers" },
  { id: "new-balance", name: "New Balance" },
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
    addedAt: "2026-08-15T08:30:00Z",
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
      en: "Baroque Brown / Ale",
      ku: "قاوەیی و بەژنکە",
      ar: "بني وبيج",
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
    addedAt: "2026-08-20T16:00:00Z",
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
      en: "Black / White",
      ku: "ڕەش و سپی",
      ar: "أسود وأبيض",
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
    addedAt: "2026-08-22T13:00:00Z",
    popularity: 82,
  },
  {
    slug: "retro-runner-sand",
    name: "New Balance 574",
    brand: "new-balance",
    category: "lifestyle",
    gender: "unisex",
    code: "RV-2414",
    price: 105000,
    colorway: {
      en: "Sand / Cream, Green Laces",
      ku: "کرێمی لەگەڵ گوریسی سەوز",
      ar: "رملي كريمي بخيوط خضراء",
    },
    description: {
      en: "The classic New Balance 574 silhouette in a soft sand suede, finished with contrast green laces and the signature ENCAP midsole.",
      ku: "شێوازی کلاسیکی نیو بالانس 574 بە پێستی جیری کرێمی و گوریسی سەوزی جیاواز، بە کفی ئینکاپی بەناوبانگ.",
      ar: "التصميم الكلاسيكي لنيو بالانس 574 بسويدي رملي ناعم مع خيوط خضراء متباينة ونعل ENCAP المميز.",
    },
    sizes: [37, 38, 39, 40, 41, 42],
    soldOutSizes: [],
    stock: 11,
    rating: 4.5,
    reviews: 15,
    addedAt: "2026-09-01T12:00:00Z",
    popularity: 78,
  },
  {
    slug: "jordan-31-banned",
    name: "Air Jordan XXXI",
    brand: "jordan",
    category: "basketball",
    gender: "unisex",
    code: "RV-2453",
    price: 245000,
    colorway: {
      en: "Black / University Red (Banned)",
      ku: "ڕەش و سووری زانکۆیی",
      ar: "أسود وأحمر جامعي",
    },
    description: {
      en: "Performance hybrid upper over Nike's Flight Speed cushioning, in the Bulls-inspired colorway that nods to the original 'Banned' Jordan 1.",
      ku: "پێکهاتەیەکی تێکەڵ لەگەڵ کفی فلایت سپیدی نایکی، بە ڕەنگی بوڵز کە ئاماژە بە جۆردان 1ی 'قەدەغەکراو' یەکەم دەکات.",
      ar: "تصميم علوي هجين مع توسيد Flight Speed من نايكي، بلون مستوحى من فريق بولز تحية لجوردان 1 'الممنوع' الأصلي.",
    },
    sizes: [40, 41, 42, 43, 44, 45],
    soldOutSizes: [],
    stock: 7,
    rating: 4.8,
    reviews: 21,
    addedAt: "2026-09-18T08:30:00Z",
    popularity: 90,
    featured: true,
  },
  {
    slug: "hoka-bondi-5-grey-blue",
    name: "HOKA Bondi 5",
    brand: "hoka",
    category: "running",
    gender: "men",
    code: "RV-2456",
    price: 165000,
    colorway: {
      en: "Charcoal / Diva Blue",
      ku: "ڕەساسی و شینی تۆخ",
      ar: "رمادي وأزرق",
    },
    description: {
      en: "The Bondi lineage before the 8 — maximalist cushioning in a lighter, more flexible package for all-day miles.",
      ku: "باپیری بۆندی 8 — کفێکی زۆر نەرم و کاریگەر بۆ ڕۆیشتن و ڕاکردنی درێژخایەن.",
      ar: "أساس سلسلة بوندي قبل الجيل الثامن — توسيد فائق بتصميم أخف وأكثر مرونة للمسافات الطويلة.",
    },
    sizes: [40, 41, 42, 43, 44, 45, 46],
    soldOutSizes: [46],
    stock: 5,
    rating: 4.7,
    reviews: 17,
    addedAt: "2026-09-17T14:00:00Z",
    popularity: 85,
  },
  {
    slug: "hoka-bondi-5-red",
    name: "HOKA Bondi 5",
    brand: "hoka",
    category: "running",
    gender: "men",
    code: "RV-2457",
    price: 165000,
    colorway: {
      en: "True Red / Black",
      ku: "سووری تۆخ و ڕەش",
      ar: "أحمر وأسود",
    },
    description: {
      en: "Same maximalist Bondi comfort as its grey sibling, in a bold true-red colorway for those who don't want to blend in.",
      ku: "هەمان ئاسوودەیی بۆندی بە ڕەنگێکی سووری زیندوو بۆ ئەوانەی دەیانەوێت جیاواز بن.",
      ar: "نفس راحة بوندي الفائقة بلون أحمر جريء لمن يفضل التميز.",
    },
    sizes: [40, 41, 42, 43, 44, 45],
    // Demo of the "last size left" card badge — only 42 is left in stock.
    soldOutSizes: [40, 41, 43, 44, 45],
    stock: 1,
    rating: 4.8,
    reviews: 14,
    addedAt: "2026-09-17T13:30:00Z",
    popularity: 83,
  },
  {
    slug: "nike-air-max-invigor-grey",
    name: "Nike Air Max Invigor",
    brand: "nike",
    category: "lifestyle",
    gender: "women",
    code: "RV-2458",
    price: 135000,
    colorway: {
      en: "Wolf Grey / Bright Mango",
      ku: "ڕەساسی و پرتەقاڵی گەرم",
      ar: "رمادي وبرتقالي فاتح",
    },
    description: {
      en: "Breathable mesh upper over a visible Max Air heel unit — an everyday women's sneaker with a sporty print finish.",
      ku: "ڕوکەشێکی مێشی هەناسەدار لەسەر یەکەی هەوای Air دیار، پێڵاوێکی ڕۆژانەی ژنان بە دیزاینێکی وەرزشی.",
      ar: "تصميم علوي شبكي قابل للتنفس مع وحدة Max Air مرئية عند الكعب — حذاء نسائي يومي بطبعة رياضية.",
    },
    sizes: [36, 37, 38, 39, 40],
    soldOutSizes: [36],
    stock: 6,
    rating: 4.5,
    reviews: 12,
    addedAt: "2026-09-17T10:00:00Z",
    popularity: 70,
  },
  {
    slug: "nike-air-max-tavas-red",
    name: "Nike Air Max Tavas",
    brand: "nike",
    category: "lifestyle",
    gender: "men",
    code: "RV-2452",
    price: 145000,
    colorway: {
      en: "Black / University Red",
      ku: "ڕەش و سوور",
      ar: "أسود وأحمر",
    },
    description: {
      en: "Textured mesh upper over a full-length visible Air-Max unit — everyday comfort with a sharp two-tone finish.",
      ku: "ڕوکەشێکی مێشی بە نەخش لەسەر یەکەی تەواوی Air-Max دیار، ئاسوودەیی ڕۆژانە بە دوو ڕەنگی جوان.",
      ar: "تصميم علوي شبكي منقوش فوق وحدة Air-Max كاملة الطول ومرئية — راحة يومية بلمسة لونين أنيقة.",
    },
    sizes: [40, 41, 42, 43, 44, 45, 46],
    soldOutSizes: [],
    stock: 9,
    rating: 4.6,
    reviews: 16,
    addedAt: "2026-09-16T16:00:00Z",
    popularity: 80,
  },
  {
    slug: "skechers-gorun-ride-grey",
    name: "Skechers GOrun Ride",
    brand: "skechers",
    category: "running",
    gender: "women",
    code: "RV-2454",
    price: 115000,
    colorway: {
      en: "Charcoal / Orange",
      ku: "ڕەساسی و پرتەقاڵی",
      ar: "رمادي وبرتقالي",
    },
    description: {
      en: "Lightweight women's trainer with M-Strike cushioning technology for a smoother, more efficient stride.",
      ku: "پێڵاوێکی سووکی ڕاکردنی ژنان بە تەکنەلۆژیای کفی M-Strike بۆ هەنگاوێکی ئاسووتر.",
      ar: "حذاء جري نسائي خفيف الوزن بتقنية توسيد M-Strike لخطوة أكثر سلاسة وكفاءة.",
    },
    sizes: [36, 37, 38, 39, 40, 41],
    soldOutSizes: [],
    stock: 8,
    rating: 4.6,
    reviews: 11,
    addedAt: "2026-09-16T11:00:00Z",
    popularity: 75,
  },
  {
    slug: "skechers-summits-navy",
    name: "Skechers Summits",
    brand: "skechers",
    category: "walking",
    gender: "women",
    code: "RV-2455",
    price: 95000,
    colorway: {
      en: "Navy / Mint",
      ku: "شینی تۆخ و ناعنایی",
      ar: "كحلي ونعناعي",
    },
    description: {
      en: "Slip-on bungee-lace comfort with a memory foam insole — grab-and-go ease for everyday errands.",
      ku: "پێڵاوێکی ئاسان بۆ لەبەرکردن بە گوریسی بەنگی و کفی مێموری فۆم بۆ ئاسوودەیی ڕۆژانە.",
      ar: "حذاء سهل الارتداء بخيوط مطاطية ونعل داخلي بذاكرة الرغوة — راحة سريعة للمهام اليومية.",
    },
    sizes: [36, 37, 38, 39, 40, 41],
    soldOutSizes: [41],
    stock: 5,
    rating: 4.7,
    reviews: 9,
    addedAt: "2026-09-15T15:00:00Z",
    popularity: 72,
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

/** Determines if a product photo is an in-store lifestyle shot vs an isolated studio product photo. */
export function isLifestylePhoto(productOrSlug: Pick<Product, "slug" | "photoType"> | string): boolean {
  const slug = typeof productOrSlug === "string" ? productOrSlug : productOrSlug.slug;
  const p = typeof productOrSlug === "string" ? getProduct(productOrSlug) : productOrSlug;
  if (p && "photoType" in p && p.photoType) {
    return p.photoType === "lifestyle";
  }
  return (
    slug === "adidas-x9000-l4-black-red" ||
    slug === "skechers-arch-fit-olive" ||
    slug === "skechers-glide-step-cream"
  );
}
