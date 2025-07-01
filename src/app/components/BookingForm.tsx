// app/components/BookingForm.tsx
"use client";

import { useState } from "react";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="booking" className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          Quick Booking Form
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <input type="text" placeholder="Your Name" required className="input" />
          <input type="tel" placeholder="WhatsApp Number" required className="input" />
          <input type="email" placeholder="Email Address" required className="input" />
          <select className="input" defaultValue="">
            <option value="" disabled>Pickup Location</option>
            <option>Colombo</option>
            <option>Negombo</option>
            <option>Galle</option>
            <option>More...</option>
          </select>
          <input type="date" className="input" required />
          <input type="date" className="input" required />
          <select className="input" defaultValue="1">
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} TukTuk{(i + 1) > 1 && "s"}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-purple-700 text-white font-bold py-3 px-6 rounded col-span-full hover:bg-purple-800 transition"
          >
            Submit Booking
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            Booking submitted successfully!
          </p>
        )}
      </div>
    </section>
  );
}
