"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Percent,
} from "lucide-react";
import { FinancialData, FinancingOption } from "@/types/financial";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface FinancingCalculatorProps {
  financialData: FinancialData;
}

export default function FinancingCalculator({
  financialData,
}: FinancingCalculatorProps) {
  const [scenarios, setScenarios] = useState<FinancingOption[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState({
    principal:
      financialData.preferences.budget - financialData.preferences.downPayment,
    rate: 6.5,
    term: financialData.preferences.loanTerm,
    downPayment: financialData.preferences.downPayment,
  });

  useEffect(() => {
    generateScenarios();
  }, [financialData]);

  const generateScenarios = () => {
    const basePrincipal =
      financialData.preferences.budget - financialData.preferences.downPayment;
    const creditScore = financialData.personalInfo.creditScore;

    // Generate different financing scenarios based on credit score
    const scenarios: FinancingOption[] = [
      {
        id: "conservative",
        type: "loan",
        monthlyPayment: calculatePayment(basePrincipal, 5.5, 60),
        totalCost:
          calculatePayment(basePrincipal, 5.5, 60) * 60 +
          financialData.preferences.downPayment,
        interestRate: 5.5,
        term: 60,
        downPayment: financialData.preferences.downPayment,
        savings: 0,
        features: [
          "Low interest rate",
          "Conservative approach",
          "Stable payments",
        ],
        pros: ["Lowest interest rate", "Predictable payments"],
        cons: ["Higher monthly payments", "Longer commitment"],
      },
      {
        id: "balanced",
        type: "loan",
        monthlyPayment: calculatePayment(basePrincipal, 6.5, 72),
        totalCost:
          calculatePayment(basePrincipal, 6.5, 72) * 72 +
          financialData.preferences.downPayment,
        interestRate: 6.5,
        term: 72,
        downPayment: financialData.preferences.downPayment,
        savings:
          calculatePayment(basePrincipal, 5.5, 60) * 60 -
          calculatePayment(basePrincipal, 6.5, 72) * 72,
        features: ["Balanced approach", "Moderate payments", "Flexible term"],
        pros: [
          "Moderate monthly payments",
          "Good balance of cost and affordability",
        ],
        cons: ["Higher total interest", "Longer repayment period"],
      },
      {
        id: "aggressive",
        type: "loan",
        monthlyPayment: calculatePayment(basePrincipal, 7.5, 84),
        totalCost:
          calculatePayment(basePrincipal, 7.5, 84) * 84 +
          financialData.preferences.downPayment,
        interestRate: 7.5,
        term: 84,
        downPayment: financialData.preferences.downPayment,
        savings:
          calculatePayment(basePrincipal, 5.5, 60) * 60 -
          calculatePayment(basePrincipal, 7.5, 84) * 84,
        features: [
          "Lowest monthly payment",
          "Extended term",
          "Maximum affordability",
        ],
        pros: ["Lowest monthly payments", "More cash flow flexibility"],
        cons: [
          "Highest total interest",
          "Longest commitment",
          "Higher interest rate",
        ],
      },
      {
        id: "lease",
        type: "lease",
        monthlyPayment: basePrincipal * 0.012, // Approximate lease rate
        totalCost:
          basePrincipal * 0.012 * 36 + financialData.preferences.downPayment,
        interestRate: 0,
        term: 36,
        downPayment: financialData.preferences.downPayment,
        savings: 0,
        features: [
          "Low monthly payments",
          "New vehicle every 3 years",
          "Warranty coverage",
        ],
        pros: [
          "Lowest monthly payments",
          "Always under warranty",
          "No depreciation risk",
        ],
        cons: ["No ownership", "Mileage restrictions", "Continuous payments"],
      },
    ];

    setScenarios(scenarios);
  };

  const calculatePayment = (
    principal: number,
    rate: number,
    term: number
  ): number => {
    const monthlyRate = rate / 100 / 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1)
    );
  };

  const updateCustomCalculation = () => {
    const monthlyPayment = calculatePayment(
      customValues.principal,
      customValues.rate,
      customValues.term
    );
    const totalCost =
      monthlyPayment * customValues.term + customValues.downPayment;

    return { monthlyPayment, totalCost };
  };

  const customCalculation = updateCustomCalculation();

  const getPaymentChartData = () => {
    return scenarios.map((scenario, index) => ({
      name: scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1),
      payment: Math.round(scenario.monthlyPayment),
      total: Math.round(scenario.totalCost / 1000), // In thousands
    }));
  };

  const getAmortizationData = (scenario: FinancingOption) => {
    const data = [];
    let balance = customValues.principal;

    for (let month = 1; month <= scenario.term; month++) {
      const interestPayment = balance * (scenario.interestRate / 100 / 12);
      const principalPayment = scenario.monthlyPayment - interestPayment;
      balance -= principalPayment;

      if (month % 12 === 0 || month === scenario.term) {
        data.push({
          year: Math.ceil(month / 12),
          balance: Math.max(0, balance),
          interest: interestPayment,
          principal: principalPayment,
        });
      }
    }

    return data;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="h-8 w-8 text-toyota-red" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Financing Calculator
        </h2>
      </div>

      {/* Custom Calculator */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Custom Calculator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Amount
            </label>
            <input
              type="number"
              value={customValues.principal}
              onChange={(e) =>
                setCustomValues((prev) => ({
                  ...prev,
                  principal: Number(e.target.value),
                }))
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={customValues.rate}
              onChange={(e) =>
                setCustomValues((prev) => ({
                  ...prev,
                  rate: Number(e.target.value),
                }))
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term (months)
            </label>
            <input
              type="number"
              value={customValues.term}
              onChange={(e) =>
                setCustomValues((prev) => ({
                  ...prev,
                  term: Number(e.target.value),
                }))
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment
            </label>
            <input
              type="number"
              value={customValues.downPayment}
              onChange={(e) =>
                setCustomValues((prev) => ({
                  ...prev,
                  downPayment: Number(e.target.value),
                }))
              }
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Monthly Payment</p>
              <p className="text-2xl font-bold text-toyota-red">
                ${Math.round(customCalculation.monthlyPayment)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Math.round(customCalculation.totalCost).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-2xl font-bold text-gray-700">
                $
                {Math.round(
                  customCalculation.totalCost -
                    customValues.principal -
                    customValues.downPayment
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Financing Scenarios
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scenarios List */}
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedScenario === scenario.id
                    ? "border-toyota-red bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {scenario.id} Option
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      scenario.type === "lease"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {scenario.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Payment</p>
                    <p className="font-semibold text-toyota-red">
                      ${Math.round(scenario.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Cost</p>
                    <p className="font-semibold text-gray-900">
                      ${Math.round(scenario.totalCost).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="font-semibold text-gray-900">
                      {scenario.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Term</p>
                    <p className="font-semibold text-gray-900">
                      {scenario.term} months
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Comparison Chart */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Payment Comparison
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getPaymentChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "payment" ? `$${value}` : `${value}K`,
                      name === "payment" ? "Monthly Payment" : "Total Cost",
                    ]}
                  />
                  <Bar dataKey="payment" fill="#EB0A1E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Scenario Details */}
      {selectedScenario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {(() => {
            const scenario = scenarios.find((s) => s.id === selectedScenario);
            if (!scenario) return null;

            return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 capitalize">
                  {scenario.id} Scenario Details
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {scenario.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-toyota-red rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-semibold text-gray-900 mb-4 mt-6">
                      Pros & Cons
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">
                          Advantages
                        </h5>
                        <ul className="space-y-1">
                          {scenario.pros.map((pro, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">
                          Considerations
                        </h5>
                        <ul className="space-y-1">
                          {scenario.cons.map((con, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Amortization Schedule
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getAmortizationData(scenario)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#EB0A1E"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="interest"
                            stroke="#10B981"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="principal"
                            stroke="#3B82F6"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
