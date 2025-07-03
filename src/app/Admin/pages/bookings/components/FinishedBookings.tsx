"use client";

import { useState } from "react";
import { BookingData } from "../BookingsPage";

export default function FinishedBookings({ bookings }: { bookings: BookingData[] }) {
  const finished = bookings.filter((b) => b.status === "finished");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  if (finished.length === 0)
    return <p className="text-gray-600">No finished bookings.</p>;

  return (
    <>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {finished.map((booking, index) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
              >
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2">{booking.name}</td>
                <td className="px-3 py-2">{booking.email}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl h-auto max-h-[80vh] flex flex-col">
            <div className="sticky top-0 bg-white py-4">
              <h2 className="text-2xl font-semibold text-center text-blue-800">
                Finished Booking Details
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto mt-2">
              {/* Personal Information Section */}
              <div className="space-y-4 border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><strong>Name:</strong> {selectedBooking.name}</div>
                  <div><strong>Email:</strong> {selectedBooking.email}</div>
                  <div><strong>WhatsApp:</strong> +{selectedBooking.whatsapp}</div>
                  <div><strong>Total Price:</strong> ${selectedBooking.RentalPrice || "—"}</div>
                  <div><strong>Pickup Location:</strong> {selectedBooking.pickup}</div>
                  <div><strong>Pickup Date/Time:</strong> {selectedBooking.pickupDate} {selectedBooking.pickupTime}</div>
                  <div><strong>Return Location:</strong> {selectedBooking.returnLoc}</div>
                  <div><strong>Return Date/Time:</strong> {selectedBooking.returnDate} {selectedBooking.returnTime}</div>
                  <div><strong>Tuk Count:</strong> {selectedBooking.tukCount}</div>
                  <div><strong>License Count:</strong> {selectedBooking.licenseCount}</div>
                </div>
              </div>

              {/* Extras Section */}
              <div className="space-y-4 border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Extras</h3>
                <div>
                  <strong>Extras:</strong> {Object.entries(selectedBooking.extras || {})
                    .filter(([, count]) => count > 0)
                    .map(([key, value]) => `${key} (${value})`)
                    .join(", ") || "None"}
                </div>
              </div>

              {/* Train Transfer Section */}
              <div className="space-y-4 border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Train Transfer</h3>
                {selectedBooking.trainTransfer ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>From:</strong> {selectedBooking.trainTransfer.from}</div>
                    <div><strong>To:</strong> {selectedBooking.trainTransfer.to}</div>
                    <div><strong>Pickup Time:</strong> {selectedBooking.trainTransfer.pickupTime}</div>
                    <div><strong>Price:</strong> ${selectedBooking.trainTransfer.price}</div>
                    <div className="md:col-span-2">
                      <strong>Assigned Person:</strong> {selectedBooking.trainTransferAssignedPerson || "N/A"}
                    </div>
                  </div>
                ) : (
                  "None"
                )}
              </div>

              {/* Assigned Tuks Section */}
              <div className="space-y-4 border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Assigned Tuks</h3>
                <div><strong>Assigned Tuks:</strong> {selectedBooking.assignedTuks?.join(", ")}</div>
                <div><strong>Allocate Person:</strong> {selectedBooking.assignedPerson || "N/A"}</div>
                <div><strong>Hold Back Person:</strong> {selectedBooking.holdBackAssignedPerson || "N/A"}</div>
              </div>
            </div>

            {/* Rental Price Section at the Bottom */}
            <div className="border-t border-gray-300 p-4 mt-4 text-right">
              <div className="text-lg font-semibold text-gray-800">
                <strong>Total Rental Price: </strong>
                ${selectedBooking.RentalPrice || "—"}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow-md transform transition-all duration-200 ease-in-out"
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
