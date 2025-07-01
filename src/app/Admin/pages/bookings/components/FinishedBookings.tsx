"use client";

import { useState } from "react";
import { BookingData } from "../BookingsPage";

export default function FinishedBookings({ bookings }: { bookings: BookingData[] }) {
  const finished = bookings.filter((b) => b.status === "finished");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  if (finished.length === 0) return <p>No finished bookings.</p>;

  return (
    <>
      <table className="min-w-full bg-white border rounded text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {finished.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="p-2">{booking.name}</td>
              <td className="p-2">{booking.email}</td>
              <td className="p-2">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Finished Booking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {selectedBooking.name}</div>
              <div><strong>Email:</strong> {selectedBooking.email}</div>
              <div><strong>WhatsApp:</strong> +{selectedBooking.whatsapp}</div>
              <div><strong>Total Price:</strong> ${selectedBooking.RentalPrice || "—"}</div>
              <div><strong>Pickup:</strong> {selectedBooking.pickup}</div>
              <div><strong>Pickup Date/Time:</strong> {selectedBooking.pickupDate} {selectedBooking.pickupTime}</div>
              <div><strong>Return:</strong> {selectedBooking.returnLoc}</div>
              <div><strong>Return Date/Time:</strong> {selectedBooking.returnDate} {selectedBooking.returnTime}</div>
              <div><strong>Tuk Count:</strong> {selectedBooking.tukCount}</div>
              <div><strong>License Count:</strong> {selectedBooking.licenseCount}</div>
              <div className="md:col-span-2">
                <strong>Extras:</strong>{" "}
                {Object.entries(selectedBooking.extras || {})
                  .filter(([, count]) => count > 0)
                  .map(([key, value]) => `${key} (${value})`)
                  .join(", ") || "None"}
              </div>
              <div><strong>Assigned Tuks:</strong> {selectedBooking.assignedTuks?.join(", ") || "N/A"}</div>
              <div><strong>Allocate Person:</strong> {selectedBooking.assignedPerson || "N/A"}</div>
              </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
