/**
 * Every real-world detail about the store lives here. Change these values and
 * the whole site follows — header, footer, contact page, WhatsApp checkout,
 * metadata and JSON-LD.
 */
export const site = {
  name: "RAVEN",
  /** Used in <title> and social cards. */
  tagline: {
    en: "Authentic sneakers, straight from the shelf",
    ku: "پێڵاوی ڕەسەن، ڕاستەوخۆ لە ڕەفەکانمانەوە",
    ar: "أحذية رياضية أصلية، مباشرة من الرف",
  },
  /** Public site origin. Set this before you deploy — used for canonical URLs. */
  url: "https://raven.example.com",

  /** Digits only, international format, no + or spaces. Used to build wa.me links. */
  whatsapp: "9647500000000",
  /** Human-readable, shown in the UI. */
  phone: "+964 750 000 0000",
  email: "hello@raven.iq",
  instagram: "raven.iq",

  address: {
    en: "Sulaymaniyah, Kurdistan Region, Iraq",
    ku: "سلێمانی، هەرێمی کوردستان، عێراق",
    ar: "السليمانية، إقليم كردستان، العراق",
  },
  /** Google Maps place link for the "Get directions" button. */
  maps: "https://maps.google.com/?q=Sulaymaniyah",

  hours: {
    en: "Every day · 10:00 — 23:00",
    ku: "هەموو ڕۆژێک · 10:00 — 23:00",
    ar: "كل يوم · 10:00 — 23:00",
  },

  /** Order total (IQD) at or above which delivery is free. */
  freeDeliveryFrom: 150_000,
  /** Flat delivery fee (IQD) below that threshold. */
  deliveryFee: 5_000,
  currency: "IQD",
} as const;

export type Site = typeof site;
