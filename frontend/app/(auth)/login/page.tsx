import Link from "next/link";
import { input } from "@/lib/styles";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md px-4">
      {/* ロゴ */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-wide text-stone-800">
          Whisky Notes
        </h1>
        <p className="mt-2 text-sm text-stone-500">あなたのコレクションへようこそ</p>
      </div>

      {/* カード */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10">
        <h2 className="text-lg font-semibold text-stone-800 mb-6">ログイン</h2>

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

          {/* パスワード */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-stone-700">
                パスワード
              </label>
              <Link
                href="/reset-password"
                className="text-xs text-amber-700 hover:text-amber-900 transition"
              >
                パスワードを忘れた方
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className={input}
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-900 transition"
          >
            ログイン
          </button>
        </form>

        {/* 区切り */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400">または</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* 新規登録リンク */}
        <p className="text-center text-sm text-stone-500">
          アカウントをお持ちでない方は{" "}
          <Link
            href="/register"
            className="font-medium text-amber-700 hover:text-amber-900 transition"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
