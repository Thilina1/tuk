"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaMoneyBillWave, FaTags } from "react-icons/fa";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import Image from "next/image";

// ---- Types ----
type DailyRate = { duration: string; pricePerDay: number };
type Extra = { name: string; price: number; type: string };
type PricingDoc = {
  dailyRates?: DailyRate[];
  bikeRates?: DailyRate[]; // Added bikeRates
  eTukRates?: DailyRate[]; // Added eTukRates
  cabrioRates?: DailyRate[]; // Added cabrioRates
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
  const [activeTab, setActiveTab] = useState("regular"); // State for active tab

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

  // ✅ Filter out bad/placeholder rows coming from Firestore for all rate types
  const filterRates = (rates?: DailyRate[]) =>
    (rates ?? []).filter(
      (r) => r?.duration?.trim() && Number(r?.pricePerDay) > 0
    );

  const dailyRates = filterRates(data.dailyRates);
  const bikeRates = filterRates(data.bikeRates); // Filter bikeRates
  const eTukRates = filterRates(data.eTukRates); // Filter eTukRates
  const cabrioRates = filterRates(data.cabrioRates); // Filter cabrioRates

  const optionalExtras =
    (data.optionalExtras ?? []).filter(
      (e) => e?.name?.trim() && Number(e?.price) > 0
    );

  const { licenseFee, refundableDeposit } = data;

  // Image paths for vehicle types
  const vehicleImages = {
    regularTukTuk: "/tukTuk/RegularTuk.png",
    motorBike: "/tukTuk/scuter.png",
    eTukTuk: "/tukTuk/BlueETX.png",
    cabrioTukTuk: "/tukTuk/cabrio.png",
  };

  // Helper function to render rate tables
  const renderRateTable = (rates: DailyRate[], vehicleType: string, imageUrl: string) => (
    <div>
      <div className="flex justify-center">
        <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <FaMoneyBillWave /> Daily Rental Rates - {vehicleType}
        </h3>
      </div>
      <div className="mb-4 text-center">
        <Image
          src={imageUrl}
          alt={vehicleType}
          width={300}
          height={200}
          className="mx-auto rounded"
        />
      </div>
      <table className="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden bg-white">
        <thead className="bg-[#FFEDD5] text-gray-700">
          <tr>
            <th className="px-4 py-2 border-b">Duration</th>
            <th className="px-4 py-2 border-b">Price / Day</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r, i) => (
            <tr key={`${r.duration}-${i}`} className="hover:bg-orange-50 transition">
              <td className="px-4 py-2 border-b">{r.duration}</td>
              <td className="px-4 py-2 border-b font-medium">{money(r.pricePerDay)}</td>
            </tr>
          ))}
          {rates.length === 0 && (
            <tr>
              <td className="px-4 py-3 text-gray-500" colSpan={2}>
                No rates available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

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
        
        {/* Pricing Tabs */}
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
          <div className="pricingTabs">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200">
                <button
                  className={`px-4 py-2 font-semibold rounded-t-lg transition ${
                    activeTab === "regular"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("regular")}
                >
                  Regular Tuk Tuk
                </button>
                <button
                  className={`px-4 py-2 font-semibold rounded-t-lg transition ${
                    activeTab === "motorbike"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("motorbike")}
                >
                  Motor Bike
                </button>
                <button
                  className={`px-4 py-2 font-semibold rounded-t-lg transition ${
                    activeTab === "etuk"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("etuk")}
                >
                  E-Tuk Tuk
                </button>
                <button
                  className={`px-4 py-2 font-semibold rounded-t-lg transition ${
                    activeTab === "cabrio"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("cabrio")}
                >
                  Cabrio Tuk Tuk
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="tabContent">
              {activeTab === "regular" && renderRateTable(dailyRates, "Regular Tuk Tuk", vehicleImages.regularTukTuk)}
              {activeTab === "motorbike" && renderRateTable(bikeRates, "Motor Bike", vehicleImages.motorBike)}
              {activeTab === "etuk" && renderRateTable(eTukRates, "E-Tuk Tuk", vehicleImages.eTukTuk)}
              {activeTab === "cabrio" && renderRateTable(cabrioRates, "Cabrio Tuk Tuk", vehicleImages.cabrioTukTuk)}
            </div>
          </div>
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
        <section className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white">
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
            href="https://www.tuktukdrive.com/"
            className="inline-block bg-gradient-to-r from-orange-400 to-amber-500 !bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
            style={{ backgroundImage: "linear-gradient(to right, #fb923c, #fbbf24)" }}
          >
            🚀 Book Your TukTuk Now
          </Link>
        </div>
      </div>
    </div>
  );
}