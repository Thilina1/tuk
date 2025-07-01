"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
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
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState<TrainTransferEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TrainTransferEntry | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const transferRef = collection(db, "trainTransfers"); // ✅ moved inside
      const snapshot = await getDocs(transferRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TrainTransferEntry[];
      setTransfers(data);
    };
    fetchData();
  }, []); // ✅ no more ESLint warning
  

  const handleAddTransfer = async (entry: Omit<TrainTransferEntry, "id">) => {
    const transferRef = collection(db, "trainTransfers"); // ✅ added here
    const docRef = await addDoc(transferRef, { ...entry });
    setTransfers([...transfers, { id: docRef.id, ...entry }]);
    setShowModal(false);
  };
  

  const handleUpdateTransfer = async (entry: Omit<TrainTransferEntry, "id">) => {
    if (!editEntry?.id) return;
    const docRef = doc(db, "trainTransfers", editEntry.id);
    await updateDoc(docRef, entry);
    setTransfers(transfers.map(t => t.id === editEntry.id ? { ...t, ...entry } : t));
    setEditEntry(null);
  };

  const handleSoftDelete = async () => {
    if (!confirmDelete?.id) return;
    const docRef = doc(db, "trainTransfers", confirmDelete.id);
    await updateDoc(docRef, { status: false });
    setTransfers(transfers.map(t =>
      t.id === confirmDelete.id ? { ...t, status: false } : t
    ));
    setConfirmDelete(null);
  };

  const TransferModal = ({
    initial,
    onSave,
    onClose,
  }: {
    initial?: TrainTransferEntry;
    onSave: (entry: Omit<TrainTransferEntry, "id">) => void;
    onClose: () => void;
  }) => {
    const [from, setFrom] = useState(initial?.from || "");
    const [to, setTo] = useState(initial?.to || "");
    const [price, setPrice] = useState(initial?.price ?? 0);
    const [pickupTime, setPickupTime] = useState(initial?.pickupTime || "");
    const [downTime, setDownTime] = useState(initial?.downTime || "");
    const [status, setStatus] = useState(initial?.status ?? true);

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow max-w-sm w-full">
          <h2 className="text-lg font-bold mb-2">{initial ? "Edit" : "Add"} Train Transfer</h2>
          <input type="text" placeholder="From" value={from} onChange={e => setFrom(e.target.value)} className="border w-full mb-2 p-2" />
          <input type="text" placeholder="To" value={to} onChange={e => setTo(e.target.value)} className="border w-full mb-2 p-2" />
          <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} className="border w-full mb-2 p-2" />
          <input type="time" placeholder="Pickup Time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="border w-full mb-2 p-2" />
          <input type="time" placeholder="Down Time" value={downTime} onChange={e => setDownTime(e.target.value)} className="border w-full mb-2 p-2" />
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} />
            Active
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-1 bg-gray-300 rounded">Cancel</button>
            <button onClick={() => onSave({ from, to, price, pickupTime, downTime, status })} className="px-4 py-1 bg-blue-600 text-white rounded">
              {initial ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmModal = ({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-sm w-full">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-1 bg-gray-300 rounded" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-1 bg-red-600 text-white rounded" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Train Transfer Management</h1>

      <div className="flex justify-end mb-4">
  <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-4 py-2 rounded">
    Add New Transfer
  </button>
</div>


      <table className="min-w-full bg-white border rounded text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">From</th>
            <th className="p-2 text-left">To</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Pickup</th>
            <th className="p-2 text-left">Down</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((entry) => (
            <tr key={entry.id} className="border-t">
              <td className="p-2">{entry.from}</td>
              <td className="p-2">{entry.to}</td>
              <td className="p-2">${entry.price}</td>
              <td className="p-2">{entry.pickupTime}</td>
              <td className="p-2">{entry.downTime}</td>
              <td className="p-2">
                {entry.status ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactive</span>
                )}
              </td>
              <td className="p-2 space-x-2">
                <button onClick={() => setEditEntry(entry)} className="text-blue-600">Edit</button>
                <button onClick={() => setConfirmDelete(entry)} className="text-red-600">Delete</button>
                <button
                  onClick={async () => {
                    const newStatus = !entry.status;
                    await updateDoc(doc(db, "trainTransfers", entry.id!), { status: newStatus });
                    setTransfers((prev) =>
                      prev.map((t) =>
                        t.id === entry.id ? { ...t, status: newStatus } : t
                      )
                    );
                  }}
                  className={`px-2 py-1 rounded ${entry.status ? "bg-yellow-500" : "bg-green-600"} text-white`}
                >
                  {entry.status ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <TransferModal
          onSave={handleAddTransfer}
          onClose={() => setShowModal(false)}
        />
      )}

      {editEntry && (
        <TransferModal
          initial={editEntry}
          onSave={handleUpdateTransfer}
          onClose={() => setEditEntry(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete this train transfer from ${confirmDelete.from} to ${confirmDelete.to}?`}
          onConfirm={handleSoftDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
