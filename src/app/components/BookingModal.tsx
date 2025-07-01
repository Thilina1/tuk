"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Image from "next/image";



type Extras = {
  [key: string]: number;
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

  const extrasList = [
    { name: "Local License", icon: "/icons/License.png" },
    { name: "Full-Time Driver", icon: "/icons/Driver.png" },
    { name: "Surf-Board Rack", icon: "/icons/surfboard.png" },
    { name: "Bluetooth Speakers", icon: "/icons/speaker.png" },
    { name: "Cooler Box", icon: "/icons/cooler.png" },
    { name: "Baby Seat", icon: "/icons/babyseat.png" },
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
  const extrasTotal = Object.values(formValues.extras).reduce(
    (sum, qty) => sum + qty * 2,
    0
  );

  const totalRental =
  rentalDays * formValues.tukCount * perDayCharge +
  formValues.licenseCount * licenseCharge +
  extrasTotal +
  (formValues.pickupPrice || 0) +
  (formValues.returnPrice || 0) +
  ((includeTrainTransfer && formValues.trainTransfer?.price) || 0);


  const handleNext = async () => {
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
      await updateDoc(docRef, {
        RentalPrice: totalRental,
        isBooked: true,
      });
    
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
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 text-black shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">
              {["Rental Details", "Extras", "License Details", "Payment"][step]}
            </h2>
            <span className="text-sm text-gray-500">{step + 1} / 4</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold">Pickup Time</label>
                  <select
  value={formValues.pickupTime}
  onChange={(e) =>
    setFormValues({ ...formValues, pickupTime: e.target.value })
  }
  className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold">Return Time</label>
                  <select
  value={formValues.returnTime}
  onChange={(e) =>
    setFormValues({ ...formValues, returnTime: e.target.value })
  }
  className="w-full border border-gray-300 rounded px-3 py-2"
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
      className="w-full border border-gray-300 rounded px-3 py-2"
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
        <option key={loc.name} value={loc.name}>
          {loc.name} ({loc.price === 0 ? "Free" : `$${loc.price}`})
        </option>
      ))}
    </select>
  </div>

  <div className="flex-1">
    <label className="text-sm font-semibold">Return Location</label>
    <select
      className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {extrasList.map((extra) => (
    <div
      key={extra.name}
      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
    >
      <div className="flex items-center gap-2">
      <Image
  src={extra.icon}
  alt={extra.name}
  width={20}
  height={20}
  className="w-5 h-5 object-contain"
/>

        <span className="text-sm">{extra.name}</span>
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
        className="border border-gray-300 rounded px-2 py-1 text-sm"
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




<div className="border border-gray-200 p-4 rounded space-y-2 bg-gray-50">
  <label className="flex items-center gap-2 text-sm font-semibold">
    <input
      type="checkbox"
      checked={includeTrainTransfer}
      onChange={(e) => setIncludeTrainTransfer(e.target.checked)}
    />
    Add Train Transfer
  </label>

  {includeTrainTransfer && (
    <>
      <label className="text-sm">Select Train Transfer</label>
      <select
        className="w-full border border-gray-300 rounded px-3 py-2"
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
        <div className="text-sm text-gray-700 ml-1 mt-1">
          <p><strong>From:</strong> {formValues.trainTransfer.from}</p>
          <p><strong>To:</strong> {formValues.trainTransfer.to}</p>
          <p><strong>Pickup Time:</strong> {formValues.trainTransfer.pickupTime}</p>
          <p><strong>Price:</strong> ${formValues.trainTransfer.price}</p>
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
          className="w-full border border-gray-300 rounded px-3 py-2"
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
          className="w-full border border-gray-300 rounded px-3 py-2"
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
    className="w-full border border-gray-300 rounded px-3 py-2"
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
          className="w-full border border-gray-300 rounded px-3 py-2"
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
          className="w-full border border-gray-300 rounded px-3 py-2"
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
          className="w-full border border-gray-300 rounded px-3 py-2"
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
        className="w-full border border-gray-300 rounded px-3 py-2"
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
            <h3 className="text-lg font-semibold">Payment (Coming Soon)</h3>
            <p>This step is reserved for payment or summary confirmation.</p>
            <p>Total Rentals: ${totalRental}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            {step < 3 ? "Next" : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
