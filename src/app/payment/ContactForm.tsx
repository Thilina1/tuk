// PaymentForm.tsx
"use client";

import React, { useState } from "react";
import Script from "next/script";





export default function PaymentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayNow = async () => {
    // 1. Get hash from backend
    const response = await fetch("/api/payhere/checkout/api", {
      method: "POST",
      body: JSON.stringify({
        amount: formData.amount,
        orderId: formData.orderId,
        currency: "USD",
      }),
    });

    const { hash } = await response.json();

    // 2. Prepare payment object
    const payment = {
      sandbox: true,
      merchant_id: "1231320", // replace
      return_url: "https://yourdomain.com/payment-success",
      cancel_url: "https://yourdomain.com/payment-cancel",
      notify_url: "https://yourdomain.com/api/payhere-notify", // server-side
      order_id: formData.orderId,
      items: "Rental Booking",
      amount: parseFloat(formData.amount).toFixed(2),
      currency: "USD",
      hash,
      first_name: formData.name,
      last_name: "Weerasinghe",
      email: formData.email,
      phone: formData.phone,
      address: "Hapugahalanda,Pilihudugolla",
      city: "Nula",
      country: "Sri Lanka",
    };

    // 3. Trigger payment popup
window.payhere.startPayment(payment);
  };

  return (
    <>
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="beforeInteractive" />
      <div className="p-8 bg-white shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center text-yellow-500">Secure Payment</h2>
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />
        <input
          name="orderId"
          placeholder="Order ID"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />
        <input
          name="amount"
          placeholder="Amount (USD)"
          type="number"
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />
        <button onClick={handlePayNow} className="bg-yellow-400 w-full py-2 font-semibold">
          Pay Now
        </button>
      </div>
    </>
  );
}
