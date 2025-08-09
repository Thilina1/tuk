"use client";

import React, { useState } from "react";

export default function PayPage() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("1000"); // LKR
  const [gatewayId, setGatewayId] = useState("1"); // try empty "" if not required
  const [multiIds, setMultiIds] = useState(""); // e.g. "1|2|3"

  const handlePay = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payhere/checkout/api2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          currency: "LKR", // keep consistent with encrypted amount
          item_name: "Regular Tuk Rental",
          payment_gateway_id: gatewayId || undefined,
          multiple_payment_gateway_ids: multiIds || undefined,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

      const { redirectUrl, fields } = JSON.parse(text);

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
      alert("Payment init failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-6 bg-white shadow">
        <h1 className="text-xl font-semibold">WebXPay Sandbox (Next.js)</h1>

        <label className="block text-sm">
          Amount (LKR)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
        </label>

        <label className="block text-sm">
          payment_gateway_id (optional)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="e.g. 1"
            value={gatewayId}
            onChange={(e) => setGatewayId(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          multiple_payment_gateway_ids (optional, pipe-separated)
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="e.g. 1|2|3"
            value={multiIds}
            onChange={(e) => setMultiIds(e.target.value)}
          />
        </label>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Processing…" : "💳 Pay Now"}
        </button>

        <p className="text-xs text-gray-500">
          Heads up: keep <code>LKR</code> as <code>process_currency</code> and encrypt the same currency amount.
        </p>
      </div>
    </main>
  );
}
