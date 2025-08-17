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

  const money = (n: any) => {
    const num = typeof n === "number" ? n : parseFloat(n ?? "0");
    if (Number.isNaN(num)) return n ?? "—";
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
                  {/* Quick print from table: open modal then trigger print */}
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
                            d="M4 12a 8 8 0 0 1 8-8v8z"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* PRINT AREA WRAPPER */}
          <div
            id="onboard-print-area"
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Booking Details</h2>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handlePrint}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 text-sm rounded-lg shadow-md"
                >
                  Print
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {selectedBooking.name}</div>
              <div><strong>Email:</strong> {selectedBooking.email}</div>
              <div><strong>WhatsApp:</strong> +{selectedBooking.whatsapp}</div>
              <div><strong>Total Price:</strong> {money(selectedBooking.RentalPrice) || "—"}</div>
              <div><strong>Pickup:</strong> {selectedBooking.pickup}</div>
              <div><strong>Pickup Date/Time:</strong> {selectedBooking.pickupDate} {selectedBooking.pickupTime}</div>
              <div><strong>Return:</strong> {selectedBooking.returnLoc}</div>
              <div><strong>Return Date/Time:</strong> {selectedBooking.returnDate} {selectedBooking.returnTime}</div>
              <div><strong>Tuk Count:</strong> {selectedBooking.tukCount}</div>
              <div><strong>License Count:</strong> {selectedBooking.licenseCount}</div>

              <div className="md:col-span-2">
                <strong>Extras:</strong>{" "}
                {Object.entries(selectedBooking.extras || {})
                  .filter(([, count]) => (count as number) > 0)
                  .map(([key, value]) => `${key} (${value})`)
                  .join(", ") || "None"}
              </div>

              <div className="space-y-4 border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-gray-800">License & Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><strong>International Driving Permit (IDP):</strong> {(selectedBooking.hasIDP)}</div>
                  <div><strong>Full Name:</strong> {(selectedBooking.licenseName)}</div>
                  <div><strong>Address:</strong> {(selectedBooking.licenseAddress)}</div>
                  <div><strong>Country:</strong> {(selectedBooking.licenseCountry)}</div>
                  <div><strong>Postal Code:</strong> {(selectedBooking.postalCode)}</div>
                  <div><strong>License Number:</strong> {(selectedBooking.licenseNumber)}</div>
                  <div><strong>Passport Number:</strong> {(selectedBooking.passportNumber)}</div>
                </div>
              </div>

              <div className="md:col-span-2">
                <strong>Train Transfer:</strong>{" "}
                {selectedBooking.trainTransfer ? (
                  <div className="mt-1 space-y-1 text-sm text-gray-700">
                    <p><strong>From:</strong> {selectedBooking.trainTransfer.from}</p>
                    <p><strong>To:</strong> {selectedBooking.trainTransfer.to}</p>
                    <p><strong>Pickup Time:</strong> {selectedBooking.trainTransfer.pickupTime}</p>
                    <p><strong>Price:</strong> {money(selectedBooking.trainTransfer.price)}</p>
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
          </div>
        </div>
      )}

      {/* Print-only CSS: only the modal’s content prints */}
      <style jsx global>{`
        @media print {
          /* hide everything by default */
          body * {
            visibility: hidden !important;
          }
          /* show only the print area */
          #onboard-print-area,
          #onboard-print-area * {
            visibility: visible !important;
          }
          /* position at top-left to avoid clipping */
          #onboard-print-area {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            max-height: none !important;
            height: auto !important;
            width: 100% !important;
          }
          /* hide buttons/actions */
          .no-print {
            display: none !important;
          }
          /* neutral print bg */
          body {
            background: #ffffff !important;
          }
        }
      `}</style>
    </>
  );
}
