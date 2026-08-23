"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottleCard from "@/components/BottleCard";
import { useAuth } from "@/contexts/AuthContext";
import { getBottles, getSessions } from "@/lib/api";
import type { Bottle, TastingSession } from "@/types";

type BottleWithMeta = Bottle & { rating: number | null; tasted_at: string | null };

export default function BottlesPage() {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">
            記録一覧
            {!loading && (
              <span className="ml-2 text-base font-normal text-stone-400">
                ({bottles.length})
              </span>
            )}
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

      {loading ? (
        <div className="text-center py-20 text-stone-400 text-sm">読み込み中...</div>
      ) : bottles.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bottles.map((bottle) => (
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
      ) : (
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
