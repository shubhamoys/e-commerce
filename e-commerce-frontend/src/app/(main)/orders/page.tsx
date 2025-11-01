"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { CustomerOrder } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await orderService.getOrderHistory();

      if (response.success && response.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load orders. Please try again."
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
          Order History
        </h1>
        <p className="text-muted-foreground">
          View all your past orders and their details
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg text-muted-foreground mb-4">
              No orders yet
            </p>
            <p className="text-sm text-muted-foreground">
              Start shopping to see your orders here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => router.push(`/orders/${order.orderId}`)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        Order #{order.orderId.slice(0, 8)}
                      </h3>
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
