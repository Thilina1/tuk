// app/contactus/ContactInfo.tsx
"use client";

import Image from "next/image";

export default function ContactInfo() {
  return (
    <div
      className="p-6 rounded-md shadow-sm bg-cover bg-center border border-gray-200"
      style={{
        backgroundImage: "url('/hero/coconut-bg.jpg')",
      }}
    >
      <div className="bg-opacity-80 p-6 rounded-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">Contact Info</h2>

        <div className="mb-4 text-center">
          <Image
            src="/logo/TukTukDrive-Logo-Footer.png"
            alt="Contact Illustration"
            width={300}
            height={200}
            className="mx-auto rounded"
          />
        </div>

        <ul className="space-y-4 text-sm text-black text-center">
          <li>📧 <strong>Email:</strong> info@tuktukrental.com</li>
          <li>📲 <strong>Phone / Whatsapp:</strong> (+94) 77 006 3780</li>
          <li>🏢 <strong>Head Office:</strong> No. 06, Ambasewanagama, Kengalla. (Kandy) Sri Lanka </li>
        </ul>
      </div>
    </div>
  );
}
