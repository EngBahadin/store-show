import type { Product } from "@/data/products";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className = "" }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 ${className}`}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
