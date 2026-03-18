import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { GuideCard } from "../components/GuideCard";
import { MOCK_GUIDES } from "../data/mockData";
import { useGetAllGuides } from "../hooks/useQueries";
import { useLang } from "../i18n";

export function GuidesPage() {
  const { t } = useLang();
  const [search, setSearch] = useState("");

  const { data: backendGuides, isLoading } = useGetAllGuides();
  const allGuides =
    backendGuides && backendGuides.length > 0 ? backendGuides : MOCK_GUIDES;

  const filtered = useMemo(() => {
    return allGuides.filter((g) => {
      return (
        !search ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.bio.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [allGuides, search]);

  return (
    <main className="container mx-auto px-4 py-8 md:py-10">
      <h1
        className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8"
        data-ocid="guides.section"
      >
        {t.guides.title}
      </h1>

      <div className="relative w-full md:max-w-md mb-6 md:mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.home.searchPlaceholder}
          className="pl-9"
          data-ocid="guides.search_input"
        />
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          data-ocid="guides.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="guides.empty_state"
        >
          {t.guides.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
