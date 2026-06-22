import Link from "next/link";
import { input } from "@/lib/styles";

export default function RegisterPage() {
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
        <h2 className="text-lg font-semibold text-stone-800 mb-6">新規登録</h2>

        <form className="space-y-5">
          {/* ユーザー名 */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">
              ユーザー名
            </label>
            <input
              type="text"
              placeholder="例: whisky_lover"
              className={input}
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
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition"
          >
            アカウントを作成
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
      </div>
    </div>
  );
}
