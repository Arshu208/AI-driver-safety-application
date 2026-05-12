import { createBrowserRouter } from "react-router";

// Onboarding & Auth
import SplashScreen from "./screens/SplashScreen";
import Onboarding1 from "./screens/Onboarding1";
import Onboarding2 from "./screens/Onboarding2";
import Onboarding3 from "./screens/Onboarding3";
import Onboarding4 from "./screens/Onboarding4";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";

// Permissions & Setup
import EnableCameraScreen from "./screens/EnableCameraScreen";
import EnableLocationScreen from "./screens/EnableLocationScreen";
import EnableNotificationsScreen from "./screens/EnableNotificationsScreen";
import VehicleSetupScreen from "./screens/VehicleSetupScreen";
import AddDriverDetailsScreen from "./screens/AddDriverDetailsScreen";

// Main Dashboard & Monitoring
import HomeDashboard from "./screens/HomeDashboard";
import AIDriverMonitoringLive from "./screens/AIDriverMonitoringLive";
import CameraCalibrationScreen from "./screens/CameraCalibrationScreen";
import RealTimeEyeTracking from "./screens/RealTimeEyeTracking";

// Alerts & Detection
import DrowsinessAlertPopup from "./screens/DrowsinessAlertPopup";
import MicrosleepWarningScreen from "./screens/MicrosleepWarningScreen";
import VoiceAssistantAlert from "./screens/VoiceAssistantAlert";
import YawningDetectionAnalysis from "./screens/YawningDetectionAnalysis";
import BlinkRateAnalysis from "./screens/BlinkRateAnalysis";
import UnsafeDistractionDetection from "./screens/UnsafeDistractionDetection";

// Trip & Driving Sessions
import TripStartConfirmation from "./screens/TripStartConfirmation";
import ActiveDrivingSession from "./screens/ActiveDrivingSession";
import LiveAIAnalyticsDashboard from "./screens/LiveAIAnalyticsDashboard";
import FatigueScoreDetail from "./screens/FatigueScoreDetail";
import DrivingBehaviorAnalysis from "./screens/DrivingBehaviorAnalysis";
import TripSummaryScreen from "./screens/TripSummaryScreen";

// Emergency & SOS
import EmergencySOSTrigger from "./screens/EmergencySOSTrigger";
import EmergencyContactScreen from "./screens/EmergencyContactScreen";
import AccidentDetectionAlert from "./screens/AccidentDetectionAlert";
import NearbyHospitalsHelp from "./screens/NearbyHospitalsHelp";

// Analytics & Reports
import DailyDrivingReport from "./screens/DailyDrivingReport";
import WeeklySafetyAnalytics from "./screens/WeeklySafetyAnalytics";
import MonthlyPerformanceDashboard from "./screens/MonthlyPerformanceDashboard";
import DriverLeaderboard from "./screens/DriverLeaderboard";
import RewardsAchievement from "./screens/RewardsAchievement";

// Fleet Management
import FleetManagementDashboard from "./screens/FleetManagementDashboard";
import FleetDriverMonitoring from "./screens/FleetDriverMonitoring";
import VehicleHealthMonitoring from "./screens/VehicleHealthMonitoring";

// AI Coach & Support
import AISafetyCoachChatbot from "./screens/AISafetyCoachChatbot";

// Settings & Preferences
import SettingsScreen from "./screens/SettingsScreen";
import NotificationPreferences from "./screens/NotificationPreferences";
import PrivacySecurityScreen from "./screens/PrivacySecurityScreen";
import SubscriptionPlans from "./screens/SubscriptionPlans";
import ThemeCustomization from "./screens/ThemeCustomization";
import LogoutConfirmation from "./screens/LogoutConfirmation";

// Root layout with navigation
import RootLayout from "./layouts/RootLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Onboarding flow
      { index: true, Component: SplashScreen },
      { path: "onboarding-1", Component: Onboarding1 },
      { path: "onboarding-2", Component: Onboarding2 },
      { path: "onboarding-3", Component: Onboarding3 },
      { path: "onboarding-4", Component: Onboarding4 },

      // Auth
      { path: "login", Component: LoginScreen },
      { path: "signup", Component: SignupScreen },
      { path: "forgot-password", Component: ForgotPasswordScreen },
      { path: "otp-verification", Component: OTPVerificationScreen },
      { path: "create-profile", Component: CreateProfileScreen },

      // Permissions & Setup
      {
        Component: ProtectedRoute,
        children: [
          { path: "enable-camera", Component: EnableCameraScreen },
          { path: "enable-location", Component: EnableLocationScreen },
          { path: "enable-notifications", Component: EnableNotificationsScreen },
          { path: "vehicle-setup", Component: VehicleSetupScreen },
          { path: "add-driver-details", Component: AddDriverDetailsScreen },

          // Main App
          { path: "home", Component: HomeDashboard },
          { path: "ai-monitoring-live", Component: AIDriverMonitoringLive },
          { path: "camera-calibration", Component: CameraCalibrationScreen },
          { path: "eye-tracking", Component: RealTimeEyeTracking },

          // Alerts
          { path: "drowsiness-alert", Component: DrowsinessAlertPopup },
          { path: "microsleep-warning", Component: MicrosleepWarningScreen },
          { path: "voice-assistant-alert", Component: VoiceAssistantAlert },
          { path: "yawning-analysis", Component: YawningDetectionAnalysis },
          { path: "blink-analysis", Component: BlinkRateAnalysis },
          { path: "distraction-detection", Component: UnsafeDistractionDetection },

          // Trip
          { path: "trip-start", Component: TripStartConfirmation },
          { path: "active-session", Component: ActiveDrivingSession },
          { path: "live-analytics", Component: LiveAIAnalyticsDashboard },
          { path: "fatigue-score", Component: FatigueScoreDetail },
          { path: "behavior-analysis", Component: DrivingBehaviorAnalysis },
          { path: "trip-summary", Component: TripSummaryScreen },

          // Emergency
          { path: "emergency-sos", Component: EmergencySOSTrigger },
          { path: "emergency-contacts", Component: EmergencyContactScreen },
          { path: "accident-alert", Component: AccidentDetectionAlert },
          { path: "nearby-hospitals", Component: NearbyHospitalsHelp },

          // Analytics
          { path: "daily-report", Component: DailyDrivingReport },
          { path: "weekly-analytics", Component: WeeklySafetyAnalytics },
          { path: "monthly-dashboard", Component: MonthlyPerformanceDashboard },
          { path: "leaderboard", Component: DriverLeaderboard },
          { path: "rewards", Component: RewardsAchievement },

          // Fleet
          { path: "fleet-dashboard", Component: FleetManagementDashboard },
          { path: "fleet-monitoring", Component: FleetDriverMonitoring },
          { path: "vehicle-health", Component: VehicleHealthMonitoring },

          // AI Coach
          { path: "ai-coach", Component: AISafetyCoachChatbot },

          // Settings
          { path: "settings", Component: SettingsScreen },
          { path: "notification-settings", Component: NotificationPreferences },
          { path: "privacy-security", Component: PrivacySecurityScreen },
          { path: "subscription", Component: SubscriptionPlans },
          { path: "theme-customization", Component: ThemeCustomization },
          { path: "logout", Component: LogoutConfirmation },
        ]
      }
    ],
  },
]);
