"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("missing");
      return;
    }

    const confirmBooking = async () => {
      try {
        const bookingRef = doc(db, "bookings", orderId);
        await updateDoc(bookingRef, { isBooked: true });
        setStatus("success");
      } catch (err) {
        console.error("❌ Firestore update failed:", err);
        setStatus("fail");
      }
    };

    confirmBooking();
  }, [orderId]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-10">
      {status === "loading" && <p className="text-gray-600">🔄 Finalizing your booking...</p>}
      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
          <p className="text-lg text-gray-700 mt-2">Your booking is confirmed. We’ll be in touch soon!</p>
        </>
      )}
      {status === "missing" && <p className="text-red-500">⚠️ Order ID is missing from the URL.</p>}
      {status === "fail" && <p className="text-red-600">❌ Something went wrong while confirming your booking.</p>}
    </main>
  );
}
