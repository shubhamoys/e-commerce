"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { cartService } from "@/services/cart.service";
import { Button } from "@/components/ui/button";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, customer, logout } = useAuthStore();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    } else {
      setCartItemCount(0);
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (isAuthenticated) {
        fetchCartCount();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        setCartItemCount(response.data.itemCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-background shadow-sm sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/products">
              <h1 className="text-xl sm:text-2xl font-bold text-primary cursor-pointer">
                E-Commerce Store
              </h1>
            </Link>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    <span className="hidden sm:inline">Orders</span>
                    <svg
                      className="w-5 h-5 sm:hidden"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="ghost" size="sm" className="relative">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground hidden md:block">
                  Welcome, {customer?.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
