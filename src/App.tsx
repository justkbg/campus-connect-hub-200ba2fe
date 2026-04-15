import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import BotPage from "./pages/BotPage";
import MapPage from "./pages/MapPage";
import SchedulePage from "./pages/SchedulePage";
import ServicesPage from "./pages/ServicesPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotificationsPage from "./pages/NotificationsPage";
import MarketplacePage from "./pages/MarketplacePage";
import ResourcesPage from "./pages/ResourcesPage";
import LecturerPortalPage from "./pages/LecturerPortalPage";
import CourseRepPortalPage from "./pages/CourseRepPortalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/bot" element={<BotPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/lecturer" element={<LecturerPortalPage />} />
          <Route path="/course-rep" element={<CourseRepPortalPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
