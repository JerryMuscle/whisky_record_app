"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "ホーム", href: "/home" },
  { label: "記録一覧", href: "/bottles" },
  { label: "設定", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}
