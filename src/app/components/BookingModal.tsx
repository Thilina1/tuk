"use client";

import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { collection, doc, getDocs, updateDoc, increment  } from "firebase/firestore";
import { db } from "../../config/firebase";
import Image from "next/image";
import { FaCar, FaGift, FaIdCard, FaCreditCard } from "react-icons/fa";




type Extras = {
  [key: string]: number;
};

type AppliedCoupon = {
  id: string;
  discountMode: string;
  discountValue: number;
};


type BookingFormValues = {
  name: string;
  email: string;
  whatsapp: string;
  pickup: string;
  returnLoc: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  tukCount: number;
  licenseCount: number;
  extras: Extras;
  licenseName: string;
  licenseAddress: string;
  licenseCountry: string;
  postalCode: string;
  licenseNumber: string;
  passportNumber: string;
  uploadedDocs: File[];
  isBooked:boolean;
  pickupPrice?: number;
  returnPrice?:number;
  trainTransfer?: {
    from: string;
    to: string;
    pickupTime: string;
    price: number;
  };  
};

type Props = {
  formValues: BookingFormValues;
  setFormValues: Dispatch<SetStateAction<BookingFormValues>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  closeModal: () => void;
  docId: string;
  locationOptions: { name: string; price: number }[]; 

};


type CouponDoc = {
  id: string;
  discountCode: string;
  discountMode: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
  startDate: string;
  endDate: string;
  currentUsers: number;
  maxUsers: number;
};

const timeOptions = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 6;
  const value = hour.toString().padStart(2, '0') + ":00";
  return <option key={value} value={value}>{value}</option>;
});




const BookingModal = ({
  formValues,
  setFormValues,
  step,
  setStep,
  closeModal,
  docId,
  locationOptions,
}: Props) => {
  const [validationError, setValidationError] = useState("");
  const [includeTrainTransfer, setIncludeTrainTransfer] = useState(false);

  const [trainTransferOptions, setTrainTransferOptions] = useState<
    { from: string; to: string; pickupTime: string; price: number }[]
  >([]);



  

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  


  const handleApplyCoupon = async () => {
    setCouponError("");
  
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
  
    const today = new Date();
  
    const snapshot = await getDocs(collection(db, "discounts"));
    const matched = snapshot.docs
    .map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as CouponDoc)
    )
    .find(
      (d) =>
        d.discountCode?.toLowerCase() === couponCode.trim().toLowerCase() &&
        d.active &&
        new Date(d.startDate) <= today &&
        today <= new Date(d.endDate) &&
        d.currentUsers < d.maxUsers
    );
  
  
    if (!matched) {
      setAppliedCoupon(null);
      setCouponError("Invalid or expired coupon.");
      setCouponCode("");  // 👈 clear the input so user can retry cleanly
      return;
    }
    
  
    setAppliedCoupon({
      id: matched.id,
      discountMode: matched.discountMode,
      discountValue: matched.discountValue,
    });
  };
  


  
  const extrasList = [
    { name: "Local License", icon: "/icons/License.png", price: 5 },
    { name: "Full-Time Driver", icon: "/icons/Driver.png", price: 10 },
    { name: "Surf-Board Rack", icon: "/icons/surfboard.png", price: 3 },
    { name: "Bluetooth Speakers", icon: "/icons/speaker.png", price: 4 },
    { name: "Cooler Box", icon: "/icons/cooler.png", price: 6 },
    { name: "Baby Seat", icon: "/icons/babyseat.png", price: 7 },
  ];
  


  React.useEffect(() => {
    const fetchTrainTransfers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "trainTransfers"));
        const formatted = snapshot.docs
          .map((doc) => doc.data())
          .filter((item) => item.status === true)
          .map((item) => ({
            from: item.from,
            to: item.to,
            pickupTime: item.pickupTime,
            price: item.price || 0,
          }));
        setTrainTransferOptions(formatted);
      } catch (error) {
        console.error("Error fetching train transfers:", error);
      }
    };
  
    fetchTrainTransfers();
  }, []);
  
  

  const rentalDays =
  new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
    ? Math.ceil(
        (new Date(formValues.returnDate).getTime() -
          new Date(formValues.pickupDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      ) + 1
    : 1;


  const perDayCharge = 13;
  const licenseCharge = 35;
  const extrasTotal = extrasList.reduce(
    (sum, extra) => sum + (formValues.extras[extra.name] || 0) * extra.price,
    0
  );
  

  const totalRental = useMemo(() => {
    let total =
      rentalDays * formValues.tukCount * perDayCharge +
      formValues.licenseCount * licenseCharge +
      extrasTotal +
      (formValues.pickupPrice || 0) +
      (formValues.returnPrice || 0) +
      ((includeTrainTransfer && formValues.trainTransfer?.price) || 0);
  
    if (appliedCoupon) {
      if (appliedCoupon.discountMode === "percentage") {
        total = total * (1 - appliedCoupon.discountValue / 100);
      } else if (appliedCoupon.discountMode === "fixed") {
        total = total - appliedCoupon.discountValue;
      }
      total = Math.max(total, 0);
    }
  
    return total;
  }, [
    rentalDays,
    formValues.tukCount,
    formValues.licenseCount,
    extrasTotal,
    formValues.pickupPrice,
    formValues.returnPrice,
    includeTrainTransfer,
    formValues.trainTransfer,
    appliedCoupon
  ]);
  



  const [loading, setLoading] = useState(false);


  const handleNext = async () => {
    setLoading(true);

    try{

    const docRef = doc(db, "bookings", docId);
    setValidationError("");
    if (step === 0) {
      const required = ["name", "email", "whatsapp", "pickupDate", "pickupTime", "returnDate", "returnTime"];
      const hasEmpty = required.some((f) => !formValues[f as keyof BookingFormValues]);
      if (hasEmpty) {
        setValidationError("Please fill in all required fields.");
        return;
      }
    
      const pickupDateTime = new Date(`${formValues.pickupDate}T${formValues.pickupTime}`);
      const returnDateTime = new Date(`${formValues.returnDate}T${formValues.returnTime}`);
      if (pickupDateTime >= returnDateTime) {
        setValidationError("Return date & time must be after pickup date & time.");
        return;
      }
    
      await updateDoc(docRef, {
        pickupDate: formValues.pickupDate,
        returnDate: formValues.returnDate,
        pickupTime: formValues.pickupTime,
        returnTime: formValues.returnTime,
        tukCount: formValues.tukCount,
        licenseCount: formValues.licenseCount,
        name: formValues.name,
        email: formValues.email,
        whatsapp: formValues.whatsapp,
      });
    }
    

    if (step === 1) {
      await updateDoc(docRef, {
        extras: formValues.extras,
        ...(includeTrainTransfer && formValues.trainTransfer && {
          trainTransfer: formValues.trainTransfer,
        }),
      });
    }

    if (step === 2) {
      await updateDoc(docRef, {
        licenseName: formValues.licenseName,
        licenseAddress: formValues.licenseAddress,
        licenseCountry: formValues.licenseCountry,
        postalCode: formValues.postalCode,
        licenseNumber: formValues.licenseNumber,
        passportNumber: formValues.passportNumber,
        uploadedDocs: formValues.uploadedDocs.map((f) => f.name),
      });
    }


    if (step === 3) {
      const updates: any = {
        RentalPrice: totalRental,
        isBooked: true,
      };
    
      if (appliedCoupon) {
        updates.couponCode = couponCode.trim();
    
        const couponRef = doc(db, "discounts", appliedCoupon.id);
        await updateDoc(couponRef, {
          currentUsers: increment(1),
        });
      }
    
      await updateDoc(docRef, updates);
    
    
    
      // Call your backend to send the email
      try {
        const response = await fetch('/api/send-email/bookingEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // send any relevant formValues or booking info for email body
            name: formValues.name,
            email: formValues.email,
            whatsapp: formValues.whatsapp,
            pickupDate: formValues.pickupDate,
            pickupTime: formValues.pickupTime,
            returnDate: formValues.returnDate,
            returnTime: formValues.returnTime,
            tukCount: formValues.tukCount,
            licenseCount: formValues.licenseCount,
            extras: formValues.extras,
            licenseName: formValues.licenseName,
            licenseAddress: formValues.licenseAddress,
            licenseCountry: formValues.licenseCountry,
            postalCode: formValues.postalCode,
            licenseNumber: formValues.licenseNumber,
            passportNumber: formValues.passportNumber,
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Email send failed: ${response.statusText}`);
        }
        console.log('✅ Email sent successfully');
      } catch (error) {
        console.error('❌ Error sending email:', error);
      }
    }

    if (step < 3) setStep((prev) => prev + 1);
    else closeModal();
  } finally {
      setLoading(false);

  }};

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 text-black shadow-2xl">
      <button
  onClick={closeModal}
  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white shadow transition"
  aria-label="Close"
>
  &times;
</button>


        <div className="relative w-full max-w-md mx-auto px-4">
  {/* background line */}
  <div className="absolute top-1/2 left-5 right-5 h-1 bg-gray-300 z-0 transform -translate-y-1/2" />

  {/* progress line */}
  <div
    className="absolute top-1/2 left-5 h-1 bg-green-500 z-0 transform -translate-y-1/2"
    style={{
      width: `calc(${(step / 3) * 100}% - ${5 * 2}px)`,
    }}
  />

  <div className="flex justify-between relative z-10">
    {[
      { label: "Rental Details", icon: <FaCar /> },
      { label: "Extras", icon: <FaGift /> },
      { label: "License Details", icon: <FaIdCard /> },
      { label: "Payment", icon: <FaCreditCard /> },
    ].map((stepItem, index) => (
      <div key={stepItem.label} className="flex flex-col items-center">
        <div
          className="rounded-full w-10 h-10 flex items-center justify-center text-white text-lg"
          style={{
            backgroundColor: step >= index ? "#22c55e" : "#d1d5db",
          }}
        >
          {stepItem.icon}
        </div>
        <span className="text-xs mt-1 text-center">{stepItem.label}</span>
      </div>
    ))}
  </div>
</div>




        {step === 0 && validationError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {validationError}
          </div>
         )}

        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "WhatsApp", key: "whatsapp", type: "tel" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm font-semibold">{label}</label>
                  <input
                    type={type}
                    value={formValues[key as keyof BookingFormValues] as string}
                    onChange={(e) =>
                      setFormValues({ ...formValues, [key]: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                </div>
              ))}

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-semibold">Pickup Date</label>
                  <input
                    type="date"
                    value={formValues.pickupDate}
                    onChange={(e) =>
                      setFormValues({ ...formValues, pickupDate: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold">Pickup Time</label>
                  <select
  value={formValues.pickupTime}
  onChange={(e) =>
    setFormValues({ ...formValues, pickupTime: e.target.value })
  }
  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"

>
  {timeOptions}
</select>

                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-semibold">Return Date</label>
                  <input
                    type="date"
                    value={formValues.returnDate}
                    onChange={(e) =>
                      setFormValues({ ...formValues, returnDate: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold">Return Time</label>
                  <select
  value={formValues.returnTime}
  onChange={(e) =>
    setFormValues({ ...formValues, returnTime: e.target.value })
  }
  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
>
  {timeOptions}
</select>

                </div>
              </div>
            </div>

            <div className="space-y-4">


            <div className="flex gap-2">
  <div className="flex-1">
    <label className="text-sm font-semibold">Pick-Up Location</label>
    <select
  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
  value={formValues.pickup}
      onChange={(e) => {
        const selected = locationOptions.find((loc) => loc.name === e.target.value);
        setFormValues((prev) => ({
          ...prev,
          pickup: selected?.name || "",
          pickupPrice: selected?.price || 0,
        }));
      }}
    >
      <option value="">Select Pick-Up Location</option>
      {locationOptions.map((loc) => (
        <option key={loc.name} value={loc.name} 
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
        >
          {loc.name} ({loc.price === 0 ? "Free" : `$${loc.price}`})
        </option>
      ))}
    </select>
  </div>

  <div className="flex-1">
    <label className="text-sm font-semibold">Return Location</label>
    <select
  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
  value={formValues.returnLoc}
      onChange={(e) => {
        const selected = locationOptions.find((loc) => loc.name === e.target.value);
        setFormValues((prev) => ({
          ...prev,
          returnLoc: selected?.name || "",
          returnPrice: selected?.price || 0,
        }));
      }}
    >
      <option value="">Select Return Location</option>
      {locationOptions.map((loc) => (
        <option key={loc.name} value={loc.name}>
          {loc.name} ({loc.price === 0 ? "Free" : `$${loc.price}`})
        </option>
      ))}
    </select>
  </div>
</div>




              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-semibold">Tuk Tuks</label>
                  <select
                    value={formValues.tukCount}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        tukCount: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((val) => (
                      <option key={val}>{val}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold">Licenses</label>
                  <select
                    value={formValues.licenseCount}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        licenseCount: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((val) => (
                      <option key={val}>{val}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-base font-semibold mb-2">Total Rentals Detail</h3>
                <p><strong>Per Day Charge:</strong> $13</p>
                <p><strong>License Charge:</strong> $35 × {formValues.licenseCount}</p>
                <p><strong>Rental Days:</strong> {rentalDays}</p>
                <p><strong>Extras Total:</strong> ${extrasTotal}</p>
                <p className="text-xl font-bold mt-2 text-emerald-600">
                  Total Rentals: ${totalRental}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your Extras</h3>
    
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {extrasList.map((extra) => (
    <div
      key={extra.name}
      className="flex items-center justify-between bg-white border rounded-lg shadow-sm p-3 hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <Image
          src={extra.icon}
          alt={extra.name}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
        <div>
          <div className="font-medium text-sm text-gray-800">{extra.name}</div>
          <div className="text-xs text-gray-500">${extra.price} each</div>
        </div>
      </div>

      <select
        value={formValues.extras[extra.name] || 0}
        onChange={(e) =>
          setFormValues({
            ...formValues,
            extras: {
              ...formValues.extras,
              [extra.name]: parseInt(e.target.value),
            },
          })
        }
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-orange-400"
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






<div className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
  <div className="flex items-center gap-3">
    <input
      id="train-transfer-checkbox"
      type="checkbox"
      checked={includeTrainTransfer}
      onChange={(e) => setIncludeTrainTransfer(e.target.checked)}
      className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
    />
    <label
      htmlFor="train-transfer-checkbox"
      className="text-sm font-medium text-gray-800"
    >
      Add <span className="text-orange-600 font-semibold">Train Transfer</span>
    </label>
  </div>

  {includeTrainTransfer && (
    <>
      <label className="text-sm font-medium text-gray-700">
        Select Train Transfer
      </label>

      <select
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
        value={formValues.trainTransfer?.from || ""}
        onChange={(e) => {
          const selected = trainTransferOptions.find(
            (option) => option.from === e.target.value
          );
          if (selected) {
            setFormValues((prev) => ({
              ...prev,
              trainTransfer: selected,
            }));
          }
        }}
      >
        <option value="">Select a train transfer</option>
        {trainTransferOptions.map((option, idx) => (
          <option key={idx} value={option.from}>
            {option.from} → {option.to} | {option.pickupTime} (${option.price})
          </option>
        ))}
      </select>

      {formValues.trainTransfer && (
        <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 mt-2 text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-medium">From:</span>{" "}
            {formValues.trainTransfer.from}
          </div>
          <div>
            <span className="font-medium">To:</span>{" "}
            {formValues.trainTransfer.to}
          </div>
          <div>
            <span className="font-medium">Pickup Time:</span>{" "}
            {formValues.trainTransfer.pickupTime}
          </div>
          <div>
            <span className="font-medium">Price:</span>{" "}
            <span className="text-emerald-600 font-semibold">
              ${formValues.trainTransfer.price}
            </span>
          </div>
        </div>
      )}
    </>
  )}
</div>






            <div className="mt-4 border border-gray-200 p-4 rounded">
              <p><strong>Extras Total:</strong> ${extrasTotal}</p>
              <p className="text-xl font-bold mt-2 text-emerald-600">
                Updated Total: ${totalRental}
              </p>
            </div>
          </div>
        )}

{step === 2 && (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">License & Identity Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-semibold">Full Name</label>
        <input
          type="text"
          value={formValues.licenseName}
          onChange={(e) =>
            setFormValues({ ...formValues, licenseName: e.target.value })
          }
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
      </div>

      <div>
        <label className="text-sm font-semibold">Address</label>
        <input
          type="text"
          value={formValues.licenseAddress}
          onChange={(e) =>
            setFormValues({ ...formValues, licenseAddress: e.target.value })
          }
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
      </div>

      <div>
  <label className="text-sm font-semibold">Country</label>
  <input
    type="text"
    placeholder="Enter country"
    value={formValues.licenseCountry}
    onChange={(e) =>
      setFormValues({ ...formValues, licenseCountry: e.target.value })
    }
    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
    />
</div>


      <div>
        <label className="text-sm font-semibold">Postal Code</label>
        <input
          type="text"
          value={formValues.postalCode}
          onChange={(e) =>
            setFormValues({ ...formValues, postalCode: e.target.value })
          }
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
      </div>

      <div>
        <label className="text-sm font-semibold">License Number</label>
        <input
          type="text"
          value={formValues.licenseNumber}
          onChange={(e) =>
            setFormValues({ ...formValues, licenseNumber: e.target.value })
          }
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
      </div>

      <div>
        <label className="text-sm font-semibold">Passport Number</label>
        <input
          type="text"
          value={formValues.passportNumber}
          onChange={(e) =>
            setFormValues({ ...formValues, passportNumber: e.target.value })
          }
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
      </div>
    </div>

    <div>
      <label className="text-sm font-semibold">Upload Documents</label>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={(e) =>
          setFormValues({
            ...formValues,
            uploadedDocs: Array.from(e.target.files || []),
          })
        }
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
      {formValues.uploadedDocs && formValues.uploadedDocs.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          {formValues.uploadedDocs.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}




{step === 3 && (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Payment & Confirmation</h3>

    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2">
      <p><strong>Rental Price:</strong> ${totalRental.toFixed(2)}</p>

      {appliedCoupon && (
        <p className="text-green-600">
          ✅ Coupon <strong>{couponCode}</strong> applied: {appliedCoupon.discountMode} {appliedCoupon.discountValue}
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleApplyCoupon}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Apply
        </button>
      </div>
      {couponError && (
        <p className="text-sm text-red-600 mt-1">{couponError}</p>
      )}
    </div>

    <p className="text-xl font-bold text-emerald-600">
      Final Total: ${totalRental.toFixed(2)}
    </p>

    <p className="text-sm text-gray-600">
      Clicking "Book" will confirm your booking and send a confirmation email.
    </p>
  </div>
)}








        <div className="flex justify-between mt-8">
<button
  onClick={() => setStep((prev) => Math.max(0, prev - 1))}
  disabled={step === 0}
  className="px-4 py-2 rounded hover:opacity-80 disabled:opacity-50"
  style={{
    backgroundColor: step === 0 ? "#E5E7EB" : "#E5E7EB",  // fixed light gray
    color: "#1F2937",                                     // fixed dark text
  }}
>
  Back
</button>

<button
  onClick={handleNext}
  disabled={loading}
  className="px-4 py-2 rounded hover:opacity-80 flex items-center justify-center gap-2"
  style={{
    backgroundColor: "#F97316",  // fixed orange
    color: "#1F2937",            // fixed dark text
  }}
>
  {loading ? (
    <svg
      className="animate-spin h-4 w-4 text-black"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  ) : (
    <span>{step < 3 ? "Next" : "Book"}</span>
  )}
</button>


        </div>
      </div>
    </div>
  );
};

export default BookingModal;
