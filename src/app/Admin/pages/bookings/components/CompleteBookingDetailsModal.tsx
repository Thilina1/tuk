"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";
import Select from "react-select";

interface TrainTransfer {
  from: string;
  to: string;
  pickupTime: string;
  downTime: string;
  price: number;
}

interface Props {
  booking: BookingData;
  onClose: () => void;
}

/** Firestore masterPrices shape */
type MasterPrices = {
  dailyRates: { duration: string; pricePerDay: number }[];
  licenseFee: { amount: number; description?: string };
  optionalExtras: { name: string; price: number; type: string }[];
  refundableDeposit: { amount: number; description?: string };
  updatedAt?: any;
};

interface TukTukDoc {
  vehicleNumber: string;
  district?: string;
  active: boolean;
}

interface LocationOption {
  label: string;
  value: string;
  price: number;
}

export default function EditBookingModal({ booking, onClose }: Props) {
  const [formValues, setFormValues] = useState<BookingData>({ ...booking });
  const [enableRecalculation, setEnableRecalculation] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 🔹 Load active locations */
  const [activeLocations, setActiveLocations] = useState<LocationOption[]>([]);
  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "locations"));
      const filtered = snapshot.docs
        .map((doc) => {
          const data = doc.data() as any;
          return {
            label: `${data.name} ($${data.price})`,
            value: data.name,
            price: data.price,
            status: data.status,
          };
        })
        .filter((loc) => loc.status === "active");
      setActiveLocations(filtered);
    };
    fetchLocations();
  }, []);

  /** 🔹 Load active tuks */
  const [activeTuks, setActiveTuks] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const fetchActiveTuks = async () => {
      const snapshot = await getDocs(collection(db, "tuktuks"));
      const activeList = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as TukTukDoc) }))
        .filter((d) => d.active)
        .map((d) => ({
          label: `${d.vehicleNumber} (${d.district || "Unknown"})`,
          value: d.vehicleNumber,
        }));
      setActiveTuks(activeList);
    };
    fetchActiveTuks();
  }, []);

  /** 🔹 Load persons */
  const [activePersons, setActivePersons] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    const fetchPersons = async () => {
      const snapshot = await getDocs(collection(db, "persons"));
      const personsList = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          value: data.name,
          label: `${data.name} (${data.district})`,
        };
      });
      setActivePersons(personsList);
    };
    fetchPersons();
  }, []);

  /** 🔹 Load train transfers */
  const [trainTransfers, setTrainTransfers] = useState<{ label: string; value: TrainTransfer; price: number }[]>([]);
  const [enableTrainTransfer, setEnableTrainTransfer] = useState(!!formValues.trainTransfer);
  useEffect(() => {
    const fetchTrainTransfers = async () => {
      const snapshot = await getDocs(collection(db, "trainTransfers"));
      const activeTransfers = snapshot.docs
        .map((doc) => {
          const data = doc.data() as any;
          return {
            label: `${data.from} → ${data.to} (${data.pickupTime}) - $${data.price}`,
            value: {
              from: data.from,
              to: data.to,
              pickupTime: data.pickupTime,
              downTime: data.downTime,
              price: data.price,
            },
            price: data.price,
            status: data.status,
          };
        })
        .filter((t) => t.status);
      setTrainTransfers(activeTransfers);
    };
    fetchTrainTransfers();
  }, []);

  /** 🆕 Load masterPrices (daily slabs, license fee, deposit, extras) */
  const [prices, setPrices] = useState<MasterPrices | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "masterPrices"));
        const first = snap.docs[0]?.data() as MasterPrices | undefined;
        if (first) setPrices(first);
      } catch (e) {
        console.warn("Failed to load masterPrices; using defaults.", e);
        setPrices(null);
      }
    };
    load();
  }, []);

  /** 🧮 Date math */
  const rentalDays =
    new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
      ? Math.ceil(
          (new Date(formValues.returnDate).getTime() - new Date(formValues.pickupDate).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

  /** 🧠 Parse duration like "1–4 days" / "121+ days" */
  const normDash = (s: string) => s.replace(/–/g, "-");
  const parseRange = (duration: string): { min: number; max: number } => {
    const clean = normDash(duration).toLowerCase();
    const plus = clean.match(/(\d+)\s*\+\s*days?/);
    if (plus) return { min: Number(plus[1]), max: Number.POSITIVE_INFINITY };
    const range = clean.match(/(\d+)\s*-\s*(\d+)\s*days?/);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };
    const single = clean.match(/(\d+)\s*days?/);
    if (single) return { min: Number(single[1]), max: Number(single[1]) };
    return { min: 1, max: Number.POSITIVE_INFINITY };
  };

  /** 🆕 Per-day charge from Firestore (fallback to your old table) */
  const getPerDayCharge = (days: number) => {
    if (prices?.dailyRates?.length) {
      const direct = prices.dailyRates.find((r) => {
        const { min, max } = parseRange(r.duration);
        return days >= min && days <= max;
      });
      if (direct) return direct.pricePerDay;

      const candidates = prices.dailyRates
        .map((r) => ({ ...r, ...parseRange(r.duration) }))
        .filter((r) => days >= r.min)
        .sort((a, b) => b.min - a.min);
      if (candidates[0]) return candidates[0].pricePerDay;
    }
    // fallback slabs
    if (days >= 121) return 8;
    if (days >= 91) return 10;
    if (days >= 36) return 11;
    if (days >= 20) return 12;
    if (days >= 16) return 13;
    if (days >= 9) return 15;
    if (days >= 5) return 16;
    if (days >= 1) return 23;
    return 23;
  };

  /** 🆕 Dynamic fees */
  const perDayCharge = getPerDayCharge(rentalDays);
  const licenseCharge = prices?.licenseFee?.amount ?? 35;
  const deposit = prices?.refundableDeposit?.amount ?? 50;

  /** 🆕 Build extras from Firestore but keep your labels */
  const DISPLAY_MAP: Record<string, { label: string }> = {
    BabySeat: { label: "Baby Seat" },
    FullTimeDriver: { label: "Full-Time Driver" },
    SurfBoardRack: { label: "Surf-Board Rack" },
    BluetoothSpeakers: { label: "Bluetooth Speakers" },
    CoolerBox: { label: "Cooler Box" },
    TrainTransfer: { label: "Train Transfer" },
    HoodRack: { label: "Hood Rack" },
    DashCam: { label: "Dash Cam" },
  };
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  const extrasList = useMemo(() => {
    const fallback = [
      { name: "Baby Seat", price: 2 },
      { name: "Full-Time Driver", price: 25 },
      { name: "Surf-Board Rack", price: 1 },
      { name: "Bluetooth Speakers", price: 1 },
      { name: "Cooler Box", price: 1 },
      { name: "Train Transfer", price: 30 },
      { name: "Hood Rack", price: 3 },
      { name: "Dash Cam", price: 1 },
    ];
    if (!prices?.optionalExtras?.length) return fallback;

    return prices.optionalExtras.map((e) => {
      const fsKey = norm(e.name);
      const matchKey =
        Object.keys(DISPLAY_MAP).find((k) => norm(k) === fsKey) ||
        (fsKey.includes("surfboard") ? "SurfBoardRack" : undefined);
      const label =
        (matchKey && DISPLAY_MAP[matchKey].label) ||
        e.name
          .replace(/([A-Z])/g, " $1")
          .replace(/\s+/g, " ")
          .trim();
      return { name: label, price: e.price };
    });
  }, [prices]);

  /** ---- helpers ---- */
  const handleChange = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleExtrasChange = (key: string, value: number) => {
    setFormValues((prev) => ({
      ...prev,
      extras: { ...prev.extras, [key]: value },
    }));
  };

  /** 💰 Calculation (now dynamic) */
  const calculateTotal = () => {
    const extrasTotal = extrasList.reduce(
      (sum, extra) => sum + (formValues.extras?.[extra.name] || 0) * extra.price,
      0
    );
    const trainTransferCost = formValues.trainTransfer?.price || 0;
    const pickupPrice = formValues.pickupPrice || 0;
    const returnPrice = formValues.returnPrice || 0;

    return (
      rentalDays * formValues.tukCount * perDayCharge +
      formValues.licenseCount * licenseCharge +
      extrasTotal +
      trainTransferCost +
      pickupPrice +
      returnPrice +
      deposit
    );
  };

  /** Assign handler (unchanged flow) */
  const handleAssign = async () => {
    const missingTuks =
      !formValues.assignedTuks ||
      formValues.assignedTuks.length !== formValues.tukCount ||
      formValues.assignedTuks.some((tuk) => tuk.trim() === "");
    const missingPerson =
      !formValues.assignedPerson || (formValues as any).assignedPerson.trim() === "";

    if (missingTuks || missingPerson) {
      alert("Please fill all required fields: Assigned Tuk Tuks and Assigned Person.");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "bookings", booking.id);
      const updatedData: Partial<BookingData> = {
        ...formValues,
        status: "assigned",
      };
      if (enableRecalculation) {
        updatedData.RentalPrice = calculateTotal().toString();
      }
      await updateDoc(docRef, updatedData);

      await fetch("/api/send-email/assignEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          whatsapp: formValues.whatsapp,
          pickup: formValues.pickup,
          pickupDate: formValues.pickupDate,
          pickupTime: formValues.pickupTime,
          returnLoc: formValues.returnLoc,
          returnDate: formValues.returnDate,
          returnTime: formValues.returnTime,
          tukCount: formValues.tukCount,
          licenseCount: formValues.licenseCount,
          extras: formValues.extras,
          assignedTuks: formValues.assignedTuks,
          holdBackAssignedPerson: formValues.holdBackAssignedPerson,
          assignedPerson: formValues.assignedPerson,
          trainTransferAssignedPerson: formValues.trainTransferAssignedPerson,
          trainTransfer: formValues.trainTransfer,
          rentalPrice: enableRecalculation ? calculateTotal() : booking.RentalPrice,
        }),
      });

      console.log("✅ Email sent after assignment");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to assign or send email:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white max-h-[90vh] w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Scrollable content */}
        <div className="overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Booking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formValues.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter your email"
              />
            </div>

            {/* WhatsApp Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="text"
                value={formValues.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter WhatsApp number"
              />
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
              <Select
                options={activeLocations}
                value={formValues.pickup ? activeLocations.find((loc) => loc.value === formValues.pickup) : null}
                onChange={(selected) => {
                  handleChange("pickup", selected?.value || "");
                  handleChange("pickupPrice", selected?.price || 0);
                }}
                isClearable
                placeholder="Select pickup location"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    padding: "0.25rem",
                    "&:hover": { borderColor: "#f97316" },
                    boxShadow: "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    marginTop: "0.25rem",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                    color: isSelected ? "white" : "#374151",
                    padding: "0.75rem",
                  }),
                }}
              />
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <input
                type="date"
                value={formValues.pickupDate}
                onChange={(e) => handleChange("pickupDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
              <input
                type="time"
                value={formValues.pickupTime}
                onChange={(e) => handleChange("pickupTime", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            {/* Return Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Location</label>
              <Select
                options={activeLocations}
                value={formValues.returnLoc ? activeLocations.find((loc) => loc.value === formValues.returnLoc) : null}
                onChange={(selected) => {
                  handleChange("returnLoc", selected?.value || "");
                  handleChange("returnPrice", selected?.price || 0);
                }}
                isClearable
                placeholder="Select return location"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    padding: "0.25rem",
                    "&:hover": { borderColor: "#f97316" },
                    boxShadow: "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    marginTop: "0.25rem",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                    color: isSelected ? "white" : "#374151",
                    padding: "0.75rem",
                  }),
                }}
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input
                type="date"
                value={formValues.returnDate}
                onChange={(e) => handleChange("returnDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            {/* Return Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
              <input
                type="time"
                value={formValues.returnTime}
                onChange={(e) => handleChange("returnTime", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            {/* Tuk Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tuk Count</label>
              <input
                type="number"
                min={1}
                value={formValues.tukCount}
                onChange={(e) => handleChange("tukCount", parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter number of tuks"
              />
            </div>

            {/* License Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Count</label>
              <input
                type="number"
                min={1}
                value={formValues.licenseCount}
                onChange={(e) => handleChange("licenseCount", parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                placeholder="Enter number of licenses"
              />
            </div>

            {/* Train Transfer */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <input
                  id="trainTransferCheckbox"
                  type="checkbox"
                  checked={enableTrainTransfer}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEnableTrainTransfer(checked);
                    if (!checked) {
                      handleChange("trainTransfer", undefined);
                    }
                  }}
                  className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="trainTransferCheckbox" className="text-sm font-medium text-gray-700 select-none">
                  Enable Train Transfer
                </label>
              </div>

              {enableTrainTransfer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Train Transfer</label>
                  <Select
                    options={trainTransfers}
                    value={
                      formValues.trainTransfer
                        ? {
                            label: `${formValues.trainTransfer.from} → ${formValues.trainTransfer.to} (${formValues.trainTransfer.pickupTime}) - $${formValues.trainTransfer.price}`,
                            value: formValues.trainTransfer,
                          }
                        : null
                    }
                    onChange={(selected) => handleChange("trainTransfer", selected?.value ?? undefined)}
                    isClearable
                    placeholder="Search or select train transfer"
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        borderColor: "#d1d5db",
                        padding: "0.25rem",
                        "&:hover": { borderColor: "#f97316" },
                        boxShadow: "none",
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        marginTop: "0.25rem",
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                        color: isSelected ? "white" : "#374151",
                        padding: "0.75rem",
                      }),
                    }}
                  />

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-red-600 mb-1">Handover Agent (Train Transfer) *</label>
                    <Select
                      options={activePersons}
                      value={
                        formValues.trainTransferAssignedPerson
                          ? activePersons.find((p) => p.value === formValues.trainTransferAssignedPerson)
                          : null
                      }
                      onChange={(selectedOption) => {
                        handleChange("trainTransferAssignedPerson", selectedOption?.value || "");
                      }}
                      isClearable
                      placeholder="Search or select a person"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          borderColor: "#d1d5db",
                          padding: "0.25rem",
                          "&:hover": { borderColor: "#f97316" },
                          boxShadow: "none",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          marginTop: "0.25rem",
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                          ...base,
                          backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                          color: isSelected ? "white" : "#374151",
                          padding: "0.75rem",
                        }),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Extras */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Extras</label>
              <div className="grid grid-cols-2 gap-4">
                {extrasList.map((extra) => (
                  <div key={extra.name} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {extra.name} <span className="text-gray-500">(${extra.price} each)</span>
                    </span>
                    <select
                      value={formValues.extras?.[extra.name] || 0}
                      onChange={(e) => handleExtrasChange(extra.name, parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            
            <div className="col-span-full w-full max-w-none space-y-4 border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
  <h3 className="text-lg font-semibold text-gray-800">License & Identity</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
    <div><strong>International Driving Permit (IDP):</strong> {formValues.hasIDP}</div>
    <div><strong>Full Name:</strong> {formValues.licenseName}</div>
    <div><strong>Address:</strong> {formValues.licenseAddress}</div>
    <div><strong>Country:</strong> {formValues.licenseCountry}</div>
    <div><strong>Postal Code:</strong> {formValues.postalCode}</div>
    <div><strong>License Number:</strong> {formValues.licenseNumber}</div>
    <div><strong>Passport Number:</strong> {formValues.passportNumber}</div>
  </div>
</div>


            {/* Assigned Tuk Tuks */}
            <div className="md:col-span-2 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Tuk Tuks *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: formValues.tukCount || 1 }, (_, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuk Tuk {index + 1}</label>
                    <Select
                      options={activeTuks}
                      value={
                        formValues.assignedTuks?.[index]
                          ? { value: formValues.assignedTuks[index], label: formValues.assignedTuks[index] }
                          : null
                      }
                      onChange={(selectedOption) => {
                        const updated = [...(formValues.assignedTuks || [])];
                        updated[index] = selectedOption?.value || "";
                        handleChange("assignedTuks", updated);
                      }}
                      isClearable
                      placeholder="Search or select tuk tuk"
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          borderColor: "#d1d5db",
                          padding: "0.25rem",
                          "&:hover": { borderColor: "#f97316" },
                          boxShadow: "none",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          marginTop: "0.25rem",
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                          ...base,
                          backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                          color: isSelected ? "white" : "#374151",
                          padding: "0.75rem",
                        }),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Handover Agent (Start) */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-1">Handover Agent (Start) *</label>
              <Select
                options={activePersons}
                value={formValues.assignedPerson ? activePersons.find((p) => p.value === formValues.assignedPerson) : null}
                onChange={(selectedOption) => {
                  handleChange("assignedPerson", selectedOption?.value || "");
                }}
                isClearable
                placeholder="Search or select a person"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    padding: "0.25rem",
                    "&:hover": { borderColor: "#f97316" },
                    boxShadow: "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    marginTop: "0.25rem",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                    color: isSelected ? "white" : "#374151",
                    padding: "0.75rem",
                  }),
                }}
              />
            </div>

            {/* Return Agent */}
            <div>
              <label className="block text-sm font-medium text-red-600 mb-1">Return Agent *</label>
              <Select
                options={activePersons}
                value={
                  formValues.holdBackAssignedPerson
                    ? activePersons.find((p) => p.value === formValues.holdBackAssignedPerson)
                    : null
                }
                onChange={(selectedOption) => {
                  handleChange("holdBackAssignedPerson", selectedOption?.value || "");
                }}
                isClearable
                placeholder="Search or select a person"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    padding: "0.25rem",
                    "&:hover": { borderColor: "#f97316" },
                    boxShadow: "none",
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    marginTop: "0.25rem",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? "#f97316" : isFocused ? "#fed7aa" : "white",
                    color: isSelected ? "white" : "#374151",
                    padding: "0.75rem",
                  }),
                }}
              />
            </div>

            {/* Coupon Code */}
            {formValues.couponCode && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={formValues.couponCode}
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="Coupon code"
                  readOnly
                />
              </div>
            )}

            {/* Price and Recalculation */}
            <div className="md:col-span-2 flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <input
                  id="recalcCheckbox"
                  type="checkbox"
                  checked={enableRecalculation}
                  disabled={!!formValues.couponCode}
                  onChange={() => setEnableRecalculation((prev) => !prev)}
                  className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="recalcCheckbox" className="text-sm font-medium text-gray-700 select-none">
                  Recalculate Total Cost
                </label>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {enableRecalculation ? (
                  <>
                    Updated Price: <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                  </>
                ) : (
                  <>
                    Original Price: <span className="text-blue-600">${booking.RentalPrice || "N/A"}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 ${
                  loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 transition"
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Assigning...
                  </>
                ) : (
                  "Assign"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
