"use client";

import { useState } from "react";
import Label from "@/components/Label";
import { input } from "@/lib/styles";

const MOCK_USER = {
  username: "whisky_lover",
  email: "user@example.com",
  avatar_url: null,
  created_at: "2026-01-15",
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="text-sm font-semibold text-stone-700">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [username, setUsername] = useState(MOCK_USER.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API連携
    alert("プロフィールを更新しました（API連携は後で実装）");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Cognito連携
    alert("パスワードを変更しました（Cognito連携は後で実装）");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">アカウント設定</h1>
        <p className="mt-1 text-sm text-stone-500">プロフィールとパスワードを管理します</p>
      </div>

      {/* アバター */}
      <SectionCard title="プロフィール">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            {MOCK_USER.avatar_url ? (
              <img src={MOCK_USER.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl text-amber-600">
                {MOCK_USER.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">{MOCK_USER.username}</p>
            <p className="text-xs text-stone-400">{MOCK_USER.email}</p>
            <p className="text-xs text-stone-400 mt-1">登録日: {MOCK_USER.created_at}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>ユーザー名</Label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={input}
            />
          </div>
          <div className="space-y-1.5">
            <Label>メールアドレス</Label>
            <input
              type="email"
              value={MOCK_USER.email}
              disabled
              className="w-full rounded-lg border border-stone-200 bg-stone-100 px-4 py-2.5 text-sm text-stone-400 cursor-not-allowed"
            />
            <p className="text-xs text-stone-400">メールアドレスは変更できません</p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
            >
              変更を保存
            </button>
          </div>
        </form>
      </SectionCard>

      {/* パスワード変更 */}
      <SectionCard title="パスワード変更">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>現在のパスワード</Label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={input}
            />
          </div>
          <div className="space-y-1.5">
            <Label>新しいパスワード</Label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={input}
            />
          </div>
          <div className="space-y-1.5">
            <Label>新しいパスワード（確認）</Label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={input}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-medium text-white hover:bg-amber-900 transition"
            >
              パスワードを変更
            </button>
          </div>
        </form>
      </SectionCard>

      {/* 危険ゾーン */}
      <SectionCard title="アカウント削除">
        <p className="text-sm text-stone-500">
          アカウントを削除すると、すべての記録データが完全に削除されます。この操作は取り消せません。
        </p>
        <button
          type="button"
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          onClick={() => alert("削除確認（API連携は後で実装）")}
        >
          アカウントを削除する
        </button>
      </SectionCard>
    </div>
  );
}
