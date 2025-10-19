"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, User, Lock, Mail } from "lucide-react";
import { LoginCredentials, RegisterCredentials } from "@/types/auth";
import { useAuth } from "@/contexts/auth-context";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  email: z.string().email("Invalid email address"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { login, register: registerUser, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema) as any,
  });

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    try {
      if (mode === "login") {
        await login(data as LoginCredentials);
      } else {
        await registerUser(data as RegisterCredentials);
      }
      reset();
      onClose();
    } catch (e) {
      // Error is handled by auth context
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "login"
                ? "Sign in to continue to Toyota Financial Navigator"
                : "Register to start your financial journey"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("username")}
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register("email")}
                    type="email"
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("password")}
                  type="password"
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="input-field pl-10"
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-toyota-red hover:text-red-700"
            >
              {mode === "login"
                ? "Need an account? Register"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}