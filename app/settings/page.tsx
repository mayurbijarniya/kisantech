"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Lock, 
  Shield, 
  Bell, 
  CreditCard,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Settings
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { auth, setAuth, isHydrated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Security form data
  const [securityData, setSecurityData] = useState({
    securityQuestion: "",
    answer: ""
  });

  const securityQuestions = [
    "What is your favorite sport?",
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "In which city were you born?",
    "What is your favorite food?",
    "What was your first car model?",
    "What is your favorite movie?",
    "What was the name of your elementary school?"
  ];

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!auth.user) {
      toast.error("Please login to access settings");
      router.push("/login");
      return;
    }

    // Initialize form data with user data
    setProfileData({
      name: auth.user.name || "",
      email: auth.user.email || "",
      phone: auth.user.phone || "",
      address: typeof auth.user.address === 'string' ? auth.user.address : ""
    });

    fetchUserDetails();
  }, [auth.user, router, isHydrated]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");
      if (data.success) {
        setSecurityData({
          securityQuestion: data.user.securityQuestion || "",
          answer: ""
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put("/api/user/update-profile", profileData);
      
      if (data.success) {
        // Update auth context with new user data
        setAuth({
          ...auth,
          user: { ...auth.user!, ...profileData }
        });
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put("/api/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (data.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        toast.success("Password updated successfully");
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!securityData.securityQuestion || !securityData.answer) {
      toast.error("Please select a security question and provide an answer");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put("/api/user/update-security", securityData);
      
      if (data.success) {
        setSecurityData({
          ...securityData,
          answer: ""
        });
        toast.success("Security settings updated successfully");
      } else {
        toast.error(data.message || "Failed to update security settings");
      }
    } catch (error: any) {
      console.error("Security update error:", error);
      toast.error("Failed to update security settings");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: number) => {
    switch (role) {
      case 2: return "Administrator";
      case 1: return "Seller";
      case 0: return "Buyer";
      default: return "Unknown";
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
              <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl shadow-sm"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your account preferences and security</p>
          </div>

          {/* Account Overview */}
          <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <User className="h-6 w-6 text-blue-600" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{auth.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{auth.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-medium">{getRoleDisplay(auth.user?.role || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border rounded-xl p-1">
              <TabsTrigger value="profile" className="rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              {/* Change Password */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading}>
                      <Lock className="h-4 w-4 mr-2" />
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security Question */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Question
                  </CardTitle>
                  <CardDescription>
                    Update your security question for password recovery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSecurityUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="securityQuestion">Security Question</Label>
                      <Select 
                        value={securityData.securityQuestion} 
                        onValueChange={(value) => setSecurityData({...securityData, securityQuestion: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a security question" />
                        </SelectTrigger>
                        <SelectContent>
                          {securityQuestions.map((question, index) => (
                            <SelectItem key={index} value={question}>
                              {question}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="securityAnswer">New Answer</Label>
                      <Input
                        id="securityAnswer"
                        value={securityData.answer}
                        onChange={(e) => setSecurityData({...securityData, answer: e.target.value})}
                        placeholder="Enter your answer"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        This will be used for password recovery
                      </p>
                    </div>

                    <Button type="submit" disabled={loading}>
                      <Shield className="h-4 w-4 mr-2" />
                      {loading ? "Updating..." : "Update Security Question"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your account preferences and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Account Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Account Type</span>
                          <span className="text-sm font-medium">{getRoleDisplay(auth.user?.role || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Member Since</span>
                          <span className="text-sm font-medium">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Payment Methods
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Bell className="h-4 w-4 mr-2" />
                          Notification Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}