"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

interface DailyRate {
  duration: string;
  pricePerDay: number;
}

interface OptionalExtra {
  name: string;
  price: number;
  type: string;
}

interface MasterPrices {
  dailyRates: DailyRate[]; // Regular
  cabrioRates: DailyRate[]; // Cabriolet Tuk Tuk
  eTukRates: DailyRate[]; // E-Tuk Tuk
  bikeRates: DailyRate[]; // Bike
  licenseFee: {
    amount: number;
    description: string;
  };
  optionalExtras: OptionalExtra[];
  refundableDeposit: {
    amount: number;
    description: string;
  };
  updatedAt?: Timestamp;
}

type SectionKey =
  | "dailyRates"
  | "cabrioRates"
  | "eTukRates"
  | "bikeRates"
  | "licenseFee"
  | "optionalExtras"
  | "refundableDeposit";

const COLLECTION = "masterPrices";
const DOC_ID = "pricing";

export default function MasterPricesPage() {
  const [form, setForm] = useState<MasterPrices>({
    dailyRates: Array(8).fill({ duration: "", pricePerDay: 0 }),
    cabrioRates: Array(8).fill({ duration: "", pricePerDay: 0 }),
    eTukRates: Array(8).fill({ duration: "", pricePerDay: 0 }),
    bikeRates: Array(8).fill({ duration: "", pricePerDay: 0 }),
    licenseFee: { amount: 0, description: "" },
    optionalExtras: Array(8).fill({ name: "", price: 0, type: "" }),
    refundableDeposit: { amount: 0, description: "" },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionStates, setSectionStates] = useState<{
    [key in SectionKey]: { dirty: boolean; saving: boolean; saveMsg: string | null };
  }>({
    dailyRates: { dirty: false, saving: false, saveMsg: null },
    cabrioRates: { dirty: false, saving: false, saveMsg: null },
    eTukRates: { dirty: false, saving: false, saveMsg: null },
    bikeRates: { dirty: false, saving: false, saveMsg: null },
    licenseFee: { dirty: false, saving: false, saveMsg: null },
    optionalExtras: { dirty: false, saving: false, saveMsg: null },
    refundableDeposit: { dirty: false, saving: false, saveMsg: null },
  });
  const [activeTab, setActiveTab] = useState<"dailyRates" | "cabrioRates" | "eTukRates" | "bikeRates">(
    "dailyRates"
  );

  const docRef = doc(db, COLLECTION, DOC_ID);

  // Fetch pricing data from Firestore
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as Partial<MasterPrices>; // Allow partial data
          setForm((prev) => ({
            dailyRates: Array.isArray(data.dailyRates) && data.dailyRates.length === 8 ? data.dailyRates : prev.dailyRates,
            cabrioRates: Array.isArray(data.cabrioRates) && data.cabrioRates.length === 8 ? data.cabrioRates : prev.cabrioRates,
            eTukRates: Array.isArray(data.eTukRates) && data.eTukRates.length === 8 ? data.eTukRates : prev.eTukRates,
            bikeRates: Array.isArray(data.bikeRates) && data.bikeRates.length === 8 ? data.bikeRates : prev.bikeRates,
            licenseFee: data.licenseFee || prev.licenseFee,
            optionalExtras: Array.isArray(data.optionalExtras) && data.optionalExtras.length === 8 ? data.optionalExtras : prev.optionalExtras,
            refundableDeposit: data.refundableDeposit || prev.refundableDeposit,
            updatedAt: data.updatedAt,
          }));
        } else {
          setError("Pricing data not found. Initialize by saving each section.");
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to load pricing data from Firestore.";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update section state
  const updateSectionState = (
    section: SectionKey,
    updates: Partial<(typeof sectionStates)[SectionKey]>
  ) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  // Save handlers for each section
  const saveDailyRates = async () => {
    if (sectionStates.dailyRates.saving || !sectionStates.dailyRates.dirty) return;
    try {
      updateSectionState("dailyRates", { saving: true });
      await setDoc(
        docRef,
        { dailyRates: form.dailyRates, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("dailyRates", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save daily rates.";
      updateSectionState("dailyRates", { saveMsg: message });
    } finally {
      updateSectionState("dailyRates", { saving: false });
    }
  };

  const saveCabrioRates = async () => {
    if (sectionStates.cabrioRates.saving || !sectionStates.cabrioRates.dirty) return;
    try {
      updateSectionState("cabrioRates", { saving: true });
      await setDoc(
        docRef,
        { cabrioRates: form.cabrioRates, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("cabrioRates", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save cabrio rates.";
      updateSectionState("cabrioRates", { saveMsg: message });
    } finally {
      updateSectionState("cabrioRates", { saving: false });
    }
  };

  const saveETukRates = async () => {
    if (sectionStates.eTukRates.saving || !sectionStates.eTukRates.dirty) return;
    try {
      updateSectionState("eTukRates", { saving: true });
      await setDoc(
        docRef,
        { eTukRates: form.eTukRates, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("eTukRates", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save e-tuk rates.";
      updateSectionState("eTukRates", { saveMsg: message });
    } finally {
      updateSectionState("eTukRates", { saving: false });
    }
  };

  const saveBikeRates = async () => {
    if (sectionStates.bikeRates.saving || !sectionStates.bikeRates.dirty) return;
    try {
      updateSectionState("bikeRates", { saving: true });
      await setDoc(
        docRef,
        { bikeRates: form.bikeRates, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("bikeRates", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save bike rates.";
      updateSectionState("bikeRates", { saveMsg: message });
    } finally {
      updateSectionState("bikeRates", { saving: false });
    }
  };

  const saveLicenseFee = async () => {
    if (sectionStates.licenseFee.saving || !sectionStates.licenseFee.dirty) return;
    try {
      updateSectionState("licenseFee", { saving: true });
      await setDoc(
        docRef,
        { licenseFee: form.licenseFee, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("licenseFee", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save license fee.";
      updateSectionState("licenseFee", { saveMsg: message });
    } finally {
      updateSectionState("licenseFee", { saving: false });
    }
  };

  const saveOptionalExtras = async () => {
    if (sectionStates.optionalExtras.saving || !sectionStates.optionalExtras.dirty) return;
    try {
      updateSectionState("optionalExtras", { saving: true });
      await setDoc(
        docRef,
        { optionalExtras: form.optionalExtras, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("optionalExtras", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save optional extras.";
      updateSectionState("optionalExtras", { saveMsg: message });
    } finally {
      updateSectionState("optionalExtras", { saving: false });
    }
  };

  const saveRefundableDeposit = async () => {
    if (sectionStates.refundableDeposit.saving || !sectionStates.refundableDeposit.dirty) return;
    try {
      updateSectionState("refundableDeposit", { saving: true });
      await setDoc(
        docRef,
        { refundableDeposit: form.refundableDeposit, updatedAt: serverTimestamp() },
        { merge: true }
      );
      updateSectionState("refundableDeposit", { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save refundable deposit.";
      updateSectionState("refundableDeposit", { saveMsg: message });
    } finally {
      updateSectionState("refundableDeposit", { saving: false });
    }
  };

  // Update handlers
  const updateField = <K extends SectionKey>(key: K, value: MasterPrices[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    updateSectionState(key, { dirty: true, saveMsg: null });
  };

  const updateRate = (
    key: "dailyRates" | "cabrioRates" | "eTukRates" | "bikeRates",
    index: number,
    field: keyof DailyRate,
    value: string | number
  ) => {
    const newRates = form[key].map((rate, i) =>
      i === index ? { ...rate, [field]: field === "pricePerDay" ? Number(value) : value } : rate
    );
    updateField(key, newRates);
  };

  const updateOptionalExtra = (index: number, field: keyof OptionalExtra, value: string | number) => {
    const newExtras = form.optionalExtras.map((extra, i) =>
      i === index ? { ...extra, [field]: field === "price" ? Number(value) : value } : extra
    );
    updateField("optionalExtras", newExtras);
  };

  const updateLicenseFee = (field: "amount" | "description", value: string | number) => {
    const newFee = { ...form.licenseFee, [field]: field === "amount" ? Number(value) : value };
    updateField("licenseFee", newFee);
  };

  const updateRefundableDeposit = (field: "amount" | "description", value: string | number) => {
    const newDeposit = { ...form.refundableDeposit, [field]: field === "amount" ? Number(value) : value };
    updateField("refundableDeposit", newDeposit);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600 animate-pulse">Loading pricing data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">TukTuk Pricing Editor</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {/* Daily Rental Rates with Tabs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Daily Rental Rates</h3>
            <button
              onClick={() => {
                if (activeTab === "dailyRates") saveDailyRates();
                if (activeTab === "cabrioRates") saveCabrioRates();
                if (activeTab === "eTukRates") saveETukRates();
                if (activeTab === "bikeRates") saveBikeRates();
              }}
              disabled={
                !sectionStates[activeTab].dirty || sectionStates[activeTab].saving
              }
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates[activeTab].dirty || sectionStates[activeTab].saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
              }`}
            >
              {sectionStates[activeTab].saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Rates"
              )}
            </button>
          </div>
          {sectionStates[activeTab].saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates[activeTab].saveMsg.includes("✅")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {sectionStates[activeTab].saveMsg}
            </div>
          )}
          <div className="mb-4">
            <div className="flex space-x-4 border-b border-gray-200">
              {[
                { key: "dailyRates", label: "Regular" },
                { key: "cabrioRates", label: "Cabriolet Tuk Tuk" },
                { key: "eTukRates", label: "E-Tuk Tuk" },
                { key: "bikeRates", label: "Bike" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === tab.key
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                    Price / Day ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {form[activeTab].map((rate, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={rate.duration}
                        onChange={(e) =>
                          updateRate(activeTab, index, "duration", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        placeholder="e.g., 1–4 days"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={rate.pricePerDay}
                        onChange={(e) =>
                          updateRate(activeTab, index, "pricePerDay", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        min="0"
                        step="0.01"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* License Fee */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">🪪 License Fee</h3>
            <button
              onClick={saveLicenseFee}
              disabled={!sectionStates.licenseFee.dirty || sectionStates.licenseFee.saving}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.licenseFee.dirty || sectionStates.licenseFee.saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
              }`}
            >
              {sectionStates.licenseFee.saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save License Fee"
              )}
            </button>
          </div>
          {sectionStates.licenseFee.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.licenseFee.saveMsg.includes("✅")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {sectionStates.licenseFee.saveMsg}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={form.licenseFee.amount}
                onChange={(e) => updateLicenseFee("amount", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.licenseFee.description}
                onChange={(e) => updateLicenseFee("description", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                rows={4}
                placeholder="Describe the license fee..."
              />
            </div>
          </div>
        </section>

        {/* Optional Extras */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Optional Extras</h3>
            <button
              onClick={saveOptionalExtras}
              disabled={!sectionStates.optionalExtras.dirty || sectionStates.optionalExtras.saving}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.optionalExtras.dirty || sectionStates.optionalExtras.saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
              }`}
            >
              {sectionStates.optionalExtras.saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Extras"
              )}
            </button>
          </div>
          {sectionStates.optionalExtras.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.optionalExtras.saveMsg.includes("✅")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {sectionStates.optionalExtras.saveMsg}
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                    Price ($)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.optionalExtras.map((extra, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={extra.name}
                        onChange={(e) => updateOptionalExtra(index, "name", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        placeholder="e.g., Train Transfer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={extra.price}
                        onChange={(e) => updateOptionalExtra(index, "price", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={extra.type}
                        onChange={(e) => updateOptionalExtra(index, "type", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        placeholder="e.g., per unit"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Refundable Deposit */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">💰 Refundable Deposit</h3>
            <button
              onClick={saveRefundableDeposit}
              disabled={
                !sectionStates.refundableDeposit.dirty || sectionStates.refundableDeposit.saving
              }
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.refundableDeposit.dirty || sectionStates.refundableDeposit.saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
              }`}
            >
              {sectionStates.refundableDeposit.saving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Deposit"
              )}
            </button>
          </div>
          {sectionStates.refundableDeposit.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.refundableDeposit.saveMsg.includes("✅")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {sectionStates.refundableDeposit.saveMsg}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={form.refundableDeposit.amount}
                onChange={(e) => updateRefundableDeposit("amount", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.refundableDeposit.description}
                onChange={(e) => updateRefundableDeposit("description", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                rows={4}
                placeholder="Describe the refundable deposit..."
              />
            </div>
          </div>
        </section>

        {/* Last Updated */}
        {form.updatedAt && (
          <p className="text-xs text-gray-500 mt-6">
            Last updated: {form.updatedAt.toDate().toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}