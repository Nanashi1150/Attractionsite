import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Page } from "../hooks/useRouter";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { isDark, toggleTheme, isAdmin, exitAdmin } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overHero = (currentPage === "index" || currentPage === "about") && !scrolled && !open;
  const nav: { page: Page; label: string }[] = [
    { page: "index", label: t("nav.home") },
    { page: "about", label: t("nav.about") },
    { page: "attractions", label: language === "th" ? "สถานที่ท่องเที่ยว" : "Attractions" },
    ...(isAdmin ? [{ page: "manage" as Page, label: t("nav.manage") }] : []),
  ];
  const isActive = (p: Page) => currentPage === p || (p === "attractions" && currentPage === "detail") || (p === "manage" && currentPage === "form");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        overHero ? "bg-transparent text-white" : "bg-background/90 text-foreground backdrop-blur-md border-b border-border"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <button onClick={() => onNavigate("index")} className="font-display text-base uppercase tracking-[0.12em] sm:text-xl sm:tracking-[0.32em]">
          {language === "th" ? "กำแพงเพชร" : "Kamphaeng Phet"}
        </button>

        <nav aria-label={language === 'th' ? 'เมนูหลัก' : 'Main navigation'} className="hidden items-center gap-6 lg:flex">
          {nav.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              data-active={isActive(page)}
              className="link-line text-[0.7rem] uppercase tracking-[0.22em]"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-[0.7rem] uppercase tracking-[0.2em]">
          {isAdmin && <button onClick={() => { exitAdmin(); onNavigate('index'); setOpen(false); }} className="border border-current px-2 py-1 text-xs">{language === 'th' ? 'ออกจากผู้ดูแล' : 'Exit admin'}</button>}
          <div className="hidden items-center gap-2 sm:flex">
            {(["en", "th"] as const).map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                {i > 0 && <span className="opacity-30">/</span>}
                <button onClick={() => setLanguage(l)} className={language === l ? "" : "opacity-50 hover:opacity-100"}>
                  {l}
                </button>
              </span>
            ))}
          </div>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="opacity-70 hover:opacity-100">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="flex flex-col gap-6 border-t border-border bg-background px-6 py-8 text-foreground lg:hidden">
          {nav.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => { onNavigate(page); setOpen(false); }}
              className="text-left font-display text-2xl"
            >
              {label}
            </button>
          ))}
          <div className="flex gap-4 text-xs uppercase tracking-[0.2em]">
            <button onClick={() => setLanguage("en")} className={language === "en" ? "text-gold" : "opacity-60"}>EN</button>
            <button onClick={() => setLanguage("th")} className={language === "th" ? "text-gold" : "opacity-60"}>TH</button>
          </div>
        </nav>
      )}
    </header>
  );
}
