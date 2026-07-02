import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalNav } from "@/components/ui/GlobalNav";
import { getCurrentUser } from "@/lib/auth-helpers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataStructs Playground",
  description: "Learn data structures through interactive visualization and code.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GlobalNav user={user} onLogout={async () => {
          "use server";
          const { logoutAction } = await import("@/app/actions/auth");
          await logoutAction();
        }} />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
