"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";

export default function OnBoardBookings({ bookings }: { bookings: BookingData[] }) {
  const [onBoardBookings, setOnBoardBookings] = useState<BookingData[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  type Numericish = number | string | null | undefined;

  const money = (n: Numericish): string => {
    const num =
      typeof n === "number"
        ? n
        : n != null
        ? Number.parseFloat(String(n))
        : Number.NaN;
    if (!Number.isFinite(num)) return String(n ?? "—");
    return `$${num.toLocaleString()}`;
  };

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
      window.location.reload();
    }
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
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
                <th className="px-3 py-2 text-left">Id</th>
                <th className="px-3 py-2 text-left">Assigned Tuk Tuks</th>
                <th className="px-3 py-2 text-left">Pickup Location</th>
                <th className="px-3 py-2 text-left">Pickup Date</th>
                <th className="px-3 py-2 text-left">Pick up time</th>
                <th className="px-3 py-2 text-left">Return Date</th>
                <th className="px-3 py-2 text-left">Assigned Person</th>
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
                    <td className="px-3 py-2">{booking.bookingId || "NA"}</td>
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
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Booking details"
          onKeyDown={(e) => e.key === "Escape" && setSelectedBooking(null)}
          tabIndex={-1}
        >
          {/* PRINT AREA WRAPPER */}
          <div
            id="onboard-print-area"
            className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Booking Details - {selectedBooking.bookingId}</h2>
              <div className="flex items-center gap-3 no-print">
                <button
                  onClick={handlePrint}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition"
                >
                  Print
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* General Booking Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong className="font-semibold text-gray-900">Name:</strong>{" "}
                  {selectedBooking.name || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Email:</strong>{" "}
                  {selectedBooking.email || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Vehicle Type:</strong>{" "}
                  {selectedBooking.selectedVehicleName || "Regular"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">WhatsApp:</strong>{" "}
                  {selectedBooking.whatsapp ? `+${selectedBooking.whatsapp}` : "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Total Price:</strong>{" "}
                  {money(selectedBooking.RentalPrice) || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Pickup:</strong>{" "}
                  {selectedBooking.pickup || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Pickup Date/Time:</strong>{" "}
                  {selectedBooking.pickupDate && selectedBooking.pickupTime
                    ? `${selectedBooking.pickupDate} ${selectedBooking.pickupTime}`
                    : "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Return:</strong>{" "}
                  {selectedBooking.returnLoc || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Return Date/Time:</strong>{" "}
                  {selectedBooking.returnDate && selectedBooking.returnTime
                    ? `${selectedBooking.returnDate} ${selectedBooking.returnTime}`
                    : "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Tuk Count:</strong>{" "}
                  {selectedBooking.tukCount || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">License Count:</strong>{" "}
                  {selectedBooking.licenseCount || "—"}
                </div>
              </div>

              {/* Extras */}
              <div className="border border-gray-300 p-6 rounded-lg shadow-sm mb-4">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Extras</h3>
  <div>
    <strong>Extras:</strong>{" "}
    {(() => {
      const extras = Object.entries(selectedBooking.extras || {}).filter(
        ([, count]) => (count as number) > 0
      );

      if (extras.length === 0) {
        return "No";
      }

      // Calculate rental days for per-day items
      const returnTime = new Date(selectedBooking.returnDate).getTime();
      const pickupTime = new Date(selectedBooking.pickupDate).getTime();
      const days = returnTime > pickupTime
        ? Math.ceil((returnTime - pickupTime) / (1000 * 60 * 60 * 24)) + 1
        : 1;

      return extras
        .map(([key, value]) => {
          const isFlatFee = key === "Full-Time Driver" || key === "Train Transfer";
          if (isFlatFee) {
            // Flat-fee items: Display quantity only (e.g., "Full-Time Driver (1)")
            return `${key} (${value})`;
          }
          // Per-day items: Display "X days, Y items"
          const ratio = Math.round((value as number) / days);
          return `${key} (${days} days, ${ratio} items)`;
        })
        .join(", ");
    })()}
  </div>
</div>

              {/* License & Identity */}
              <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">License & Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong className="font-semibold text-gray-900">International Driving Permit (IDP):</strong>{" "}
                    {selectedBooking.hasIDP || "—"}
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-900">Full Name:</strong>{" "}
                    {selectedBooking.licenseName || "—"}
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-900">Address:</strong>{" "}
                    {selectedBooking.licenseAddress || "—"}
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-900">Country:</strong>{" "}
                    {selectedBooking.licenseCountry || "—"}
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-900">Postal Code:</strong>{" "}
                    {selectedBooking.postalCode || "—"}
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-900">License Number:</strong>{" "}
                    {selectedBooking.licenseNumber || "—"}
                  </div>
                  <div>
                    <strong className="font-semibold text-gray-900">Passport Number:</strong>{" "}
                    {selectedBooking.passportNumber || "—"}
                  </div>
                </div>
              </div>

              {/* Train Transfer */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Train Transfer</h3>
                {selectedBooking.trainTransfer ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong className="font-semibold text-gray-900">From:</strong>{" "}
                      {selectedBooking.trainTransfer.from || "—"}
                    </p>
                    <p>
                      <strong className="font-semibold text-gray-900">To:</strong>{" "}
                      {selectedBooking.trainTransfer.to || "—"}
                    </p>
                    <p>
                      <strong className="font-semibold text-gray-900">Pickup Time:</strong>{" "}
                      {selectedBooking.trainTransfer.pickupTime || "—"}
                    </p>
                    <p>
                      <strong className="font-semibold text-gray-900">Price:</strong>{" "}
                      {money(selectedBooking.trainTransfer.price) || "—"}
                    </p>
                    <p>
                      <strong className="font-semibold text-gray-900">Train Assign Person:</strong>{" "}
                      {selectedBooking.trainTransferAssignedPerson || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">None</p>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong className="font-semibold text-gray-900">Assigned Tuks:</strong>{" "}
                  {selectedBooking.assignedTuks?.join(", ") || "—"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Handover Agent (Start):</strong>{" "}
                  {selectedBooking.assignedPerson || "N/A"}
                </div>
                <div>
                  <strong className="font-semibold text-gray-900">Return Agent:</strong>{" "}
                  {selectedBooking.holdBackAssignedPerson || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print-only CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #onboard-print-area,
          #onboard-print-area * {
            visibility: visible !important;
          }
          #onboard-print-area {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            margin: 0 !important;
            padding: 16px !important;
            box-shadow: none !important;
            max-height: none !important;
            height: auto !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure text and borders are black for print */
          #onboard-print-area h2,
          #onboard-print-area h3,
          #onboard-print-area strong {
            color: #000000 !important;
          }
          #onboard-print-area .border,
          #onboard-print-area .border-t {
            border-color: #000000 !important;
          }
          #onboard-print-area .shadow-sm {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}