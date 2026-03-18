import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useLang } from "../i18n";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-navy text-cream/70 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-6 h-6 text-orange" />
              <span className="font-display text-xl font-bold text-cream">
                Angotur
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Descubra Angola. Conectando visitantes com os melhores pontos
              turísticos e guias locais.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-cream mb-3">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/spots"
                  className="hover:text-cream transition-colors"
                >
                  Pontos Turísticos
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="hover:text-cream transition-colors"
                >
                  Guias Turísticos
                </Link>
              </li>
              <li>
                <Link
                  to="/register-spot"
                  className="hover:text-cream transition-colors"
                >
                  Cadastrar Ponto
                </Link>
              </li>
              <li>
                <Link
                  to="/register-guide"
                  className="hover:text-cream transition-colors"
                >
                  Ser Guia
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cream mb-3">Destinos</h4>
            <ul className="space-y-2 text-sm">
              <li>Luanda</li>
              <li>Malanje</li>
              <li>Zaire</li>
              <li>Bengo</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>
            © {year} Angotur. {t.footer.rights}.
          </p>
          <p>
            {t.footer.builtWith}{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:text-orange/80 font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
