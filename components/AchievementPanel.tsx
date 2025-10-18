"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Target,
  TrendingUp,
  Shield,
  DollarSign,
  CreditCard,
  Car,
  CheckCircle,
  Lock,
  Award,
  Zap,
} from "lucide-react";
import { FinancialData, Achievement } from "@/types/financial";

interface AchievementPanelProps {
  financialData: FinancialData;
}

export default function AchievementPanel({
  financialData,
}: AchievementPanelProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState({
    totalSavings: 0,
    creditImprovement: 0,
    goalsCompleted: 0,
    streak: 0,
  });

  useEffect(() => {
    generateAchievements();
    calculateUserStats();
  }, [financialData]);

  const generateAchievements = () => {
    const allAchievements: Achievement[] = [
      {
        id: "first-profile",
        title: "Profile Pioneer",
        description: "Complete your financial profile",
        icon: "👤",
        unlocked: true,
        progress: 100,
        reward: "Unlocked personalized recommendations",
      },
      {
        id: "credit-optimizer",
        title: "Credit Optimizer",
        description: "Achieve a credit score above 720",
        icon: "📈",
        unlocked: financialData.personalInfo.creditScore >= 720,
        progress: Math.min(
          100,
          (financialData.personalInfo.creditScore / 720) * 100
        ),
        reward: "Better financing rates",
      },
      {
        id: "budget-master",
        title: "Budget Master",
        description: "Keep vehicle budget under 20% of annual income",
        icon: "💰",
        unlocked:
          financialData.preferences.budget /
            financialData.personalInfo.annualIncome <=
          0.2,
        progress: Math.min(
          100,
          (0.2 /
            (financialData.preferences.budget /
              financialData.personalInfo.annualIncome)) *
            100
        ),
        reward: "Financial stability badge",
      },
      {
        id: "down-payment-hero",
        title: "Down Payment Hero",
        description: "Make a 20% down payment",
        icon: "💎",
        unlocked:
          financialData.preferences.downPayment /
            financialData.preferences.budget >=
          0.2,
        progress: Math.min(
          100,
          (financialData.preferences.downPayment /
            financialData.preferences.budget) *
            100 *
            5
        ),
        reward: "Lower monthly payments",
      },
      {
        id: "debt-destroyer",
        title: "Debt Destroyer",
        description: "Maintain debt-to-income ratio under 40%",
        icon: "⚡",
        unlocked: financialData.personalInfo.debtToIncomeRatio <= 0.4,
        progress: Math.max(
          0,
          (1 - financialData.personalInfo.debtToIncomeRatio / 0.4) * 100
        ),
        reward: "Better loan approval odds",
      },
      {
        id: "goal-setter",
        title: "Goal Setter",
        description: "Set 3 or more financial goals",
        icon: "🎯",
        unlocked: financialData.goals.financialGoals.length >= 3,
        progress: Math.min(
          100,
          (financialData.goals.financialGoals.length / 3) * 100
        ),
        reward: "Focused financial planning",
      },
      {
        id: "payment-planner",
        title: "Payment Planner",
        description: "Set a realistic monthly payment target",
        icon: "📅",
        unlocked:
          financialData.goals.monthlyPaymentTarget <=
          (financialData.personalInfo.annualIncome * 0.15) / 12,
        progress: Math.min(
          100,
          ((financialData.personalInfo.annualIncome * 0.15) /
            12 /
            financialData.goals.monthlyPaymentTarget) *
            100
        ),
        reward: "Sustainable payment plan",
      },
      {
        id: "lifestyle-matcher",
        title: "Lifestyle Matcher",
        description: "Define your lifestyle preferences",
        icon: "🏠",
        unlocked: financialData.preferences.lifestyle.length >= 2,
        progress: Math.min(
          100,
          (financialData.preferences.lifestyle.length / 2) * 100
        ),
        reward: "Better vehicle recommendations",
      },
      {
        id: "financial-guru",
        title: "Financial Guru",
        description: "Unlock all basic achievements",
        icon: "🧠",
        unlocked: false, // Will be calculated based on other achievements
        progress: 0,
        reward: "Master financial navigator status",
      },
      {
        id: "toyota-champion",
        title: "Toyota Champion",
        description: "Complete your Toyota financing journey",
        icon: "🏆",
        unlocked: false,
        progress: 0,
        reward: "Exclusive Toyota rewards",
      },
    ];

    // Calculate if Financial Guru is unlocked (basic achievements)
    const basicAchievements = allAchievements.slice(0, 7);
    const basicUnlocked = basicAchievements.filter((a) => a.unlocked).length;
    allAchievements[8].unlocked = basicUnlocked >= 5;
    allAchievements[8].progress = (basicUnlocked / 7) * 100;

    setAchievements(allAchievements);
  };

  const calculateUserStats = () => {
    const stats = {
      totalSavings: Math.round(financialData.preferences.budget * 0.05), // Estimated savings
      creditImprovement: Math.max(
        0,
        financialData.personalInfo.creditScore - 650
      ),
      goalsCompleted: financialData.goals.financialGoals.length,
      streak: Math.floor(Math.random() * 30) + 1, // Mock streak
    };
    setUserStats(stats);
  };

  const getAchievementColor = (achievement: Achievement) => {
    if (achievement.unlocked) {
      return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    }
    return "bg-gray-200";
  };

  const getAchievementIcon = (achievement: Achievement) => {
    if (achievement.unlocked) {
      return <Trophy className="h-8 w-8 text-white" />;
    }
    return <Lock className="h-8 w-8 text-gray-400" />;
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className="h-8 w-8 text-toyota-red" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Achievement Center
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Total Savings</p>
          <p className="text-2xl font-bold text-gray-900">
            ${userStats.totalSavings.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Credit Improvement</p>
          <p className="text-2xl font-bold text-gray-900">
            +{userStats.creditImprovement}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Goals Completed</p>
          <p className="text-2xl font-bold text-gray-900">
            {userStats.goalsCompleted}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
            <Zap className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-gray-600">Day Streak</p>
          <p className="text-2xl font-bold text-gray-900">{userStats.streak}</p>
        </motion.div>
      </div>

      {/* Achievement Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Achievement Progress
          </h3>
          <div className="text-sm text-gray-600">
            {unlockedAchievements.length} of {achievements.length} unlocked
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                (unlockedAchievements.length / achievements.length) * 100
              }%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Unlocked Achievements
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-xl ${getAchievementColor(
                achievement
              )} shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{achievement.icon}</div>
                <CheckCircle className="h-6 w-6 text-white" />
              </div>

              <h4 className="font-semibold text-white mb-2">
                {achievement.title}
              </h4>
              <p className="text-white/90 text-sm mb-3">
                {achievement.description}
              </p>

              <div className="bg-white/20 rounded-lg p-2">
                <p className="text-white text-xs font-medium">
                  Reward: {achievement.reward}
                </p>
              </div>

              <div className="absolute top-2 right-2">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Available Achievements
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-gray-100 rounded-xl border-2 border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl opacity-50">{achievement.icon}</div>
                <Lock className="h-6 w-6 text-gray-400" />
              </div>

              <h4 className="font-semibold text-gray-700 mb-2">
                {achievement.title}
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                {achievement.description}
              </p>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(achievement.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-toyota-red h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg p-2">
                <p className="text-gray-600 text-xs font-medium">
                  Reward: {achievement.reward}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tips to Unlock More Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-toyota-red rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Improve Your Credit Score
                </h4>
                <p className="text-sm text-gray-600">
                  Pay bills on time and reduce credit utilization to unlock
                  better financing rates.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-toyota-red rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Increase Down Payment
                </h4>
                <p className="text-sm text-gray-600">
                  Save more for a larger down payment to reduce monthly payments
                  and total interest.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-toyota-red rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">Set More Goals</h4>
                <p className="text-sm text-gray-600">
                  Define additional financial goals to stay focused and
                  motivated.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-toyota-red rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Optimize Your Budget
                </h4>
                <p className="text-sm text-gray-600">
                  Keep your vehicle budget under 20% of your annual income for
                  financial stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
