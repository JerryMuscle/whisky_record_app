import Link from "next/link";
import StarRating from "@/components/StarRating";

type Props = {
  id: string;
  name: string;
  distillery: string;
  region: string;
  abv: number | null;
  rating: number;
  tasted_at: string;
  photo_url?: string | null;
};

export default function BottleCard({
  id,
  name,
  distillery,
  region,
  abv,
  rating,
  tasted_at,
  photo_url,
}: Props) {
  return (
    <Link href={`/bottles/${id}`}>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* 画像エリア */}
        <div className="h-40 bg-amber-50 flex items-center justify-center overflow-hidden">
          {photo_url ? (
            <img src={photo_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl">🥃</span>
          )}
        </div>
        {/* 情報エリア */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-stone-400">{region}</p>
          <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2">
            {name}
          </h3>
          <p className="text-xs text-stone-500">{distillery}</p>
          <div className="flex items-center justify-between pt-1">
            <StarRating rating={rating} />
            {abv !== null && (
              <span className="text-xs text-stone-400">{abv}%</span>
            )}
          </div>
          <p className="text-xs text-stone-400">{tasted_at}</p>
        </div>
      </div>
    </Link>
  );
}
