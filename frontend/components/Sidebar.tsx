"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "ホーム", href: "/home" },
  { label: "記録一覧", href: "/bottles" },
  { label: "設定", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-stone-800 min-h-screen px-4 py-6">
      {/* ロゴ */}
      <div className="mb-10 px-2">
        <span className="text-lg font-semibold tracking-wide text-amber-100">
          Whisky Notes
        </span>
      </div>

      {/* ナビゲーション */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname.startsWith(href)
                ? "bg-amber-700 text-white"
                : "text-stone-400 hover:bg-stone-700 hover:text-stone-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {user && (
        <div className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-700 text-sm font-medium text-white">
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="truncate text-sm font-medium text-stone-100">
            {user.username}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-stone-400 hover:bg-stone-700 hover:text-stone-100 transition-colors"
      >
        ログアウト
      </button>
    </aside>
  );
}
