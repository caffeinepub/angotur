import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Type } from "../backend.d";
import { SpotCard } from "../components/SpotCard";
import { MOCK_SPOTS } from "../data/mockData";
import { useGetAllSpots } from "../hooks/useQueries";
import { useLang } from "../i18n";

export function SpotsPage() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: backendSpots, isLoading } = useGetAllSpots();
  const allSpots =
    backendSpots && backendSpots.length > 0 ? backendSpots : MOCK_SPOTS;

  const filtered = useMemo(() => {
    return allSpots.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "all" || s.category === category;
      return matchesSearch && matchesCat;
    });
  }, [allSpots, search, category]);

  const categories = [
    { value: "all", label: t.spots.all },
    { value: Type.nature, label: t.spots.nature },
    { value: Type.beach, label: t.spots.beach },
    { value: Type.historical, label: t.spots.historical },
    { value: Type.museum, label: t.spots.museum },
    { value: Type.city, label: t.spots.city },
  ];

  return (
    <main className="container mx-auto px-4 py-8 md:py-10">
      <h1
        className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8"
        data-ocid="spots.section"
      >
        {t.spots.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.home.searchPlaceholder}
            className="pl-9"
            data-ocid="spots.search_input"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-6 md:mb-8">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 min-w-max">
            {categories.map((c) => (
              <TabsTrigger key={c.value} value={c.value} data-ocid="spots.tab">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          data-ocid="spots.loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="spots.empty_state"
        >
          {t.spots.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((spot, i) => (
            <SpotCard key={spot.id} spot={spot} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
