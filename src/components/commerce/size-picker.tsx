"use client";

import { formatSize } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";

interface SizePickerProps {
  sizes: number[];
  soldOutSizes?: number[];
  selectedSize: number | null;
  onSelectSize: (size: number) => void;
  className?: string;
  sizeClassName?: string;
}

export function SizePicker({
  sizes,
  soldOutSizes = [],
  selectedSize,
  onSelectSize,
  className = "",
  sizeClassName = "w-[42px] h-[42px] text-sm",
}: SizePickerProps) {
  const { locale } = useI18n();

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {sizes.map((size) => {
        const isSoldOut = soldOutSizes.includes(size);
        const isSelected = selectedSize === size;

        if (isSoldOut) {
          return (
            <button
              key={size}
              type="button"
              disabled
              title={
                locale === "ku"
                  ? "ئەم قەبارەیە نەماوە"
                  : locale === "ar"
                    ? "هذا المقاس نفد"
                    : "Size sold out"
              }
              className={`slash-soldout flex-none rounded-lg border border-border flex items-center justify-center font-medium text-muted-foreground/40 cursor-not-allowed select-none bg-secondary/30 ${sizeClassName}`}
            >
              {formatSize(size)}
            </button>
          );
        }

        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelectSize(size)}
            className={`flex-none rounded-lg border transition-all select-none flex items-center justify-center font-semibold ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm scale-[1.03]"
                : "border-border text-foreground hover:border-foreground/50 hover:bg-secondary"
            } ${sizeClassName}`}
          >
            {formatSize(size)}
          </button>
        );
      })}
    </div>
  );
}
