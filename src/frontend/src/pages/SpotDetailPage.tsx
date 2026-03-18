import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Variant_spot_guide } from "../backend.d";
import { GuideCard } from "../components/GuideCard";
import {
  MOCK_GUIDES,
  MOCK_REVIEWS,
  MOCK_SPOTS,
  SPOT_IMAGES,
} from "../data/mockData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddReview,
  useGetAllGuides,
  useGetAllSpots,
  useGetReviewsByTarget,
} from "../hooks/useQueries";
import { useLang } from "../i18n";

function StarRating({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`w-7 h-7 transition-colors ${
            s <= value ? "text-orange" : "text-muted-foreground/40"
          }`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      ))}
    </div>
  );
}

export function SpotDetailPage() {
  const { id } = useParams({ from: "/spots/$id" });
  const { t } = useLang();
  const { identity } = useInternetIdentity();

  const { data: backendSpots } = useGetAllSpots();
  const allSpots =
    backendSpots && backendSpots.length > 0 ? backendSpots : MOCK_SPOTS;
  const spot = allSpots.find((s) => s.id === id);

  const { data: backendReviews } = useGetReviewsByTarget(id || "");
  const reviews =
    backendReviews && backendReviews.length > 0
      ? backendReviews
      : MOCK_REVIEWS.filter((r) => r.targetId === id);

  const { data: backendGuides } = useGetAllGuides();
  const guides =
    backendGuides && backendGuides.length > 0 ? backendGuides : MOCK_GUIDES;

  const addReview = useAddReview();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  if (!spot) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-64 sm:h-96 rounded-xl mb-8" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const img =
    SPOT_IMAGES[spot.id] || "/assets/generated/angola-hero.dim_1400x700.jpg";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error(t.guideDetail.loginRequired);
      return;
    }
    await addReview.mutateAsync({
      targetId: spot.id,
      targetType: Variant_spot_guide.spot,
      rating: BigInt(rating),
      comment,
      authorName,
    });
    toast.success("Avaliação enviada!");
    setComment("");
    setAuthorName("");
    setRating(5);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 max-w-4xl">
      <div className="rounded-2xl overflow-hidden shadow-card mb-8">
        <img
          src={img}
          alt={spot.name}
          className="w-full h-48 sm:h-64 md:h-80 object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-10">
        <div className="flex-1">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {spot.name}
          </h1>
          <div className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{spot.location}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {spot.description}
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
          {t.spotDetail.bookGuide}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {guides.slice(0, 3).map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} />
          ))}
        </div>
      </section>

      <section data-ocid="spotdetail.section">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
          {t.spotDetail.reviews}
        </h2>
        {reviews.length === 0 ? (
          <p
            className="text-muted-foreground mb-6"
            data-ocid="spotdetail.empty_state"
          >
            {t.spotDetail.noReviews}
          </p>
        ) : (
          <div className="space-y-4 mb-8">
            {reviews.map((rev, i) => (
              <div
                key={rev.id}
                className="bg-card p-4 rounded-lg border border-border"
                data-ocid={`spotdetail.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="font-semibold text-foreground">
                    {rev.authorName}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Number(rev.rating)
                            ? "text-orange fill-orange"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

        <h3 className="font-display text-lg md:text-xl font-semibold mb-4">
          {t.spotDetail.addReview}
        </h3>
        <form
          onSubmit={handleReviewSubmit}
          className="bg-card p-4 md:p-6 rounded-xl border border-border space-y-4"
          data-ocid="spotdetail.panel"
        >
          <div>
            <Label>{t.spotDetail.rating}</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <Label htmlFor="authorName">{t.spotDetail.yourName}</Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              data-ocid="spotdetail.input"
            />
          </div>
          <div>
            <Label htmlFor="comment">{t.spotDetail.yourComment}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              data-ocid="spotdetail.textarea"
            />
          </div>
          <Button
            type="submit"
            className="bg-orange hover:bg-orange/90 text-white"
            disabled={addReview.isPending}
            data-ocid="spotdetail.submit_button"
          >
            {t.spotDetail.submit}
          </Button>
        </form>
      </section>
    </main>
  );
}
