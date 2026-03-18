import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import type { TouristSpot } from "../backend.d";
import { SPOT_IMAGES } from "../data/mockData";
import { useLang } from "../i18n";

const categoryColors: Record<string, string> = {
  nature: "bg-green-100 text-green-800",
  beach: "bg-blue-100 text-blue-800",
  historical: "bg-amber-100 text-amber-800",
  museum: "bg-purple-100 text-purple-800",
  city: "bg-gray-100 text-gray-800",
};

const categoryLabels: Record<string, Record<string, string>> = {
  nature: { pt: "Natureza", en: "Nature" },
  beach: { pt: "Praia", en: "Beach" },
  historical: { pt: "Histórico", en: "Historical" },
  museum: { pt: "Museu", en: "Museum" },
  city: { pt: "Cidade", en: "City" },
};

interface Props {
  spot: TouristSpot;
  index?: number;
}

export function SpotCard({ spot, index = 0 }: Props) {
  const { lang, t } = useLang();
  const img =
    SPOT_IMAGES[spot.id] || "/assets/generated/angola-hero.dim_1400x700.jpg";
  const catKey = spot.category as string;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-shadow group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={img}
          alt={spot.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[catKey] || "bg-gray-100 text-gray-800"}`}
          >
            {categoryLabels[catKey]?.[lang] || catKey}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {spot.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{spot.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {spot.description}
        </p>
        <Link to="/spots/$id" params={{ id: spot.id }}>
          <Button
            size="sm"
            className="w-full bg-navy hover:bg-navy/90 text-cream"
            data-ocid="spots.primary_button"
          >
            {t.spots.details}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
