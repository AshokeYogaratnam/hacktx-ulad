"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Star,
  Fuel,
  Shield,
  Wrench,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";
import {
  FinancialData,
  VehicleRecommendation,
  FinancingOption,
} from "@/types/financial";

interface VehicleMatcherProps {
  financialData: FinancialData;
}

export default function VehicleMatcher({ financialData }: VehicleMatcherProps) {
  const [vehicles, setVehicles] = useState<VehicleRecommendation[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<
    VehicleRecommendation[]
  >([]);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleRecommendation | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [20000, 80000],
    vehicleType: financialData.preferences.vehicleType as "sedan" | "suv" | "truck" | "hybrid" | "luxury" | "all",
    monthlyPayment: financialData.goals.monthlyPaymentTarget,
  });

  useEffect(() => {
    // Generate recommendations whenever financial data changes
    generateVehicleRecommendations();
    
    // Update filters based on financial data
    setFilters({
      priceRange: [Math.max(15000, financialData.preferences.budget * 0.7), Math.min(80000, financialData.preferences.budget * 1.2)],
      vehicleType: financialData.preferences.vehicleType,
      monthlyPayment: financialData.goals.monthlyPaymentTarget,
    });
  }, [financialData]);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]);

    const generateVehicleRecommendations = () => {
      // Mock vehicle data - Represents local test data
      const mockVehicles = [{
        id: "camry-hybrid",
        name: "Camry Hybrid",
        model: "Camry",
        year: 2024,
        price: 28000,
        monthlyPayment: 420,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
        features: [
          "Hybrid Engine",
          "Safety Sense 2.5+",
          "Wireless Charging",
          "Premium Audio",
        ],
        matchScore: 95,
        financingOptions: [],
      },
      {
        id: "rav4-hybrid",
        name: "RAV4 Hybrid",
        model: "RAV4",
        year: 2024,
        price: 32000,
        monthlyPayment: 480,
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
        features: [
          "AWD",
          "Hybrid Engine",
          "Safety Sense 2.5+",
          "Panoramic Roof",
        ],
        matchScore: 88,
        financingOptions: [],
      },
      {
        id: "corolla-cross",
        name: "Corolla Cross",
        model: "Corolla Cross",
        year: 2024,
        price: 24000,
        monthlyPayment: 360,
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
        features: [
          "Compact SUV",
          "Safety Sense 2.0",
          "Apple CarPlay",
          "Backup Camera",
        ],
        matchScore: 92,
        financingOptions: [],
      },
      {
        id: "highlander",
        name: "Highlander",
        model: "Highlander",
        year: 2024,
        price: 38000,
        monthlyPayment: 570,
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400",
        features: [
          "3-Row Seating",
          "V6 Engine",
          "Safety Sense 2.5+",
          "Premium Interior",
        ],
        matchScore: 75,
        financingOptions: [],
      },
      {
        id: "tacoma",
        name: "Tacoma",
        model: "Tacoma",
        year: 2024,
        price: 35000,
        monthlyPayment: 525,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        features: [
          "Off-Road Capable",
          "V6 Engine",
          "Towing Package",
          "Durable Build",
        ],
        matchScore: 82,
        financingOptions: [],
      },
      {
        id: "prius",
        name: "Prius",
        model: "Prius",
        year: 2024,
        price: 26000,
        monthlyPayment: 390,
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400",
        features: [
          "Hybrid Engine",
          "Excellent MPG",
          "Safety Sense 2.5+",
          "Eco-Friendly",
        ],
        matchScore: 90,
        financingOptions: [],
      }
      ];

      // Calculate match scores based on user preferences
      const scoredVehicles = mockVehicles.map((vehicle) => {
      let score = 0;

      // Price match (40% weight)
      const priceDiff = Math.abs(
        vehicle.price - financialData.preferences.budget
      );
      const priceScore = Math.max(
        0,
        100 - (priceDiff / financialData.preferences.budget) * 100
      );
      score += priceScore * 0.4;

      // Monthly payment match (30% weight)
      const paymentDiff = Math.abs(
        vehicle.monthlyPayment - financialData.goals.monthlyPaymentTarget
      );
      const paymentScore = Math.max(
        0,
        100 - (paymentDiff / financialData.goals.monthlyPaymentTarget) * 100
      );
      score += paymentScore * 0.3;

      // Vehicle type match (20% weight)
      const typeMatch = vehicle.model
        .toLowerCase()
        .includes(financialData.preferences.vehicleType)
        ? 100
        : 60;
      score += typeMatch * 0.2;

      // Lifestyle match (10% weight)
      const lifestyleMatch = calculateLifestyleMatch(
        vehicle,
        financialData.preferences.lifestyle
      );
      score += lifestyleMatch * 0.1;

      return {
        ...vehicle,
        matchScore: Math.round(score),
      };
    });

    setVehicles(scoredVehicles.sort((a, b) => b.matchScore - a.matchScore));
  };

  const calculateLifestyleMatch = (
    vehicle: VehicleRecommendation,
    lifestyle: string[]
  ): number => {
    let score = 50; // Base score

    lifestyle.forEach((lifestyleType) => {
      switch (lifestyleType) {
        case "family":
          if (
            vehicle.name.includes("Highlander") ||
            vehicle.name.includes("RAV4")
          )
            score += 20;
          break;
        case "eco-conscious":
          if (vehicle.name.includes("Hybrid") || vehicle.name.includes("Prius"))
            score += 25;
          break;
        case "adventure":
          if (vehicle.name.includes("Tacoma") || vehicle.name.includes("RAV4"))
            score += 20;
          break;
        case "business":
          if (vehicle.name.includes("Camry") || vehicle.name.includes("Avalon"))
            score += 15;
          break;
        case "luxury":
          if (
            vehicle.name.includes("Highlander") ||
            vehicle.features.includes("Premium")
          )
            score += 20;
          break;
        case "tech-savvy":
          if (
            vehicle.features.some(
              (f) => f.includes("Wireless") || f.includes("CarPlay")
            )
          )
            score += 15;
          break;
      }
    });

    return Math.min(100, score);
  };

  const applyFilters = () => {
    const filtered = vehicles.filter((vehicle) => {
      return (
        vehicle.price >= filters.priceRange[0] &&
        vehicle.price <= filters.priceRange[1] &&
        vehicle.monthlyPayment <= filters.monthlyPayment &&
        (filters.vehicleType === "all" ||
          vehicle.model.toLowerCase().includes(filters.vehicleType))
      );
    });

    setFilteredVehicles(filtered);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    return "Fair Match";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Car className="h-8 w-8 text-toyota-red" />
        <h2 className="text-2xl font-semibold text-gray-900">
          Smart Vehicle Matcher
        </h2>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${filters.priceRange[0].toLocaleString()} - $
              {filters.priceRange[1].toLocaleString()}
            </label>
            <div className="flex space-x-2">
              <input
                type="range"
                min="15000"
                max="80000"
                step="5000"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [Number(e.target.value), prev.priceRange[1]],
                  }))
                }
                className="flex-1"
              />
              <input
                type="range"
                min="15000"
                max="80000"
                step="5000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], Number(e.target.value)],
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              value={filters.vehicleType}
              onChange={(e) =>
                setFilters((prev) => ({ 
                  ...prev, 
                  vehicleType: e.target.value as "all" | "sedan" | "suv" | "truck" | "hybrid" | "luxury"
                }))
              }
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Monthly Payment
            </label>
            <input
              type="number"
              value={filters.monthlyPayment}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  monthlyPayment: Number(e.target.value),
                }))
              }
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <div className="relative">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div
                className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(
                  vehicle.matchScore
                )}`}
              >
                {vehicle.matchScore}% Match
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {vehicle.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {vehicle.year} • {vehicle.model}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">
                  ${vehicle.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-toyota-red">
                  ${vehicle.monthlyPayment}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {vehicle.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{vehicle.features.length - 3} more
                </span>
              )}
            </div>

            <div
              className={`text-center p-2 rounded-lg ${getMatchColor(
                vehicle.matchScore
              )}`}
            >
              <span className="text-sm font-medium">
                {getMatchLabel(vehicle.matchScore)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {selectedVehicle.name}
            </h3>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedVehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-toyota-red rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Financial Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">MSRP:</span>
                      <span className="font-semibold">
                        ${selectedVehicle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Estimated Monthly Payment:
                      </span>
                      <span className="font-semibold text-toyota-red">
                        ${selectedVehicle.monthlyPayment}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Match Score:</span>
                      <span
                        className={`font-semibold ${
                          getMatchColor(selectedVehicle.matchScore).split(
                            " "
                          )[0]
                        }`}
                      >
                        {selectedVehicle.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Why This Vehicle?
                  </h4>
                  <p className="text-gray-700 text-sm">
                    This vehicle matches your budget, lifestyle preferences, and
                    financial goals. The {selectedVehicle.name} offers excellent
                    value with features that align with your needs.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button className="btn-primary flex-1">
                    Get Financing Options
                  </button>
                  <button className="btn-secondary flex-1">
                    Schedule Test Drive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
