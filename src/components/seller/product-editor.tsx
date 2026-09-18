"use client";

import { Camera, ChevronDown, ChevronUp, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BrandId, CategoryId, Gender, Product } from "@/data/products";
import { formatSize, toLatinDigits } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { useSeller } from "@/lib/store/seller-store";

const DEFAULT_SIZES = [38, 39, 40, 41, 42, 43, 44];
const DEFAULT_IMAGE = "adidas-x9000-l4-black-red";
const AVAILABLE_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

/** Keeps a money field to bare Latin digits, whatever script it was typed in. */
function onlyDigits(input: string) {
  return toLatinDigits(input).replace(/\D/g, "");
}

interface ProductEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: Product | null;
}

export function ProductEditor({
  open,
  onOpenChange,
  productToEdit,
}: ProductEditorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg bg-card border border-border text-card-foreground p-0 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Mounted only while open, and keyed by the product being edited, so
            the fields below can initialise straight from `productToEdit`
            instead of being reset by an effect.
            https://react.dev/learn/you-might-not-need-an-effect */}
        {open && (
          <ProductEditorForm
            key={productToEdit?.slug ?? "__new__"}
            onOpenChange={onOpenChange}
            productToEdit={productToEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProductEditorForm({
  onOpenChange,
  productToEdit,
}: Omit<ProductEditorProps, "open">) {
  const { locale } = useI18n();
  const { addProduct, updateProduct, deleteProduct } = useSeller();

  const isEditing = !!productToEdit;

  const [name, setName] = useState(productToEdit?.name ?? "");
  const [price, setPrice] = useState(
    productToEdit && productToEdit.price > 0 ? String(productToEdit.price) : "",
  );
  const [compareAt, setCompareAt] = useState(
    productToEdit?.compareAt ? String(productToEdit.compareAt) : "",
  );
  const [selectedSizes, setSelectedSizes] = useState<number[]>(
    productToEdit?.sizes ?? DEFAULT_SIZES,
  );
  const [gender, setGender] = useState<Gender>(productToEdit?.gender ?? "men");
  // No picker for these in the form yet — they carry through unchanged on an
  // edit, and fall back to sensible defaults on a new listing.
  const category: CategoryId = productToEdit?.category ?? "lifestyle";
  const brand: BrandId = productToEdit?.brand ?? "adidas";
  const [videoUrl, setVideoUrl] = useState(productToEdit?.videoUrl ?? "");
  const [selectedImage, setSelectedImage] = useState(
    productToEdit?.slug ?? DEFAULT_IMAGE,
  );
  const [showMore, setShowMore] = useState(false);

  const availableSizesList = AVAILABLE_SIZES;


  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b),
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error(
        locale === "ku"
          ? "تکایە ناوی کاڵا بنووسە"
          : "Please enter product name",
      );
      return;
    }

    const numericPrice = parseInt(price, 10) || 0;
    const numericCompareAt = compareAt ? parseInt(compareAt, 10) : undefined;

    if (isEditing && productToEdit) {
      updateProduct(productToEdit.slug, {
        name,
        price: numericPrice,
        compareAt: numericCompareAt,
        sizes: selectedSizes,
        gender,
        category,
        brand,
        videoUrl: videoUrl || undefined,
      });
      toast.success(
        locale === "ku" ? "گۆڕانکارییەکان پاشەکەوت کران" : "Product updated",
      );
    } else {
      const newProduct: Product = {
        slug: selectedImage, // Use selected placeholder asset
        name,
        brand,
        category,
        gender,
        code: `RV-${Math.floor(2000 + Math.random() * 900)}`,
        price: numericPrice,
        compareAt: numericCompareAt,
        colorway: {
          en: "Custom Colorway",
          ku: "ڕەنگی تایبەت",
          ar: "لون مخصص",
        },
        description: {
          en: "Fresh addition to the RAVEN collection.",
          ku: "بەرهەمێکی نوێ بۆ کۆلێکشنەکە.",
          ar: "إضافة جديدة لمجموعة ريفن.",
        },
        sizes: selectedSizes,
        soldOutSizes: [],
        stock: selectedSizes.length,
        rating: 5.0,
        reviews: 1,
        addedAt: new Date().toISOString(),
        popularity: 90,
        videoUrl: videoUrl || undefined,
      };
      addProduct(newProduct);
      toast.success(
        locale === "ku" ? "کاڵای نوێ زیادکرا" : "Product added to store",
      );
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (productToEdit) {
      deleteProduct(productToEdit.slug);
      toast.success(locale === "ku" ? "کاڵاکە سڕایەوە" : "Product deleted");
      onOpenChange(false);
    }
  };

  return (
    <>
        <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between text-start">
          <DialogTitle className="text-base font-bold text-foreground">
            {isEditing
              ? locale === "ku"
                ? "دەستکاری کاڵا"
                : locale === "ar"
                  ? "تعديل المنتج"
                  : "Edit Product"
              : locale === "ku"
                ? "زیادکردنی کاڵا"
                : locale === "ar"
                  ? "إضافة منتج"
                  : "Add Product"}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={
              locale === "ku" ? "داخستن" : locale === "ar" ? "إغلاق" : "Close"
            }
            className="-me-1 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Photo Upload area (Screen 12) */}
          {isEditing ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border bg-secondary">
              <Image
                src={`/products/${selectedImage}.webp`}
                alt="Product"
                fill
                className="object-contain p-2"
              />
              <button
                type="button"
                className="absolute bottom-2.5 end-2.5 bg-background/90 border border-border text-foreground text-xs px-3 py-1 rounded-full backdrop-blur-xs font-semibold shadow-xs"
              >
                {locale === "ku" ? "گۆڕینی وێنە" : "Change photo"}
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-xl p-5 text-center flex flex-col items-center gap-3 bg-secondary/20">
              <div className="text-xs font-bold text-foreground">
                {locale === "ku" ? "وێنەی کاڵا" : "Product Photo"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {locale === "ku"
                  ? "پێویستە — بەبێ وێنە پاشەکەوت ناکرێت"
                  : "Required — photo drives catalog display"}
              </div>
              <div className="flex gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage("adidas-x9000-l4-black-red")
                  }
                  className="flex-1 h-11 border border-border rounded-full flex items-center justify-center gap-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>{locale === "ku" ? "کامێرا" : "Camera"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage("hoka-bondi-8-black")}
                  className="flex-1 h-11 border border-border rounded-full flex items-center justify-center gap-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>{locale === "ku" ? "گەلەری" : "Gallery"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Product Name Input */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">
              {locale === "ku" ? "ناوی کاڵا" : "Product Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nike Air Max, Jordan 4..."
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Price Input */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">
              {locale === "ku" ? "نرخ (د.ع)" : "Price (IQD)"}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={price}
                onChange={(e) => setPrice(onlyDigits(e.target.value))}
                placeholder="65000"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground text-start focus:outline-none focus:border-primary transition-colors"
              />
              <span className="absolute top-2.5 end-3 text-xs text-muted-foreground">
                {locale === "en" ? "IQD" : "د.ع"}
              </span>
            </div>
          </div>

          {/* Sizes Toggle Grid (Screen 12) */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">
              {locale === "ku"
                ? "قەبارەکان (دەستنیشانی بکە)"
                : "Available Sizes"}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSizesList.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`w-9 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {formatSize(size)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable More Details Section (Screen 12) */}
          <div className="border-t border-b border-border py-3">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="w-full flex items-center justify-between text-xs font-semibold text-foreground"
            >
              <span>{locale === "ku" ? "وردەکاری زیاتر" : "More Details"}</span>
              {showMore ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {showMore && (
              <div className="pt-4 space-y-4">
                {/* Department / Gender */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {locale === "ku" ? "بەش" : "Gender"}
                  </span>
                  <div className="flex gap-2">
                    {(["men", "women", "unisex"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          gender === g
                            ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {g === "men"
                          ? locale === "ku"
                            ? "پیاوان"
                            : "Men"
                          : g === "women"
                            ? locale === "ku"
                              ? "ژنان"
                              : "Women"
                            : "Unisex"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compare at / Discount price */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    {locale === "ku"
                      ? "نرخی سەرەکی پێش داشکاندن (ئارەزوومەندانە)"
                      : "Original Price before Discount"}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={compareAt}
                    onChange={(e) => setCompareAt(onlyDigits(e.target.value))}
                    placeholder="85000"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground text-start focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Video Link */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    {locale === "ku"
                      ? "لینکی ڤیدیۆی کاڵا (ئارەزوومەندانە)"
                      : "Video Link (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    dir="ltr"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:opacity-90 transition-transform active:scale-[0.98] shadow-md"
            >
              {locale === "ku" ? "پاشەکەوتکردن" : "Save Product"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full h-11 border border-[#E01B24] text-[#E01B24] rounded-full font-semibold text-xs hover:bg-[#E01B24]/10 transition-colors"
              >
                {locale === "ku" ? "سڕینەوەی کاڵا" : "Delete Product"}
              </button>
            )}
          </div>
        </div>
    </>
  );
}
