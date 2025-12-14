'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
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
  Filler,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { TrendingUp, BarChart2, DollarSign, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

type Booking = {
  country: string;
  name: string;
  email?: string;
  createdAt?: { toDate: () => Date };
  pickupDate?: string;
  returnDate?: string;
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
  const [showAllPickups, setShowAllPickups] = useState(false);
  const [showAllReturns, setShowAllReturns] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'bookings'));
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
          const pickupDate = data.pickupDate ? new Date(data.pickupDate) : null;
          const returnDate = data.returnDate ? new Date(data.returnDate) : null;

          if (typeof data.RentalPrice === 'number' && data.status !== '' && data.status !== 'PENDING_PAYMENT') {
            totalAll += data.RentalPrice;
            if (createdAt && createdAt >= thirtyDaysAgo && createdAt <= endOfToday) {
              total30 += data.RentalPrice;
              const day = createdAt.toISOString().split('T')[0];
              dayRevenueMap[day] = (dayRevenueMap[day] || 0) + data.RentalPrice;
              dayCountMap[day] = (dayCountMap[day] || 0) + 1;
            }
          }

          if (data.isBooked) bookedCount++;
          else notBookedCount++;

          if (pickupDate && pickupDate >= startOfToday && pickupDate <= sevenDaysLater && data.isBooked) {
            pickups.push(data);
          }

          if (returnDate && returnDate >= startOfToday && returnDate <= sevenDaysLater && data.isBooked) {
            returns.push(data);
          }
        });

        const sortedDays = Object.keys(dayRevenueMap).sort();
        setTotalRentalAll(totalAll);
        setTotalRental30(total30);
        setIsBookedStats({ booked: bookedCount, notBooked: notBookedCount });
        setRevenueChartData({ labels: sortedDays, data: sortedDays.map((day) => dayRevenueMap[day]) });
        setCountChartData({ labels: sortedDays, data: sortedDays.map((day) => dayCountMap[day]) });
        setUpcomingPickups(pickups.sort((a, b) => new Date(a.pickupDate!).getTime() - new Date(b.pickupDate!).getTime()));
        setUpcomingReturns(returns.sort((a, b) => new Date(a.returnDate!).getTime() - new Date(b.returnDate!).getTime()));

      } catch (err) {
        console.error("Error loading bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getRowColor = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    const today = new Date();
    const pickupDate = new Date(dateStr);
    today.setHours(0,0,0,0);
    pickupDate.setHours(0,0,0,0);
    const diffTime = pickupDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return 'bg-red-100 text-red-800';
    } else if (diffDays === 1) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return '';
  };

  const lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#fff',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: false,
        padding: 10,
        callbacks: {
          label: (context: any) => `Revenue: $${context.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 10 } },
        border: { display: false },
      },
      y: {
        grid: { color: '#e5e7eb', drawBorder: false },
        ticks: {
          color: '#6b7280',
          callback: (value: any) => `$${Number(value) / 1000}k`,
          stepSize: 1000,
        },
        border: { display: false },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const countChartOptions: any = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      tooltip: {
        ...lineChartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => `Bookings: ${context.formattedValue}`,
        },
      },
    },
    scales: {
      ...lineChartOptions.scales,
      y: {
        ...lineChartOptions.scales.y,
        ticks: {
          color: '#6b7280',
          stepSize: 1,
          callback: (value: any) => Math.floor(value),
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm text-gray-600 flex items-center gap-2"><DollarSign size={16} /> Total Rental Revenue</h2>
              <p className="text-2xl text-emerald-600 font-bold">${totalRentalAll.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-sm text-gray-600 flex items-center gap-2"><DollarSign size={16} /> Last 30 Days Revenue</h2>
              <p className="text-2xl text-blue-600 font-bold">${totalRental30.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart2 size={20} /> Booking Status
              </h2>
              <div className="h-80 flex items-center justify-center">
                <Pie
                  data={{
                    labels: ['Booked', 'Not Booked'],
                    datasets: [
                      {
                        data: [isBookedStats.booked, isBookedStats.notBooked],
                        backgroundColor: ['#10B981', '#F59E0B'],
                        hoverOffset: 12,
                        borderColor: '#ffffff',
                        borderWidth: 4,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: '#374151', usePointStyle: true, padding: 20 },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Revenue Trend (Last 30 Days)
              </h2>
              <div className="h-80">
                <Line
                  data={{
                    labels: revenueChartData.labels,
                    datasets: [
                      {
                        label: 'Revenue',
                        data: revenueChartData.data,
                        borderColor: '#3B82F6',
                        backgroundColor: (context: any) => {
                          const chart = context.chart;
                          const { ctx, chartArea } = chart;
                          if (!chartArea) return null;
                          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                          gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
                          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
                          return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#3B82F6',
                        pointBorderColor: '#fff',
                      },
                    ],
                  }}
                  options={lineChartOptions}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart2 size={20} /> Booking Count Trend (Last 30 Days)
            </h2>
            <div className="h-80">
              <Line
                data={{
                  labels: countChartData.labels,
                  datasets: [
                    {
                      label: 'Bookings',
                      data: countChartData.data,
                      borderColor: '#10B981',
                      backgroundColor: (context: any) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
                        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
                        return gradient;
                      },
                      fill: true,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 6,
                      pointBackgroundColor: '#10B981',
                      pointBorderColor: '#fff',
                    },
                  ],
                }}
                options={countChartOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar size={20} /> Upcoming Pickups (Next 7 Days)
              </h2>
              <ul className="text-sm text-gray-800 space-y-3">
                {upcomingPickups.length > 0 ? (
                  (showAllPickups ? upcomingPickups : upcomingPickups.slice(0, 4)).map((b, i) => (
                    <li key={i} className={`border-b border-gray-200 pb-3 mb-2 flex justify-between items-start p-2 rounded-md ${getRowColor(b.pickupDate)}`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{b.name}</span>
                        <span className="text-gray-500 text-sm">{b.email}</span>
                        <span className="text-gray-600">{b.pickup || 'N/A'}</span>
                        <span className="text-xs text-gray-500">{b.pickupDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 font-bold">${b.RentalPrice.toLocaleString()}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No upcoming pickups.</li>
                )}
              </ul>
              {upcomingPickups.length > 4 && (
                <button onClick={() => setShowAllPickups(!showAllPickups)} className="text-blue-500 hover:underline mt-4">
                  {showAllPickups ? 'Show less' : 'View full list'}
                </button>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar size={20} /> Upcoming Returns (Next 7 Days)
              </h2>
              <ul className="text-sm text-gray-800 space-y-3">
                {upcomingReturns.length > 0 ? (
                  (showAllReturns ? upcomingReturns : upcomingReturns.slice(0, 4)).map((b, i) => (
                    <li key={i} className={`border-b border-gray-200 pb-3 mb-2 flex justify-between items-start p-2 rounded-md ${getRowColor(b.returnDate)}`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{b.name}</span>
                         <span className="text-gray-500 text-sm">{b.email}</span>
                        <span className="text-gray-600">{b.returnLoc || 'N/A'}</span>
                        <span className="text-xs text-gray-500">{b.returnDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-blue-600 font-bold">${b.RentalPrice.toLocaleString()}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No upcoming returns.</li>
                )}
              </ul>
              {upcomingReturns.length > 4 && (
                <button onClick={() => setShowAllReturns(!showAllReturns)} className="text-blue-500 hover:underline mt-4">
                  {showAllReturns ? 'Show less' : 'View full list'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
