import Link from "next/link";
import StarRating from "@/components/StarRating";

const MOCK_BOTTLE = {
  id: "1",
  name: "Laphroaig 10 Years",
  distillery: "Laphroaig",
  region: "アイラ",
  bottle_type: "シングルモルト",
  abv: 40,
  price: 5500,
  photo_url: null,
};

const MOCK_SESSIONS = [
  {
    id: "s1",
    tasted_at: "2026-06-01",
    rating: 4.2,
    serving_style: "ストレート",
    location: "自宅",
    situation: "自宅",
    memo: "スモーキーさが心地よく、後味に甘みが残る。ピートの香りが特徴的。",
    want_again: true,
    f_smoky: 5,
    f_fruity: 2,
    f_floral: 1,
    f_spicy: 3,
    f_woody: 2,
    flavor_tags: [{ id: "t1", name: "ピーティー" }, { id: "t2", name: "スモーキー" }],
    photo_urls: [
      "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=300",
      "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300",
    ],
  },
  {
    id: "s2",
    tasted_at: "2026-04-10",
    rating: 4.0,
    serving_style: "ロック",
    location: "バー",
    situation: "バー",
    memo: "氷で少し薄まるが、フルーティーさが引き立つ。",
    want_again: true,
    f_smoky: 4,
    f_fruity: 3,
    f_floral: 1,
    f_spicy: 2,
    f_woody: 2,
    flavor_tags: [{ id: "t1", name: "ピーティー" }],
    photo_urls: [],
  },
];

const FLAVOR_LABELS: { key: keyof typeof MOCK_SESSIONS[0]; label: string }[] = [
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
        <div
          className="h-full bg-amber-500 rounded-full"
          style={{ width: `${(v / 5) * 100}%` }}
        />
      </div>
      <span className="w-4 text-xs text-stone-400 text-right">{v}</span>
    </div>
  );
}

export default async function BottleDetailPage({
  params,
}: {
  params: Promise<{ bottle_id: string }>;
}) {
  await params;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* パンくず */}
      <nav className="text-xs text-stone-400 flex items-center gap-1.5">
        <Link href="/bottles" className="hover:text-stone-600 transition">記録一覧</Link>
        <span>/</span>
        <span className="text-stone-600">{MOCK_BOTTLE.name}</span>
      </nav>

      {/* ボトル基本情報 */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="flex gap-6 p-6">
          {/* 画像 */}
          <div className="w-32 h-40 shrink-0 rounded-lg bg-amber-50 flex items-center justify-center">
            <span className="text-5xl">🥃</span>
          </div>

          {/* 情報 */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-stone-400">{MOCK_BOTTLE.region} · {MOCK_BOTTLE.bottle_type}</p>
              <h1 className="mt-1 text-xl font-semibold text-stone-800">{MOCK_BOTTLE.name}</h1>
              <p className="text-sm text-stone-500">{MOCK_BOTTLE.distillery}</p>
            </div>
            <div className="flex gap-4 text-sm text-stone-600">
              {MOCK_BOTTLE.abv && (
                <span className="bg-stone-100 rounded-md px-2.5 py-1 text-xs">
                  {MOCK_BOTTLE.abv}%
                </span>
              )}
              {MOCK_BOTTLE.price && (
                <span className="bg-stone-100 rounded-md px-2.5 py-1 text-xs">
                  ¥{MOCK_BOTTLE.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2 border-t border-stone-100 px-6 py-3 bg-stone-50">
          <Link
            href={`/bottles/${MOCK_BOTTLE.id}/sessions/new`}
            className="rounded-lg bg-amber-800 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-900 transition"
          >
            + セッション追加
          </Link>
          <Link
            href={`/bottles/${MOCK_BOTTLE.id}/edit`}
            className="rounded-lg border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 transition"
          >
            編集
          </Link>
        </div>
      </div>

      {/* テイスティングセッション一覧 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-stone-700">
          テイスティング記録
          <span className="ml-2 text-sm font-normal text-stone-400">({MOCK_SESSIONS.length}件)</span>
        </h2>

        {MOCK_SESSIONS.map((session) => (
          <div key={session.id} className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
            {/* セッションヘッダー */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-stone-400">{session.tasted_at}</p>
                <StarRating rating={session.rating} />
              </div>
              <div className="flex items-center gap-2">
                {session.want_again && (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                    また飲みたい
                  </span>
                )}
                <Link
                  href={`/bottles/${MOCK_BOTTLE.id}/sessions/${session.id}/edit`}
                  className="text-xs text-stone-400 hover:text-stone-600 transition"
                >
                  編集
                </Link>
              </div>
            </div>

            {/* メタ情報 */}
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

            {/* フレーバーノート */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-stone-500">フレーバーノート</p>
              {FLAVOR_LABELS.map(({ key, label }) => (
                <FlavorBar
                  key={key}
                  label={label}
                  value={session[key] as number | null}
                />
              ))}
            </div>

            {/* フレーバータグ */}
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

            {/* 写真 */}
            {session.photo_urls.length > 0 && (
              <div className="flex gap-2">
                {session.photo_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`写真 ${i + 1}`}
                    className="w-24 h-24 rounded-lg object-cover border border-stone-200"
                  />
                ))}
              </div>
            )}

            {/* メモ */}
            {session.memo && (
              <p className="text-sm text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-3">
                {session.memo}
              </p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
