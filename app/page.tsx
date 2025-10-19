"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Calculator,
  Brain,
  Trophy,
  TrendingUp,
  Shield,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import AuthModal from "@/components/AuthModal";
import Hero from "@/components/Hero";
import FinancialProfile from "@/components/FinancialProfile";
import ProgressiveProfile from "@/components/ProgressiveProfile";
import Dashboard from "@/components/Dashboard";
import { FinancialData } from "@/types/financial";

export default function Home() {
  const { user, logout, getFinancialData, updateFinancialData } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentStep, setCurrentStep] = useState<
    "hero" | "profile" | "dashboard"
  >("hero");
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [dashboardInitialTab, setDashboardInitialTab] = useState<
    "overview" | "calculator" | "vehicles" | "coach" | "achievements"
  >("overview");
  const [progressiveMode, setProgressiveMode] = useState(false);

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  const handleProfileComplete = (data: FinancialData) => {
    // Update financial data in both local state and auth context
    setFinancialData(data);
    if (user) {
      updateFinancialData(data);
    }
    // After saving the profile, return the user to the front page (hero)
    setCurrentStep("hero");
  };

  // On mount or user change, attempt to load saved financial profile
  useEffect(() => {
    if (user) {
      // Try to load financial data from auth context
      const savedData = getFinancialData();
      if (savedData) {
        setFinancialData(savedData);
      }
    } else {
      // Clear financial data when user logs out
      setFinancialData(null);
    }
  }, [user]);

  const handleBackToProfile = () => {
    setCurrentStep("profile");
  };

  const handleStartOver = () => {
    setFinancialData(null);
    setCurrentStep("hero");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-toyota-red" />
              <span className="text-xl font-bold text-gray-900">
                Toyota Financial Navigator
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleStartOver}
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <Car className="h-4 w-4" />
                <span>Return Home</span>
              </button>
              
              {currentStep !== "hero" && (
                <>
                  <button
                    onClick={handleBackToProfile}
                    className="text-gray-600 hover:text-toyota-red transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button onClick={handleStartOver} className="btn-secondary">
                    Start Over
                  </button>
                </>
              )}

              <div className="ml-4 flex items-center space-x-4 border-l pl-4">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">
                      Welcome, {user.username}
                    </span>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 text-gray-600 hover:text-toyota-red transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 text-gray-600 hover:text-toyota-red transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>

            <AuthModal 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {currentStep === "hero" && (
          <Hero
            onGetStarted={() => {
              if (user) {
                setCurrentStep("profile");
              } else {
                handleLogin();
              }
            }}
            onSmartStart={() => {
              if (user) {
                setProgressiveMode(true);
                setCurrentStep("profile");
              } else {
                handleLogin();
              }
            }}
            onExploreVehicles={() => {
              // If user has completed their financial profile, show vehicle recommendations
              if (financialData) {
                setDashboardInitialTab("vehicles");
                setCurrentStep("dashboard");
              } else {
                // If no profile exists, guide them to create one with focus on vehicle preferences
                setCurrentStep("profile");
                // Show a message about completing profile to get personalized recommendations
                alert("Please complete your financial profile to get personalized vehicle recommendations based on your budget and preferences.");
              }
            }}
          />
        )}

        {currentStep === "profile" && !progressiveMode && (
          <FinancialProfile
            onComplete={handleProfileComplete}
            onBack={() => setCurrentStep("hero")}
          />
        )}

        {currentStep === "profile" && progressiveMode && (
          <ProgressiveProfile
            onComplete={(data) => {
              handleProfileComplete(data);
              setProgressiveMode(false);
            }}
            onCancel={() => setProgressiveMode(false)}
          />
        )}

        {currentStep === "dashboard" && financialData && (
          <Dashboard
            financialData={financialData}
            onEditProfile={handleBackToProfile}
            initialTab={dashboardInitialTab}
          />
        )}
      </main>

      {/* Features Preview */}
      {currentStep === "hero" && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powered by AI Innovation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of automotive financing with our
                cutting-edge features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Financial Coach",
                  description:
                    "Get personalized financial advice and strategies tailored to your unique situation.",
                  color: "text-blue-600",
                },
                {
                  icon: TrendingUp,
                  title: "Predictive Analytics",
                  description:
                    "See future scenarios and market trends to make informed decisions.",
                  color: "text-green-600",
                },
                {
                  icon: Trophy,
                  title: "Gamified Wellness",
                  description:
                    "Track your financial health with achievements and progress milestones.",
                  color: "text-yellow-600",
                },
                {
                  icon: Calculator,
                  title: "Smart Calculator",
                  description:
                    "Advanced financing simulations with interactive visualizations.",
                  color: "text-purple-600",
                },
                {
                  icon: Car,
                  title: "Vehicle Matching",
                  description:
                    "AI-powered recommendations based on your budget and lifestyle.",
                  color: "text-red-600",
                },
                {
                  icon: Shield,
                  title: "Financial Security",
                  description:
                    "Comprehensive credit analysis and risk assessment tools.",
                  color: "text-indigo-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
