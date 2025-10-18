"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface DiscountRule {
  id?: string;
  discountCode: string;
  discountName: string;
  startDate: string;
  endDate: string;
  maxUsers: number;
  discountMode: "percentage" | "reduce";
  discountValue: number;
  createdAt: string;
  active: boolean;
  currentUsers: number;
}

export default function DiscountPage() {
  const [discounts, setDiscounts] = useState<DiscountRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [discountCode, setDiscountCode] = useState("");
  const [discountName, setDiscountName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxUsers, setMaxUsers] = useState(1);
  const [discountMode, setDiscountMode] = useState<"percentage" | "reduce">("percentage");
  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "discounts"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as DiscountRule[];
    // Sort discounts alphabetically by discountCode
    data.sort((a, b) => a.discountCode.localeCompare(b.discountCode));
    setDiscounts(data);
    setLoading(false);
  };

  const openModal = (discount?: DiscountRule) => {
    if (discount) {
      setEditingId(discount.id!);
      setDiscountCode(discount.discountCode);
      setDiscountName(discount.discountName);
      setStartDate(discount.startDate);
      setEndDate(discount.endDate);
      setMaxUsers(discount.maxUsers);
      setDiscountMode(discount.discountMode);
      setDiscountValue(discount.discountValue);
    } else {
      setEditingId(null);
      setDiscountCode("");
      setDiscountName("");
      setStartDate("");
      setEndDate("");
      setMaxUsers(1);
      setDiscountMode("percentage");
      setDiscountValue(0);
    }
    setShowModal(true);
  };

  const handleSaveDiscountRule = async () => {
    if (!discountCode || !discountName || !startDate || !endDate || maxUsers < 1 || discountValue <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }

    setLoading(true);

    const data: DiscountRule = {
      discountCode,
      discountName,
      startDate,
      endDate,
      maxUsers,
      discountMode,
      discountValue,
      createdAt: new Date().toISOString(),
      active: true,
      currentUsers: 0,
    };

    try {
      if (editingId) {
        const existing = discounts.find((d) => d.id === editingId)!;
        await updateDoc(doc(db, "discounts", editingId), {
          ...data,
          createdAt: existing.createdAt,
          currentUsers: existing.currentUsers,
        });
        setDiscounts((prev) =>
          prev
            .map((d) => (d.id === editingId ? { ...data, id: editingId, createdAt: existing.createdAt, currentUsers: existing.currentUsers } : d))
            .sort((a, b) => a.discountCode.localeCompare(b.discountCode))
        );
      } else {
        const newDoc = await addDoc(collection(db, "discounts"), data);
        setDiscounts((prev) => [...prev, { ...data, id: newDoc.id }].sort((a, b) => a.discountCode.localeCompare(b.discountCode)));
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this discount rule?")) return;
    await deleteDoc(doc(db, "discounts", id));
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleActive = async (discount: DiscountRule) => {
    if (!discount.id) return;
    await updateDoc(doc(db, "discounts", discount.id), {
      active: !discount.active,
    });
    setDiscounts((prev) =>
      prev.map((d) => (d.id === discount.id ? { ...d, active: !d.active } : d))
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-gray-800"></h1>
        <button
  onClick={() => openModal()}
  className="bg-green-600 text-white inline-flex items-center gap-2 rounded-md px-4 py-2 mb-3 text-sm hover:bg-green-700 transition"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
  Add Discount
</button>
      </div>
      <br></br>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="ml-3 text-gray-600">Loading discounts...</span>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto"> {/* Added overflow-x-auto for responsive scrolling */}
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Users</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {discounts.map((d) => (
        <tr key={d.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 text-xs text-gray-900">{d.discountCode}</td>
          <td className="px-4 py-3 text-xs text-gray-900">{d.discountName}</td>
          <td className="px-4 py-3 text-xs text-gray-900">{d.startDate}</td>
          <td className="px-4 py-3 text-xs text-gray-900">{d.endDate}</td>
          <td className="px-4 py-3 text-xs text-gray-900">{d.maxUsers}</td>
          <td className="px-4 py-3 text-xs text-gray-900">{d.currentUsers}</td>
          <td className="px-4 py-3 text-xs text-gray-900">
            {d.discountMode.charAt(0).toUpperCase() + d.discountMode.slice(1)}
          </td>
          <td className="px-4 py-3 text-xs text-gray-900">{d.discountValue}</td>
          <td className="px-4 py-3 text-xs text-gray-900">
            <button
              onClick={() => toggleActive(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                d.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {d.active ? "Active" : "Inactive"}
            </button>
          </td>
          <td className="px-4 py-3 text-xs text-gray-900 space-x-2">
            <button
              onClick={() => openModal(d)}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(d.id!)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{editingId ? "Edit Discount" : "Add Discount"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Code</label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Name</label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter discount name"
                  value={discountName}
                  onChange={(e) => setDiscountName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Users</label>
                <input
                  type="number"
                  min={1}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter max users"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Mode</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={discountMode}
                  onChange={(e) => setDiscountMode(e.target.value as "percentage" | "reduce")}
                >
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter discount value"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDiscountRule}
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 transition"}`}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}