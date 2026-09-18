"use client";

import { ArrowLeft, Box, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DiscountCampaignModal } from "@/components/seller/discount-campaign";
import { InventoryManager } from "@/components/seller/inventory-manager";
import { ProductEditor } from "@/components/seller/product-editor";
import { SellerDashboard } from "@/components/seller/seller-dashboard";
import { StoreSettings } from "@/components/seller/store-settings";
import type { Product } from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";

type AdminTab = "dashboard" | "inventory" | "settings";

export default function AdminPage() {
  const { href, locale } = useI18n();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductEditorOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setProductEditorOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-foreground transition-colors pb-24 md:pb-12">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={href("/")}
            aria-label="Back to storefront"
            className="p-1.5 -ms-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-foreground">
              {locale === "ku"
                ? "داشبۆردی فرۆشیار"
                : locale === "ar"
                  ? "لوحة تحكم البائع"
                  : "Seller Command Center"}
            </h1>
            <p className="text-[11px] text-muted-foreground">
              RAVEN Store Sulaymaniyah · Live Catalog & Stats
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-secondary p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{locale === "ku" ? "سەرەکی" : "Dashboard"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inventory")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "inventory"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{locale === "ku" ? "کاڵاکانم" : "Products"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{locale === "ku" ? "ڕێکخستن" : "Settings"}</span>
          </button>
        </div>

        <Link
          href={href("/")}
          className="text-xs text-muted-foreground border border-border rounded-full px-3.5 py-1.5 hover:text-foreground hover:bg-secondary transition-colors self-start sm:self-auto"
        >
          {locale === "ku" ? "بینینی فرۆشگا" : "View Storefront"}
        </Link>
      </div>

      {/* Main Tab Content */}
      {activeTab === "dashboard" && (
        <SellerDashboard
          onOpenAddProduct={handleOpenAdd}
          onOpenDiscountModal={() => setDiscountModalOpen(true)}
          onNavigateToInventory={() => setActiveTab("inventory")}
        />
      )}

      {activeTab === "inventory" && (
        <InventoryManager
          onOpenAddProduct={handleOpenAdd}
          onEditProduct={handleOpenEdit}
        />
      )}

      {activeTab === "settings" && <StoreSettings />}

      {/* Modals */}
      <ProductEditor
        open={productEditorOpen}
        onOpenChange={setProductEditorOpen}
        productToEdit={editingProduct}
      />

      <DiscountCampaignModal
        open={discountModalOpen}
        onOpenChange={setDiscountModalOpen}
      />

      {/* Admin Bottom Navigation Bar (Mobile only) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border h-[60px] flex items-center justify-around safe-area-bottom shadow-lg transition-colors">
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors cursor-pointer ${
            activeTab === "dashboard"
              ? "text-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{locale === "ku" ? "سەرەکی" : "Dashboard"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors cursor-pointer ${
            activeTab === "inventory"
              ? "text-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Box className="w-4 h-4" />
          <span>{locale === "ku" ? "کاڵاکانم" : "Products"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors cursor-pointer ${
            activeTab === "settings"
              ? "text-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{locale === "ku" ? "ڕێکخستن" : "Settings"}</span>
        </button>
      </div>
    </div>
  );
}
