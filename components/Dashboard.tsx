"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Calculator,
  Car,
  Brain,
  Trophy,
  Target,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import {
  FinancialData,
  FinancingOption,
  VehicleRecommendation,
  FinancialHealthScore,
  AIRecommendation,
} from "@/types/financial";
import FinancingCalculator from "./FinancingCalculator";
import VehicleMatcher from "./VehicleMatcher";
import AIFinancialCoach from "./AIFinancialCoach";
import FinancialHealthMeter from "./FinancialHealthMeter";
import AchievementPanel from "./AchievementPanel";

interface DashboardProps {
  financialData: FinancialData;
  onEditProfile: () => void;
}

export default function Dashboard({
  financialData,
  onEditProfile,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "calculator" | "vehicles" | "coach" | "achievements"
  >("overview");
  const [financialHealth, setFinancialHealth] =
    useState<FinancialHealthScore | null>(null);
  const [aiRecommendations, setAIRecommendations] = useState<
    AIRecommendation[]
  >([]);

  useEffect(() => {
    // Calculate financial health score
    const healthScore = calculateFinancialHealth(financialData);
    setFinancialHealth(healthScore);

    // Generate AI recommendations
    const recommendations = generateAIRecommendations(
      financialData,
      healthScore
    );
    setAIRecommendations(recommendations);
  }, [financialData]);

  const calculateFinancialHealth = (
    data: FinancialData
  ): FinancialHealthScore => {
    const { personalInfo, preferences, goals } = data;

    // Credit score component (0-100)
    const creditScore = Math.max(
      0,
      Math.min(100, (personalInfo.creditScore - 300) / 5.5)
    );

    // Income component (0-100)
    const incomeScore = Math.max(
      0,
      Math.min(100, (personalInfo.annualIncome / 100000) * 100)
    );

    // Debt-to-income ratio (inverted, lower is better)
    const debtScore = Math.max(0, 100 - personalInfo.debtToIncomeRatio * 100);

    // Savings component (estimated)
    const savingsScore = Math.max(
      0,
      Math.min(100, (preferences.downPayment / preferences.budget) * 100)
    );

    const overall = Math.round(
      (creditScore + incomeScore + debtScore + savingsScore) / 4
    );

    return {
      overall,
      credit: Math.round(creditScore),
      income: Math.round(incomeScore),
      debt: Math.round(debtScore),
      savings: Math.round(savingsScore),
      recommendations: [],
    };
  };

  const generateAIRecommendations = (
    data: FinancialData,
    health: FinancialHealthScore
  ): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];

    if (health.credit < 70) {
      recommendations.push({
        type: "tip",
        title: "Improve Credit Score",
        description:
          "Your credit score could be improved. Consider paying down existing debt and maintaining consistent payments.",
        action: "View credit improvement tips",
        impact: "high",
      });
    }

    if (health.debt < 70) {
      recommendations.push({
        type: "warning",
        title: "High Debt-to-Income Ratio",
        description:
          "Your debt-to-income ratio is higher than recommended. Consider reducing monthly expenses or increasing income.",
        action: "Explore debt reduction strategies",
        impact: "high",
      });
    }

    if (data.preferences.downPayment < data.preferences.budget * 0.2) {
      recommendations.push({
        type: "opportunity",
        title: "Increase Down Payment",
        description:
          "A larger down payment could reduce your monthly payments and total interest paid.",
        action: "Calculate down payment scenarios",
        impact: "medium",
      });
    }

    return recommendations;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "vehicles", label: "Vehicles", icon: Car },
    { id: "coach", label: "AI Coach", icon: Brain },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Financial Dashboard
          </h1>
          <p className="text-gray-600">
            Your personalized Toyota financing hub with AI-powered insights
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Financial Health</p>
                <p className="text-2xl font-bold text-gray-900">
                  {financialHealth?.overall || 0}/100
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  (financialHealth?.overall || 0) >= 80
                    ? "bg-green-100"
                    : (financialHealth?.overall || 0) >= 60
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Target
                  className={`h-6 w-6 ${
                    (financialHealth?.overall || 0) >= 80
                      ? "text-green-600"
                      : (financialHealth?.overall || 0) >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Target</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${financialData.goals.monthlyPaymentTarget}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credit Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {financialData.personalInfo.creditScore}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vehicle Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${financialData.preferences.budget.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Car className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-toyota-red text-toyota-red"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Financial Health Meter */}
              <FinancialHealthMeter financialHealth={financialHealth} />

              {/* AI Recommendations */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <Brain className="h-8 w-8 text-toyota-red" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    AI Recommendations
                  </h2>
                </div>

                <div className="space-y-4">
                  {aiRecommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.type === "tip"
                          ? "border-blue-500 bg-blue-50"
                          : rec.type === "warning"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-green-500 bg-green-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {rec.type === "tip" && (
                          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                        )}
                        {rec.type === "warning" && (
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        )}
                        {rec.type === "opportunity" && (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        )}

                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {rec.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {rec.description}
                          </p>
                          {rec.action && (
                            <button className="text-toyota-red hover:text-red-700 font-medium mt-2">
                              {rec.action} →
                            </button>
                          )}
                        </div>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : rec.impact === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {rec.impact} impact
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "calculator" && (
            <FinancingCalculator financialData={financialData} />
          )}

          {activeTab === "vehicles" && (
            <VehicleMatcher financialData={financialData} />
          )}

          {activeTab === "coach" && (
            <AIFinancialCoach financialData={financialData} />
          )}

          {activeTab === "achievements" && (
            <AchievementPanel financialData={financialData} />
          )}
        </div>
      </div>
    </div>
  );
}
