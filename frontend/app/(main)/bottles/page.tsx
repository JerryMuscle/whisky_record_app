import Link from "next/link";
import BottleCard from "@/components/BottleCard";

const MOCK_BOTTLES = [
  { id: "1", name: "Laphroaig 10 Years", distillery: "Laphroaig", region: "アイラ", abv: 40, rating: 4.2, tasted_at: "2026-06-01" },
  { id: "2", name: "The Macallan 18", distillery: "The Macallan", region: "スペイサイド", abv: 43, rating: 4.8, tasted_at: "2026-05-28" },
  { id: "3", name: "山崎 12年", distillery: "山崎蒸溜所", region: "ジャパニーズ", abv: 43, rating: 4.5, tasted_at: "2026-05-20" },
  { id: "4", name: "Glenfiddich 15 Years", distillery: "Glenfiddich", region: "スペイサイド", abv: 40, rating: 3.9, tasted_at: "2026-05-15" },
  { id: "5", name: "Ardbeg 10", distillery: "Ardbeg", region: "アイラ", abv: 46, rating: 4.3, tasted_at: "2026-05-10" },
  { id: "6", name: "余市 NAS", distillery: "余市蒸溜所", region: "ジャパニーズ", abv: 45, rating: 4.1, tasted_at: "2026-05-05" },
  { id: "7", name: "Bowmore 18 Years", distillery: "Bowmore", region: "アイラ", abv: 43, rating: 4.0, tasted_at: "2026-04-30" },
  { id: "8", name: "Talisker 10 Years", distillery: "Talisker", region: "アイランズ", abv: 45.8, rating: 4.4, tasted_at: "2026-04-22" },
  { id: "9", name: "Highland Park 12", distillery: "Highland Park", region: "アイランズ", abv: 40, rating: 3.8, tasted_at: "2026-04-15" },
  { id: "10", name: "Glenlivet 12", distillery: "The Glenlivet", region: "スペイサイド", abv: 40, rating: 3.7, tasted_at: "2026-04-10" },
  { id: "11", name: "Knob Creek Rye", distillery: "Beam Suntory", region: "バーボン", abv: 57.5, rating: 3.9, tasted_at: "2026-04-05" },
  { id: "12", name: "白州 12年", distillery: "白州蒸溜所", region: "ジャパニーズ", abv: 43, rating: 4.6, tasted_at: "2026-03-28" },
];

export default function BottlesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">
            記録一覧
            <span className="ml-2 text-base font-normal text-stone-400">
              ({MOCK_BOTTLES.length})
            </span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">登録済みのすべてのボトル</p>
        </div>
        <Link
          href="/bottles/new"
          className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
        >
          + 新規記録
        </Link>
      </div>

      {/* ボトルグリッド */}
      {MOCK_BOTTLES.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MOCK_BOTTLES.map((bottle) => (
            <BottleCard key={bottle.id} {...bottle} />
          ))}
        </div>
      ) : (
        /* 空状態 */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-20 text-center">
          <span className="text-5xl">🥃</span>
          <p className="mt-4 text-sm font-medium text-stone-600">まだ記録がありません</p>
          <p className="mt-1 text-xs text-stone-400">最初のウイスキーを登録しましょう</p>
          <Link
            href="/bottles/new"
            className="mt-6 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
          >
            + 新規記録
          </Link>
        </div>
      )}
    </div>
  );
}
