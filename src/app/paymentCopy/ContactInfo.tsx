"use client";

import React, { useState } from "react";

export default function PayPage() {
  const [sendingMail, setSendingMail] = useState(false);

  const handleSendEmail = async () => {
    try {
      setSendingMail(true);
      const res = await fetch("/api/send-email/test", {
        method: "POST",
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
