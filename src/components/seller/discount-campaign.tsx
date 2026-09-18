"use client";

import { Check, Flame, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { useSeller, type DiscountCampaign } from "@/lib/store/seller-store";

type CampaignScope = DiscountCampaign["scope"];

interface DiscountCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DiscountCampaignModal({
  open,
  onOpenChange,
}: DiscountCampaignModalProps) {
  const { locale } = useI18n();
  const { campaign, updateCampaign, products } = useSeller();

  const [percentage, setPercentage] = useState(campaign.percentage || 20);
  const [scope, setScope] = useState<CampaignScope>(campaign.scope || "all");
  const [durationDays, setDurationDays] = useState(campaign.durationDays || 3);
  const [isActive, setIsActive] = useState(campaign.active);

  const handleApply = () => {
    updateCampaign({
      active: true,
      percentage,
      scope,
      durationDays,
      startDate: new Date().toISOString(),
    });
    setIsActive(true);
    toast.success(
      locale === "ku"
        ? `داشکاندنی ${percentage}% بە سەرکەوتوویی چالاک کرا`
        : `Store-wide ${percentage}% discount campaign activated!`,
    );
    onOpenChange(false);
  };

  const handlePause = () => {
    updateCampaign({
      ...campaign,
      active: false,
    });
    setIsActive(false);
    toast.info(
      locale === "ku" ? "داشکاندن وەستێنرا" : "Discount paused",
    );
  };

  const previewProducts = products.slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-md bg-[#0A0A0A] border border-[#262626] text-white p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        <DialogHeader className="p-4 border-b border-[#262626] flex flex-row items-center justify-between text-start">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#E01B24]" />
            <span>
              {locale === "ku"
                ? "داشکاندنی گشتی"
                : locale === "ar"
                  ? "تخفيض عام على المتجر"
                  : "Store-Wide Discount"}
            </span>
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={
              locale === "ku" ? "داخستن" : locale === "ar" ? "إغلاق" : "Close"
            }
            className="-me-1 grid size-8 place-items-center rounded-full text-[#8A8A8A] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Active campaign banner if active (Screen 14b) */}
          {isActive ? (
            <div className="border border-[#E01B24] bg-[#E01B24]/10 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E01B24] animate-ping" />
                  <span>
                    {locale === "ku"
                      ? `داشکاندنی چالاک · ${percentage}%`
                      : `Active Campaign · ${percentage}%`}
                  </span>
                </div>
                <div className="text-[11px] text-[#8A8A8A]">
                  {locale === "ku"
                    ? `${products.length} کاڵا · 2 ڕۆژ و 4 کاتژمێر ماوە`
                    : `${products.length} pairs on sale · 2 days remaining`}
                </div>
              </div>

              <button
                type="button"
                onClick={handlePause}
                className="text-xs font-bold text-[#E01B24] hover:underline shrink-0"
              >
                {locale === "ku" ? "وەستاندن" : "Pause"}
              </button>
            </div>
          ) : (
            <div className="border border-[#262626] bg-[#141414] rounded-xl p-3 text-xs text-[#8A8A8A]">
              {locale === "ku"
                ? "هیچ داشکاندنێکی گشتی ئێستا چالاک نییە."
                : "No active discount campaign at the moment."}
            </div>
          )}

          {/* Discount Percentage Selector */}
          <div className="space-y-2">
            <div className="text-xs text-[#8A8A8A]">
              {locale === "ku" ? "ڕێژەی داشکاندن" : "Discount Percentage"}
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 15, 20, 25, 30, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setPercentage(pct)}
                  className={`w-14 h-11 rounded-lg border text-xs font-bold transition-all ${
                    percentage === pct
                      ? "bg-white text-[#0A0A0A] border-white scale-105 shadow-sm"
                      : "border-[#262626] text-[#8A8A8A] hover:border-white hover:text-white"
                  }`}
                >
                  {`${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Selector (Apply to) */}
          <div className="space-y-2">
            <div className="text-xs text-[#8A8A8A]">
              {locale === "ku" ? "جێبەجێکردن بۆ" : "Apply to"}
            </div>
            <div className="divide-y divide-[#262626] border border-[#262626] rounded-xl bg-[#141414]">
              {([
                {
                  id: "all",
                  label:
                    locale === "ku"
                      ? "هەموو کاڵاکان"
                      : "All Products",
                },
                {
                  id: "category",
                  label:
                    locale === "ku"
                      ? "بەشێکی دیاریکراو"
                      : "Specific Category",
                },
                {
                  id: "selected",
                  label:
                    locale === "ku"
                      ? "کاڵاکانی هەڵبژێردراو"
                      : "Selected Pairs Only",
                },
              ] satisfies { id: CampaignScope; label: string }[]).map((opt) => {
                const isSelected = scope === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScope(opt.id)}
                    className="w-full flex items-center justify-between p-3 text-xs text-start hover:bg-white/[0.03]"
                  >
                    <span className={isSelected ? "font-bold text-white" : "text-[#8A8A8A]"}>
                      {opt.label}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "bg-white border-white text-[#0A0A0A]"
                          : "border-[#3A3A3A] text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <div className="text-xs text-[#8A8A8A]">
              {locale === "ku" ? "ماوەی داشکاندن" : "Duration"}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { days: 1, label: locale === "ku" ? "24 کاتژمێر" : "24 Hours" },
                { days: 3, label: locale === "ku" ? "3 ڕۆژ" : "3 Days" },
                { days: 7, label: locale === "ku" ? "هەفتەیەک" : "1 Week" },
                { days: 30, label: locale === "ku" ? "بێ کۆتایی" : "Until stopped" },
              ].map((dur) => (
                <button
                  key={dur.days}
                  type="button"
                  onClick={() => setDurationDays(dur.days)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    durationDays === dur.days
                      ? "bg-white text-[#0A0A0A]"
                      : "border border-[#3A3A3A] text-[#8A8A8A] hover:text-white"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border border-[#E0A31B]/30 bg-[#E0A31B]/10 rounded-lg p-2.5 text-[11px] text-[#E8D39B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E0A31B] shrink-0" />
              <span>
                {locale === "ku"
                  ? "دوای کۆتایی ماوە، نرخەکان خۆکارانە دەگەڕێنەوە بۆ نرخی پێشوو."
                  : "Original prices will be restored automatically when the campaign ends."}
              </span>
            </div>
          </div>

          {/* Live Preview (Screen 14b) */}
          <div className="space-y-2">
            <div className="text-xs text-[#8A8A8A]">
              {locale === "ku" ? "پێشبینین" : "Live Price Preview"}
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
              {previewProducts.map((p) => {
                const discounted = Math.round(p.price * (1 - percentage / 100));
                return (
                  <div
                    key={p.slug}
                    className="flex-none w-28 space-y-1"
                  >
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#262626] bg-[#141414]">
                      <Image
                        src={`/products/${p.slug}.webp`}
                        alt={p.name}
                        fill
                        className="object-contain p-1.5"
                      />
                      <span className="absolute top-1.5 end-1.5 bg-[#E01B24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {percentage}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span>{formatPrice(discounted, "").trim()}</span>
                      <span className="text-[10px] text-[#8A8A8A] line-through font-normal">
                        {formatPrice(p.price, "").trim()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleApply}
              className="w-full h-12 bg-white text-[#0A0A0A] rounded-full font-bold text-sm hover:bg-white/90 transition-transform active:scale-[0.98]"
            >
              {locale === "ku"
                ? "جێبەجێکردنی داشکاندن"
                : locale === "ar"
                  ? "تفعيل التخفيض"
                  : "Apply Campaign"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
