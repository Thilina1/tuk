// File: app/admin/bookings/components/IncompleteBookings.tsx
import { BookingData } from "../BookingsPage";

export default function IncompleteBookings({ bookings }: { bookings: BookingData[] }) {
  const incomplete = bookings.filter((b) => !b.isBooked);

  if (incomplete.length === 0)
    return <p className="text-gray-600">No incomplete bookings.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-sm text-gray-700 font-medium">
        {incomplete.length} incomplete booking{incomplete.length > 1 ? "s" : ""}
      </h2>

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Whatsapp</th>
            <th className="px-3 py-2 text-left">Pickup Location</th>
            <th className="px-3 py-2 text-left">Pickup Time</th>
            <th className="px-3 py-2 text-left">Return Location</th>
            <th className="px-3 py-2 text-left">Return Time</th>
          </tr>
        </thead>
        <tbody>
          {incomplete.map((booking, idx) => (
            <tr
              key={booking.id}
              className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
            >
              <td className="px-3 py-2">{idx + 1}</td>
              <td className="px-3 py-2">{booking.name}</td>
              <td className="px-3 py-2">{booking.email}</td>
              <td className="px-3 py-2">+{booking.whatsapp}</td>
              <td className="px-3 py-2">{booking.pickup}</td>
              <td className="px-3 py-2">{booking.pickupTime}</td>
              <td className="px-3 py-2">{booking.returnLoc}</td>
              <td className="px-3 py-2">{booking.returnTime}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
