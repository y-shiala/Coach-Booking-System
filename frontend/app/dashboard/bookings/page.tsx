"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingsTable } from "@/components/BookingsTable";
import { Booking } from "@/lib/types";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<Booking[]>("/bookings");
      setBookings(data || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await apiClient.put(`/bookings/${id}/cancel`, {});
      toast.success("Booking cancelled");
      loadBookings();
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "coach"
              ? "Manage bookings for your services"
              : "View and manage your bookings"}
          </p>
        </div>
        {user?.role === "customer" && (
          <Button asChild size="lg">
            <Link href="/dashboard/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        )}
      </div>

      {/* Bookings Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === "coach" ? "Your Service Bookings" : "My Bookings"}
          </CardTitle>
          <CardDescription>
            {user?.role === "coach"
              ? "All bookings made for your services"
              : "All your upcoming and past bookings"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsTable
            bookings={bookings}
            isLoading={isLoading}
            onCancel={handleCancel}
            userRole={user?.role}
          />
        </CardContent>
      </Card>
    </div>
  );
}