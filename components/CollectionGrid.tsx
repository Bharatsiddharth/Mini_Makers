import Link from "next/link";
import { Collection } from "@/lib/types";

export default function CollectionGrid({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {collections.map((c) => (
        <Link key={c.slug} href={`/collections/${c.slug}`} className="group hover-lift">
          <div
            className="relative aspect-square rounded-2xl"
            style={{
              backgroundImage: `linear-gradient(150deg, ${c.gradient[0]}, ${c.gradient[1]})`,
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-black/35 via-transparent to-transparent p-3">
              <p className="font-display text-sm text-white sm:text-base">{c.name}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
