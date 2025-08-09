"use client";

import { useState } from "react";
import type { BookingData } from "@/app/Admin/pages/bookings/BookingsPage";
import BookingPaymentDetailsModal from "./CompletePaymentDetailsModal";

interface Props {
  bookings: BookingData[];
}

export default function CompleteBookingsTab({ bookings }: Props) {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  const openModal = (booking: BookingData) => setSelectedBooking(booking);
  const closeModal = () => setSelectedBooking(null);

  const filteredBookings = bookings
  .filter(
    (booking) => booking.isBooked && booking.status == "PENDING_PAYMENT"
  )
  .sort(
    (a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
  );


  return (
    <div className="overflow-x-auto shadow rounded-lg">
      {filteredBookings.length > 0 ? (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Pickup</th>
              <th className="px-3 py-2 text-left">Pickup Date</th>
              <th className="px-3 py-2 text-left">Return</th>
              <th className="px-3 py-2 text-left">Return Date</th>
              <th className="px-3 py-2 text-left">Booked Date</th>
              <th className="px-3 py-2 text-left">Mobile Number</th> 
              <th className="px-3 py-2 text-left">Price</th> 
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
              >
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2">{booking.name}</td>
                <td className="px-3 py-2">{booking.pickup}</td>
                <td className="px-3 py-2">{booking.pickupDate}</td>
                <td className="px-3 py-2">{booking.returnLoc}</td>
                <td className="px-3 py-2">{booking.returnDate}</td>
                <td className="px-3 py-2">
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
                    <span className="text-red-500">Invalid date</span>
                  )}
                </td>
                <th className="px-3 py-2 text-left">{booking.whatsapp}</th> 
                <td className="px-3 py-2">{booking.RentalPrice}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No new bookings found.
        </p>
      )}

      {selectedBooking && (
        <BookingPaymentDetailsModal booking={selectedBooking} onClose={closeModal} />
      )}
    </div>
  );
}
