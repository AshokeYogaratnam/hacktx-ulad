"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  CreditCard,
  Target,
  Car,
  Check,
} from "lucide-react";
import { FinancialData } from "@/types/financial";

const profileSchema = z.object({
  annualIncome: z.number().min(20000, "Minimum income required"),
  monthlyExpenses: z.number().min(500, "Minimum expenses required"),
  creditScore: z.number().min(300).max(850),
  employmentStatus: z.enum([
    "employed",
    "self-employed",
    "unemployed",
    "retired",
  ]),
  budget: z.number().min(5000, "Minimum budget required"),
  downPayment: z.number().min(0),
  loanTerm: z.number().min(12).max(84),
  vehicleType: z.enum(["sedan", "suv", "truck", "hybrid", "luxury"]),
  lifestyle: z.array(z.string()),
  monthlyPaymentTarget: z.number().min(100),
  financialGoals: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface FinancialProfileProps {
  onComplete: (data: FinancialData) => void;
  onBack: () => void;
}

export default function FinancialProfile({
  onComplete,
  onBack,
}: FinancialProfileProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      annualIncome: 50000,
      monthlyExpenses: 2000,
      creditScore: 650,
      employmentStatus: "employed",
      budget: 25000,
      downPayment: 5000,
      loanTerm: 60,
      vehicleType: "sedan",
      monthlyPaymentTarget: 400,
    },
  });

  const watchedValues = watch();

  const lifestyleOptions = [
    { id: "family", label: "Family-oriented", icon: "👨‍👩‍👧‍👦" },
    { id: "adventure", label: "Adventure seeker", icon: "🏔️" },
    { id: "business", label: "Business professional", icon: "💼" },
    { id: "eco-conscious", label: "Eco-conscious", icon: "🌱" },
    { id: "tech-savvy", label: "Tech-savvy", icon: "📱" },
    { id: "luxury", label: "Luxury focused", icon: "✨" },
  ];

  const goalOptions = [
    { id: "save-money", label: "Save money on payments" },
    { id: "build-credit", label: "Build credit score" },
    { id: "low-maintenance", label: "Low maintenance costs" },
    { id: "fuel-efficiency", label: "Fuel efficiency" },
    { id: "resale-value", label: "High resale value" },
    { id: "warranty", label: "Comprehensive warranty" },
  ];

  const toggleLifestyle = (id: string) => {
    setSelectedLifestyle((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: ProfileFormData) => {
    const financialData: FinancialData = {
      personalInfo: {
        annualIncome: data.annualIncome,
        monthlyExpenses: data.monthlyExpenses,
        creditScore: data.creditScore,
        employmentStatus: data.employmentStatus,
        debtToIncomeRatio: (data.monthlyExpenses * 12) / data.annualIncome,
      },
      preferences: {
        budget: data.budget,
        downPayment: data.downPayment,
        loanTerm: data.loanTerm,
        vehicleType: data.vehicleType,
        lifestyle: selectedLifestyle,
        features: [],
      },
      goals: {
        monthlyPaymentTarget: data.monthlyPaymentTarget,
        financialGoals: selectedGoals,
        timeline: data.loanTerm,
      },
    };

    onComplete(financialData);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getProgress = () => (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-toyota-red transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Financial Profile
          </h1>
          <p className="text-gray-600">
            Help us understand your financial situation to provide personalized
            recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of 4</span>
            <span>{Math.round(getProgress())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-toyota-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Financial Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <DollarSign className="h-8 w-8 text-toyota-red" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Financial Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    {...register("annualIncome", { valueAsNumber: true })}
                    className="input-field"
                    placeholder="50000"
                  />
                  {errors.annualIncome && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.annualIncome.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Expenses
                  </label>
                  <input
                    type="number"
                    {...register("monthlyExpenses", { valueAsNumber: true })}
                    className="input-field"
                    placeholder="2000"
                  />
                  {errors.monthlyExpenses && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.monthlyExpenses.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Score
                  </label>
                  <input
                    type="number"
                    {...register("creditScore", { valueAsNumber: true })}
                    className="input-field"
                    placeholder="650"
                  />
                  {errors.creditScore && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.creditScore.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status
                  </label>
                  <select
                    {...register("employmentStatus")}
                    className="input-field"
                  >
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Budget & Preferences */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="h-8 w-8 text-toyota-red" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Budget & Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Budget
                  </label>
                  <input
                    type="number"
                    {...register("budget", { valueAsNumber: true })}
                    className="input-field"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    {...register("downPayment", { valueAsNumber: true })}
                    className="input-field"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (months)
                  </label>
                  <select
                    {...register("loanTerm", { valueAsNumber: true })}
                    className="input-field"
                  >
                    <option value={36}>36 months</option>
                    <option value={48}>48 months</option>
                    <option value={60}>60 months</option>
                    <option value={72}>72 months</option>
                    <option value={84}>84 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <select {...register("vehicleType")} className="input-field">
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Lifestyle & Goals */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Target className="h-8 w-8 text-toyota-red" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Lifestyle & Goals
                </h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select your lifestyle (choose all that apply):
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {lifestyleOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleLifestyle(option.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedLifestyle.includes(option.id)
                            ? "border-toyota-red bg-red-50 text-toyota-red"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="text-sm font-medium">
                          {option.label}
                        </div>
                        {selectedLifestyle.includes(option.id) && (
                          <Check className="h-4 w-4 absolute top-2 right-2 text-toyota-red" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Financial goals (choose all that apply):
                  </h3>
                  <div className="space-y-3">
                    {goalOptions.map((goal) => (
                      <label
                        key={goal.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGoals.includes(goal.id)}
                          onChange={() => toggleGoal(goal.id)}
                          className="h-4 w-4 text-toyota-red focus:ring-toyota-red border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{goal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment Target */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Car className="h-8 w-8 text-toyota-red" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Payment Target
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Monthly Payment
                </label>
                <input
                  type="number"
                  {...register("monthlyPaymentTarget", { valueAsNumber: true })}
                  className="input-field"
                  placeholder="400"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Based on your income, we recommend a payment under $
                  {Math.round((watchedValues.annualIncome / 12) * 0.15)}
                </p>
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Annual Income:</span>
                    <span className="ml-2 font-medium">
                      ${watchedValues.annualIncome?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Budget:</span>
                    <span className="ml-2 font-medium">
                      ${watchedValues.budget?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Credit Score:</span>
                    <span className="ml-2 font-medium">
                      {watchedValues.creditScore}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vehicle Type:</span>
                    <span className="ml-2 font-medium capitalize">
                      {watchedValues.vehicleType}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Complete Profile
                <Check className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
