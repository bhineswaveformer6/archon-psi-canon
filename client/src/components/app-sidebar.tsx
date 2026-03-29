import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Calculator, Link2, CreditCard, Moon, Zap, Sun, MoonStar, Globe } from "lucide-react";
import { useTheme } from "./theme-provider";

const navItems = [
  { href: "/registry", label: "Registry", icon: Globe },
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/canon", label: "Canon Ledger", icon: Link2 },
  { href: "/daily", label: "Daily Block", icon: MoonStar },
  { href: "/pricing", label: "Pricing", icon: Zap },
];

function PsiGlyph() {
  return (
    <svg viewBox="0 0 40 40" width="36" height="36" aria-label="ARCHON Psi Logo">
      <text
        x="20"
        y="30"
        textAnchor="middle"
        fontSize="28"
        fontFamily="'EB Garamond', serif"
        fill="#c8a96e"
        fontWeight="600"
      >
        Ψ
      </text>
    </svg>
  );
}

export function AppSidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] min-h-screen border-r border-sidebar-border shrink-0"
      style={{ backgroundColor: "hsl(220 60% 9%)" }}
      data-testid="app-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <PsiGlyph />
        <span
          className="font-mono text-sm tracking-[0.15em] font-medium"
          style={{ color: "#c8a96e" }}
        >
          ARCHON
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 mt-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-colors cursor-pointer ${
                  active
                    ? "text-[#c8a96e]"
                    : "text-[#c8a96e]/50 hover:text-[#c8a96e]/80"
                }`}
                style={
                  active
                    ? { backgroundColor: "hsl(220 50% 14%)" }
                    : undefined
                }
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 flex flex-col gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono text-[#c8a96e]/50 hover:text-[#c8a96e]/80 transition-colors"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Tier badge */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-[#c8a96e]/60 tracking-wider">
            FREE TIER
          </span>
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 border-b border-sidebar-border"
        style={{ backgroundColor: "hsl(220 60% 9%)" }}
      >
        <div className="flex items-center gap-2">
          <PsiGlyph />
          <span className="font-mono text-sm tracking-[0.15em] font-medium text-[#c8a96e]">
            ARCHON
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-[#c8a96e] p-1"
          data-testid="button-mobile-menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </header>

      {open && (
        <div
          className="md:hidden border-b border-sidebar-border px-4 py-3 flex flex-col gap-1"
          style={{ backgroundColor: "hsl(220 60% 9%)" }}
        >
          {navItems.map((item) => {
            const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono cursor-pointer ${
                    active ? "text-[#c8a96e] bg-[hsl(220,50%,14%)]" : "text-[#c8a96e]/50"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
          <button
            onClick={() => { toggleTheme(); setOpen(false); }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono text-[#c8a96e]/50"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      )}
    </>
  );
}

