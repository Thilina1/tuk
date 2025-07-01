"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore"; // ✅ Timestamp imported
import { db } from "@/config/firebase";

import CompleteBookings from "./components/CompleteBookings";
import IncompleteBookings from "./components/IncompleteBookings";
import AssignedBookings from "./components/AssignedBookings";
import FinishedBookings from "./components/FinishedBookings";

// --- Types ---
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
  createdAt: Timestamp; // ✅ Properly typed
  pickupPrice?: number;
  returnPrice?: number;
  trainTransfer?: {
    from: string;
    to: string;
    pickupTime: string;
    downTime: string;
    price: number;
  };
}

type TabType = "complete" | "incomplete" | "assigned" | "finished";

const tabs: { label: string; value: TabType }[] = [
  { label: "✅ New Bookings", value: "complete" },
  { label: "❌ Not Complete", value: "incomplete" },
  { label: "🚖 Assigned", value: "assigned" },
  { label: "🏁 Finished", value: "finished" },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("complete");

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));

      const data: BookingData[] = snapshot.docs.map((doc) => {
        const booking = doc.data() as Omit<BookingData, "id">; // ✅ Safe casting, no any
        return {
          id: doc.id,
          ...booking,
        };
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
      case "assigned":
        return <AssignedBookings bookings={bookings} />;
      case "finished":
        return <FinishedBookings bookings={bookings} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>

      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded ${
              activeTab === tab.value
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
