"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottleCard from "@/components/BottleCard";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { getBottles, getSessions } from "@/lib/api";
import type { Bottle, TastingSession } from "@/types";

type BottleWithMeta = Bottle & { rating: number | null; tasted_at: string | null };

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 px-6 py-5">
      <p className="text-xs text-stone-400 font-medium">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-800">{value}</p>
      {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  const { token } = useAuth();
  const [bottles, setBottles] = useState<BottleWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getBottles(token);
        const enriched = await Promise.all(
          raw.map(async (bottle) => {
            try {
              const sessions: TastingSession[] = await getSessions(token, bottle.id);
              const latest = sessions[0] ?? null;
              return {
                ...bottle,
                rating: latest ? latest.rating : null,
                tasted_at: latest ? latest.tasted_at : null,
              };
            } catch {
              return { ...bottle, rating: null, tasted_at: null };
            }
          })
        );
        setBottles(enriched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const totalBottles = bottles.length;
  const ratingsOnly = bottles.filter((b) => b.rating !== null).map((b) => b.rating as number);
  const avgRating = ratingsOnly.length > 0
    ? ratingsOnly.reduce((a, b) => a + b, 0) / ratingsOnly.length
    : null;

  const thisMonth = bottles.filter((b) => {
    if (!b.tasted_at) return false;
    const d = new Date(b.tasted_at);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const recent = [...bottles]
    .filter((b) => b.tasted_at)
    .sort((a, b) => new Date(b.tasted_at!).getTime() - new Date(a.tasted_at!).getTime())
    .slice(0, 6);

  const topRated = [...bottles]
    .filter((b) => b.rating !== null)
    .sort((a, b) => (b.rating as number) - (a.rating as number))
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
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

      {loading ? (
        <div className="text-center py-20 text-stone-400 text-sm">読み込み中...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="総ボトル数" value={`${totalBottles}本`} />
            <StatCard
              label="平均評価"
              value={avgRating !== null ? avgRating.toFixed(1) : "-"}
              sub="5点満点"
            />
            <StatCard label="今月の記録" value={`${thisMonth}回`} />
          </div>

          {recent.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-stone-700">最近の記録</h2>
                <Link href="/bottles" className="text-sm text-amber-700 hover:text-amber-900 transition">
                  すべて見る →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {recent.map((bottle) => (
                  <BottleCard
                    key={bottle.id}
                    id={bottle.id}
                    name={bottle.name}
                    distillery={bottle.distillery}
                    region={bottle.region}
                    abv={bottle.abv ?? undefined}
                    rating={bottle.rating ?? undefined}
                    tasted_at={bottle.tasted_at ?? undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {topRated.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-semibold text-stone-700">評価の高いボトル</h2>
              <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                {topRated.map((bottle, i) => (
                  <div key={bottle.id} className="flex items-center gap-4 px-5 py-4">
                    <span className="text-lg font-semibold text-stone-300 w-5 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{bottle.name}</p>
                      <p className="text-xs text-stone-400">{bottle.region}</p>
                    </div>
                    <StarRating rating={bottle.rating as number} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {totalBottles === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-20 text-center">
              <span className="text-5xl">🥃</span>
              <p className="mt-4 text-sm font-medium text-stone-600">まだ記録がありません</p>
              <Link
                href="/bottles/new"
                className="mt-6 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
              >
                + 新規記録
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
