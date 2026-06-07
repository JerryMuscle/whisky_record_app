import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-semibold text-zinc-900">404</h1>
      <p className="text-zinc-500">ページが見つかりませんでした</p>
      <Link href="/home" className="text-sm text-zinc-900 underline underline-offset-4">
        ホームへ戻る
      </Link>
    </div>
  );
}
