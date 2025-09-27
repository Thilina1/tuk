"use client";

import React, { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: Record<string, unknown>) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
    };
  }
}

export default function ContactInfo() {
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("Saman");
  const [lastName, setLastName] = useState("Perera");
  const [email, setEmail] = useState("samanp@gmail.com");
  const [phone, setPhone] = useState("0771234567");
  const [address, setAddress] = useState("No.1, Galle Road");
  const [city, setCity] = useState("Colombo");
  const [country, setCountry] = useState("Sri Lanka");
  const [deliveryAddress, setDeliveryAddress] = useState("No. 46, Galle road, Kalutara South");
  const [deliveryCity, setDeliveryCity] = useState("Kalutara");
  const [deliveryCountry, setDeliveryCountry] = useState("Sri Lanka");
  const [items, setItems] = useState("Door bell wireles");
  const [orderId, setOrderId] = useState(`ItemNo_${Date.now()}`);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate inputs
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !country.trim()) {
        setError("Please fill in all required fields (first name, last name, email, country).");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      // Check if PayHere SDK is loaded
      if (!sdkLoaded || !window.payhere) {
        setError("Payment system not ready. Please try again.");
        return;
      }

      // Fetch the PayHere hash
      const hashRes = await fetch("/api/payhere/checkout/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: 5, // Hardcoded to $5 USD
          currency: "USD",
        }),
      });

      if (!hashRes.ok) {
        const hashText = await hashRes.text();
        const errorMessage = hashText.includes("404")
          ? "API route not found. Please check /api/get-payhere-hash."
          : hashText || `HTTP ${hashRes.status}`;
        throw new Error(errorMessage);
      }

      const { hash } = await hashRes.json();

      // Prepare payment object
      const payment = {
        sandbox: true,
        merchant_id: "121XXXX", // Replace with your Merchant ID
        return_url: "https://yourdomain.com/payment-success", // Replace
        cancel_url: "https://yourdomain.com/payment-cancel", // Replace
        notify_url: "https://yourdomain.com/api/payhere-notify", // Replace
        order_id: orderId,
        items,
        amount: "5.00", // Hardcoded to $5.00 USD
        currency: "USD",
        hash,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        country,
        delivery_address: deliveryAddress || undefined,
        delivery_city: deliveryCity || undefined,
        delivery_country: deliveryCountry || undefined,
        custom_1: "",
        custom_2: "",
      };

      // Start payment
      window.payhere.startPayment(payment);

      // Payment event handlers
      window.payhere.onCompleted = (orderId) => {
        console.log("Payment completed. OrderID:", orderId);
        alert(`Payment completed. OrderID: ${orderId}`);
      };

      window.payhere.onDismissed = () => {
        console.log("Payment dismissed");
        alert("Payment dismissed");
      };

      window.payhere.onError = (error) => {
        console.log("Error:", error);
        setError(`Payment error: ${error}`);
      };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("Payment initiation error:", errorMessage, e);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-6 bg-white shadow">
        <h1 className="text-xl font-semibold">PayHere Payment ($5 USD)</h1>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        <label className="block text-sm">
          First Name
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="Enter first name"
          />
        </label>

        <label className="block text-sm">
          Last Name
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            placeholder="Enter last name"
          />
        </label>

        <label className="block text-sm">
          Email
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
          />
        </label>

        <label className="block text-sm">
          Phone (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="Enter phone number"
          />
        </label>

        <label className="block text-sm">
          Address (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Enter address"
          />
        </label>

        <label className="block text-sm">
          City (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            type="text"
            placeholder="Enter city"
          />
        </label>

        <label className="block text-sm">
          Country
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            type="text"
            placeholder="Enter country"
          />
        </label>

        <label className="block text-sm">
          Delivery Address (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            type="text"
            placeholder="Enter delivery address"
          />
        </label>

        <label className="block text-sm">
          Delivery City (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
            type="text"
            placeholder="Enter delivery city"
          />
        </label>

        <label className="block text-sm">
          Delivery Country (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={deliveryCountry}
            onChange={(e) => setDeliveryCountry(e.target.value)}
            type="text"
            placeholder="Enter delivery country"
          />
        </label>

        <label className="block text-sm">
          Items
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            type="text"
            placeholder="Enter item description"
          />
        </label>

        <label className="block text-sm">
          Order ID
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            type="text"
            placeholder="Enter order ID"
          />
        </label>

        <button
          id="payhere-payment"
          onClick={handlePay}
          disabled={loading || !sdkLoaded}
          className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Processing…" : "Pay $5 USD"}
        </button>

        <Script
          src="https://www.payhere.lk/lib/payhere.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("✅ PayHere SDK loaded");
            setSdkLoaded(true);
          }}
        />
      </div>
    </main>
  );
}
