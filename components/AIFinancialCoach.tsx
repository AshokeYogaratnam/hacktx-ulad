"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  CreditCard,
  Target,
  Send,
} from "lucide-react";
import { FinancialData, AIRecommendation } from "@/types/financial";

interface AIFinancialCoachProps {
  financialData: FinancialData;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function AIFinancialCoach({
  financialData,
}: AIFinancialCoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with welcome message and personalized recommendations
    const welcomeMessage: ChatMessage = {
      id: "1",
      type: "ai",
      content: `Hello! I'm your AI Financial Coach. I've analyzed your financial profile and I'm here to help you make the best financing decisions for your Toyota vehicle. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        "How can I improve my credit score?",
        "What financing option is best for me?",
        "How much should I put down?",
        "Should I lease or buy?",
      ],
    };

    setMessages([welcomeMessage]);
  }, []);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const message = userMessage.toLowerCase();

    // Credit score improvement
    if (message.includes("credit") || message.includes("score")) {
      return `Based on your current credit score of ${financialData.personalInfo.creditScore}, here are some strategies to improve it:

1. **Pay bills on time** - This is the most important factor (35% of your score)
2. **Reduce credit utilization** - Keep balances below 30% of your credit limits
3. **Don't close old accounts** - Length of credit history matters
4. **Limit new credit applications** - Each hard inquiry can lower your score by 5-10 points
5. **Check for errors** - Review your credit reports regularly

Your goal should be to reach 720+ for the best financing rates. With your current score, you're likely to get rates around 6-8% APR.`;
    }

    // Financing options
    if (
      message.includes("financing") ||
      message.includes("option") ||
      message.includes("best")
    ) {
      const debtToIncome = financialData.personalInfo.debtToIncomeRatio;
      const recommendation = debtToIncome > 0.4 ? "lease" : "loan";

      return `Based on your financial profile, I recommend a ${recommendation} option:

**Your Situation:**
- Annual Income: $${financialData.personalInfo.annualIncome.toLocaleString()}
- Debt-to-Income Ratio: ${(debtToIncome * 100).toFixed(1)}%
- Target Payment: $${financialData.goals.monthlyPaymentTarget}

**My Recommendation:**
${
  recommendation === "lease"
    ? "Leasing might be better for you because it offers lower monthly payments and less commitment. Perfect if you like driving newer vehicles every 3 years."
    : "A traditional loan is better for you. Your debt-to-income ratio is manageable, and you'll build equity in the vehicle."
}

**Next Steps:**
1. Consider increasing your down payment to reduce monthly payments
2. Shop around for the best interest rates
3. Consider a longer term if cash flow is tight`;
    }

    // Down payment advice
    if (message.includes("down payment") || message.includes("down")) {
      const recommendedDown = financialData.preferences.budget * 0.2;
      const currentDown = financialData.preferences.downPayment;

      return `Here's my advice on down payments:

**Current Down Payment:** $${currentDown.toLocaleString()}
**Recommended:** $${recommendedDown.toLocaleString()} (20% of vehicle price)

**Benefits of a Larger Down Payment:**
- Lower monthly payments
- Reduced total interest paid
- Better loan terms and rates
- Immediate equity in the vehicle

**Your Options:**
${
  currentDown < recommendedDown
    ? `Consider saving an additional $${(
        recommendedDown - currentDown
      ).toLocaleString()} to reach the 20% threshold. This could save you $${Math.round(
        ((recommendedDown - currentDown) * 0.065) / 12
      )} per month in payments.`
    : "Great! Your down payment is at a healthy level."
}

**Pro Tip:** If you can't afford 20% now, consider a longer loan term initially, then make extra principal payments when possible.`;
    }

    // Lease vs Buy
    if (message.includes("lease") || message.includes("buy")) {
      return `Let me help you decide between leasing and buying:

**Leasing Pros:**
- Lower monthly payments (typically 30-40% less)
- Always drive a newer vehicle
- Minimal maintenance costs (under warranty)
- No depreciation risk

**Leasing Cons:**
- No ownership or equity building
- Mileage restrictions (usually 12,000-15,000/year)
- Continuous payments (never "paid off")
- Fees for excess wear and tear

**Buying Pros:**
- Build equity and ownership
- No mileage restrictions
- Can modify the vehicle
- Eventually no payments

**Buying Cons:**
- Higher monthly payments
- Responsible for all maintenance after warranty
- Depreciation risk
- Longer commitment

**For You Specifically:**
Given your income of $${financialData.personalInfo.annualIncome.toLocaleString()} and budget of $${financialData.preferences.budget.toLocaleString()}, ${
        financialData.personalInfo.debtToIncomeRatio > 0.4
          ? "leasing might provide better cash flow"
          : "buying could be a good investment"
      } in the long run.`;
    }

    // Budget planning
    if (message.includes("budget") || message.includes("afford")) {
      const maxAffordable =
        (financialData.personalInfo.annualIncome * 0.15) / 12;
      const currentTarget = financialData.goals.monthlyPaymentTarget;

      return `Let's analyze what you can afford:

**Financial Rule of Thumb:**
- Car payment should be ≤ 15% of monthly take-home pay
- Your maximum affordable payment: ~$${Math.round(maxAffordable)}

**Your Current Target:** $${currentTarget}
${
  currentTarget <= maxAffordable
    ? "✅ Your target is within a safe range!"
    : "⚠️ Your target is above the recommended 15% rule. Consider reducing your budget or increasing your down payment."
}

**Budget Breakdown:**
- Vehicle payment: $${currentTarget}
- Insurance: ~$${Math.round(currentTarget * 0.15)}
- Gas: ~$${Math.round(currentTarget * 0.2)}
- Maintenance: ~$${Math.round(currentTarget * 0.1)}
- **Total monthly cost: ~$${Math.round(currentTarget * 1.45)}**

**My Recommendation:** Keep your total vehicle costs under 20% of your monthly income for financial stability.`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Let me provide some general financial advice:

Based on your profile, here are some key areas to focus on:

1. **Credit Optimization** - Your score of ${
      financialData.personalInfo.creditScore
    } is ${
      financialData.personalInfo.creditScore >= 720
        ? "excellent"
        : financialData.personalInfo.creditScore >= 650
        ? "good"
        : "fair"
    }

2. **Payment Strategy** - Your target of $${
      financialData.goals.monthlyPaymentTarget
    } is ${
      financialData.goals.monthlyPaymentTarget <=
      (financialData.personalInfo.annualIncome * 0.15) / 12
        ? "reasonable"
        : "above recommended guidelines"
    }

3. **Budget Alignment** - Your budget of $${financialData.preferences.budget.toLocaleString()} represents ${(
      (financialData.preferences.budget /
        financialData.personalInfo.annualIncome) *
      100
    ).toFixed(1)}% of your annual income

Feel free to ask me about specific aspects of your financing journey!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    const aiResponse = await generateAIResponse(inputMessage);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getQuickInsights = () => [
    {
      icon: CreditCard,
      title: "Credit Score",
      value: financialData.personalInfo.creditScore,
      status:
        financialData.personalInfo.creditScore >= 720 ? "excellent" : "good",
      tip: "Consider improving your score for better rates",
    },
    {
      icon: DollarSign,
      title: "Monthly Target",
      value: `$${financialData.goals.monthlyPaymentTarget}`,
      status: "on-track",
      tip: "Your payment target is reasonable",
    },
    {
      icon: Target,
      title: "Budget Utilization",
      value: `${Math.round(
        (financialData.preferences.budget /
          financialData.personalInfo.annualIncome) *
          100
      )}%`,
      status: "good",
      tip: "Your budget is well-balanced",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="h-8 w-8 text-toyota-red" />
        <h2 className="text-2xl font-semibold text-gray-900">
          AI Financial Coach
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="card h-96 flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="h-6 w-6 text-toyota-red" />
              <h3 className="text-lg font-semibold text-gray-900">
                Chat with Your Coach
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-toyota-red text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-red-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Quick questions you can ask:
                </p>
                <div className="flex flex-wrap gap-2">
                  {messages[0].suggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything about financing..."
                className="flex-1 input-field"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Insights
            </h3>
            <div className="space-y-4">
              {getQuickInsights().map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-white rounded-lg">
                    <insight.icon className="h-5 w-5 text-toyota-red" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {insight.title}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {insight.value}
                    </p>
                    <p className="text-xs text-gray-600">{insight.tip}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {[
                {
                  action: "Improve credit score",
                  priority: "high",
                  icon: TrendingUp,
                },
                {
                  action: "Increase down payment",
                  priority: "medium",
                  icon: DollarSign,
                },
                {
                  action: "Compare financing options",
                  priority: "high",
                  icon: CheckCircle,
                },
                {
                  action: "Review budget allocation",
                  priority: "low",
                  icon: Target,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      item.priority === "high"
                        ? "text-red-600"
                        : item.priority === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.action}
                    </p>
                    <p
                      className={`text-xs ${
                        item.priority === "high"
                          ? "text-red-600"
                          : item.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.priority} priority
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
