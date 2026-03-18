import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { TourGuide } from "../backend.d";
import { GUIDE_IMAGES } from "../data/mockData";
import { useLang } from "../i18n";

interface Props {
  guide: TourGuide;
  index?: number;
}

export function GuideCard({ guide, index = 0 }: Props) {
  const { t } = useLang();
  const img = GUIDE_IMAGES[guide.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-cream rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16 shrink-0">
          {img && <AvatarImage src={img} alt={guide.name} />}
          <AvatarFallback className="bg-navy text-cream text-lg font-bold">
            {guide.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {guide.name}
          </h3>
          <div className="flex items-center gap-1 text-orange font-bold text-sm">
            <span>${Number(guide.pricePerDay)}</span>
            <span className="text-muted-foreground font-normal">
              {t.guides.perDay}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {guide.languages.map((lang) => (
              <Badge
                key={lang}
                variant="outline"
                className="text-xs border-navy/30 text-navy"
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
        {guide.bio}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            guide.available
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {guide.available ? t.guides.available : t.guides.unavailable}
        </span>
        <Link to="/guides/$id" params={{ id: guide.id }}>
          <Button
            size="sm"
            className="bg-orange hover:bg-orange/90 text-white"
            data-ocid="guides.primary_button"
          >
            {t.guides.viewProfile}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
