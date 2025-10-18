"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { FinancialHealthScore } from "@/types/financial";

interface FinancialHealthMeterProps {
  financialHealth: FinancialHealthScore | null;
}

export default function FinancialHealthMeter({
  financialHealth,
}: FinancialHealthMeterProps) {
  if (!financialHealth) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4" />;
    if (score >= 50) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const categories = [
    { name: "Credit", score: financialHealth.credit, label: "Credit Score" },
    { name: "Income", score: financialHealth.income, label: "Income Level" },
    { name: "Debt", score: financialHealth.debt, label: "Debt Management" },
    { name: "Savings", score: financialHealth.savings, label: "Savings Rate" },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Financial Health Score
        </h2>
        <div
          className={`px-4 py-2 rounded-full ${getScoreColor(
            financialHealth.overall
          )}`}
        >
          <div className="flex items-center space-x-2">
            {getScoreIcon(financialHealth.overall)}
            <span className="font-semibold">{financialHealth.overall}/100</span>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Overall Score
          </span>
          <span className="text-sm text-gray-500">
            {financialHealth.overall}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${financialHealth.overall}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              financialHealth.overall >= 80
                ? "bg-green-500"
                : financialHealth.overall >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getScoreColor(
                category.score
              )} mb-3`}
            >
              {getScoreIcon(category.score)}
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{category.label}</h3>
            <p
              className={`text-2xl font-bold ${
                getScoreColor(category.score).split(" ")[0]
              }`}
            >
              {category.score}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.score}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                className={`h-2 rounded-full ${
                  category.score >= 80
                    ? "bg-green-500"
                    : category.score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Health Level Description */}
      <div className="mt-8 p-4 rounded-lg bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-2">
          Health Level Assessment
        </h3>
        <p className="text-gray-600 text-sm">
          {financialHealth.overall >= 80
            ? "Excellent! Your financial health is in great shape. You're well-positioned for favorable financing terms."
            : financialHealth.overall >= 60
            ? "Good! Your financial health is solid with room for improvement in some areas."
            : "Needs attention. Focus on improving your credit score and debt management for better financing options."}
        </p>
      </div>
    </div>
  );
}
