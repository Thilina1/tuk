
// File: app/admin/bookings/components/CompleteBookings.tsx
import { BookingData } from "../BookingsPage";

export default function CompleteBookings({ bookings }: { bookings: BookingData[] }) {
  const complete = bookings.filter((b) => b.isBooked);

  if (complete.length === 0) return <p>No complete bookings.</p>;

  return (
    <table className="min-w-full bg-white border rounded text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-left">Pickup</th>
          <th className="p-2 text-left">Return</th>
        </tr>
      </thead>
      <tbody>
        {complete.map((booking) => (
          <tr key={booking.id} className="border-t">
            <td className="p-2">{booking.name}</td>
            <td className="p-2">{booking.email}</td>
            <td className="p-2">{booking.pickup}</td>
            <td className="p-2">{booking.returnLoc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
