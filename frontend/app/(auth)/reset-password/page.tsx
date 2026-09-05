"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { input } from "@/lib/styles";
import * as cognito from "@/lib/cognito";
import { AUTH_MESSAGES, translateCognitoError } from "@/lib/messages";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await cognito.forgotPassword(email);
      setStep("confirm");
    } catch (err) {
      setError(translateCognitoError(err, AUTH_MESSAGES.RESET_REQUEST_FAILED));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await cognito.confirmForgotPassword(email, code, newPassword);
      router.push("/login");
    } catch (err) {
      setError(translateCognitoError(err, AUTH_MESSAGES.RESET_CONFIRM_FAILED));
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
        <p className="mt-2 text-sm text-stone-500">パスワードを再設定します</p>
      </div>

      {/* カード */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10">
        {step === "request" ? (
          <>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">パスワードリセット</h2>
            <p className="text-sm text-stone-500 mb-6">
              登録済みのメールアドレスを入力してください。
              パスワード再設定用のコードをお送りします。
            </p>

            <form className="space-y-5" onSubmit={handleRequest}>
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

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition disabled:opacity-50"
              >
                {submitting ? "送信中..." : "リセットコードを送信"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">新しいパスワードを設定</h2>
            <p className="text-sm text-stone-500 mb-6">
              {email} 宛に送信されたコードと、新しいパスワードを入力してください。
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

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-stone-700">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition disabled:opacity-50"
              >
                {submitting ? "設定中..." : "パスワードを再設定"}
              </button>
            </form>
          </>
        )}

        {/* ログインへ戻る */}
        <p className="mt-6 text-center text-sm text-stone-500">
          <Link
            href="/login"
            className="font-medium text-amber-700 hover:text-amber-900 transition"
          >
            ← ログイン画面に戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
