import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  Download,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalReservations: number;
  totalFeedback: number;
  averageRating: number;
  todayOrders: number;
  todayRevenue: number;
}

const DataDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalReservations: 0,
    totalFeedback: 0,
    averageRating: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Mock data for charts
  const revenueData = [
    { name: "Mon", revenue: 2400 },
    { name: "Tue", revenue: 1398 },
    { name: "Wed", revenue: 9800 },
    { name: "Thu", revenue: 3908 },
    { name: "Fri", revenue: 4800 },
    { name: "Sat", revenue: 3800 },
    { name: "Sun", revenue: 4300 },
  ];

  const orderTypeData = [
    { name: "Dine-in", value: 45, color: "#f59e0b" },
    { name: "Takeaway", value: 30, color: "#10b981" },
    { name: "Delivery", value: 25, color: "#3b82f6" },
  ];

  const paymentMethodData = [
    { name: "UPI", value: 40, color: "#8b5cf6" },
    { name: "Card", value: 35, color: "#06b6d4" },
    { name: "Cash", value: 25, color: "#f97316" },
  ];

  useEffect(() => {
    // Simulate loading data from Google Sheets
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch data from Google Sheets API
      // or Google Apps Script web app
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      setStats({
        totalOrders: 1247,
        totalRevenue: 89650,
        totalReservations: 342,
        totalFeedback: 156,
        averageRating: 4.3,
        todayOrders: 23,
        todayRevenue: 3450,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    // This would trigger the Google Apps Script export function
    window.open(
      "https://docs.google.com/spreadsheets/d/1rY4jh2WzlArfJiu12IGC6QPwxhgXG2vCySpBxYilyS0/export?format=xlsx",
      "_blank",
    );
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600">Real-time data from Google Sheets</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadDashboardData}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleExportData}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart className="h-6 w-6 text-white" />}
            color="bg-blue-500"
            subtitle={`${stats.todayOrders} today`}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-green-500"
            subtitle={`₹${stats.todayRevenue} today`}
          />
          <StatCard
            title="Reservations"
            value={stats.totalReservations}
            icon={<Calendar className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
          <StatCard
            title="Avg Rating"
            value={stats.averageRating.toFixed(1)}
            icon={<Star className="h-6 w-6 text-white" />}
            color="bg-yellow-500"
            subtitle={`${stats.totalFeedback} reviews`}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
            <TabsTrigger value="orders">Order Analysis</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {orderTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() =>
                  window.open(
                    "https://docs.google.com/spreadsheets/d/1rY4jh2WzlArfJiu12IGC6QPwxhgXG2vCySpBxYilyS0/edit#gid=0",
                    "_blank",
                  )
                }
                variant="outline"
                className="flex items-center gap-2 h-16"
              >
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View All Data</div>
                  <div className="text-sm text-gray-500">Open Google Sheet</div>
                </div>
              </Button>

              <Button
                onClick={() =>
                  window.open("https://forms.gle/qvD4PLm6NsVzQZX46", "_blank")
                }
                variant="outline"
                className="flex items-center gap-2 h-16"
              >
                <MessageSquare className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View Messages</div>
                  <div className="text-sm text-gray-500">
                    Customer Inquiries
                  </div>
                </div>
              </Button>

              <Button
                onClick={() =>
                  window.open("https://forms.gle/DZPw4ijRjP2q4r7f9", "_blank")
                }
                variant="outline"
                className="flex items-center gap-2 h-16"
              >
                <Star className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View Feedback</div>
                  <div className="text-sm text-gray-500">Customer Reviews</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataDashboard;
