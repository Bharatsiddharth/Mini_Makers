import {
  Gift,
  Gem,
  Link2,
  Sparkles,
  Flower2,
  CircleDashed,
  KeyRound,
  CircleDot,
  Layers,
  PackageOpen,
  StickyNote,
  LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  hamper: Gift,
  pendant: Gem,
  bracelet: Link2,
  earring: Sparkles,
  jhumka: Flower2,
  ring: CircleDashed,
  keychain: KeyRound,
  scrunchie: CircleDot,
  clip: Layers,
  box: PackageOpen,
  card: StickyNote,
};

export default function ProductVisual({
  image,
  imageUrl,
  gradient,
  className = "",
}: {
  image: string;
  imageUrl?: string;
  gradient: [string, string];
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  const Icon = ICONS[image] ?? Gift;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 80% 85%, black 0, transparent 40%)",
        }}
      />
      <Icon className="relative h-10 w-10 text-white/90 drop-shadow-sm" strokeWidth={1.5} />
    </div>
  );
}
