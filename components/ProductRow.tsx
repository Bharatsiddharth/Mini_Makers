import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <div key={p.id} className="w-44 shrink-0 sm:w-auto">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
