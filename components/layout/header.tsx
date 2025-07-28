"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, Leaf, ShoppingCart, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMenu } from "@/components/navigation/user-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { auth, logout } = useAuth();
  const { getCartCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Buy Products", href: "/buy" },
    { name: "Rent Equipment", href: "/rent" },
    { name: "Weather", href: "/weather" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Add dashboard link for sellers - point to correct seller dashboard
  if (auth.user && auth.user.role === 1) {
    navigation.splice(1, 0, { name: "Dashboard", href: "/dashboard/seller" });
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              KisanTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </Button>
            
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {auth.user ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                        {getInitials(auth.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{auth.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {auth.user.role === 1 ? "Seller" : "Buyer"}
                      </p>
                    </div>
                  </div>
                  {auth.user.role === 1 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/seller">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Seller Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}