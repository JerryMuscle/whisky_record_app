"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SessionImageUpload from "@/components/SessionImageUpload";
import Label from "@/components/Label";
import { input, select } from "@/lib/styles";
import { useAuth } from "@/contexts/AuthContext";
import { createBottle, createSession, createTag } from "@/lib/api";

const REGIONS = ["スコッチ", "バーボン", "ジャパニーズ", "アイリッシュ", "カナディアン", "その他"];
const BOTTLE_TYPES = ["シングルモルト", "ブレンデッド", "シングルグレーン", "バーボン", "ライ", "その他"];
const SERVING_STYLES = ["ストレート", "ロック", "水割り", "ハイボール", "その他"];
const SITUATIONS = ["自宅", "バー", "イベント", "その他"];
const FLAVORS: { key: string; label: string }[] = [
  { key: "f_smoky", label: "スモーキー" },
  { key: "f_fruity", label: "フルーティー" },
  { key: "f_floral", label: "フローラル" },
  { key: "f_spicy", label: "スパイシー" },
  { key: "f_woody", label: "ウッディー" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-stone-700 pb-3 border-b border-stone-200">
      {children}
    </h2>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hovered || value) ? "text-amber-500" : "text-stone-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 self-center text-sm text-stone-500">{value > 0 ? `${value} / 5` : "未評価"}</span>
    </div>
  );
}

function FlavorSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-24 text-sm text-stone-600 shrink-0">{label}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-amber-600"
      />
      <span className="w-4 text-sm text-stone-500 text-right">{value}</span>
    </div>
  );
}

export default function NewBottlePage() {
  const { token } = useAuth();
  const router = useRouter();

  // ボトル情報
  const [name, setName] = useState("");
  const [distillery, setDistillery] = useState("");
  const [region, setRegion] = useState("");
  const [bottleType, setBottleType] = useState("");
  const [abv, setAbv] = useState("");
  const [price, setPrice] = useState("");

  // セッション情報
  const [tastedAt, setTastedAt] = useState("");
  const [rating, setRating] = useState(0);
  const [servingStyle, setServingStyle] = useState("");
  const [location, setLocation] = useState("");
  const [situation, setSituation] = useState("");
  const [memo, setMemo] = useState("");
  const [wantAgain, setWantAgain] = useState<boolean | null>(null);
  const [flavors, setFlavors] = useState({ f_smoky: 0, f_fruity: 0, f_floral: 0, f_spicy: 0, f_woody: 0 });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sessionImages, setSessionImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !distillery || !region) {
      setError("銘柄名・蒸留所・産地は必須です");
      return;
    }
    if (!tastedAt || rating === 0) {
      setError("飲んだ日時と総合評価は必須です");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const bottle = await createBottle(token, {
        name,
        distillery,
        region,
        bottle_type: bottleType || undefined,
        abv: abv ? Number(abv) : undefined,
        price: price ? Number(price) : undefined,
      });

      const tagIds: string[] = await Promise.all(
        tags.map(async (tagName) => {
          const tag = await createTag(token, tagName);
          return tag.id;
        })
      );

      await createSession(token, bottle.id, {
        tasted_at: new Date(tastedAt).toISOString(),
        rating,
        serving_style: servingStyle || undefined,
        location: location || undefined,
        situation: situation || undefined,
        memo: memo || undefined,
        want_again: wantAgain ?? undefined,
        ...flavors,
        tag_ids: tagIds,
      });

      router.push(`/bottles/${bottle.id}`);
    } catch (err) {
      console.error(err);
      setError("保存に失敗しました。入力内容を確認してください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">新規記録</h1>
          <p className="mt-1 text-sm text-stone-500">ボトル情報と初回テイスティングを登録します</p>
        </div>
        <Link href="/bottles" className="text-sm text-stone-400 hover:text-stone-600 transition">
          キャンセル
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* ── ボトル情報 ── */}
        <section className="space-y-5">
          <SectionTitle>ボトル情報</SectionTitle>

          <div className="space-y-1.5">
            <Label required>銘柄名</Label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: Laphroaig 10 Years"
              className={input}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>産地</Label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className={select}>
                <option value="">選択してください</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label required>蒸留所</Label>
              <input
                type="text"
                value={distillery}
                onChange={(e) => setDistillery(e.target.value)}
                placeholder="例: Laphroaig"
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
                placeholder="例: 43"
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
              placeholder="例: 5500"
              min={0}
              className={input}
            />
          </div>

          <div className="space-y-1.5">
            <Label>ボトル写真</Label>
            <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:bg-stone-100 transition">
              <div className="text-center">
                <p className="text-sm text-stone-400">クリックして画像をアップロード</p>
                <p className="text-xs text-stone-300 mt-1">JPEG / PNG</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── テイスティング記録 ── */}
        <section className="space-y-5">
          <SectionTitle>テイスティング記録</SectionTitle>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>飲んだ日時</Label>
              <input
                type="date"
                value={tastedAt}
                onChange={(e) => setTastedAt(e.target.value)}
                className={input}
              />
            </div>
            <div className="space-y-1.5">
              <Label>飲み方</Label>
              <select value={servingStyle} onChange={(e) => setServingStyle(e.target.value)} className={select}>
                <option value="">選択してください</option>
                {SERVING_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label required>総合評価</Label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>シチュエーション</Label>
              <select value={situation} onChange={(e) => setSituation(e.target.value)} className={select}>
                <option value="">選択してください</option>
                {SITUATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>飲んだ場所</Label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例: 新宿のバー"
                className={input}
              />
            </div>
          </div>

          {/* フレーバーノート */}
          <div className="space-y-3">
            <Label>フレーバーノート</Label>
            <div className="bg-stone-50 rounded-lg border border-stone-200 px-5 py-4 space-y-3">
              {FLAVORS.map(({ key, label }) => (
                <FlavorSlider
                  key={key}
                  label={label}
                  value={flavors[key as keyof typeof flavors]}
                  onChange={(v) => setFlavors({ ...flavors, [key]: v })}
                />
              ))}
            </div>
          </div>

          {/* フレーバータグ */}
          <div className="space-y-2">
            <Label>フレーバータグ</Label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="タグを入力してEnter"
                className={input}
              />
              <button
                type="button"
                onClick={addTag}
                className="shrink-0 rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100 transition"
              >
                追加
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-amber-900">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* また飲みたい */}
          <div className="space-y-2">
            <Label>また飲みたい</Label>
            <div className="flex gap-3">
              {[{ label: "はい", value: true }, { label: "いいえ", value: false }].map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setWantAgain(wantAgain === value ? null : value)}
                  className={`rounded-lg border px-5 py-2 text-sm font-medium transition ${
                    wantAgain === value
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-stone-300 text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 写真 */}
          <div className="space-y-1.5">
            <Label>写真</Label>
            <SessionImageUpload images={sessionImages} onChange={setSessionImages} />
          </div>

          {/* メモ */}
          <div className="space-y-1.5">
            <Label>メモ</Label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="テイスティングの感想など..."
              rows={4}
              className={input}
            />
          </div>
        </section>

        {/* エラー */}
        {error && (
          <p className="text-sm text-red-600 text-right">{error}</p>
        )}

        {/* 送信ボタン */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/bottles"
            className="rounded-lg border border-stone-300 px-6 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-amber-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition disabled:opacity-50"
          >
            {submitting ? "保存中..." : "記録を保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
