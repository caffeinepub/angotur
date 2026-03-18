import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeDollarSign,
  BookOpen,
  CheckCircle,
  CreditCard,
  Lock,
  LogOut,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus, FeeStatus, Type__1 } from "../backend.d";
import { MOCK_BOOKINGS, MOCK_GUIDES, MOCK_SPOTS } from "../data/mockData";
import { useAdminAuth } from "../hooks/useAdminAuth";
import {
  useApproveGuide,
  useApproveSpot,
  useGetAdminStats,
  useGetAllBookings,
  useGetAllGuides,
  useGetAllSpotsAdmin,
  useGetGuidesWithPendingFees,
  useGetSpotsWithPendingFees,
  useMarkGuideFeeAsPaid,
  useMarkSpotFeeAsPaid,
  useRejectGuide,
  useRejectSpot,
} from "../hooks/useQueries";
import { useLang } from "../i18n";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl p-4 md:p-6 shadow-card border border-border"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground mb-1">
            {label}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {value}
          </p>
        </div>
        <div className={`p-2 md:p-3 rounded-full ${color}`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function FeeBadge({ status }: { status: FeeStatus }) {
  if (status === FeeStatus.paid) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3" /> Taxa Paga
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-800">
      <CreditCard className="w-3 h-3" /> Taxa Pendente
    </span>
  );
}

function AdminLoginForm({
  onLogin,
}: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(username, password);
    if (!ok) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card className="border-border shadow-lg" data-ocid="admin.modal">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-navy flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-orange" />
            </div>
            <CardTitle className="font-display text-2xl text-foreground">
              Acesso Restrito
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Painel de Administrador · Angotur
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Utilizador</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                  }}
                  placeholder="nome de utilizador"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••"
                  data-ocid="admin.input"
                />
              </div>
              {error && (
                <p
                  className="text-sm text-red-600 font-medium text-center"
                  data-ocid="admin.error_state"
                >
                  Credenciais inválidas. Tente novamente.
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-navy hover:bg-navy/90 text-white"
                data-ocid="admin.submit_button"
              >
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

export function AdminPage() {
  const { t } = useLang();
  const { isAdminLoggedIn, adminLogin, adminLogout } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <AdminLoginForm onLogin={adminLogin} />;
  }

  return <AdminPanel t={t} onLogout={adminLogout} />;
}

function AdminPanel({ t, onLogout }: { t: any; onLogout: () => void }) {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: spotsData } = useGetAllSpotsAdmin();
  const { data: guidesData } = useGetAllGuides();
  const { data: bookingsData } = useGetAllBookings();
  const { data: guidesWithPendingFees = [] } = useGetGuidesWithPendingFees();
  const { data: spotsWithPendingFees = [] } = useGetSpotsWithPendingFees();

  const allSpots = spotsData && spotsData.length > 0 ? spotsData : MOCK_SPOTS;
  const allGuides =
    guidesData && guidesData.length > 0 ? guidesData : MOCK_GUIDES;
  const allBookings =
    bookingsData && bookingsData.length > 0 ? bookingsData : MOCK_BOOKINGS;

  const pendingSpots = allSpots.filter((s) => s.status === Type__1.pending);
  const pendingGuides = allGuides.filter((g) => g.status === Type__1.pending);
  const totalPendingFees =
    guidesWithPendingFees.length + spotsWithPendingFees.length;

  const approveSpot = useApproveSpot();
  const rejectSpot = useRejectSpot();
  const approveGuide = useApproveGuide();
  const rejectGuide = useRejectGuide();
  const markGuidePaid = useMarkGuideFeeAsPaid();
  const markSpotPaid = useMarkSpotFeeAsPaid();

  const statusBadge = (status: BookingStatus) => {
    const map = {
      [BookingStatus.pending]: "bg-amber-100 text-amber-800",
      [BookingStatus.confirmed]: "bg-green-100 text-green-800",
      [BookingStatus.cancelled]: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full ${map[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-10">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        data-ocid="admin.section"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {t.admin.title}
        </h1>
        <Button
          size="sm"
          variant="outline"
          className="border-border text-muted-foreground hover:text-foreground gap-2 self-start sm:self-auto"
          onClick={() => {
            onLogout();
            toast.success("Sessão admin terminada.");
          }}
          data-ocid="admin.secondary_button"
        >
          <LogOut className="w-4 h-4" />
          Sair da sessão admin
        </Button>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10"
          data-ocid="admin.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 md:h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          <StatCard
            label={t.admin.totalSpots}
            value={stats ? Number(stats.totalSpots) : allSpots.length}
            icon={MapPin}
            color="bg-navy"
          />
          <StatCard
            label={t.admin.totalGuides}
            value={stats ? Number(stats.totalGuides) : allGuides.length}
            icon={Users}
            color="bg-orange"
          />
          <StatCard
            label={t.admin.totalReviews}
            value={stats ? Number(stats.totalReviews) : 3}
            icon={Star}
            color="bg-amber-500"
          />
          <StatCard
            label={t.admin.confirmedBookings}
            value={stats ? Number(stats.confirmedBookings) : 1}
            icon={BookOpen}
            color="bg-green-600"
          />
          <StatCard
            label={t.admin.pendingBookings}
            value={stats ? Number(stats.pendingBookings) : 0}
            icon={BookOpen}
            color="bg-amber-500"
          />
          <StatCard
            label="Taxas Pendentes"
            value={totalPendingFees}
            icon={BadgeDollarSign}
            color="bg-rose-600"
          />
        </div>
      )}

      <Tabs defaultValue="pending-spots">
        <div className="overflow-x-auto">
          <TabsList className="mb-6 flex-wrap h-auto gap-1 min-w-max">
            <TabsTrigger value="pending-spots" data-ocid="admin.tab">
              {t.admin.pendingSpots}{" "}
              {pendingSpots.length > 0 && (
                <Badge className="ml-2 bg-orange text-white">
                  {pendingSpots.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending-guides" data-ocid="admin.tab">
              {t.admin.pendingGuides}{" "}
              {pendingGuides.length > 0 && (
                <Badge className="ml-2 bg-orange text-white">
                  {pendingGuides.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings" data-ocid="admin.tab">
              {t.admin.allBookings}
            </TabsTrigger>
            <TabsTrigger value="fees" data-ocid="admin.tab">
              Taxas / Fees{" "}
              {totalPendingFees > 0 && (
                <Badge className="ml-2 bg-rose-600 text-white">
                  {totalPendingFees}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Pending Spots */}
        <TabsContent value="pending-spots">
          {pendingSpots.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              Nenhum ponto pendente.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSpots.map((spot, i) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden flex"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div
                    className={`w-1.5 flex-shrink-0 ${
                      spot.status === Type__1.pending
                        ? "bg-amber-400"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {spot.name}
                        </h3>
                        {spot.isPrivate && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            <Lock className="w-3 h-3" /> Privado
                          </span>
                        )}
                        <FeeBadge status={spot.feeStatus} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {spot.location} · {spot.category}
                      </p>
                      {spot.platformFee > 0n && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Taxa plataforma:{" "}
                          <span className="font-semibold text-foreground">
                            {Number(spot.platformFee).toLocaleString("pt-AO")}{" "}
                            AOA
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          approveSpot.mutate(spot.id, {
                            onSuccess: () => toast.success("Ponto aprovado!"),
                          })
                        }
                        data-ocid="admin.confirm_button"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />{" "}
                        {t.admin.approve}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          rejectSpot.mutate(spot.id, {
                            onSuccess: () => toast.success("Ponto rejeitado."),
                          })
                        }
                        data-ocid="admin.delete_button"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> {t.admin.reject}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Guides */}
        <TabsContent value="pending-guides">
          {pendingGuides.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="admin.empty_state"
            >
              Nenhum guia pendente.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingGuides.map((guide, i) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden flex"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div
                    className={`w-1.5 flex-shrink-0 ${
                      guide.status === Type__1.pending
                        ? "bg-amber-400"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {guide.name}
                        </h3>
                        <FeeBadge status={guide.feeStatus} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {guide.languages.join(", ")} · $
                        {Number(guide.pricePerDay)}/dia
                      </p>
                      {guide.platformFee > 0n && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Taxa plataforma:{" "}
                          <span className="font-semibold text-foreground">
                            {Number(guide.platformFee).toLocaleString("pt-AO")}{" "}
                            AOA
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          approveGuide.mutate(guide.id, {
                            onSuccess: () => toast.success("Guia aprovado!"),
                          })
                        }
                        data-ocid="admin.confirm_button"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />{" "}
                        {t.admin.approve}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          rejectGuide.mutate(guide.id, {
                            onSuccess: () => toast.success("Guia rejeitado."),
                          })
                        }
                        data-ocid="admin.delete_button"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> {t.admin.reject}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bookings */}
        <TabsContent value="bookings">
          <div
            className="rounded-xl border border-border overflow-x-auto"
            data-ocid="admin.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>{t.bookings.guide}</TableHead>
                  <TableHead>{t.bookings.dates}</TableHead>
                  <TableHead>{t.bookings.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allBookings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhuma reserva encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  allBookings.map((booking, i) => (
                    <TableRow key={booking.id} data-ocid={`admin.row.${i + 1}`}>
                      <TableCell className="font-mono text-xs">
                        {booking.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{booking.guideId}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {booking.startDate} → {booking.endDate}
                      </TableCell>
                      <TableCell>{statusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees">
          <div className="space-y-8">
            {/* Guides with pending fees */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
                  Guias com taxa pendente
                </h2>
                {guidesWithPendingFees.length > 0 && (
                  <Badge className="bg-rose-600 text-white">
                    {guidesWithPendingFees.length}
                  </Badge>
                )}
              </div>

              {guidesWithPendingFees.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-border"
                  data-ocid="admin.empty_state"
                >
                  Nenhum guia com taxa pendente. 🎉
                </div>
              ) : (
                <div className="space-y-3">
                  {guidesWithPendingFees.map((guide, i) => (
                    <motion.div
                      key={guide.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-xl border border-border overflow-hidden flex"
                      data-ocid={`admin.item.${i + 1}`}
                    >
                      <div className="w-1.5 flex-shrink-0 bg-rose-500" />
                      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {guide.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {guide.languages.join(", ")} ·{" "}
                            {Number(guide.pricePerDay).toLocaleString("pt-AO")}{" "}
                            AOA/dia
                          </p>
                          <p className="text-sm font-semibold text-rose-600 mt-1">
                            Taxa em dívida:{" "}
                            {Number(guide.platformFee).toLocaleString("pt-AO")}{" "}
                            AOA
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0 self-start sm:self-auto"
                          disabled={markGuidePaid.isPending}
                          onClick={() =>
                            markGuidePaid.mutate(guide.id, {
                              onSuccess: () =>
                                toast.success(
                                  `Taxa de ${guide.name} marcada como paga!`,
                                ),
                            })
                          }
                          data-ocid="admin.confirm_button"
                        >
                          <CreditCard className="w-4 h-4 mr-1" /> Marcar como
                          Pago
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Spots with pending fees */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-accent" />
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
                  Pontos privados com taxa pendente
                </h2>
                {spotsWithPendingFees.length > 0 && (
                  <Badge className="bg-rose-600 text-white">
                    {spotsWithPendingFees.length}
                  </Badge>
                )}
              </div>

              {spotsWithPendingFees.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground bg-card rounded-xl border border-border"
                  data-ocid="admin.empty_state"
                >
                  Nenhum ponto com taxa pendente. 🎉
                </div>
              ) : (
                <div className="space-y-3">
                  {spotsWithPendingFees.map((spot, i) => (
                    <motion.div
                      key={spot.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-xl border border-border overflow-hidden flex"
                      data-ocid={`admin.item.${i + 1}`}
                    >
                      <div className="w-1.5 flex-shrink-0 bg-rose-500" />
                      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {spot.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {spot.location} · {spot.category}
                          </p>
                          <p className="text-sm font-semibold text-rose-600 mt-1">
                            Taxa em dívida:{" "}
                            {Number(spot.platformFee).toLocaleString("pt-AO")}{" "}
                            AOA
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0 self-start sm:self-auto"
                          disabled={markSpotPaid.isPending}
                          onClick={() =>
                            markSpotPaid.mutate(spot.id, {
                              onSuccess: () =>
                                toast.success(
                                  `Taxa de ${spot.name} marcada como paga!`,
                                ),
                            })
                          }
                          data-ocid="admin.confirm_button"
                        >
                          <CreditCard className="w-4 h-4 mr-1" /> Marcar como
                          Pago
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
