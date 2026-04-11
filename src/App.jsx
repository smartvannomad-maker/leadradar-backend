import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import CreateLeadPage from "./pages/dashboard/CreateLeadPage";
import ImportPage from "./pages/dashboard/ImportPage";
import FollowupsPage from "./pages/dashboard/FollowupsPage";
import PipelinePage from "./pages/dashboard/PipelinePage";
import LeadsPage from "./pages/dashboard/LeadsPage";
import LinkedInPage from "./pages/dashboard/LinkedInPage";
import TeamPage from "./pages/dashboard/TeamPage";
import SearchAutomationPage from "./pages/dashboard/SearchAutomationPage";
import BillingPage from "./pages/dashboard/BillingPage";

import { AuthProvider } from "./context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { useAuth } from "./hooks/useAuth";
import AppBootLoader from "./components/AppBootLoader";

const API_ROOT = "https://leadradar-backend-oziv.onrender.com";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicAuthRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard/overview" replace />
  ) : (
    children
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <LoginPage />
          </PublicAuthRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicAuthRoute>
            <SignupPage />
          </PublicAuthRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardProvider>
              <DashboardLayout />
            </DashboardProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="create" element={<CreateLeadPage />} />
        <Route path="import" element={<ImportPage />} />
        <Route path="followups" element={<FollowupsPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="linkedin" element={<LinkedInPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="search" element={<SearchAutomationPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppShell() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const wakeBackend = async () => {
      const wakeUrl = `${API_ROOT}/`;
      const maxAttempts = 6;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          const response = await fetch(wakeUrl, {
            method: "GET",
            cache: "no-store",
          });

          if (response.ok) {
            if (isMounted) {
              setBooting(false);
            }
            return;
          }

          console.warn(
            `Backend wake attempt ${attempt} returned status ${response.status}`
          );
        } catch (error) {
          console.warn(`Backend wake attempt ${attempt} failed:`, error);
        }

        if (attempt < maxAttempts) {
          await sleep(3000);
        }
      }

      if (isMounted) {
        setBooting(false);
      }
    };

    wakeBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  if (booting) {
    return <AppBootLoader message="Waking LeadRadar engine..." />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;