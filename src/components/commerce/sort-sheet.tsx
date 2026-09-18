"use client";

import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n/provider";

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

interface SortSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export function SortSheet({
  open,
  onOpenChange,
  currentSort,
  onSelectSort,
}: SortSheetProps) {
  const { locale } = useI18n();

  const options: { id: SortOption; label: string }[] = [
    {
      id: "newest",
      label:
        locale === "ku" ? "نوێترین" : locale === "ar" ? "الأحدث" : "Newest",
    },
    {
      id: "price-asc",
      label:
        locale === "ku"
          ? "ئەرزانترین"
          : locale === "ar"
            ? "الأقل سعراً"
            : "Price: Low to High",
    },
    {
      id: "price-desc",
      label:
        locale === "ku"
          ? "گرانترین"
          : locale === "ar"
            ? "الأعلى سعراً"
            : "Price: High to Low",
    },
    {
      id: "popular",
      label:
        locale === "ku"
          ? "بەناوبانگترین"
          : locale === "ar"
            ? "الأكثر طلباً"
            : "Most Popular",
    },
  ];

  return (
    <>
      {/* 1. Mobile Drawer (bottom sheet) */}
      <div className="sm:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl border-t border-border bg-card p-0 text-card-foreground max-w-md mx-auto"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3.5 mb-2" />

            <SheetHeader className="px-5 pb-3 text-start">
              <SheetTitle className="text-base font-bold text-foreground">
                {locale === "ku" ? "ڕیزکردن" : locale === "ar" ? "ترتيب" : "Sort By"}
              </SheetTitle>
            </SheetHeader>

            <div className="divide-y divide-border border-t border-border pb-6">
              {options.map((opt) => {
                const isSelected = opt.id === currentSort;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectSort(opt.id);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <span
                      className={
                        isSelected ? "font-bold text-foreground" : "text-muted-foreground"
                      }
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-foreground stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* 2. Desktop Dialog Modal (centered popup instead of full bottom sheet) */}
      <div className="hidden sm:block">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-xs bg-card border border-border text-card-foreground p-0 rounded-2xl overflow-hidden shadow-2xl">
            <DialogHeader className="p-4 border-b border-border text-start">
              <DialogTitle className="text-base font-bold text-foreground">
                {locale === "ku" ? "ڕیزکردن" : locale === "ar" ? "ترتيب" : "Sort By"}
              </DialogTitle>
            </DialogHeader>

            <div className="divide-y divide-border py-1">
              {options.map((opt) => {
                const isSelected = opt.id === currentSort;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectSort(opt.id);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <span
                      className={
                        isSelected ? "font-bold text-foreground" : "text-muted-foreground"
                      }
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-foreground stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
