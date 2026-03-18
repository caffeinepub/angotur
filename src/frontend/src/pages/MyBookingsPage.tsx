import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, MessageSquare, User } from "lucide-react";
import { motion } from "motion/react";
import { BookingStatus } from "../backend.d";
import { MOCK_BOOKINGS, MOCK_GUIDES, MOCK_SPOTS } from "../data/mockData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetMyBookings } from "../hooks/useQueries";
import { useLang } from "../i18n";

const statusStyles: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "bg-amber-100 text-amber-800",
  [BookingStatus.confirmed]: "bg-green-100 text-green-800",
  [BookingStatus.cancelled]: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, Record<BookingStatus, string>> = {
  pt: {
    [BookingStatus.pending]: "Pendente",
    [BookingStatus.confirmed]: "Confirmada",
    [BookingStatus.cancelled]: "Cancelada",
  },
  en: {
    [BookingStatus.pending]: "Pending",
    [BookingStatus.confirmed]: "Confirmed",
    [BookingStatus.cancelled]: "Cancelled",
  },
};

export function MyBookingsPage() {
  const { t, lang } = useLang();
  const { identity } = useInternetIdentity();
  const { data: backendBookings, isLoading } = useGetMyBookings();

  const bookings =
    backendBookings && backendBookings.length > 0
      ? backendBookings
      : MOCK_BOOKINGS;

  const getGuide = (id: string) => MOCK_GUIDES.find((g) => g.id === id);
  const getSpot = (id: string) => MOCK_SPOTS.find((s) => s.id === id);

  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-lg">
          {t.bookings.loginRequired}
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
      <h1
        className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8"
        data-ocid="bookings.section"
      >
        {t.bookings.title}
      </h1>

      {isLoading ? (
        <div className="space-y-4" data-ocid="bookings.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="bookings.empty_state"
        >
          {t.bookings.noBookings}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => {
            const guide = getGuide(booking.guideId);
            const spot = getSpot(booking.spotId);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-card"
                data-ocid={`bookings.item.${i + 1}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <User className="w-4 h-4 text-orange" />
                      <span className="font-semibold">
                        {guide?.name || booking.guideId}
                      </span>
                    </div>
                    {spot && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{spot.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        {booking.startDate} → {booking.endDate}
                      </span>
                    </div>
                    {booking.message && (
                      <div className="flex items-start gap-2 text-muted-foreground text-sm">
                        <MessageSquare className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-2">{booking.message}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full self-start ${
                      statusStyles[booking.status]
                    }`}
                  >
                    {statusLabels[lang][booking.status]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
