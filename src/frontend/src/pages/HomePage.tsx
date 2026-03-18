import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, Search, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { GuideCard } from "../components/GuideCard";
import { SpotCard } from "../components/SpotCard";
import { MOCK_GUIDES, MOCK_SPOTS } from "../data/mockData";
import { useGetAllGuides, useGetAllSpots } from "../hooks/useQueries";
import { useLang } from "../i18n";

export function HomePage() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: backendSpots } = useGetAllSpots();
  const { data: backendGuides } = useGetAllGuides();

  const spots =
    backendSpots && backendSpots.length > 0 ? backendSpots : MOCK_SPOTS;
  const guides =
    backendGuides && backendGuides.length > 0 ? backendGuides : MOCK_GUIDES;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate({ to: "/spots", search: { q: search.trim() } });
    }
  };

  return (
    <main>
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/angola-hero.dim_1400x700.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4"
          >
            {t.home.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8 px-2"
          >
            {t.home.heroSubtitle}
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto w-full"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.home.searchPlaceholder}
              className="bg-white/95 border-0 text-foreground placeholder:text-muted-foreground h-12 text-base flex-1"
              data-ocid="home.search_input"
            />
            <Button
              type="submit"
              className="bg-orange hover:bg-orange/90 text-white h-12 px-6 w-full sm:w-auto"
              data-ocid="home.primary_button"
            >
              <Search className="w-4 h-4" />
            </Button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-10 text-white/80 text-sm"
          >
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>4 destinos</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>3 guias</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>5★ avaliações</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {t.home.featuredSpots}
          </h2>
          <Link to="/spots" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-navy text-navy hover:bg-navy/5"
              data-ocid="home.secondary_button"
            >
              {t.home.exploreAll} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spots.slice(0, 4).map((spot, i) => (
            <SpotCard key={spot.id} spot={spot} index={i} />
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 gap-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {t.home.featuredGuides}
            </h2>
            <Link to="/guides" className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="border-navy text-navy hover:bg-navy/5"
                data-ocid="home.secondary_button"
              >
                {t.home.exploreAll} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {guides.slice(0, 3).map((guide, i) => (
              <GuideCard key={guide.id} guide={guide} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-navy text-cream text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Conheça Angola Conosco
          </h2>
          <p className="text-cream/75 mb-8 max-w-xl mx-auto text-sm md:text-base">
            Cadastre seu ponto turístico ou torne-se um guia e ajude a promover
            o turismo em Angola.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <Link to="/register-spot">
              <Button
                className="bg-orange hover:bg-orange/90 text-white w-full sm:w-auto"
                data-ocid="home.primary_button"
              >
                {t.nav.registerSpot}
              </Button>
            </Link>
            <Link to="/register-guide">
              <Button
                variant="outline"
                className="border-cream/50 text-cream hover:bg-cream/10 w-full sm:w-auto"
                data-ocid="home.secondary_button"
              >
                {t.nav.registerGuide}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
