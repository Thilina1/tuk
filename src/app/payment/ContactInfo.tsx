"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaMoneyBillWave, FaTags } from "react-icons/fa";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

// ---- Types ----
type DailyRate = { duration: string; pricePerDay: number };
type Extra = { name: string; price: number; type: string };
type PricingDoc = {
  dailyRates?: DailyRate[];
  licenseFee?: { amount: number; description?: string };
  optionalExtras?: Extra[];
  refundableDeposit?: { amount: number; description?: string };
  updatedAt?: Timestamp;
};

// ---- Utils ----
const money = (n?: number) =>
  typeof n === "number" ? `$${n}` : "-";

// ---- Component ----
export default function PricingDetails() {
  const [data, setData] = useState<PricingDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live Firestore subscription to masterPrices/pricing
  useEffect(() => {
    const ref = doc(db, "masterPrices", "pricing");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData((snap.data() as PricingDoc) ?? null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-500">Loading pricing…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-600">Couldn’t load pricing. {error ?? ""}</p>
      </div>
    );
  }

  // ✅ Filter out bad/placeholder rows coming from Firestore
  const dailyRates =
    (data.dailyRates ?? []).filter(
      (r) => r?.duration?.trim() && Number(r?.pricePerDay) > 0
    );

  const optionalExtras =
    (data.optionalExtras ?? []).filter(
      (e) => e?.name?.trim() && Number(e?.price) > 0
    );

  const { licenseFee, refundableDeposit } = data;

  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/hero/coconut-bg.jpg')" }}
    >
      <div className="max-w-6xl mx-auto bg-white backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-12 text-gray-800">
        <h2 className="text-4xl font-extrabold text-center">📊 TukTuk Rental Pricing Guide</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Transparent pricing, no hidden charges. Plan your ride with ease.
        </p>

        {/* Daily Rental */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-[#FFF7ED] via-white to-[#F0FFF4] !bg-white">
          <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <FaMoneyBillWave /> Daily Rental Rates
          </h3>

          <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden bg-white">
            <thead className="bg-[#FFEDD5] text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Duration</th>
                <th className="px-4 py-2 border-b">Price / Day</th>
              </tr>
            </thead>
            <tbody>
              {dailyRates.map((r, i) => (
                <tr key={`${r.duration}-${i}`} className="hover:bg-orange-50 transition">
                  <td className="px-4 py-2 border-b">{r.duration}</td>
                  <td className="px-4 py-2 border-b font-medium">{money(r.pricePerDay)}</td>
                </tr>
              ))}
              {dailyRates.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={2}>
                    No rates available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* License Fee */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <h3 className="text-2xl font-bold text-emerald-600 mb-4">🪪 License Fee</h3>
          <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
            <li>
              <strong>{money(licenseFee?.amount)} per license</strong>.
            </li>
            {licenseFee?.description && <li>{licenseFee.description}</li>}
            <li>IDP recommended for foreign visitors; all drivers must be 18+.</li>
          </ul>
        </section>

        {/* Extras */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-gradient-to-br from-[#F0FFF4] via-white to-[#FFFBEB] !bg-white">
          <h3 className="text-2xl font-bold text-amber-600 mb-4 flex items-center gap-2">
            <FaTags /> Optional Extras
          </h3>

          <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden bg-white">
            <thead className="bg-[#FEF3C7] text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Extra</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Type</th>
              </tr>
            </thead>
            <tbody>
              {optionalExtras.map((e, i) => (
                <tr key={`${e.name}-${i}`} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-2 border-b">{e.name}</td>
                  <td className="px-4 py-2 border-b">{money(e.price)}</td>
                  <td className="px-4 py-2 border-b">{e.type}</td>
                </tr>
              ))}
              {optionalExtras.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={3}>
                    No extras available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Deposit */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">💰 Refundable Deposit</h3>
          <p className="text-sm leading-relaxed">
            A one-time <strong>{money(refundableDeposit?.amount ?? 50)} security deposit</strong> is collected and fully refunded after the trip (if all good).
          </p>
          {refundableDeposit?.description && (
            <p className="text-sm mt-2">{refundableDeposit.description}</p>
          )}
        </section>

        {/* Cost Formula */}
        <section className="rounded-xl border border-dashed border-emerald-400 p-6 bg-[#F0FFF4] text-sm">
          <h3 className="text-xl font-bold text-emerald-800 mb-2">🧮 Cost Calculation Formula</h3>
          <code className="text-gray-700 block">
            Total = (Tuk Count × Days × Per Day Rate) + (License Count × {money(licenseFee?.amount ?? 35)}) + Pickup/Return + Extras + {money(refundableDeposit?.amount ?? 50)} (Deposit) − Coupon
          </code>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/#book"
            className="inline-block bg-gradient-to-r from-orange-400 to-amber-500 !bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
            style={{ backgroundImage: "linear-gradient(to right, #fb923c, #fbbf24)" }}
          >
            🚀 Book Your TukTuk Now
          </Link>
          <p className="text-sm text-gray-500 mt-2">No upfront payment required to get started.</p>
        </div>
      </div>
    </div>
  );
}
