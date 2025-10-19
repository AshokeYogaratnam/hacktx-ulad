"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Calculator,
  Brain,
  Trophy,
  TrendingUp,
  Shield,
} from "lucide-react";
import Hero from "@/components/Hero";
import FinancialProfile from "@/components/FinancialProfile";
import ProgressiveProfile from "@/components/ProgressiveProfile";
import Dashboard from "@/components/Dashboard";
import { FinancialData } from "@/types/financial";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<
    "hero" | "profile" | "dashboard"
  >("hero");
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [progressiveMode, setProgressiveMode] = useState(false);

  const handleProfileComplete = (data: FinancialData) => {
    setFinancialData(data);
    setCurrentStep("dashboard");
  };

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

            {currentStep !== "hero" && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToProfile}
                  className="text-gray-600 hover:text-toyota-red transition-colors"
                >
                  Edit Profile
                </button>
                <button onClick={handleStartOver} className="btn-secondary">
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {currentStep === "hero" && (
          <Hero
            onGetStarted={() => setCurrentStep("profile")}
            onSmartStart={() => {
              setProgressiveMode(true);
              setCurrentStep("profile");
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
