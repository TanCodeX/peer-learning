import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Global layout components - rendered on every page, keep static
import Navbar from "./components/Navbar/Navbar";
import Chatbot from "./components/Chatbot/Chatbot";
import StreakBadge from "./components/StreakBadge";
import CookieConsentBanner from "./components/CookieConsentBanner";
import FloatingAI from "./components/FloatingAI";
import MouseSparkles from "./components/MouseSparkles";
import BackToTop from "./components/BackToTop";
import { useAuth } from "@/contexts/useAuth";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";




// Lazy-loaded page & route-specific components (code-split per route)
const LazyRoute = <T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>
) => {
  const Component = React.lazy(loader);

  return function RouteComponent(props: React.ComponentProps<T>) {
    const location = useLocation();

    return (
      <ErrorBoundary key={location.key}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#020617]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" /></div>}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
};

const Landing = LazyRoute(() => import("./pages/Landing"));
const Index = LazyRoute(() => import("./pages/Index"));
const NotFound = LazyRoute(() => import("./pages/NotFound"));
const Dashboard = LazyRoute(() => import("./pages/Dashboard"));
const MentorDashboard = LazyRoute(() => import("./pages/MentorDashboard"));
const LearnerDashboard = LazyRoute(() => import("./pages/LearnerDashboard"));
const Discover = LazyRoute(() => import("./pages/Discover"));
const Sessions = LazyRoute(() => import("./pages/Sessions"));
const Messages = LazyRoute(() => import("./pages/Messages"));
const Chat = LazyRoute(() => import("./pages/Chat"));
const Login = LazyRoute(() => import("./pages/Login"));
const Signup = LazyRoute(() => import("./pages/Signup"));
const Onboarding = LazyRoute(() => import("./pages/Onboarding"));
const Profile = LazyRoute(() => import("./pages/Profile"));
const EditProfile = LazyRoute(() => import("./pages/EditProfile"));
const Notifications = LazyRoute(() => import("./pages/Notifications"));
const Leaderboard = LazyRoute(() => import("./pages/Leaderboard"));
const Admin = LazyRoute(() => import("./pages/Admin"));
const ForgotPassword = LazyRoute(() => import("./pages/ForgotPassword"));
const ResetPassword = LazyRoute(() => import("./pages/ResetPassword"));
const AnonymousDoubts = LazyRoute(() => import("./pages/AnonymousDoubts"));
const AIPage = LazyRoute(() => import("./pages/aipage"));
const ContributorDashboard = LazyRoute(() => import("./pages/ContributorDashboard"));
const BecomeMentor = LazyRoute(() => import("./pages/BecomeMentor"));
const Portfolio = LazyRoute(() => import("./pages/Portfolio"));
const AuthCallback = LazyRoute(() => import("./pages/AuthCallback"));
const PublicPortfolio = LazyRoute(() => import("./pages/PublicPortfolio"));
const ResourceHub = LazyRoute(() => import("@/pages/ResourceHub"));
const StudyRooms = LazyRoute(() => import("./components/StudyRooms"));
const Room = LazyRoute(() => import("./components/Room/Room"));
const Contact = LazyRoute(() => import("./pages/Contact"));
const PrivacyPolicy = LazyRoute(() => import("./pages/privacy"));
const CookiesPolicy = LazyRoute(() => import("./pages/cookies-policy"));
const PeerReviewDashboard = LazyRoute(() => import("./pages/PeerReviewDashboard"));
const SubmitForReview = LazyRoute(() => import("./pages/SubmitForReview"));
const ReviewSubmission = LazyRoute(() => import("./pages/ReviewSubmission"));
const MockInterview = LazyRoute(() => import("./pages/MockInterview"));
const TermsAndConditions = LazyRoute(() => import("./pages/TermsAndConditions"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <CookieConsentProvider>
            <AuthProvider>
              <RoleProvider>
                <RouterProvider router={router} />
              </RoleProvider>
            </AuthProvider>
          </CookieConsentProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
