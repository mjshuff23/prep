"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Save, Database, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/playgrounds", label: "Saved Playgrounds", icon: Save },
  { href: "/dashboard/datasets", label: "Datasets", icon: Database },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 max-w-7xl">
      <aside className="w-full md:w-64 flex-none md:border-r pr-6 mb-8 md:mb-0">
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted font-medium ${
                  active ? "text-foreground bg-muted/50" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 md:pl-8">
        {children}
      </main>
    </div>
  );
}
