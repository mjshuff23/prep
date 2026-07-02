"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { BookOpen, MonitorPlay, LayoutDashboard, UserCircle, Menu, X, LogOut, Settings } from "lucide-react";
import { Button, buttonVariants } from "./button";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export function GlobalNav({ user, onLogout }: { user?: User, onLogout?: () => Promise<void> | void }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    if (onLogout) {
      startTransition(async () => {
        await onLogout();
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
            <span className="font-bold sm:inline-block">DataStructs</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/structures"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Structures
            </Link>
            <Link
              href="/playground"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2"
            >
              <MonitorPlay className="h-4 w-4" />
              Playground
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-2" })}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link href="/settings" className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-2" })}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout} disabled={isPending}>
                  <LogOut className="h-4 w-4" />
                  {isPending ? "Logging out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-2" })}>
                  <UserCircle className="h-4 w-4" />
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants({ variant: "outline", size: "sm", className: "gap-2" })}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav-menu" className="md:hidden border-t border-border/40 bg-background/95 p-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/structures"
              className="transition-colors hover:text-foreground/80 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Structures
            </Link>
            <Link
              href="/playground"
              className="transition-colors hover:text-foreground/80 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <MonitorPlay className="h-4 w-4" />
              Playground
            </Link>

            <div className="border-t border-border/40 pt-4 mt-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-foreground/80 flex items-center gap-2 mb-4"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="transition-colors hover:text-foreground/80 flex items-center gap-2 mb-4"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="transition-colors hover:text-foreground/80 flex items-center gap-2 text-destructive w-full text-left"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    disabled={isPending}
                  >
                    <LogOut className="h-4 w-4" />
                    {isPending ? "Logging out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="transition-colors hover:text-foreground/80 flex items-center gap-2 mb-4"
                    onClick={() => setOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="transition-colors hover:text-foreground/80 flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
