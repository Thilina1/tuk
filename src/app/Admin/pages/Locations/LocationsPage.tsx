"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface LocationEntry {
  id?: string;
  name: string;
  price: number;
  status: string;
}

export default function LocationPage() {
  const [locations, setLocations] = useState<LocationEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editLocation, setEditLocation] = useState<LocationEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LocationEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const locationRef = collection(db, "locations");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const snapshot = await getDocs(locationRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LocationEntry));
      // Sort locations alphabetically by name
      data.sort((a, b) => a.name.localeCompare(b.name));
      setLocations(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddLocation = async ({ name, price, status }: { name: string; price: number; status: string }) => {
    const docRef = await addDoc(locationRef, { name, price, status });
    const newLocation = { id: docRef.id, name, price, status };
    // Add new location and re-sort
    setLocations([...locations, newLocation].sort((a, b) => a.name.localeCompare(b.name)));
    setShowAddModal(false);
  };

  const handleUpdateLocation = async ({ name, price, status }: { name: string; price: number; status: string }) => {
    if (!editLocation?.id) return;
    const docRef = doc(db, "locations", editLocation.id);
    await updateDoc(docRef, { name, price, status });
    // Update location and re-sort
    setLocations(
      locations
        .map((loc) => (loc.id === editLocation.id ? { ...loc, name, price, status } : loc))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditLocation(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete?.id) return;
    const docRef = doc(db, "locations", confirmDelete.id);
    await deleteDoc(docRef); // Full delete from Firestore
    setLocations(locations.filter((loc) => loc.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const LocationModal = ({
    initial,
    onSave,
    onClose,
  }: {
    initial?: LocationEntry;
    onSave: (data: { name: string; price: number; status: string }) => void;
    onClose: () => void;
  }) => {
    const [name, setName] = useState(initial?.name || "");
    const [price, setPrice] = useState(initial?.price ?? 0);
    const [status, setStatus] = useState(initial?.status || "active");

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{initial ? "Edit Location" : "Add Location"}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location Name</label>
              <input
                type="text"
                placeholder="Enter location name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                placeholder="Enter price"
                value={price.toString()}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => onSave({ name, price, status })}
            >
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800"></h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
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
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="ml-3 text-gray-600">Loading locations...</span>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${loc.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loc.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setEditLocation(loc)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(loc)}
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
          message={`Are you sure you want to permanently delete "${confirmDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}