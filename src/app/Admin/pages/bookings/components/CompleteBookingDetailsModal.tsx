"use client";

import { useEffect, useState } from "react";
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

const extrasList = [
  { name: "Baby Seat", price: 2 },
  { name: "Full-Time Driver", price: 25 },
  { name: "Surf-Board Rack", price: 1 },
  { name: "Bluetooth Speakers", price: 1 },
  { name: "Cooler Box", price: 1 },
  { name: "Train Transfer", price: 30 },
  { name: "Hood Rack", price: 3 },
  { name: "Dash Cam", price: 1 },
];


interface TukTukDoc {
  vehicleNumber: string;
  district?: string;
  active: boolean;
}


export default function EditBookingModal({ booking, onClose }: Props) {
  const [formValues, setFormValues] = useState<BookingData>({ ...booking });
  const [enableRecalculation, setEnableRecalculation] = useState(false);

  const [loading, setLoading] = useState(false);
  

  const handleChange = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };
  

  const handleExtrasChange = (key: string, value: number) => {
    setFormValues((prev) => ({
      ...prev,
      extras: { ...prev.extras, [key]: value },
    }));
  };


  interface LocationOption {
    label: string;
    value: string;
    price: number;
  }
  
  const [activeLocations, setActiveLocations] = useState<LocationOption[]>([]);
  


  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "locations"));
      const filtered = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            label: `${data.name} ($${data.price})`,
            value: data.name,
            price: data.price,
            status: data.status,
          };
        })
        .filter(loc => loc.status === "active"); // only active
  
      setActiveLocations(filtered);
    };
  
    fetchLocations();
  }, []);
  

  const calculateTotal = () => {
    const rentalDays =
      new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
        ? Math.ceil(
            (new Date(formValues.returnDate).getTime() -
              new Date(formValues.pickupDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : 1;
  
    const getPerDayCharge = (days: number) => {
         if (days >= 121) return 8;
         if (days >= 91) return 10;
         if (days >= 36) return 11;
         if (days >= 20) return 12;
         if (days >= 16) return 13;
         if (days >= 9) return 15;
         if (days >= 5) return 16;
         if (days >= 1) return 23;
            return 23; // fallback (should not happen)
    };
        
    const perDayCharge = getPerDayCharge(rentalDays);
        
    const licenseCharge = 35;
  
    const extrasTotal = extrasList.reduce(
      (sum, extra) => sum + (formValues.extras?.[extra.name] || 0) * extra.price,
      0
    );
    
  
    const trainTransferCost = formValues.trainTransfer?.price || 0;
  
    // ✅ Get pickup/return prices (default to 0 if not set)
    const pickupPrice = formValues.pickupPrice || 0;
    const returnPrice = formValues.returnPrice || 0;
  
    return (
      rentalDays * formValues.tukCount * perDayCharge +
      formValues.licenseCount * licenseCharge +
      extrasTotal +
      trainTransferCost +
      pickupPrice +
      returnPrice + 50
    );
  };
  
  

  const [activeTuks, setActiveTuks] = useState<{ label: string; value: string }[]>([]);


  useEffect(() => {
    const fetchActiveTuks = async () => {
      const snapshot = await getDocs(collection(db, "tuktuks"));
      const activeList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as TukTukDoc) }))
        .filter((doc) => doc.active)
        .map((doc) => ({
          label: `${doc.vehicleNumber} (${doc.district || 'Unknown'})`,
          value: doc.vehicleNumber,
        }));
      setActiveTuks(activeList);
    };
    fetchActiveTuks();
  }, []);
  
  
  

  const [activePersons, setActivePersons] = useState<{ label: string; value: string }[]>([]);

useEffect(() => {
  const fetchPersons = async () => {
    const snapshot = await getDocs(collection(db, "persons"));
    const personsList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        value: data.name,
        label: `${data.name} (${data.district})`,
      };
    });
    setActivePersons(personsList);
  };

  fetchPersons();
}, []);


const [trainTransfers, setTrainTransfers] = useState<
  { label: string; value: TrainTransfer; price: number }[]
>([]);

const [enableTrainTransfer, setEnableTrainTransfer] = useState(
  !!formValues.trainTransfer
);


useEffect(() => {
  const fetchTrainTransfers = async () => {
    const snapshot = await getDocs(collection(db, "trainTransfers"));
    const activeTransfers = snapshot.docs
      .map((doc) => {
        const data = doc.data();
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
      .filter((transfer) => transfer.status);
    setTrainTransfers(activeTransfers);
  };
  fetchTrainTransfers();
}, []);



  const handleAssign = async () => {
    const missingTuks = !formValues.assignedTuks || formValues.assignedTuks.length !== formValues.tukCount || formValues.assignedTuks.some((tuk) => tuk.trim() === "");
    const missingPerson = !formValues.assignedPerson || (formValues).assignedPerson

    .trim() === "";
  
    if (missingTuks || missingPerson) {
      alert("Please fill all required fields: Assigned Tuk Tuks and Assigned Person.");
      return;
    }
  
    setLoading(true); // ⏳ Start loading
  
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
  
      await fetch('/api/send-email/assignEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setLoading(false); // ✅ Stop loading
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
              value={
                formValues.pickup
                  ? activeLocations.find(loc => loc.value === formValues.pickup)
                  : null
              }
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
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  padding: '0.25rem',
                  '&:hover': { borderColor: '#f97316' },
                  boxShadow: 'none',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                  color: isSelected ? 'white' : '#374151',
                  padding: '0.75rem',
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
              value={
                formValues.returnLoc
                  ? activeLocations.find(loc => loc.value === formValues.returnLoc)
                  : null
              }
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
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  padding: '0.25rem',
                  '&:hover': { borderColor: '#f97316' },
                  boxShadow: 'none',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                  color: isSelected ? 'white' : '#374151',
                  padding: '0.75rem',
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
              <label
                htmlFor="trainTransferCheckbox"
                className="text-sm font-medium text-gray-700 select-none"
              >
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
                  onChange={(selected) =>
                    handleChange("trainTransfer", selected?.value ?? undefined)
                  }
                  isClearable
                  placeholder="Search or select train transfer"
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      padding: '0.25rem',
                      '&:hover': { borderColor: '#f97316' },
                      boxShadow: 'none',
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      marginTop: '0.25rem',
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                      color: isSelected ? 'white' : '#374151',
                      padding: '0.75rem',
                    }),
                  }}
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-red-600 mb-1">
                    Handover Agent (Train Transfer) *
                  </label>
                  <Select
                    options={activePersons}
                    value={
                      formValues.trainTransferAssignedPerson
                        ? activePersons.find((person) => person.value === formValues.trainTransferAssignedPerson)
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
                        borderRadius: '0.5rem',
                        borderColor: '#d1d5db',
                        padding: '0.25rem',
                        '&:hover': { borderColor: '#f97316' },
                        boxShadow: 'none',
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        marginTop: '0.25rem',
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                        color: isSelected ? 'white' : '#374151',
                        padding: '0.75rem',
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
                        borderRadius: '0.5rem',
                        borderColor: '#d1d5db',
                        padding: '0.25rem',
                        '&:hover': { borderColor: '#f97316' },
                        boxShadow: 'none',
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        marginTop: '0.25rem',
                      }),
                      option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                        color: isSelected ? 'white' : '#374151',
                        padding: '0.75rem',
                      }),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Handover Agent (Start) */}
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">
              Handover Agent (Start) *
            </label>
            <Select
              options={activePersons}
              value={
                formValues.assignedPerson
                  ? activePersons.find((person) => person.value === formValues.assignedPerson)
                  : null
              }
              onChange={(selectedOption) => {
                handleChange("assignedPerson", selectedOption?.value || "");
              }}
              isClearable
              placeholder="Search or select a person"
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  padding: '0.25rem',
                  '&:hover': { borderColor: '#f97316' },
                  boxShadow: 'none',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                  color: isSelected ? 'white' : '#374151',
                  padding: '0.75rem',
                }),
              }}
            />
          </div>

          {/* Return Agent */}
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">
              Return Agent *
            </label>
            <Select
              options={activePersons}
              value={
                formValues.holdBackAssignedPerson
                  ? activePersons.find((person) => person.value === formValues.holdBackAssignedPerson)
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
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  padding: '0.25rem',
                  '&:hover': { borderColor: '#f97316' },
                  boxShadow: 'none',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#f97316' : isFocused ? '#fed7aa' : 'white',
                  color: isSelected ? 'white' : '#374151',
                  padding: '0.75rem',
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
              <label
                htmlFor="recalcCheckbox"
                className="text-sm font-medium text-gray-700 select-none"
              >
                Recalculate Total Cost
              </label>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {enableRecalculation ? (
                <>Updated Price: <span className="text-green-600">${calculateTotal().toFixed(2)}</span></>
              ) : (
                <>Original Price: <span className="text-blue-600">${booking.RentalPrice || "N/A"}</span></>
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
                loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 transition'
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
