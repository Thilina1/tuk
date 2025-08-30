"use client";

import React, { useState } from "react";

export default function PayPage() {
  const [loading, setLoading] = useState(false);
  const [sendingMail, setSendingMail] = useState(false);
  const [amount, setAmount] = useState("1000");
  const [gatewayId, setGatewayId] = useState("1");
  const [multiIds, setMultiIds] = useState("");

  const handlePay = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/send-email/checkout/api2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          currency: "LKR",
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

  const handleSendEmail = async () => {
    try {
      setSendingMail(true);
      const res = await fetch("/api/send-email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "thilinaweerasing@gmail.com", // 👈 force send to Gmail
          subject: "TukTukDrive — SMTP Live ✅",
          html: `
            <h2>SMTP is working 🎉</h2>
            <p>This is a test email from your Next.js app.</p>
            <ul>
              <li>Amount: <b>${amount} LKR</b></li>
              <li>Gateway: <b>${gatewayId || "-"}</b></li>
              <li>Multi IDs: <b>${multiIds || "-"}</b></li>
            </ul>
          `,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Send email failed:", data);
        alert(`Email failed: ${data.code || ""} ${data.message || ""}`);
        return;
      }
      alert(`Email sent! Message ID: ${data.id}`);
    } catch (e) {
      console.error(e);
      alert("Email send failed. Check console.");
    } finally {
      setSendingMail(false);
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

        <button
          onClick={handleSendEmail}
          disabled={sendingMail}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {sendingMail ? "Sending…" : "✉️ Send Test Email"}
        </button>
      </div>
    </main>
  );
}
