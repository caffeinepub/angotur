import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLang } from "../i18n";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { isAdminLoggedIn } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isLoggedIn = !!identity;

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/spots", label: t.nav.spots },
    { href: "/guides", label: t.nav.guides },
    ...(isLoggedIn ? [{ href: "/my-bookings", label: t.nav.myBookings }] : []),
    { href: "/admin", label: t.nav.admin },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-cream font-display text-2xl font-bold"
          data-ocid="nav.link"
        >
          <Compass className="w-7 h-7 text-orange" />
          Angotur
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              data-ocid="nav.link"
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-orange"
                  : isAdminLoggedIn && link.href === "/admin"
                    ? "text-orange hover:text-orange/80"
                    : "text-orange/90 hover:text-orange"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
            data-ocid="nav.toggle"
            className="text-xs font-bold text-cream/70 hover:text-cream border border-cream/30 rounded px-2 py-1 transition-colors"
          >
            {lang === "pt" ? "EN" : "PT"}
          </button>
          {isLoggedIn ? (
            <Button
              size="sm"
              variant="outline"
              className="border-cream/40 text-cream hover:bg-cream/10 hover:text-cream"
              onClick={() => clear()}
              data-ocid="nav.button"
            >
              {t.nav.logout}
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-orange hover:bg-orange/90 text-white"
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="nav.button"
            >
              {t.nav.login}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-cream p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy border-t border-cream/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid="nav.link"
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-orange"
                      : "text-orange/90 hover:text-orange"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-cream/10">
                <button
                  type="button"
                  onClick={() => setLang(lang === "pt" ? "en" : "pt")}
                  className="text-xs font-bold text-cream/70 hover:text-cream border border-cream/30 rounded px-2 py-1"
                >
                  {lang === "pt" ? "EN" : "PT"}
                </button>
                {isLoggedIn ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cream/40 text-cream hover:bg-cream/10 hover:text-cream"
                    onClick={() => clear()}
                  >
                    {t.nav.logout}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-orange hover:bg-orange/90 text-white"
                    onClick={() => login()}
                    disabled={isLoggingIn}
                  >
                    {t.nav.login}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
