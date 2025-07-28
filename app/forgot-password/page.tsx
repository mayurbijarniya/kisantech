"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Mail, HelpCircle, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Security Question, 3: New Password, 4: Success
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/forgot-password/verify-email", { email });
      
      if (data.success) {
        setSecurityQuestion(data.securityQuestion);
        setStep(2);
        toast.success("Email verified! Please answer your security question.");
      } else {
        toast.error(data.message || "Email not found");
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast.error("Email not found or server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) {
      toast.error("Security answer is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/forgot-password/verify-answer", { 
        email, 
        answer: answer.toLowerCase().trim() 
      });
      
      if (data.success) {
        setStep(3);
        toast.success("Security answer verified! Set your new password.");
      } else {
        toast.error(data.message || "Incorrect security answer");
      }
    } catch (error: any) {
      console.error("Security answer verification error:", error);
      toast.error("Incorrect security answer");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/forgot-password/reset-password", { 
        email, 
        newPassword,
        answer: answer.toLowerCase().trim()
      });
      
      if (data.success) {
        setStep(4);
        toast.success("Password reset successfully!");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-full font-medium"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleSecurityAnswerSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-gray-700 font-medium block mb-2">
                  Security Question:
                </Label>
                <p className="text-blue-800 font-medium">{securityQuestion}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer" className="text-gray-700 font-medium">
                  Your Answer
                </Label>
                <div className="relative">
                  <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="answer"
                    name="answer"
                    type="text"
                    placeholder="Enter your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Answer is case-insensitive
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600">
                Your password has been reset successfully. You can now login with your new password.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-full font-medium"
            >
              Go to Login
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Reset Your Password";
      case 2:
        return "Security Verification";
      case 3:
        return "Set New Password";
      case 4:
        return "Password Reset Complete";
      default:
        return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Enter your email address to begin the password reset process";
      case 2:
        return "Answer your security question to verify your identity";
      case 3:
        return "Create a new strong password for your account";
      case 4:
        return "Your password has been successfully reset";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />
      
      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {getStepTitle()}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {getStepDescription()}
                </CardDescription>
                
                {/* Progress indicator */}
                {step < 4 && (
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((stepNumber) => (
                        <div
                          key={stepNumber}
                          className={`w-3 h-3 rounded-full ${
                            stepNumber <= step
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                {renderStep()}

                {step === 1 && (
                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Remember your password?{" "}
                      <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                        Sign In
                      </Link>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}