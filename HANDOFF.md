# RAVEN — build handoff

Status as of the end of session 1. Everything below is written for the **next agent**
picking this up cold. Read all of it before writing code; several decisions were
already made and locked, and re-litigating them will cost the user time.

---

## 1. What is being built

A **fully static** marketing + catalogue site for **RAVEN**, a real sneaker store in
Erbil, Kurdistan Region, Iraq. Stack and requirements were set by the user:

| Requirement | Decision |
|---|---|
| Framework | Next.js **16.3.5**, App Router, `src/` dir, TypeScript |
| Styling | Tailwind **v4** (CSS-first, no `tailwind.config.js`) |
| Components | **shadcn/ui v4** (`style: base-nova`) |
| Output | **Static export** — `output: "export"`, builds to `./out` |
| Languages | **Kurdish Sorani (`ku`, default, RTL)**, English (`en`, LTR), Arabic (`ar`, RTL) |
| Themes | Light + dark, via `next-themes` |
| Interactivity | localStorage-backed cart, wishlist, recently-viewed, language + theme memory |
| Checkout | **WhatsApp** — cart builds a pre-filled `wa.me` message. No server, no payments. |
| Prices | Placeholder **IQD** values in one editable data file |

There is **no backend**. Anything that looks like state must be client-side and
persisted in `localStorage`.

---

## 2. What is already DONE (do not redo)

### Project scaffold
- `create-next-app` run, `shadcn init` run, components added.
- `next.config.ts` — configured for static export (`output: "export"`,
  `trailingSlash: true`, `images.unoptimized: true`). **Done, don't change.**
- `package.json` scripts include `prep:assets`.
- `components.json` has `"rtl": true` so any *newly added* shadcn component
  generates RTL-aware classes.

### Assets pipeline — DONE
`scripts/prep-assets.mjs` (run it with `npm run prep:assets`).

It has already been run. It produced:

- `public/brand/raven-wordmark-white.png` (947×678, transparent)
- `public/brand/raven-wordmark-black.png` (947×678, transparent)
- `public/brand/raven-mark-white.png` (237×353, transparent)
- `public/brand/raven-mark-black.png` (237×353, transparent)
- `public/icon.png` — favicon, white mark on `#0a0a0a`
- `public/products/*.webp` — 12 product photos re-encoded
- `src/data/blur.json` — slug → base64 LQIP map, for `<Image placeholder="blur">`

The user supplied the logos as **white-on-black JPEGs**. The script derives an alpha
channel from luminance with a levels curve (`LO=96, HI=200`) to kill JPEG noise, then
crops to the artwork bounding box. Use `-white.png` in dark mode and `-black.png` in
light mode. The `-src.jpg` originals are kept but should not be used in the UI.

> ⚠️ **Known asset limitation — tell the user again.** 8 of the 12 product photos are
> only **206×206 px**. They will look soft in a large grid card or on a product detail
> page. Design cards so this is tolerable (square crop, ~360px card max), and note in
> your final message that dropping full-res files at the same `public/products/<slug>.jpg`
> path and re-running `npm run prep:assets` fixes it with zero code changes.
> Full-res ones: `adidas-x9000-l4-black-red`, `skechers-arch-fit-olive`,
> `skechers-glide-step-cream` (1440×1920), `adidas-runfalcon-black` (1024×883).

### Config + i18n runtime — DONE
- `src/lib/site.ts` — every real-world store detail (WhatsApp number, phone, email,
  Instagram, address, hours, delivery thresholds) in one object, each with `en/ku/ar`
  variants where it is prose. **All contact values are placeholders the user must
  replace.** Flag this.
- `src/lib/i18n/config.ts` — `locales`, `defaultLocale = "ku"`, `localeMeta`
  (label/dir/htmlLang/flag), `isLocale`, `dirOf`, `localePath`, `matchLocale`.
  Note `ku` maps to `htmlLang: "ckb"`.
- `src/lib/i18n/dictionaries.ts` — bundles all 3 JSON dictionaries, exports
  `getDictionary(locale)` and `createTranslator(dict)` giving
  `t("cart.checkout")` / `t("shop.results", { count: 12 })`. `MessageKey` is a typed
  union of every leaf path — **use it, it will catch typos at build time.**
- `src/lib/i18n/provider.tsx` — `"use client"` `<I18nProvider locale>` +
  `useI18n()` → `{ locale, dir, t, href, price, size }`.
  `href("/shop")` → `/ku/shop`. Use it for every internal link.
- `src/lib/format.ts` — `formatNumber`, `formatPrice`, `formatSize`,
  `toArabicDigits`, `discountPercent`.
  **Formatting is deliberately hand-rolled, not `Intl`** — the static build (Node ICU)
  and the browser must produce byte-identical strings or React throws a hydration
  mismatch. Do not "improve" this by switching to `Intl.NumberFormat`.
  `ar` and `ku` render Arabic-Indic digits (٠١٢…) with `٬` as the group separator.

### Translations — DONE
`src/messages/{en,ku,ar}.json` — ~200 keys each, fully written and mutually consistent.
Sections: `nav, announce, home, shop, product, cart, wishlist, about, contact, footer,
common, category, theme, lang, notFound`.

**All three files must keep identical key shapes** — `en.json` is the source of truth
for the `Dictionary` type. If you add a key, add it to all three.

---

## 3. What is LEFT TO DO

Ordered. Each step assumes the previous is done.

### Step 1 — Design tokens + fonts (`src/app/globals.css`, `src/app/[locale]/layout.tsx`)

`globals.css` is still the **stock shadcn neutral palette**. Replace the brand colours:

- Brand black `#0B0B0C`, off-white `#FAFAF9`.
- Accent: **red**, matching the red neon in the store photos — around
  `oklch(0.58 0.21 25)` (≈ `#E02B1D`). Use it for `--primary` in dark mode, sale
  badges, and focus rings.
- Small radius (`--radius: 0.25rem`) — the brand is sharp/streetwear, not rounded.
- Keep both `:root` (light) and `.dark` blocks complete. `next-themes` uses the
  `class` attribute and the `@custom-variant dark (&:is(.dark *))` already in the file.

Fonts — `next/font/google`, all three loaded in the locale layout:
- Latin display: **Archivo** or **Anton** (condensed, heavy) for headings.
- Latin body: **Inter**.
- Arabic/Kurdish: **Noto Kufi Arabic** (display) + **Noto Sans Arabic** (body).
  Both cover the Sorani-specific glyphs (ڕ ڵ ێ ۆ ژ چ پ گ ڤ). Subset `["arabic"]`.
- Wire them as CSS vars and switch the active stack off `dir`/`lang`.

`src/app/layout.tsx` and `src/app/page.tsx` are still **create-next-app boilerplate**.
Both must be replaced (see Step 3).

### Step 2 — Product data (`src/data/products.ts`) — **start here, everything depends on it**

Not written yet. Shape agreed in session 1:

```ts
export type BrandId = "hoka" | "nike" | "jordan" | "adidas" | "skechers" | "other";
export type CategoryId = "running" | "lifestyle" | "basketball" | "skate" | "walking";
export type Gender = "men" | "women" | "unisex";
export type Localized = Record<Locale, string>;

export type Product = {
  slug: string;          // also the image basename in /public/products
  name: string;          // Latin in every language — "Bondi 8", "Air Jordan 4 SB"
  brand: BrandId;
  category: CategoryId;
  gender: Gender;
  price: number;         // IQD, placeholder
  compareAt?: number;    // set => renders as on-sale
  colorway: Localized;
  description: Localized;
  sizes: number[];       // EU
  soldOutSizes?: number[];
  stock: number;
  rating: number;        // 0–5
  reviews: number;
  addedAt: string;       // ISO date, drives "newest" sort + "New" badge
  popularity: number;    // drives "most popular" sort
  featured?: boolean;
};
```

Brand and model names stay **Latin in all three languages** — that is how this market
actually refers to them. Only `colorway` and `description` are translated.

The 12 products, already identified from the photos, with suggested placeholder IQD
prices (realistic for Iraq):

| slug | name | brand | category | price | notes |
|---|---|---|---|---|---|
| `hoka-bondi-8-black` | Bondi 8 | hoka | running | 185,000 | compareAt 225,000; photo shows sizes 36–48 |
| `hoka-clifton-9-blue` | Clifton 9 | hoka | running | 175,000 | coastal blue; photo tagged 43 |
| `jordan-4-sb-pine-green` | Air Jordan 4 SB | jordan | basketball | 295,000 | Pine Green; photo tagged 38 |
| `jordan-5-sail` | Air Jordan 5 | jordan | basketball | 275,000 | Sail; featured |
| `nike-sb-dunk-low-volt` | SB Dunk Low | nike | skate | 215,000 | brown/volt; photo tagged 41 |
| `adidas-x9000-l4-black-red` | X9000L4 | adidas | lifestyle | 165,000 | black/red; photo tagged 41; full-res |
| `adidas-runfalcon-black` | Runfalcon 3.0 | adidas | running | 95,000 | studio shot; full-res |
| `skechers-arch-fit-olive` | Arch Fit | skechers | walking | 125,000 | full-res |
| `skechers-glide-step-cream` | Glide Step Slip-ins | skechers | walking | 135,000 | full-res |
| `skechers-go-walk-navy` | Go Walk 5 | skechers | walking | 110,000 | |
| `skechers-max-cushioning-tan` | Max Cushioning | skechers | running | 130,000 | |
| `retro-runner-sand` | Retro Runner | other | lifestyle | 105,000 | ⚠️ brand not identifiable from the photo — left as `other`. Ask the user. |

Also export helpers from this file: `getProduct(slug)`, `allProducts`, `featured`,
`newArrivals`, `onSale`, `relatedTo(product)`, `brands`, `categories`, and
`getBlur(slug)` reading `src/data/blur.json`.

Put a comment at the top: *"Placeholder prices and copy — edit this file, nothing else,
to correct the catalogue."*

### Step 3 — Routing + root shell

Static export means **every dynamic segment needs `generateStaticParams`**.

```
src/app/
  layout.tsx              # minimal: <html>/<body> are set per-locale, so keep this thin
  page.tsx                # "/" language gate — see below
  globals.css
  [locale]/
    layout.tsx            # html lang+dir, fonts, providers, header, footer, <Toaster/>
    page.tsx              # home
    shop/page.tsx
    product/[slug]/page.tsx   # generateStaticParams over locales × products
    wishlist/page.tsx
    cart/page.tsx
    about/page.tsx
    contact/page.tsx
    not-found.tsx
```

- `[locale]/layout.tsx` exports `generateStaticParams` returning all 3 locales, and
  `generateMetadata` per locale (title, description, OG image, `alternates.languages`).
- `/` (root `page.tsx`): a **client-side language gate**. On mount, read
  `localStorage.raven.locale`, else `matchLocale(navigator.languages)`, then
  `router.replace(...)`. Render a minimal branded splash + `<noscript>` links to all
  three locales so it still works without JS. Do **not** use `redirect()` — it does not
  emit a usable static page.
- Next 16 route params are **async**: `async function Page({ params }: PageProps<"/[locale]">)`
  then `const { locale } = await params`. Same for `generateMetadata`.
- Validate the segment with `isLocale()` and `notFound()` otherwise.

### Step 4 — localStorage stores (`src/lib/store/`)

Three client contexts, each a `"use client"` provider + hook:

- `cart.tsx` — items keyed `` `${slug}:${size}` ``, `{ slug, size, qty }`.
  API: `items, add, remove, setQty, clear, count, subtotal, note, setNote`.
- `wishlist.tsx` — `string[]` of slugs. API: `has, toggle, clear, items`.
- `recently-viewed.tsx` — capped ring buffer of ~8 slugs.

Shared concerns — get these right, they are the usual source of bugs here:
1. **Hydration.** Start from the empty initial state on both server and first client
   render; load from `localStorage` inside `useEffect`. Expose a `hydrated` flag and
   render cart/wishlist counts as `null` until it flips, or the badge count will
   mismatch and React will warn.
2. Storage keys namespaced `raven.cart`, `raven.wishlist`, `raven.recent`,
   `raven.locale`, `raven.theme`.
3. Wrap every `localStorage` read/write in `try/catch` — private mode and blocked
   site-data both throw.
4. Version the payload (`{ v: 1, items: [...] }`) and drop anything with another `v`,
   so a future shape change does not crash returning visitors.
5. Persist the chosen locale to `raven.locale` whenever the language switcher is used —
   the root gate depends on it.

### Step 5 — WhatsApp checkout (`src/lib/whatsapp.ts`)

One function building the `wa.me` URL from cart contents:

```
https://wa.me/<site.whatsapp>?text=<encodeURIComponent(message)>
```

Message body, written in the **active locale**, listing each line as
`name — size X — qty N — price`, then subtotal, delivery, total, then the optional
customer note and the product page URLs. Keep it under ~1,500 chars. `encodeURIComponent`
the whole text; `%0A` for newlines. Also used by the contact form (`send`) and the
"Order on WhatsApp" button on the product page.

Delivery logic lives in `site.ts`: free at/above `freeDeliveryFrom` (150,000 IQD),
otherwise `deliveryFee` (5,000 IQD).

### Step 6 — Components

`src/components/`:

- `brand/logo.tsx` — wordmark + mark, swapping `-white`/`-black` PNG on theme. Since
  theme is class-based, render both and toggle with `dark:` classes rather than reading
  `useTheme()` (avoids a flash and a hydration branch).
- `layout/site-header.tsx` — sticky, announcement ticker (`announce.a/b/c`), nav,
  search, language switcher, theme toggle, wishlist + cart counts, mobile `Sheet` nav.
- `layout/site-footer.tsx` — links, contact, the phone-capture field
  (`footer.newsletter*`, store to `localStorage`, toast on success).
- `theme-toggle.tsx`, `language-switcher.tsx` (switcher must preserve the current path:
  `/en/product/x` → `/ar/product/x`).
- `commerce/product-card.tsx`, `product-grid.tsx`, `shop-filters.tsx`,
  `size-picker.tsx`, `add-to-cart.tsx`, `wishlist-button.tsx`, `cart-sheet.tsx`,
  `product-gallery.tsx`, `quick-view.tsx`, `recently-viewed.tsx`.
- Shop filters: brand, category, size, price `Slider`, gender, on-sale, in-stock, sort.
  Mirror filter state into the **URL query string** so filtered views are shareable,
  and keep the mobile filter UI in a `Sheet`.

### Step 7 — Pages

Home, shop, product detail, wishlist, cart, about, contact, 404 — copy for all of them
already exists in the dictionaries; do not invent new strings without adding keys to all
three JSON files.

Product detail should also emit **JSON-LD** (`Product` + `Offer`, price in IQD) and the
home page an `Organization`/`LocalBusiness` block built from `site.ts`.

### Step 8 — Verify

```bash
npm run lint
npx tsc --noEmit
npm run build          # must emit ./out with no errors
npx serve out          # click through all three locales
```

Check specifically:
- `/`, `/ku`, `/en`, `/ar` and every page under each.
- **RTL**: `ku` and `ar` must have `dir="rtl"` on `<html>`; no horizontal scroll;
  chevrons/arrows must flip (use logical utilities — `ms-*`, `me-*`, `ps-*`, `pe-*`,
  `start-*`, `end-*`, `text-start/end`, and `rtl:` variants — never `ml-*`/`left-*`).
- Light **and** dark in all three languages.
- Reload after adding to cart → items persist; open in a private window → no crash.
- 400px viewport.

---

## 4. Environment facts worth knowing

- Windows 11, PowerShell is primary; the Bash tool is Git Bash. Node **v22.18.0**,
  npm 10.9.3 (pnpm 11.1.2 also present, but the project is npm — stay on npm).
- **Heredocs through the Bash tool have been unreliable for large files** in this
  project — a ~200-line JSON heredoc failed with a quoting error. Use the `Write` tool
  for anything substantial.
- **shadcn v4 here is built on `@base-ui/react`, not Radix.** Component internals and
  prop names differ from the Radix-era shadcn docs most models have memorised. Read the
  actual file in `src/components/ui/` before using a component.
- `lucide-react` is **v1.46** — icon names are mostly stable, but verify imports.
- Installed and available: `next-themes`, `sonner`, `embla-carousel-react`,
  `class-variance-authority`, `tw-animate-css`, `sharp` (dev).
- A stray `cn@0.3.0` npm package got installed by shadcn's dependency detection. The
  real helper is `src/lib/utils.ts`. Consider `npm uninstall cn`.
- Git repo was initialised by `create-next-app`; **nothing has been committed yet.**

---

## 5. Open questions for the user

1. `retro-runner-sand.jpg` — which brand/model is it? Currently `other` / "Retro Runner".
2. Real WhatsApp number, phone, email, Instagram handle, street address and Google Maps
   link — all placeholders in `src/lib/site.ts`.
3. Real prices — all 12 are placeholders.
4. Default locale is **`ku`**. One-line change in `src/lib/i18n/config.ts` if wrong.
5. Deploy target (Netlify / Cloudflare Pages / GitHub Pages / cPanel)? Affects whether a
   `basePath` is needed in `next.config.ts`.
6. Full-resolution product photos for the 8 thumbnails.
