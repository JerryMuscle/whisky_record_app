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
    <aside className="w-56 shrink-0 flex flex-col border-r border-zinc-200 bg-white min-h-screen px-4 py-6">
      <div className="mb-8 px-2">
        <span className="text-lg font-semibold tracking-tight text-zinc-900">
          Whisky Record
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith(href)
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
