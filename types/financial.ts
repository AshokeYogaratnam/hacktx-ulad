export interface FinancialData {
  personalInfo: {
    annualIncome: number;
    monthlyExpenses: number;
    creditScore: number;
    employmentStatus: "employed" | "self-employed" | "unemployed" | "retired";
    debtToIncomeRatio: number;
  };
  preferences: {
    budget: number;
    downPayment: number;
    loanTerm: number;
    vehicleType: "sedan" | "suv" | "truck" | "hybrid" | "luxury";
    lifestyle: string[];
    features: string[];
  };
  goals: {
    monthlyPaymentTarget: number;
    financialGoals: string[];
    timeline: number;
  };
}

export interface FinancingOption {
  id: string;
  type: "loan" | "lease";
  monthlyPayment: number;
  totalCost: number;
  interestRate: number;
  term: number;
  downPayment: number;
  savings: number;
  features: string[];
  pros: string[];
  cons: string[];
}

export interface VehicleRecommendation {
  id: string;
  name: string;
  model: string;
  year: number;
  price: number;
  monthlyPayment: number;
  image: string;
  features: string[];
  matchScore: number;
  financingOptions: FinancingOption[];
}

export interface FinancialHealthScore {
  overall: number;
  credit: number;
  income: number;
  debt: number;
  savings: number;
  recommendations: string[];
}

export interface AIRecommendation {
  type: "tip" | "warning" | "opportunity";
  title: string;
  description: string;
  action?: string;
  impact: "low" | "medium" | "high";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  reward: string;
}
