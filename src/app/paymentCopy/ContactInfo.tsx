"use client";

import React, { useState } from "react";

export default function PayPage() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);

      // Ask our server to prepare the WebXPay POST payload
      const res = await fetch("/api/payhere/checkout/api2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send whatever you need to compute amount/orderId
        body: JSON.stringify({
          amount: 12.0, // test amount (use LKR in prod if process_currency=LKR)
          currency: "LKR",
          meta: { item: "Regular Tuk Rental" },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const { redirectUrl, fields } = await res.json();

      // Build and submit a form to WebXPay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = redirectUrl;

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      alert("Payment init failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-60"
      >
        {loading ? "Processing..." : "💳 Pay Now"}
      </button>
    </div>
  );
}
