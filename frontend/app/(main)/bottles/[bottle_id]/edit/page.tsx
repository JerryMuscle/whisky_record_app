"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Label from "@/components/Label";
import { input, select } from "@/lib/styles";
import { useAuth } from "@/contexts/AuthContext";
import { getBottle, updateBottle, deleteBottle } from "@/lib/api";

const REGIONS = ["スコッチ", "バーボン", "ジャパニーズ", "アイリッシュ", "カナディアン", "その他"];
const BOTTLE_TYPES = ["シングルモルト", "ブレンデッド", "シングルグレーン", "バーボン", "ライ", "その他"];

export default function EditBottlePage({
  params,
}: {
  params: Promise<{ bottle_id: string }>;
}) {
  const { bottle_id } = use(params);
  const { token } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [distillery, setDistillery] = useState("");
  const [region, setRegion] = useState("");
  const [bottleType, setBottleType] = useState("");
  const [abv, setAbv] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const bottle = await getBottle(token, bottle_id);
        setName(bottle.name);
        setDistillery(bottle.distillery);
        setRegion(bottle.region);
        setBottleType(bottle.bottle_type ?? "");
        setAbv(bottle.abv != null ? String(bottle.abv) : "");
        setPrice(bottle.price != null ? String(bottle.price) : "");
      } catch (e) {
        console.error(e);
        router.push("/bottles");
      }
    })();
  }, [token, bottle_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateBottle(token, bottle_id, {
        name,
        distillery,
        region,
        bottle_type: bottleType || undefined,
        abv: abv ? Number(abv) : undefined,
        price: price ? Number(price) : undefined,
      });
      router.push(`/bottles/${bottle_id}`);
    } catch (err) {
      console.error(err);
      setError("更新に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("このボトルを削除しますか？関連するテイスティング記録もすべて削除されます。")) return;
    try {
      await deleteBottle(token, bottle_id);
      router.push("/bottles");
    } catch (err) {
      console.error(err);
      setError("削除に失敗しました。");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-xs text-stone-400 flex items-center gap-1.5 mb-2">
            <Link href="/bottles" className="hover:text-stone-600 transition">記録一覧</Link>
            <span>/</span>
            <Link href={`/bottles/${bottle_id}`} className="hover:text-stone-600 transition">
              {MOCK_BOTTLE.name}
            </Link>
            <span>/</span>
            <span className="text-stone-600">編集</span>
          </nav>
          <h1 className="text-2xl font-semibold text-stone-800">記録編集</h1>
          <p className="mt-1 text-sm text-stone-500">ボトルの基本情報を編集します</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
          <div className="space-y-1.5">
            <Label required>銘柄名</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>産地</Label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className={select}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label required>蒸留所</Label>
              <input
                type="text"
                value={distillery}
                onChange={(e) => setDistillery(e.target.value)}
                className={input}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>タイプ</Label>
              <select value={bottleType} onChange={(e) => setBottleType(e.target.value)} className={select}>
                <option value="">選択してください</option>
                {BOTTLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>アルコール度数（%）</Label>
              <input
                type="number"
                value={abv}
                onChange={(e) => setAbv(e.target.value)}
                min={0}
                max={100}
                step={0.1}
                className={input}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>価格（円）</Label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              className={input}
            />
          </div>

          {/* 写真 */}
          <div className="space-y-1.5">
            <Label>ボトル写真</Label>
            <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:bg-stone-100 transition">
              <div className="text-center">
                <p className="text-sm text-stone-400">クリックして画像を変更</p>
                <p className="text-xs text-stone-300 mt-1">JPEG / PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* 削除ゾーン */}
        <div className="bg-red-50 rounded-xl border border-red-200 p-5 space-y-2">
          <p className="text-sm font-medium text-red-700">ボトルを削除</p>
          <p className="text-xs text-red-500">
            削除すると紐づくすべてのテイスティング記録も削除されます。この操作は取り消せません。
          </p>
          <button
            type="button"
            className="mt-2 rounded-lg border border-red-300 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
            onClick={handleDelete}
          >
            このボトルを削除する
          </button>
        </div>

        {/* エラー */}
        {error && <p className="text-sm text-red-600 text-right">{error}</p>}

        {/* 送信ボタン */}
        <div className="flex justify-end gap-3">
          <Link
            href={`/bottles/${bottle_id}`}
            className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-amber-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition disabled:opacity-50"
          >
            {submitting ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
