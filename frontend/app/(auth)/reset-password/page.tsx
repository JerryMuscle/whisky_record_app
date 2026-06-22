import Link from "next/link";
import { input } from "@/lib/styles";

export default function ResetPasswordPage() {
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
        <h2 className="text-lg font-semibold text-stone-800 mb-2">パスワードリセット</h2>
        <p className="text-sm text-stone-500 mb-6">
          登録済みのメールアドレスを入力してください。
          パスワード再設定用のリンクをお送りします。
        </p>

        <form className="space-y-5">
          {/* メールアドレス */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">
              メールアドレス
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={input}
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition"
          >
            リセットメールを送信
          </button>
        </form>

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
