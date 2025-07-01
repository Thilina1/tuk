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

interface LocationEntry {
  id?: string;
  name: string;
  price: number;
  status?: string;
}

export default function LocationPage() {
  const [locations, setLocations] = useState<LocationEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editLocation, setEditLocation] = useState<LocationEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LocationEntry | null>(null);

  const locationRef = collection(db, "locations");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const locationRef = collection(db, "locations");
      const snapshot = await getDocs(locationRef);
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as LocationEntry))
        .filter((entry) => entry.status !== "inactive");
  
      setLocations(data);
      setLoading(false);
    };
  
    fetchData();
  }, []); // ✅ No dependencies now
  
  

  const handleAddLocation = async ({ name, price }: { name: string; price: number }) => {
    const docRef = await addDoc(locationRef, { name, price, status: "active" });
    setLocations([...locations, { id: docRef.id, name, price, status: "active" }]);
    setShowAddModal(false);
  };

  const handleUpdateLocation = async ({ name, price }: { name: string; price: number }) => {
    if (!editLocation?.id) return;
    const docRef = doc(db, "locations", editLocation.id);
    await updateDoc(docRef, { name, price });
    setLocations(locations.map((loc) => (loc.id === editLocation.id ? { ...loc, name, price } : loc)));
    setEditLocation(null);
  };

  const handleSoftDelete = async () => {
    if (!confirmDelete?.id) return;
    const docRef = doc(db, "locations", confirmDelete.id);
    await updateDoc(docRef, { status: "inactive" });
    setLocations(locations.filter((loc) => loc.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const LocationModal = ({
    initial,
    onSave,
    onClose,
  }: {
    initial?: LocationEntry;
    onSave: (data: { name: string; price: number }) => void;
    onClose: () => void;
  }) => {
    const [name, setName] = useState(initial?.name || "");
    const [price, setPrice] = useState(initial?.price ?? 0);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow max-w-sm w-full">
          <h2 className="text-lg font-bold mb-2">{initial ? "Edit Location" : "Add Location"}</h2>
          <input
            type="text"
            placeholder="Location Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border w-full mb-2 p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={price.toString()}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="border w-full mb-2 p-2"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-4 py-1 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
            <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={() => onSave({ name, price })}>
              {initial ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmModal = ({
    message,
    onConfirm,
    onCancel,
  }: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-sm w-full">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-1 bg-gray-300 rounded" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-1 bg-red-500 text-white rounded" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Location Management</h1>

      <div className="flex justify-end mb-4">
  <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-white px-4 py-2 rounded">
    Add New Location
  </button>
</div>


      {loading ? (
  <div className="flex justify-center items-center h-40">
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    <span className="ml-3 text-gray-600">Loading locations...</span>
  </div>
) : (

      <table className="min-w-full bg-white border rounded text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id} className="border-t">
              <td className="p-2">{loc.name}</td>
              <td className="p-2">${loc.price}</td>
              <td className="p-2">
                <button onClick={() => setEditLocation(loc)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => setConfirmDelete(loc)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
)}
      {showAddModal && (
        <LocationModal
          onSave={handleAddLocation}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editLocation && (
        <LocationModal
          initial={editLocation}
          onSave={handleUpdateLocation}
          onClose={() => setEditLocation(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete.name}"?`}
          onConfirm={handleSoftDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
