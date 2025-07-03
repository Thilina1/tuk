"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface TrainTransferEntry {
  id?: string;
  from: string;
  to: string;
  price: number;
  pickupTime: string;
  downTime: string;
  status?: boolean;
}

export default function TrainTransferPage() {
  const [transfers, setTransfers] = useState<TrainTransferEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TrainTransferEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TrainTransferEntry | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    const snapshot = await getDocs(collection(db, "trainTransfers"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TrainTransferEntry[];
    setTransfers(data);
  };

  const saveTransfer = async (entry: TrainTransferEntry) => {
    const { id, ...data } = entry; // 🔷 strip id
    if (id) {
      await updateDoc(doc(db, "trainTransfers", id), data);
      setTransfers((prev) => prev.map((t) => (t.id === id ? entry : t)));
    } else {
      const docRef = await addDoc(collection(db, "trainTransfers"), data);
      setTransfers((prev) => [...prev, { ...entry, id: docRef.id }]);
    }
    setActiveEntry(null);
  };

  const toggleStatus = async (entry: TrainTransferEntry) => {
    const updated = { ...entry, status: !entry.status };
    await updateDoc(doc(db, "trainTransfers", entry.id!), { status: updated.status });
    setTransfers((prev) => prev.map((t) => (t.id === entry.id ? updated : t)));
  };

  const softDelete = async () => {
    if (!confirmDelete?.id) return;
    await updateDoc(doc(db, "trainTransfers", confirmDelete.id), { status: false });
    setTransfers((prev) =>
      prev.map((t) => (t.id === confirmDelete.id ? { ...t, status: false } : t))
    );
    setConfirmDelete(null);
  };

  const TransferModal = ({ entry }: { entry?: TrainTransferEntry }) => {
    const [form, setForm] = useState<TrainTransferEntry>({
      id: entry?.id,
      from: entry?.from || "",
      to: entry?.to || "",
      price: entry?.price || 0,
      pickupTime: entry?.pickupTime || "",
      downTime: entry?.downTime || "",
      status: entry?.status ?? true,
    });

    const handleChange = (key: keyof TrainTransferEntry, value: string | number | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow max-w-sm w-full">
          <h2 className="text-lg font-bold mb-4">{entry ? "Edit" : "Add"} Train Transfer</h2>
          <input
            type="text"
            placeholder="From"
            value={form.from}
            onChange={(e) => handleChange("from", e.target.value)}
            className="border w-full mb-2 p-2"
          />
          <input
            type="text"
            placeholder="To"
            value={form.to}
            onChange={(e) => handleChange("to", e.target.value)}
            className="border w-full mb-2 p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            className="border w-full mb-2 p-2"
          />
          <input
            type="time"
            placeholder="Pickup Time"
            value={form.pickupTime}
            onChange={(e) => handleChange("pickupTime", e.target.value)}
            className="border w-full mb-2 p-2"
          />
          <input
            type="time"
            placeholder="Down Time"
            value={form.downTime}
            onChange={(e) => handleChange("downTime", e.target.value)}
            className="border w-full mb-2 p-2"
          />
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) => handleChange("status", e.target.checked)}
            />
            Active
          </label>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-1 bg-gray-300 rounded"
              onClick={() => setActiveEntry(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 bg-blue-600 text-white rounded"
              onClick={() => saveTransfer(form)}
            >
              {entry ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmModal = ({ entry }: { entry: TrainTransferEntry }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-sm w-full">
        <p>
          Are you sure you want to delete transfer from <strong>{entry.from}</strong> to{" "}
          <strong>{entry.to}</strong>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-1 bg-gray-300 rounded"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-red-600 text-white rounded"
            onClick={softDelete}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Train Transfer Management</h1>
        <button
          onClick={() => setActiveEntry({} as TrainTransferEntry)}
          className="bg-green-500 text-white px-4 py-2 rounded shadow"
        >
          ➕ Add New Transfer
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
    <tr>
      <th className="px-3 py-2 text-left">#</th>
      <th className="px-3 py-2 text-left">From</th>
      <th className="px-3 py-2 text-left">To</th>
      <th className="px-3 py-2 text-left">Price</th>
      <th className="px-3 py-2 text-left">Pickup</th>
      <th className="px-3 py-2 text-left">Down</th>
      <th className="px-3 py-2 text-left">Status</th>
      <th className="px-3 py-2 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {transfers.map((entry, index) => (
      <tr
        key={entry.id}
        className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
      >
        <td className="px-3 py-2">{index + 1}</td>
        <td className="px-3 py-2">{entry.from}</td>
        <td className="px-3 py-2">{entry.to}</td>
        <td className="px-3 py-2">${entry.price}</td>
        <td className="px-3 py-2">{entry.pickupTime}</td>
        <td className="px-3 py-2">{entry.downTime}</td>
        <td className="px-3 py-2">
          <button
            onClick={() => toggleStatus(entry)}
            className={`text-xs px-3 py-1 rounded-full shadow ${
              entry.status
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {entry.status ? 'Active' : 'Inactive'}
          </button>
        </td>
        <td className="px-3 py-2 space-x-1">
          <button
            onClick={() => setActiveEntry(entry)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs shadow"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(entry)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs shadow"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {activeEntry && <TransferModal entry={activeEntry.id ? activeEntry : undefined} />}
      {confirmDelete && <ConfirmModal entry={confirmDelete} />}
    </div>
  );
}
