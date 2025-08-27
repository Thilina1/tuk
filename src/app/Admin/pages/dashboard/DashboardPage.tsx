"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../config/firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type Booking = {
  createdAt?: { toDate: () => Date };
  pickupDate?: { toDate: () => Date };
  returnDate?: { toDate: () => Date };
  RentalPrice: number;
  isBooked: boolean;
  pickup?: string;
  returnLoc?: string;
  status?: string;
};

export default function DashboardPage() {
  const [totalRentalAll, setTotalRentalAll] = useState<number>(0);
  const [totalRental30, setTotalRental30] = useState<number>(0);
  const [revenueChartData, setRevenueChartData] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [countChartData, setCountChartData] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [isBookedStats, setIsBookedStats] = useState({ booked: 0, notBooked: 0 });
  const [upcomingPickups, setUpcomingPickups] = useState<Booking[]>([]);
  const [upcomingReturns, setUpcomingReturns] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thirtyDaysAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        let totalAll = 0;
        let total30 = 0;
        let bookedCount = 0;
        let notBookedCount = 0;
        const dayRevenueMap: Record<string, number> = {};
        const dayCountMap: Record<string, number> = {};
        const pickups: Booking[] = [];
        const returns: Booking[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data() as Booking;

          const createdAt = data.createdAt?.toDate?.() ?? null;
          const pickupDate = data.pickupDate?.toDate?.() ?? null;
          const returnDate = data.returnDate?.toDate?.() ?? null;

          if (
            typeof data.RentalPrice === "number" &&
            data.status !== "" &&
            data.status !== "PENDING_PAYMENT"
          ) {
            totalAll += data.RentalPrice;
          
            if (createdAt && createdAt >= thirtyDaysAgo && createdAt <= endOfToday) {
              total30 += data.RentalPrice;
              const day = createdAt.toISOString().split("T")[0];
              dayRevenueMap[day] = (dayRevenueMap[day] || 0) + data.RentalPrice;
              dayCountMap[day] = (dayCountMap[day] || 0) + 1;
            }
          }
          

          if (data.isBooked) bookedCount++;
          else notBookedCount++;

          if (pickupDate && pickupDate >= startOfToday && pickupDate <= sevenDaysLater) {
            pickups.push({ ...data, pickupDate: { toDate: () => pickupDate } });
          }

          if (returnDate && returnDate >= startOfToday && returnDate <= sevenDaysLater) {
            returns.push({ ...data, returnDate: { toDate: () => returnDate } });
          }
        });

        const sortedDays = Object.keys(dayRevenueMap).sort();

        setTotalRentalAll(totalAll);
        setTotalRental30(total30);
        setIsBookedStats({ booked: bookedCount, notBooked: notBookedCount });
        setRevenueChartData({
          labels: sortedDays,
          data: sortedDays.map((day) => dayRevenueMap[day]),
        });
        setCountChartData({
          labels: sortedDays,
          data: sortedDays.map((day) => dayCountMap[day]),
        });
        setUpcomingPickups(pickups.sort((a, b) => a.pickupDate!.toDate().getTime() - b.pickupDate!.toDate().getTime()));
        setUpcomingReturns(returns.sort((a, b) => a.returnDate!.toDate().getTime() - b.returnDate!.toDate().getTime()));
      } catch (err) {
        console.error("Error loading bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <span className="material-symbols-outlined">dashboard</span> Dashboard Overview
      </h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-sm text-gray-600 flex items-center gap-2">
                <span className="material-symbols-outlined"></span> Total Rental Revenue
              </h2>
              <p className="text-2xl text-emerald-600 font-bold">${totalRentalAll.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-sm text-gray-600 flex items-center gap-2">
                <span className="material-symbols-outlined"></span> Last 30 Days Revenue
              </h2>
              <p className="text-2xl text-blue-600 font-bold">${totalRental30.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined"></span> Booking Status
              </h2>
              <div className="w-full h-64">
                <Pie
                  data={{
                    labels: ["Booked", "Not Booked"],
                    datasets: [
                      {
                        data: [isBookedStats.booked, isBookedStats.notBooked],
                        backgroundColor: ["#10B981", "#F59E0B"],
                        hoverOffset: 12,
                        borderColor: "#ffffff",
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { color: "#374151", usePointStyle: true },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined"></span> Revenue Trend (Last 7 Days)
              </h2>
              <Line
                data={{
                  labels: revenueChartData.labels,
                  datasets: [
                    {
                      label: "Revenue",
                      data: revenueChartData.data,
                      borderColor: "#10B981",
                      backgroundColor: "#10B98133",
                      tension: 0.4,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { labels: { color: "#374151" } },
                    tooltip: { backgroundColor: "#1F2937", titleColor: "#ffffff", bodyColor: "#ffffff" },
                  },
                  scales: {
                    x: { ticks: { color: "#374151" } },
                    y: { ticks: { color: "#374151" } },
                  },
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined"></span> Booking Count (Last 7 Days)
              </h2>
              <Line
                data={{
                  labels: countChartData.labels,
                  datasets: [
                    {
                      label: "Bookings",
                      data: countChartData.data,
                      borderColor: "#3B82F6",
                      backgroundColor: "#3B82F633",
                      tension: 0.4,
                      pointRadius: 4,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { labels: { color: "#374151" } },
                    tooltip: { backgroundColor: "#1F2937", titleColor: "#ffffff", bodyColor: "#ffffff" },
                  },
                  scales: {
                    x: { ticks: { color: "#374151" } },
                    y: { ticks: { color: "#374151" } },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              </h2>
              <ul className="text-sm text-gray-800 space-y-3">
                {upcomingPickups.length ? (
                  upcomingPickups.map((b, i) => (
                    <li key={i} className="border-b border-gray-200 pb-2 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{b.pickup || "N/A"}</span> — {new Date(b.pickupDate!.toDate()).toLocaleDateString()}
                      </div>
                      <span className="text-emerald-600 font-semibold">${b.RentalPrice.toLocaleString()}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500"></li>
                )}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              </h2>
              <ul className="text-sm text-gray-800 space-y-3">
                {upcomingReturns.length ? (
                  upcomingReturns.map((b, i) => (
                    <li key={i} className="border-b border-gray-200 pb-2 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{b.returnLoc || "N/A"}</span> — {new Date(b.returnDate!.toDate()).toLocaleDateString()}
                      </div>
                      <span className="text-blue-600 font-semibold">${b.RentalPrice.toLocaleString()}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500"></li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}