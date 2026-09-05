"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { input } from "@/lib/styles";
import { useAuth } from "@/contexts/AuthContext";
import * as cognito from "@/lib/cognito";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }
    setSubmitting(true);
    try {
      await cognito.signUp(email, password);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await cognito.confirmSignUp(email, code);
      await login(email, password, username);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "確認コードが正しくありません");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* ロゴ */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-wide text-stone-800">
          Whisky Notes
        </h1>
        <p className="mt-2 text-sm text-stone-500">新しいコレクションをはじめましょう</p>
      </div>

      {/* カード */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10">
        {step === "form" ? (
          <>
            <h2 className="text-lg font-semibold text-stone-800 mb-6">新規登録</h2>

            <form className="space-y-5" onSubmit={handleSignUp}>
              {/* ユーザー名 */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  ユーザー名
                </label>
                <input
                  type="text"
                  placeholder="例: whisky_lover"
                  className={input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* メールアドレス */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  メールアドレス
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* パスワード */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  パスワード
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* パスワード確認 */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={input}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* 登録ボタン */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition disabled:opacity-50"
              >
                {submitting ? "登録中..." : "アカウントを作成"}
              </button>
            </form>

            {/* ログインリンク */}
            <p className="mt-6 text-center text-sm text-stone-500">
              すでにアカウントをお持ちの方は{" "}
              <Link
                href="/login"
                className="font-medium text-amber-700 hover:text-amber-900 transition"
              >
                ログイン
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">確認コード入力</h2>
            <p className="text-sm text-stone-500 mb-6">
              {email} 宛に送信された確認コードを入力してください。
            </p>

            <form className="space-y-5" onSubmit={handleConfirm}>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  確認コード
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  className={input}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition disabled:opacity-50"
              >
                {submitting ? "確認中..." : "確認してログイン"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
