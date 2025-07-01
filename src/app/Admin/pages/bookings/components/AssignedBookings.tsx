"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";

export default function AssignedBookings({ bookings }: { bookings: BookingData[] }) {
  const [assignedBookings, setAssignedBookings] = useState(
    bookings.filter((b) => b.assignedTuks && b.assignedTuks.length > 0 && b.status !== "finished")
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleComplete = async (booking: BookingData) => {
    try {
      setLoadingId(booking.id); // 🔄 show loading for this row
  
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status: "finished" });
  
      await fetch("/api/send-email/completeBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
  
      setAssignedBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to complete trip.");
    } finally {
      setLoadingId(null);
    }
  };
  
  

  return (
    <>
      {assignedBookings.length === 0 ? (
        <p className="text-gray-600">No assigned bookings.</p>
      ) : (
        <table className="min-w-full bg-white border rounded text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Assigned Tuk Tuks</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedBookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-2">{booking.name}</td>
                <td className="p-2">{booking.assignedTuks?.join(", ")}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                  >
                    View
                  </button>
                  <button
  onClick={() => handleComplete(booking)}
  disabled={loadingId === booking.id}
  className={`flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-xs transition ${
    loadingId === booking.id ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {loadingId === booking.id ? (
    <>
      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Completing...
    </>
  ) : (
    "Complete Trip"
  )}
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Booking Details</h2>
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
              <div className="md:col-span-2">
  <strong>Train Transfer:</strong>{" "}
  {selectedBooking.trainTransfer ? (
    <div className="mt-1 space-y-1 text-sm text-gray-700">
      <p><strong>From:</strong> {selectedBooking.trainTransfer.from}</p>
      <p><strong>To:</strong> {selectedBooking.trainTransfer.to}</p>
      <p><strong>Pickup Time:</strong> {selectedBooking.trainTransfer.pickupTime}</p>
      <p><strong>Price:</strong> ${selectedBooking.trainTransfer.price}</p>
    </div>
  ) : (
    "None"
  )}
</div>

              <div><strong>Assigned Tuks:</strong> {selectedBooking.assignedTuks?.join(", ")}</div>
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
