import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "@tanstack/react-router";
import { DollarSign, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GUIDE_IMAGES, MOCK_GUIDES, MOCK_SPOTS } from "../data/mockData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateBooking,
  useGetAllGuides,
  useGetAllSpots,
} from "../hooks/useQueries";
import { useLang } from "../i18n";

export function GuideDetailPage() {
  const { id } = useParams({ from: "/guides/$id" });
  const { t } = useLang();
  const { identity } = useInternetIdentity();

  const { data: backendGuides } = useGetAllGuides();
  const guides =
    backendGuides && backendGuides.length > 0 ? backendGuides : MOCK_GUIDES;
  const guide = guides.find((g) => g.id === id);

  const { data: backendSpots } = useGetAllSpots();
  const spots =
    backendSpots && backendSpots.length > 0 ? backendSpots : MOCK_SPOTS;

  const createBooking = useCreateBooking();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [spotId, setSpotId] = useState("");

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Skeleton className="h-40 w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-48 mb-4" />
      </div>
    );
  }

  const img = GUIDE_IMAGES[guide.id];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error(t.guideDetail.loginRequired);
      return;
    }
    await createBooking.mutateAsync({
      guideId: guide.id,
      spotId: spotId || "",
      startDate,
      endDate,
      message,
    });
    toast.success(t.guideDetail.bookingSuccess);
    setStartDate("");
    setEndDate("");
    setMessage("");
    setSpotId("");
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 max-w-4xl">
      <div className="bg-card rounded-2xl p-5 md:p-8 shadow-card mb-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
          {img && <AvatarImage src={img} alt={guide.name} />}
          <AvatarFallback className="bg-navy text-cream text-4xl font-bold">
            {guide.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            {guide.name}
          </h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-orange font-bold text-lg mb-3">
            <DollarSign className="w-5 h-5" />
            <span>
              {Number(guide.pricePerDay)} USD{t.guides.perDay}
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {guide.languages.map((lang) => (
                <Badge
                  key={lang}
                  variant="outline"
                  className="border-navy/30 text-navy"
                >
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{guide.bio}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-5 md:p-8 shadow-card border border-border">
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
          {t.guideDetail.bookNow}
        </h2>
        <form
          onSubmit={handleBooking}
          className="space-y-5"
          data-ocid="guidebooking.panel"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">{t.guideDetail.startDate}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                data-ocid="guidebooking.input"
              />
            </div>
            <div>
              <Label htmlFor="endDate">{t.guideDetail.endDate}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                data-ocid="guidebooking.input"
              />
            </div>
          </div>
          <div>
            <Label>{t.guideDetail.selectSpot}</Label>
            <Select value={spotId} onValueChange={setSpotId}>
              <SelectTrigger data-ocid="guidebooking.select">
                <SelectValue placeholder={t.guideDetail.selectSpot} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {spots.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="message">{t.guideDetail.message}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.guideDetail.messagePlaceholder}
              rows={4}
              required
              data-ocid="guidebooking.textarea"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-orange hover:bg-orange/90 text-white h-11"
            disabled={createBooking.isPending}
            data-ocid="guidebooking.submit_button"
          >
            {createBooking.isPending ? "Enviando..." : t.guideDetail.submit}
          </Button>
        </form>
      </div>
    </main>
  );
}
