import Link from "next/link";
import BottleCard from "@/components/BottleCard";
import StarRating from "@/components/StarRating";

const MOCK_STATS = {
  totalBottles: 12,
  avgRating: 4.2,
  thisMonthCount: 3,
};

const MOCK_RECENT = [
  { id: "1", name: "Laphroaig 10 Years", distillery: "Laphroaig", region: "アイラ", abv: 40, rating: 4.2, tasted_at: "2026-06-01" },
  { id: "2", name: "The Macallan 18", distillery: "The Macallan", region: "スペイサイド", abv: 43, rating: 4.8, tasted_at: "2026-05-28" },
  { id: "3", name: "山崎 12年", distillery: "山崎蒸溜所", region: "ジャパニーズ", abv: 43, rating: 4.5, tasted_at: "2026-05-20" },
  { id: "4", name: "Glenfiddich 15 Years", distillery: "Glenfiddich", region: "スペイサイド", abv: 40, rating: 3.9, tasted_at: "2026-05-15" },
  { id: "5", name: "Ardbeg 10", distillery: "Ardbeg", region: "アイラ", abv: 46, rating: 4.3, tasted_at: "2026-05-10" },
  { id: "6", name: "余市 NAS", distillery: "余市蒸溜所", region: "ジャパニーズ", abv: 45, rating: 4.1, tasted_at: "2026-05-05" },
];

const MOCK_TOP_RATED = [
  { name: "The Macallan 18", region: "スペイサイド", rating: 4.8 },
  { name: "白州 12年", region: "ジャパニーズ", rating: 4.6 },
  { name: "山崎 12年", region: "ジャパニーズ", rating: 4.5 },
];

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 px-6 py-5">
      <p className="text-xs text-stone-400 font-medium">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-800">{value}</p>
      {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">ホーム</h1>
          <p className="mt-1 text-sm text-stone-500">コレクションの概要</p>
        </div>
        <Link
          href="/bottles/new"
          className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
        >
          + 新規記録
        </Link>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="総ボトル数"
          value={`${MOCK_STATS.totalBottles}本`}
        />
        <StatCard
          label="平均評価"
          value={MOCK_STATS.avgRating.toFixed(1)}
          sub="5点満点"
        />
        <StatCard
          label="今月の記録"
          value={`${MOCK_STATS.thisMonthCount}回`}
        />
      </div>

      {/* 最近の記録 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-700">最近の記録</h2>
          <Link
            href="/bottles"
            className="text-sm text-amber-700 hover:text-amber-900 transition"
          >
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {MOCK_RECENT.map((bottle) => (
            <BottleCard key={bottle.id} {...bottle} />
          ))}
        </div>
      </section>

      {/* 高評価トップ3 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-stone-700">評価の高いボトル</h2>
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {MOCK_TOP_RATED.map((bottle, i) => (
            <div key={bottle.name} className="flex items-center gap-4 px-5 py-4">
              <span className="text-lg font-semibold text-stone-300 w-5 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{bottle.name}</p>
                <p className="text-xs text-stone-400">{bottle.region}</p>
              </div>
              <StarRating rating={bottle.rating} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
