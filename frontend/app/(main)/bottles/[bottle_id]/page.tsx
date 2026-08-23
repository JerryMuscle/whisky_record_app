"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { getBottle, getSessions } from "@/lib/api";
import type { Bottle, TastingSession } from "@/types";

const FLAVOR_LABELS: { key: keyof TastingSession; label: string }[] = [
  { key: "f_smoky", label: "スモーキー" },
  { key: "f_fruity", label: "フルーティー" },
  { key: "f_floral", label: "フローラル" },
  { key: "f_spicy", label: "スパイシー" },
  { key: "f_woody", label: "ウッディー" },
];

function FlavorBar({ label, value }: { label: string; value: number | null }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-stone-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(v / 5) * 100}%` }} />
      </div>
      <span className="w-4 text-xs text-stone-400 text-right">{v}</span>
    </div>
  );
}

export default function BottleDetailPage({
  params,
}: {
  params: Promise<{ bottle_id: string }>;
}) {
  const { bottle_id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [bottle, setBottle] = useState<Bottle | null>(null);
  const [sessions, setSessions] = useState<TastingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, s] = await Promise.all([
          getBottle(token, bottle_id),
          getSessions(token, bottle_id),
        ]);
        setBottle(b);
        setSessions(s);
      } catch (e) {
        console.error(e);
        router.push("/bottles");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, bottle_id]);

  if (loading) {
    return <div className="text-center py-20 text-stone-400 text-sm">読み込み中...</div>;
  }
  if (!bottle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <nav className="text-xs text-stone-400 flex items-center gap-1.5">
        <Link href="/bottles" className="hover:text-stone-600 transition">記録一覧</Link>
        <span>/</span>
        <span className="text-stone-600">{bottle.name}</span>
      </nav>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="flex gap-6 p-6">
          <div className="w-32 h-40 shrink-0 rounded-lg bg-amber-50 flex items-center justify-center overflow-hidden">
            {bottle.photo_url ? (
              <img src={bottle.photo_url} alt={bottle.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl">🥃</span>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-stone-400">
                {bottle.region}{bottle.bottle_type ? ` · ${bottle.bottle_type}` : ""}
              </p>
              <h1 className="mt-1 text-xl font-semibold text-stone-800">{bottle.name}</h1>
              <p className="text-sm text-stone-500">{bottle.distillery}</p>
            </div>
            <div className="flex gap-4 text-sm text-stone-600">
              {bottle.abv && (
                <span className="bg-stone-100 rounded-md px-2.5 py-1 text-xs">{bottle.abv}%</span>
              )}
              {bottle.price && (
                <span className="bg-stone-100 rounded-md px-2.5 py-1 text-xs">
                  ¥{Number(bottle.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-t border-stone-100 px-6 py-3 bg-stone-50">
          <Link
            href={`/bottles/${bottle.id}/sessions/new`}
            className="rounded-lg bg-amber-800 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-900 transition"
          >
            + セッション追加
          </Link>
          <Link
            href={`/bottles/${bottle.id}/edit`}
            className="rounded-lg border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 transition"
          >
            編集
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-stone-700">
          テイスティング記録
          <span className="ml-2 text-sm font-normal text-stone-400">({sessions.length}件)</span>
        </h2>

        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white py-12 text-center">
            <p className="text-sm text-stone-400">まだ記録がありません</p>
            <Link
              href={`/bottles/${bottle.id}/sessions/new`}
              className="mt-4 inline-block rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
            >
              + セッション追加
            </Link>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-stone-400">
                    {new Date(session.tasted_at).toLocaleDateString("ja-JP")}
                  </p>
                  <StarRating rating={session.rating} />
                </div>
                <div className="flex items-center gap-2">
                  {session.want_again && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                      また飲みたい
                    </span>
                  )}
                  <Link
                    href={`/bottles/${bottle.id}/sessions/${session.id}/edit`}
                    className="text-xs text-stone-400 hover:text-stone-600 transition"
                  >
                    編集
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {session.serving_style && (
                  <span className="text-xs bg-stone-100 text-stone-600 rounded-md px-2.5 py-1">
                    {session.serving_style}
                  </span>
                )}
                {session.situation && (
                  <span className="text-xs bg-stone-100 text-stone-600 rounded-md px-2.5 py-1">
                    {session.situation}
                  </span>
                )}
                {session.location && (
                  <span className="text-xs bg-stone-100 text-stone-600 rounded-md px-2.5 py-1">
                    📍 {session.location}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-stone-500">フレーバーノート</p>
                {FLAVOR_LABELS.map(({ key, label }) => (
                  <FlavorBar key={key} label={label} value={session[key] as number | null} />
                ))}
              </div>

              {session.flavor_tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {session.flavor_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {session.memo && (
                <p className="text-sm text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-3">
                  {session.memo}
                </p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
