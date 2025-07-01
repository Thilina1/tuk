

// File: app/admin/bookings/components/IncompleteBookings.tsx
import { BookingData } from "../BookingsPage";

export default function IncompleteBookings({ bookings }: { bookings: BookingData[] }) {
  const incomplete = bookings.filter((b) => !b.isBooked);

  if (incomplete.length === 0) return <p>No incomplete bookings.</p>;

  return (
    <table className="min-w-full bg-white border rounded text-sm">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-left">Whatsapp Num</th>
          <th className="p-2 text-left">PickUp</th>
        </tr>
      </thead>
      <tbody>
        {incomplete.map((booking) => (
          <tr key={booking.id} className="border-t">
            <td className="p-2">{booking.name}</td>
            <td className="p-2">{booking.email}</td>
            <td className="p-2">{booking.whatsapp}</td>
            <td className="p-2">{booking.pickup}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
