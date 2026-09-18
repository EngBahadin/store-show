"use client";

import { usePathname } from "next/navigation";

import { useI18n } from "@/lib/i18n/provider";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppIcon({
  className = "w-6 h-6",
  variant = "monochrome",
}: {
  className?: string;
  variant?: "monochrome" | "colored";
}) {
  if (variant === "colored") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" fill="#25D366" />
        <path
          fill="#FFFFFF"
          d="M17.867 16.219c-.242.68-1.406 1.258-1.93 1.305-.492.047-1.125.07-3.289-.828-2.68-1.117-4.398-3.852-4.531-4.031-.133-.18-1.078-1.438-1.078-2.75 0-1.313.687-1.953.93-2.219.242-.266.531-.328.71-.328h.516c.164 0 .39-.063.602.445.226.547.773 1.883.844 2.024.07.14.117.304.023.492-.093.187-.14.304-.28.469-.14.164-.298.367-.423.492-.14.14-.29.29-.125.57.164.281.734 1.219 1.578 1.969 1.086.969 2 1.273 2.281 1.414.281.14.445.117.61-.07.163-.188.702-.82 1.078-1.336.187-.281.375-.234.633-.14.258.093 1.64.773 1.921.914.282.14.47.21.539.328.07.117.07.68-.172 1.36z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="currentColor"
    >
      <path d="M12.031 2C6.516 2 2.023 6.492 2.023 12.008c0 1.836.5 3.578 1.375 5.086L2 22l5.063-1.328A9.97 9.97 0 0 0 12.03 22c5.516 0 10.008-4.492 10.008-10.008C22.039 6.492 17.547 2 12.031 2zm5.836 14.219c-.242.68-1.406 1.258-1.93 1.305-.492.047-1.125.07-3.289-.828-2.68-1.117-4.398-3.852-4.531-4.031-.133-.18-1.078-1.438-1.078-2.75 0-1.313.687-1.953.93-2.219.242-.266.531-.328.71-.328h.516c.164 0 .39-.063.602.445.226.547.773 1.883.844 2.024.07.14.117.304.023.492-.093.187-.14.304-.28.469-.14.164-.298.367-.423.492-.14.14-.29.29-.125.57.164.281.734 1.219 1.578 1.969 1.086.969 2 1.273 2.281 1.414.281.14.445.117.61-.07.163-.188.702-.82 1.078-1.336.187-.281.375-.234.633-.14.258.093 1.64.773 1.921.914.282.14.47.21.539.328.07.117.07.68-.172 1.36z" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const { locale } = useI18n();
  const pathname = usePathname();

  // If on admin route, hide floating button to not overlap admin controls
  if (pathname.includes("/admin")) {
    return null;
  }

  const whatsappUrl = buildContactWhatsAppUrl(locale);

  return (
    <div className="fixed bottom-[74px] sm:bottom-8 end-4 sm:end-8 z-50 flex items-center gap-2 pointer-events-auto">
      {/* Expanded pill tooltip on desktop hover */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
      >
        <div className="relative flex items-center justify-center">
          <WhatsAppIcon className="w-6 h-6 fill-white" />
          {/* Subtle radar ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />
        </div>

        <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">
          {locale === "ku"
            ? "چات لە واتسئاپ"
            : locale === "ar"
              ? "تواصل عبر واتساب"
              : "Chat on WhatsApp"}
        </span>
      </a>
    </div>
  );
}
