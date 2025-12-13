'use client';

import { useMemo } from 'react';

type Booking = {
  country: string;
  name: string;
};

type Props = {
  bookings: Booking[];
};

export default function BookingMap({ bookings }: Props) {
  const countryData = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      const { country, name } = booking;
      if (!acc[country]) {
        acc[country] = { count: 0, names: [] };
      }
      acc[country].count += 1;
      acc[country].names.push(name);
      return acc;
    }, {} as Record<string, { count: number; names: string[] }>);
  }, [bookings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(countryData).map(([country, data]) => (
        <div key={country} className="bg-white p-4 rounded-lg shadow-md group relative">
          <h2 className="text-md font-semibold text-gray-700">{country}</h2>
          <p className="text-2xl font-bold text-blue-500">{data.count}</p>
          <p className="text-xs text-gray-500">bookings</p>
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
            <h3 className="text-md font-bold mb-2">Bookings from {country}</h3>
            <ul className="text-xs list-disc list-inside">
              {data.names.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
