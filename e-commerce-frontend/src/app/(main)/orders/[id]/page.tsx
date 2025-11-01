"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { orderService } from "@/services/order.service";
import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await orderService.getOrder(orderId);

      if (response.success && response.data?.order) {
        setOrder(response.data.order);
      }
    } catch (err: any) {
      console.error("Order details fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load order details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Button onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <p>Order not found</p>
        <Button onClick={() => router.push("/orders")} className="mt-4">
          Back to Orders
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/orders")}
          className="mb-4"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Order Details
        </h1>
        <p className="text-muted-foreground">
          Order #{order.id.slice(0, 8)} • Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex justify-between items-start py-4 ${
                      index !== order.items.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price: {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium text-xs sm:text-sm">
                    {order.customerEmail}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total:</span>
                  <span className="text-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
