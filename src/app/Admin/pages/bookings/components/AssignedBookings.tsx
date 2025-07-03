"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";

export default function AssignedBookings({ bookings }: { bookings: BookingData[] }) {
  const [assignedBookings, setAssignedBookings] = useState(
    bookings.filter((b) => b.assignedTuks && b.assignedTuks.length > 0 && b.status == "assigned")
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleComplete = async (booking: BookingData) => {
    try {
      setLoadingId(booking.id);

      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status: "onboard" });

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
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Assigned Tuk Tuks</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedBookings.map((booking, idx) => (
              <tr key={booking.id} className="hover:bg-gray-50 even:bg-gray-50 text-gray-800">
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2">{booking.name}</td>
                <td className="px-3 py-2">{booking.assignedTuks?.join(", ")}</td>
                <td className="px-3 py-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs shadow"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleComplete(booking)}
                    disabled={loadingId === booking.id}
                    className={`flex items-center justify-center gap-2 px-3 py-1 rounded text-xs shadow transition ${
                      loadingId === booking.id
                        ? "bg-green-600 opacity-50 cursor-not-allowed text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {loadingId === booking.id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Completing...
                      </>
                    ) : (
                      "On-board"
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
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">Booking Details</h2>

            {/* Personal Information Card */}
            <div className="border border-gray-300 p-6 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div><strong className="font-semibold">Name:</strong> {selectedBooking.name}</div>
                <div><strong className="font-semibold">Email:</strong> {selectedBooking.email}</div>
                <div><strong className="font-semibold">WhatsApp:</strong> +{selectedBooking.whatsapp}</div>
                <div><strong className="font-semibold">Total Price:</strong> ${selectedBooking.RentalPrice || "—"}</div>
                <div><strong className="font-semibold">Pickup:</strong> {selectedBooking.pickup}</div>
                <div><strong className="font-semibold">Pickup Date/Time:</strong> {selectedBooking.pickupDate} {selectedBooking.pickupTime}</div>
                <div><strong className="font-semibold">Return:</strong> {selectedBooking.returnLoc}</div>
                <div><strong className="font-semibold">Return Date/Time:</strong> {selectedBooking.returnDate} {selectedBooking.returnTime}</div>
                <div><strong className="font-semibold">Tuk Count:</strong> {selectedBooking.tukCount}</div>
                <div><strong className="font-semibold">License Count:</strong> {selectedBooking.licenseCount}</div>
              </div>
            </div>

            {/* Extras Card */}
            <div className="border border-gray-300 p-6 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Extras</h3>
              <div>
                <strong>Extras:</strong>{" "}
                {Object.entries(selectedBooking.extras || {})
                  .filter(([, count]) => count > 0)
                  .map(([key, value]) => `${key} (${value})`)
                  .join(", ") || "None"}
              </div>
            </div>

            {/* Train Transfer Card */}
            <div className="border border-gray-300 p-6 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Train Transfer</h3>
              {selectedBooking.trainTransfer ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>From:</strong> {selectedBooking.trainTransfer.from}</p>
                  <p><strong>To:</strong> {selectedBooking.trainTransfer.to}</p>
                  <p><strong>Pickup Time:</strong> {selectedBooking.trainTransfer.pickupTime}</p>
                  <p><strong>Price:</strong> ${selectedBooking.trainTransfer.price}</p>
                  <p><strong>Train Assigned Person:</strong> {selectedBooking.trainTransferAssignedPerson || "N/A"}</p>
                </div>
              ) : (
                "None"
              )}
            </div>

            {/* Assigned Tuks Card */}
            <div className="border border-gray-300 p-6 rounded-lg shadow-sm mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assigned Tuks</h3>
              <div><strong>Assigned Tuks:</strong> {selectedBooking.assignedTuks?.join(", ")}</div>
              <div><strong>Allocate Person:</strong> {selectedBooking.assignedPerson || "N/A"}</div>
              <div><strong>Hold Back Person:</strong> {selectedBooking.holdBackAssignedPerson || "N/A"}</div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm rounded-lg shadow-md transform transition-all duration-200 ease-in-out"
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
