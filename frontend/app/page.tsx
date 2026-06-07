import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-zinc-50">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Whisky Record
        </h1>
        <p className="text-zinc-500">あなたのウイスキー体験を記録・管理する</p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          ログイン
        </Link>
        <Link
          href="/register"
          className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}
