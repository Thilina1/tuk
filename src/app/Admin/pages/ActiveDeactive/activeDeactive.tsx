"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

interface VehicleStatus {
  isActive: boolean;
  deactivateUntil: Timestamp | null;
  basePrice: number | null; // New field for base price
  updatedAt?: Timestamp;
}

type VehicleType = "regularTukTuk" | "eTukTuk" | "cambioTukTuks" | "scooterBikes";

const COLLECTION = "vehicleStatus";
const VEHICLE_TYPES: { id: VehicleType; label: string }[] = [
  { id: "regularTukTuk", label: "Regular Tuk Tuk" },
  { id: "eTukTuk", label: "E-Tuk Tuk" },
  { id: "cambioTukTuks", label: "Cabrio Tuk Tuks" },
  { id: "scooterBikes", label: "Scooter Bikes" },
];

export default function TukTukActivation() {
  const [vehicleStatuses, setVehicleStatuses] = useState<Record<VehicleType, VehicleStatus>>({
    regularTukTuk: { isActive: true, deactivateUntil: null, basePrice: null },
    eTukTuk: { isActive: false, deactivateUntil: null, basePrice: null },
    cambioTukTuks: { isActive: false, deactivateUntil: null, basePrice: null },
    scooterBikes: { isActive: false, deactivateUntil: null, basePrice: null },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionStates, setSectionStates] = useState<
    Record<VehicleType, { dirty: boolean; saving: boolean; saveMsg: string | null }>
  >({
    regularTukTuk: { dirty: false, saving: false, saveMsg: null },
    eTukTuk: { dirty: false, saving: false, saveMsg: null },
    cambioTukTuks: { dirty: false, saving: false, saveMsg: null },
    scooterBikes: { dirty: false, saving: false, saveMsg: null },
  });

  // Fetch and initialize vehicle statuses from Firestore
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const newStatuses: Record<VehicleType, VehicleStatus> = { ...vehicleStatuses };
        const newSectionStates: Record<
          VehicleType,
          { dirty: boolean; saving: boolean; saveMsg: string | null }
        > = { ...sectionStates };

        for (const { id } of VEHICLE_TYPES) {
          const docRef = doc(db, COLLECTION, id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as VehicleStatus;
            newStatuses[id] = {
              isActive: data.isActive ?? vehicleStatuses[id].isActive,
              deactivateUntil: data.deactivateUntil ?? null,
              basePrice: data.basePrice ?? null, // Load basePrice
              updatedAt: data.updatedAt,
            };
            newSectionStates[id].dirty = !data.isActive || !!data.deactivateUntil || data.basePrice !== null;
          } else {
            // Initialize with default values
            const isActive = true;
            const basePrice = null; // Default to null for new documents
            await setDoc(
              docRef,
              {
                isActive,
                deactivateUntil: null,
                basePrice,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
            newStatuses[id] = {
              isActive,
              deactivateUntil: null,
              basePrice,
            };
            newSectionStates[id].dirty = !isActive || basePrice !== null;
          }
        }

        setVehicleStatuses(newStatuses);
        setSectionStates(newSectionStates);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load vehicle statuses from Firestore.";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update section state
  const updateSectionState = (
    vehicleType: VehicleType,
    updates: Partial<(typeof sectionStates)[VehicleType]>
  ) => {
    setSectionStates((prev) => ({
      ...prev,
      [vehicleType]: { ...prev[vehicleType], ...updates },
    }));
  };

  // Save handler for vehicle status
  const saveVehicleStatus = async (vehicleType: VehicleType) => {
    if (sectionStates[vehicleType].saving || !sectionStates[vehicleType].dirty) return;
    try {
      updateSectionState(vehicleType, { saving: true });
      const docRef = doc(db, COLLECTION, vehicleType);
      await setDoc(
        docRef,
        {
          isActive: vehicleStatuses[vehicleType].isActive,
          deactivateUntil: vehicleStatuses[vehicleType].deactivateUntil,
          basePrice: vehicleStatuses[vehicleType].basePrice, // Save basePrice
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      updateSectionState(vehicleType, { dirty: false, saveMsg: "Saved successfully ✅" });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : `Failed to save status for ${vehicleType}.`;
      updateSectionState(vehicleType, { saveMsg: message });
    } finally {
      updateSectionState(vehicleType, { saving: false });
    }
  };

  // Update vehicle status
  const updateVehicleStatus = (
    vehicleType: VehicleType,
    updates: Partial<VehicleStatus>
  ) => {
    // If isActive is false, clear deactivateUntil and keep basePrice
    const newDeactivateUntil = updates.isActive === false ? null : updates.deactivateUntil ?? vehicleStatuses[vehicleType].deactivateUntil;
    setVehicleStatuses((prev) => ({
      ...prev,
      [vehicleType]: {
        ...prev[vehicleType],
        ...updates,
        deactivateUntil: newDeactivateUntil,
      },
    }));
    updateSectionState(vehicleType, { dirty: true, saveMsg: null });
  };

  // Format date for input
  const formatDateForInput = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toISOString().split("T")[0];
  };

  // Check if vehicle type is active
  const isVehicleActive = (vehicleType: VehicleType) => {
    const status = vehicleStatuses[vehicleType];
    if (!status.isActive) return false;
    if (!status.deactivateUntil) return true;
    const now = new Date();
    const deactivateDate = status.deactivateUntil.toDate();
    return now > deactivateDate;
  };

  // Get disabled reason for save button
  const getDisabledReason = (vehicleType: VehicleType) => {
    if (sectionStates[vehicleType].saving) return "Saving in progress...";
    if (!sectionStates[vehicleType].dirty) return "No changes to save.";
    return "";
  };

  if (loading) {
    return (
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
      <span className="ml-3 text-gray-600">Loading Vehicle Status...</span>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">TukTuk Activation Manager</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VEHICLE_TYPES.map(({ id, label }) => (
            <section key={id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                </div>
                <div className="relative group">
                  <button
                    onClick={() => saveVehicleStatus(id)}
                    disabled={!sectionStates[id].dirty || sectionStates[id].saving}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-md transition ${
                      !sectionStates[id].dirty || sectionStates[id].saving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {sectionStates[id].saving ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Status"
                    )}
                  </button>
                  {(!sectionStates[id].dirty || sectionStates[id].saving) && (
                    <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 -mt-12 right-0">
                      {getDisabledReason(id)}
                    </div>
                  )}
                </div>
              </div>
              {sectionStates[id].saveMsg && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
                    sectionStates[id].saveMsg.includes("✅")
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {sectionStates[id].saveMsg.includes("✅") ? (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  {sectionStates[id].saveMsg}
                </div>
              )}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-900">Active</label>
                  <input
                    type="checkbox"
                    checked={vehicleStatuses[id].isActive}
                    onChange={(e) => updateVehicleStatus(id, { isActive: e.target.checked })}
                    className="h-5 w-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className={`text-sm ${isVehicleActive(id) ? "text-green-600" : "text-red-600"}`}>
                    {isVehicleActive(id)
                      ? "Active"
                      : vehicleStatuses[id].deactivateUntil
                      ? `Deactivated until ${vehicleStatuses[id].deactivateUntil!.toDate().toLocaleDateString()}`
                      : "Fully Deactivated"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Deactivate Until (Optional)
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(vehicleStatuses[id].deactivateUntil)}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      updateVehicleStatus(id, { deactivateUntil: date ? Timestamp.fromDate(date) : null });
                    }}
                    disabled={!vehicleStatuses[id].isActive}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Base Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={vehicleStatuses[id].basePrice ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateVehicleStatus(id, {
                        basePrice: value ? parseFloat(value) : null,
                      });
                    }}
                    placeholder="Enter base price"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Last Updated */}
        {Object.values(vehicleStatuses).some((status) => status.updatedAt) && (
          <p className="text-xs text-gray-500 mt-6">
            Last updated:{" "}
            {Object.values(vehicleStatuses)
              .filter((status) => status.updatedAt)
              .map((status) => status.updatedAt!.toDate().toLocaleString())
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]}
          </p>
        )}
      </div>
    </div>
  );
}