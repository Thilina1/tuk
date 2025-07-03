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

  // form states
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
    const snapshot = await getDocs(collection(db, "discounts"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as DiscountRule[];
    setDiscounts(data);
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
          prev.map((d) => (d.id === editingId ? { ...data, id: editingId, createdAt: existing.createdAt, currentUsers: existing.currentUsers } : d))
        );
      } else {
        const newDoc = await addDoc(collection(db, "discounts"), data);
        setDiscounts((prev) => [...prev, { ...data, id: newDoc.id }]);
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
    if (!confirm("Delete this discount rule?")) return;
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Discount Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Add Discount
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">End</th>
              <th className="px-3 py-2 text-left">Max Users</th>
              <th className="px-3 py-2 text-left">Current</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Value</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="px-3 py-2">{d.discountCode}</td>
                <td className="px-3 py-2">{d.discountName}</td>
                <td className="px-3 py-2">{d.startDate}</td>
                <td className="px-3 py-2">{d.endDate}</td>
                <td className="px-3 py-2">{d.maxUsers}</td>
                <td className="px-3 py-2">{d.currentUsers}</td>
                <td className="px-3 py-2">{d.discountMode}</td>
                <td className="px-3 py-2">{d.discountValue}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleActive(d)}
                    className={`text-xs px-3 py-1 rounded-full shadow ${
                      d.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => openModal(d)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id!)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add"} Discount</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border rounded px-3 py-2" placeholder="Discount Code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="Discount Name" value={discountName} onChange={(e) => setDiscountName(e.target.value)} />
              <input type="date" className="border rounded px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" className="border rounded px-3 py-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <input type="number" min={1} className="border rounded px-3 py-2" placeholder="Max Users" value={maxUsers} onChange={(e) => setMaxUsers(Number(e.target.value))} />
              <select className="border rounded px-3 py-2" value={discountMode} onChange={(e) => setDiscountMode(e.target.value as "percentage" | "reduce")}>
                <option value="percentage">Percentage (%)</option>
                <option value="reduce">Reduce Count</option>
              </select>
              <input type="number" className="md:col-span-2 border rounded px-3 py-2" placeholder="Discount Value" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setShowModal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded shadow">Cancel</button>
              <button onClick={handleSaveDiscountRule} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
