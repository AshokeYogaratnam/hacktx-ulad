"use client";

import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { FinancialData } from "@/types/financial";

interface Props {
  onComplete: (data: FinancialData) => void;
  onCancel?: () => void;
}

type Question = {
  id: string;
  label: string;
  type: "number" | "range" | "select" | "nl";
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  placeholder?: string;
};

const QUESTIONS: Question[] = [
  { id: "annualIncome", label: "What's your annual income?", type: "number", min: 0, placeholder: "e.g. 60000" },
  { id: "creditScore", label: "What's your credit score?", type: "range", min: 300, max: 850, step: 1 },
  { id: "monthlyPaymentTarget", label: "What's a comfortable monthly payment?", type: "nl", placeholder: "e.g. around $400" },
  { id: "vehicleType", label: "Preferred vehicle type", type: "select", options: ["sedan", "suv", "truck", "hybrid", "luxury"] },
];

function parseNaturalLanguage(input: string, key: string) {
  // very small local parser: pick numbers and keywords
  const num = input.replace(/[^0-9.]/g, "");
  if (num) return Number(num);

  if (key === "vehicleType") {
    const lc = input.toLowerCase();
    if (lc.includes("suv")) return "suv";
    if (lc.includes("truck")) return "truck";
    if (lc.includes("hybrid")) return "hybrid";
    if (lc.includes("lux")) return "luxury";
    return "sedan";
  }

  return input;
}

export default function ProgressiveProfile({ onComplete, onCancel }: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const q = QUESTIONS[idx];

  const handleNext = (value: any) => {
    setAnswers((s) => ({ ...s, [q.id]: value }));
    if (idx < QUESTIONS.length - 1) setIdx(idx + 1);
    else finish({ ...answers, [q.id]: value });
  };

  const finish = (data: Record<string, any>) => {
    const financialData: FinancialData = {
      personalInfo: {
        annualIncome: Number(data.annualIncome || 50000),
        monthlyExpenses: Number(data.monthlyExpenses || 2000),
        creditScore: Number(data.creditScore || 650),
        employmentStatus: "employed",
        debtToIncomeRatio: Number(( (Number(data.monthlyExpenses || 2000) * 12) / Number(data.annualIncome || 50000)).toFixed(2)),
      },
      preferences: {
        budget: Number(data.budget || 25000),
        downPayment: Number(data.downPayment || 5000),
        loanTerm: Number(data.loanTerm || 60),
        vehicleType: (data.vehicleType as any) || "sedan",
        lifestyle: [],
        features: [],
      },
      goals: {
        monthlyPaymentTarget: Number(data.monthlyPaymentTarget || 400),
        financialGoals: [],
        timeline: Number(data.loanTerm || 60),
      },
    };

    onComplete(financialData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={onCancel} className="btn-secondary inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </button>
          <div className="text-sm text-gray-600">Progressive questionnaire</div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{q.label}</h2>

          {/* Render input types */}
          {q.type === "number" && (
            <div className="space-y-4">
              <input
                type="number"
                defaultValue={(answers[q.id] as any) || ""}
                placeholder={q.placeholder}
                className="input-field"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext((e.target as HTMLInputElement).value);
                }}
              />

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const el = document.querySelector('input[type=number]') as HTMLInputElement | null;
                    handleNext(el?.value || "");
                  }}
                  className="btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {q.type === "range" && (
            <div className="space-y-4">
              <input
                type="range"
                min={q.min}
                max={q.max}
                step={q.step || 1}
                defaultValue={(answers[q.id] as any) || ((q.min ?? 300) + ((q.max ?? 850) - (q.min ?? 300)) / 2)}
                onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{q.min}</span>
                <span className="text-sm font-medium">{answers[q.id] ?? (Math.round(((q.min ?? 300) + ((q.max ?? 850) - (q.min ?? 300)) / 2)))}</span>
                <span className="text-sm text-gray-500">{q.max}</span>
              </div>
              <div className="flex justify-end">
                <button onClick={() => handleNext(answers[q.id])} className="btn-primary">Next</button>
              </div>
            </div>
          )}

          {q.type === "select" && (
            <div className="space-y-4">
              <select className="input-field" defaultValue={(answers[q.id] as any) || q.options?.[0]} onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: e.target.value }))}>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="flex justify-end">
                <button onClick={() => handleNext(answers[q.id] ?? q.options?.[0])} className="btn-primary">Next</button>
              </div>
            </div>
          )}

          {q.type === "nl" && (
            <div className="space-y-4">
              <input type="text" placeholder={q.placeholder} className="input-field" onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value;
                  handleNext(parseNaturalLanguage(v, q.id));
                }
              }} />
              <div className="flex justify-end">
                <button onClick={() => {
                  const el = document.querySelector('input[type=text]') as HTMLInputElement | null;
                  handleNext(parseNaturalLanguage(el?.value || '', q.id));
                }} className="btn-primary">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
