"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";

export default function OnBoardedBookings({ bookings }: { bookings: BookingData[] }) {
  const [assignedBookings, setAssignedBookings] = useState(
    bookings.filter((b) => b.status === "onboard")
  );
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

  const handleComplete = async (booking: BookingData) => {
    try {
      setLoadingId(booking.id);

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
      window.location.reload();
    }
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
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
              <th className="px-3 py-2 text-left">Id</th>
              <th className="px-3 py-2 text-left">Assigned Tuk Tuks</th>
              <th className="px-3 py-2 text-left">Return Person</th>
              <th className="px-3 py-2 text-left">Return Date</th>
              <th className="px-3 py-2 text-left">Return Location</th>
              <th className="px-3 py-2 text-left">Return Time</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedBookings.map((booking, idx) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
              >
                <td className="px-3 py-2">{idx + 1}</td>
                <td className="px-3 py-2">{booking.name}</td>
                <td className="px-3 py-2 text-left">{booking.bookingId || "NA"}</td>
                <td className="px-3 py-2">{booking.assignedTuks?.join(", ")}</td>
                <td className="px-3 py-2">{booking.holdBackAssignedPerson}</td>
                <td className="px-3 py-2">{booking.returnDate}</td>
                <td className="px-3 py-2">{booking.returnLoc}</td>
                <td className="px-3 py-2">{booking.returnTime}</td>
                <td className="px-3 py-2 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs shadow"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setTimeout(() => handlePrint(), 50);
                    }}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded text-xs shadow"
                  >
                    Print
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
                            d="M4 12a8 8 0 0 1 8-8v8z"
                          ></path>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
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
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extras</h3>
                <p className="text-sm text-gray-700">
                  {Object.entries(selectedBooking.extras || {})
                    .filter(([, count]) => (count as number) > 0)
                    .map(([key, value]) => `${key} (${value})`)
                    .join(", ") || "None"}
                </p>
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
    </>
  );
}