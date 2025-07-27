import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";

export default function OnBoardBookings({ bookings }: { bookings: BookingData[] }) {
  const [onBoardBookings, setOnBoardBookings] = useState<BookingData[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set tomorrow's date

    // Reset time to 00:00:00 for both today and tomorrow to avoid time mismatch
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    const filtered = bookings.filter((b) => {
      if (!b.pickupDate || b.status !== "assigned") {
        return false; // Only show bookings that are assigned
      }

      const pickupDate = new Date(b.pickupDate);
      pickupDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for accurate comparison

      if (isNaN(pickupDate.getTime())) return false;

      const diffInDays = Math.floor(
        (pickupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Show bookings that are either today or tomorrow
      return diffInDays >= 0 && diffInDays <= 1;
    });

    setOnBoardBookings(filtered);
  }, [bookings]);

  const handleComplete = async (booking: BookingData) => {
    try {
      setLoadingId(booking.id);

      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, { status: "onboard" });

      setOnBoardBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (error) {
      console.error("Error Onboard :", error);
      alert("Failed to onboard.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {onBoardBookings.length === 0 ? (
        <p className="text-gray-600">No bookings assigned for today or tomorrow.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white text-sm text-gray-800">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Assigned Tuk Tuks</th>
              <th className="px-3 py-2 text-left">Pickup Location</th>
              <th className="px-3 py-2 text-left">Pickup Data</th>
              <th className="px-3 py-2 text-left">Pick up time</th>
              <th className="px-3 py-2 text-left">Return Data</th>
              <th className="px-3 py-2 text-left">assigned Person</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
            </thead>
            <tbody>
              {onBoardBookings.map((booking, index) => {
                const pickupDate = new Date(booking.pickupDate);
                pickupDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for accurate comparison
                const diffInDays = Math.floor(
                  (pickupDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                let rowColor = "";
                if (diffInDays === 0) rowColor = "bg-green-50 text-green-800"; // Today
                else if (diffInDays === 1) rowColor = "bg-yellow-50 text-yellow-800"; // Tomorrow

                return (
                  <tr
                    key={booking.id}
                    className={`hover:bg-gray-50 even:bg-gray-50 ${rowColor}`}
                  >
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{booking.name}</td>
                    <td className="px-3 py-2">{booking.assignedTuks?.join(", ")}</td>
                    <td className="px-3 py-2">{booking.pickup}</td>
                    <td className="px-3 py-2">{booking.pickupDate}</td>
                    <td className="px-3 py-2">{booking.pickupTime}</td>
                    <td className="px-3 py-2">{booking.returnDate}</td>
                    <td className="px-3 py-2">{booking.assignedPerson}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
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
                    <p><strong>Train Assign Person:</strong> {selectedBooking.trainTransferAssignedPerson || "N/A"}</p>
                  </div>
                ) : (
                  "None"
                )}
              </div>

              <div><strong>Assigned Tuks:</strong> {selectedBooking.assignedTuks?.join(", ")}</div>
              <div><strong>Handover Agent (Start):</strong> {selectedBooking.assignedPerson || "N/A"}</div>
              <div><strong>Return Agent:</strong> {selectedBooking.holdBackAssignedPerson || "N/A"}</div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
