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




// Lazy-loaded page & route-specific components (code-split per route)
const Landing = React.lazy(() => import("./pages/Landing"));
const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const MentorDashboard = React.lazy(() => import("./pages/MentorDashboard"));
const LearnerDashboard = React.lazy(() => import("./pages/LearnerDashboard"));
const Discover = React.lazy(() => import("./pages/Discover"));
const Sessions = React.lazy(() => import("./pages/Sessions"));
const Messages = React.lazy(() => import("./pages/Messages"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const Profile = React.lazy(() => import("./pages/Profile"));
const EditProfile = React.lazy(() => import("./pages/EditProfile"));
const Notifications = React.lazy(() => import("./pages/Notifications"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));
const Admin = React.lazy(() => import("./pages/Admin"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const AnonymousDoubts = React.lazy(() => import("./pages/AnonymousDoubts"));
const AIPage = React.lazy(() => import("./pages/aipage"));
const ContributorDashboard = React.lazy(() => import("./pages/ContributorDashboard"));
const BecomeMentor = React.lazy(() => import("./pages/BecomeMentor"));
const Portfolio = React.lazy(() => import("./pages/Portfolio"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const PublicPortfolio = React.lazy(() => import("./pages/PublicPortfolio"));
const ResourceHub = React.lazy(() => import("@/pages/ResourceHub"));
const StudyRooms = React.lazy(() => import("./components/StudyRooms"));
const Room = React.lazy(() => import("./components/Room/Room"));
const Contact = React.lazy(() => import("./pages/Contact"));
const PrivacyPolicy = React.lazy(() => import("./pages/privacy"));
const CookiesPolicy = React.lazy(() => import("./pages/cookies-policy"));
const PeerReviewDashboard = React.lazy(() => import("./pages/PeerReviewDashboard"));
const SubmitForReview = React.lazy(() => import("./pages/SubmitForReview"));
const ReviewSubmission = React.lazy(() => import("./pages/ReviewSubmission"));
const MockInterview = React.lazy(() => import("./pages/MockInterview"));
const TermsAndConditions = React.lazy(
  () => import("./pages/TermsAndConditions")
);

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
