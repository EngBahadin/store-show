"use client";

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
import { formatSize } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";

interface SizeGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SizeGuideDialog({ open, onOpenChange }: SizeGuideDialogProps) {
  const { locale } = useI18n();

  const chart = [
    { eu: 36, cm: "22.5 cm" },
    { eu: 37, cm: "23.2 cm" },
    { eu: 38, cm: "24.0 cm" },
    { eu: 39, cm: "24.8 cm" },
    { eu: 40, cm: "25.5 cm" },
    { eu: 41, cm: "26.0 cm" },
    { eu: 42, cm: "26.8 cm" },
    { eu: 43, cm: "27.5 cm" },
    { eu: 44, cm: "28.2 cm" },
    { eu: 45, cm: "29.0 cm" },
    { eu: 46, cm: "29.8 cm" },
    { eu: 47, cm: "30.5 cm" },
    { eu: 48, cm: "31.2 cm" },
  ];

  const content = (
    <>
      <div className="flex justify-between px-5 py-2.5 border-t border-border text-xs text-muted-foreground font-semibold bg-secondary/50">
        <span>
          {locale === "ku"
            ? "قەبارەی ئەوروپی"
            : locale === "ar"
              ? "المقاس الأوروبي"
              : "EU Size"}
        </span>
        <span>
          {locale === "ku"
            ? "درێژی پێ"
            : locale === "ar"
              ? "طول القدم"
              : "Foot Length"}
        </span>
      </div>

      <div className="divide-y divide-border overflow-y-auto max-h-[60vh]">
        {chart.map((row) => (
          <div
            key={row.eu}
            className="flex justify-between items-center px-5 py-3 text-sm"
          >
            <span className="font-bold text-foreground">
              {formatSize(row.eu)}
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              {row.cm}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* 1. Mobile Drawer */}
      <div className="sm:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl border-t border-border bg-card p-0 text-card-foreground max-w-md mx-auto max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3.5 mb-2" />
            <SheetHeader className="px-5 pb-3 text-start">
              <div className="flex items-baseline justify-between">
                <SheetTitle className="text-base font-bold text-foreground">
                  {locale === "ku"
                    ? "ڕێنمایی قەبارە"
                    : locale === "ar"
                      ? "دليل المقاسات"
                      : "Size Guide"}
                </SheetTitle>
                <span className="text-xs text-muted-foreground">
                  {locale === "ku"
                    ? "درێژی پێ بە سانتیمەتر"
                    : locale === "ar"
                      ? "طول القدم بالسنتيمتر"
                      : "Foot length in cm"}
                </span>
              </div>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      </div>

      {/* 2. Desktop Centered Dialog */}
      <div className="hidden sm:block">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md bg-card border border-border text-card-foreground p-0 rounded-2xl overflow-hidden shadow-2xl">
            <DialogHeader className="p-5 border-b border-border text-start">
              <div className="flex items-baseline justify-between pe-6">
                <DialogTitle className="text-base font-bold text-foreground">
                  {locale === "ku"
                    ? "ڕێنمایی قەبارە"
                    : locale === "ar"
                      ? "دليل المقاسات"
                      : "Size Guide"}
                </DialogTitle>
                <span className="text-xs text-muted-foreground">
                  {locale === "ku"
                    ? "درێژی پێ بە سانتیمەتر"
                    : locale === "ar"
                      ? "طول القدم بالسنتيمتر"
                      : "Foot length in cm"}
                </span>
              </div>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
