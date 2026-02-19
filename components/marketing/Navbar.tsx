"use client";
import Link from "next/link";
import { useState } from "react";
import LogoIcon from "@/components/LogoIcon";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-80">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-2 shadow-md">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-bold">Cedewise</span>
            <span className="text-base font-semibold text-primary"> Direct</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#features" className="text-muted-foreground transition-colors hover:text-primary">Features</a>
          <a href="#roles" className="text-muted-foreground transition-colors hover:text-primary">Roles</a>
          <a href="#workflow" className="text-muted-foreground transition-colors hover:text-primary">Workflow</a>
          <a href="#faqs" className="text-muted-foreground transition-colors hover:text-primary">FAQs</a>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/auth/login" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">Sign in</Link>
          <Link
            href="/submissions/new"
            className="btn-primary"
          >
            Get started
          </Link>
        </div>
        <button className="md:hidden rounded-lg p-2 hover:bg-accent transition-colors" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            <a href="#features" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Features</a>
            <a href="#roles" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Roles</a>
            <a href="#workflow" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Workflow</a>
            <a href="#faqs" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">FAQs</a>
            <div className="mt-4 flex items-center gap-3 border-t border-border/40 pt-4">
              <Link href="/auth/login" className="flex-1 text-center text-sm font-semibold text-foreground">Sign in</Link>
              <Link href="/submissions/new" className="btn-primary flex-1">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

