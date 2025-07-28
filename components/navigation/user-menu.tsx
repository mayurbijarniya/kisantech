"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  LogOut,
  ChevronDown,
  Store,
  Users
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function UserMenu() {
  const { auth, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (!auth.user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{auth.user.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{auth.user.name}</p>
            <p className="text-sm text-gray-600">{auth.user.email}</p>
            <p className="text-xs text-gray-500">
              {auth.user.role === 2 ? "Administrator" : auth.user.role === 1 ? "Seller" : "Buyer"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Role-based dashboard - only for admin and buyers */}
        {auth.user.role !== 1 && (
          <DropdownMenuItem asChild>
            <Link href={
              auth.user.role === 2 ? "/dashboard/admin" : "/dashboard"
            } className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {/* Seller specific dashboard */}
        {auth.user.role === 1 && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/seller" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Seller Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        {/* Orders for buyers and sellers */}
        {(auth.user.role === 0 || auth.user.role === 1) && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
        )}

        {/* Seller specific items */}
        {auth.user.role === 1 && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/admin/create-product" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Add Product
            </Link>
          </DropdownMenuItem>
        )}

        {/* Admin specific items */}
        {auth.user.role === 2 && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/admin/create-product" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Manage Products
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}