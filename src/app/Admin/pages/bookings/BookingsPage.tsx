"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

import CompleteBookings from "./components/CompleteBookings";
import IncompleteBookings from "./components/IncompleteBookings";
import AssignedBookings from "./components/AssignedBookings";
import FinishedBookings from "./components/FinishedBookings";
import OnBoardBookings from "./components/OnBoardBooking";
import OnboardedBookings from "./components/OnBoardedBooking";


export interface TrainTransfer {
  from: string;
  to: string;
  price: number;
  pickupTime: string;
  downTime: string;
  status?: boolean;
}

export interface Extras {
  [key: string]: number;
}

export interface BookingData {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  pickup: string;
  returnLoc: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  tukCount: number;
  licenseCount: number;
  isBooked: boolean;
  RentalPrice?: string;
  extras: Extras;
  assignedTuks?: string[];
  status?: string;
  assignedPerson: string;
  holdBackAssignedPerson: string;
  trainTransferAssignedPerson: string;
  createdAt: Timestamp;
  pickupPrice?: number;
  returnPrice?: number;
  couponCode?:string;
  trainTransfer?: {
    from: string;
    to: string;
    pickupTime: string;
    downTime: string;
    price: number;
  };
}

type TabType = "complete" | "incomplete" | "assigned" | "finished" | "OnBoard" | "OnBoarded";

const tabs: { label: string; value: TabType }[] = [
  { label: "✅ New", value: "complete" },
  { label: "❌ Not Complete", value: "incomplete" },
  { label: "🚖 Assigned", value: "assigned" },
  { label: "🛫 Readt to OnBoard", value: "OnBoard" },
  { label: "🛫 OnBoarded", value: "OnBoarded" },
  { label: "🏁 Finished", value: "finished" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("complete");

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      const data: BookingData[] = snapshot.docs.map((doc) => {
        const booking = doc.data() as Omit<BookingData, "id">;
        return { id: doc.id, ...booking };
      });
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "complete":
        return <CompleteBookings bookings={bookings} />;
      case "incomplete":
        return <IncompleteBookings bookings={bookings} />;
      case "OnBoard":
        return <OnBoardBookings bookings={bookings} />;
      case "assigned":
        return <AssignedBookings bookings={bookings} />;
      case "OnBoarded":
        return <OnboardedBookings bookings={bookings} />;
        case "finished":
          return <FinishedBookings bookings={bookings} />;

        default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Bookings Overview</h2>

      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition 
              ${
                activeTab === tab.value
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {renderTab()}
      </div>
    </div>
  );
}
