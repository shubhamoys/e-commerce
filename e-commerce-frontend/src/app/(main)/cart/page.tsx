"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth.store";
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await cartService.getCart();

      if (response.success && response.data?.cart) {
        setCart(response.data.cart);
        setTotalAmount(response.data.totalAmount || 0);
        setTotalItems(response.data.itemCount || 0);
      }
    } catch (err: any) {
      console.error("Cart fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load cart. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItemId(itemId);

    try {
      const response = await cartService.updateCartItem(itemId, {
        quantity: newQuantity,
      });

      if (response.success && response.data?.cart) {
        setCart(response.data.cart);
        setTotalAmount(response.data.totalAmount || 0);
        setTotalItems(response.data.itemCount || 0);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err: any) {
      console.error("Update cart error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update item. Please try again."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItemId(itemId);

    try {
      const response = await cartService.removeCartItem(itemId);

      if (response.success && response.data?.cart) {
        setCart(response.data.cart);
        setTotalAmount(response.data.totalAmount || 0);
        setTotalItems(response.data.itemCount || 0);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err: any) {
      console.error("Remove item error:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to remove item. Please try again."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;

    setIsCheckingOut(true);
    setError("");

    try {
      const orderItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const response = await orderService.createOrder({ items: orderItems });

      if (response.success && response.data?.order) {
        // Clear cart after successful order
        window.dispatchEvent(new Event("cartUpdated"));
        // Redirect to orders page
        router.push("/orders");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create order. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground">
          Review your items and proceed to checkout
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <svg
              className="w-16 h-16 text-muted-foreground mx-auto mb-4"
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
            <p className="text-lg text-muted-foreground mb-4">
              Your cart is empty
            </p>
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-primary font-bold">
                        {formatCurrency(item.productPrice)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            updatingItemId === item.id || item.quantity <= 1
                          }
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 text-center"
                          min="1"
                          disabled={updatingItemId === item.id}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updatingItemId === item.id}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingItemId === item.id}
                        className="w-full sm:w-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Subtotal:{" "}
                    {formatCurrency(item.productPrice * item.quantity)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => router.push("/products")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
