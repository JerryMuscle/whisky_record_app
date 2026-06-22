"use client";

import { useRef, useState } from "react";

const MAX_IMAGES = 3;

type Props = {
  images: File[];
  onChange: (images: File[]) => void;
};

export default function SessionImageUpload({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const merged = [...images, ...files].slice(0, MAX_IMAGES);
    onChange(merged);
    // 同じファイルを再選択できるようにリセット
    e.target.value = "";
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {/* プレビューサムネイル */}
        {images.map((file, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-200 shrink-0">
            <img
              src={URL.createObjectURL(file)}
              alt={`写真 ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70 transition"
            >
              ×
            </button>
          </div>
        ))}

        {/* 追加ボタン（上限未満のときだけ表示） */}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-center gap-1 hover:bg-stone-100 transition shrink-0"
          >
            <span className="text-xl text-stone-400">+</span>
            <span className="text-xs text-stone-400">
              {images.length}/{MAX_IMAGES}
            </span>
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400">最大{MAX_IMAGES}枚 · JPEG / PNG</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className="hidden"
        onChange={handleSelect}
      />
    </div>
  );
}
