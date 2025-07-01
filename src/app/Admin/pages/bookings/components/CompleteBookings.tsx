"use client";

import { useState } from "react";

// ✅ Import shared BookingData type from central definition
import type { BookingData } from "@/app/Admin/pages/bookings/BookingsPage";

import BookingDetailsModal from "../components/CompleteBookingDetailsModal";

// ✅ Define props with imported BookingData[] to ensure consistency
interface Props {
  bookings: BookingData[];
}

export default function CompleteBookingsTab({ bookings }: Props) {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  const openModal = (booking: BookingData) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  // ✅ Filter to show only new bookings and sort by creation date descending
  const filteredBookings = bookings
  .filter((booking) => booking.isBooked && !booking.status)
  .sort(
    (a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
  );

    

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Pickup</th>
            <th className="p-2 text-left">Pickup Date</th>
            <th className="p-2 text-left">Return</th>
            <th className="p-2 text-left">Return Date</th>
            <th className="p-2 text-left">Booked Date</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="p-2">{booking.name}</td>
              <td className="p-2">{booking.pickup}</td>
              <td className="p-2">{booking.pickupDate}</td>
              <td className="p-2">{booking.returnLoc}</td>
              <td className="p-2">{booking.returnDate}</td>
              <td className="p-2">
                {booking.createdAt?.toDate ? (
                  booking.createdAt.toDate().toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Asia/Colombo",
                  })
                ) : (
                  "Invalid date"
                )}
              </td>
              <td className="p-2">
                <button
                  onClick={() => openModal(booking)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Action
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Show fallback message when no bookings match */}
      {filteredBookings.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No new bookings found.</p>
      )}

      {/* ✅ Conditionally show modal when a booking is selected */}
      {selectedBooking && (
        <BookingDetailsModal booking={selectedBooking} onClose={closeModal} />
      )}
    </div>
  );
}
