import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { LangProvider } from "./i18n";
import { AdminPage } from "./pages/AdminPage";
import { GuideDetailPage } from "./pages/GuideDetailPage";
import { GuidesPage } from "./pages/GuidesPage";
import { HomePage } from "./pages/HomePage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { RegisterGuidePage } from "./pages/RegisterGuidePage";
import { RegisterSpotPage } from "./pages/RegisterSpotPage";
import { SpotDetailPage } from "./pages/SpotDetailPage";
import { SpotsPage } from "./pages/SpotsPage";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <LangProvider>
      <Layout />
      <Toaster />
    </LangProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const spotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spots",
  component: SpotsPage,
});
const spotDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/spots/$id",
  component: SpotDetailPage,
});
const guidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guides",
  component: GuidesPage,
});
const guideDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/guides/$id",
  component: GuideDetailPage,
});
const registerSpotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register-spot",
  component: RegisterSpotPage,
});
const registerGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register-guide",
  component: RegisterGuidePage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  spotsRoute,
  spotDetailRoute,
  guidesRoute,
  guideDetailRoute,
  registerSpotRoute,
  registerGuideRoute,
  adminRoute,
  myBookingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
