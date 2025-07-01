// "use client";

// import React from "react";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../../config/firebase";

// type Extras = {
//   [key: string]: number;
// };

// type BookingFormValues = {
//   name: string;
//   email: string;
//   whatsapp: string;
//   pickup: string;
//   returnLoc: string;
//   pickupDate: string;
//   pickupTime: string;
//   returnDate: string;
//   returnTime: string;
//   tukCount: number;
//   licenseCount: number;
//   extras: Extras;
//   licenseName: string;
//   licenseAddress: string;
//   licenseCountry: string;
//   postalCode: string;
//   licenseNumber: string;
//   passportNumber: string;
//   uploadedDocs: File[];
// };

// type Props = {
//   formValues: BookingFormValues;
//   setFormValues: (values: BookingFormValues) => void;
//   step: number;
//   setStep: React.Dispatch<React.SetStateAction<number>>;
//   closeModal: () => void;
//   docId: string;
// };

// const BookingModal = ({
//   formValues,
//   setFormValues,
//   step,
//   setStep,
//   closeModal,
//   docId,
// }: Props) => {
//   const extrasList = [
//     { name: "Train Transfer", icon: "/icons/train.png" },
//     { name: "Local License", icon: "/icons/License.png" },
//     { name: "Full-Time Driver", icon: "/icons/Driver.png" },
//     { name: "Surf-Board Rack", icon: "/icons/surfboard.png" },
//     { name: "Bluetooth Speakers", icon: "/icons/speaker.png" },
//     { name: "Cooler Box", icon: "/icons/cooler.png" },
//     { name: "Baby Seat", icon: "/icons/babyseat.png" },
//   ];

//   const rentalDays =
//     new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
//       ? Math.ceil(
//           (new Date(formValues.returnDate).getTime() -
//             new Date(formValues.pickupDate).getTime()) /
//             (1000 * 60 * 60 * 24)
//         )
//       : 1;

//   const perDayCharge = 13;
//   const licenseCharge = 35;
//   const extrasTotal = Object.values(formValues.extras).reduce(
//     (sum, qty) => sum + qty * 2,
//     0
//   );

//   const totalRental =
//     rentalDays * formValues.tukCount * perDayCharge +
//     formValues.licenseCount * licenseCharge +
//     extrasTotal;

//   const handleNext = async () => {
//     const docRef = doc(db, "bookings", docId);

//     if (step === 0) {
//       const required = ["name", "email", "whatsapp", "pickupDate", "returnDate"];
//       const hasEmpty = required.some((f) => !formValues[f as keyof BookingFormValues]);
//       if (hasEmpty) {
//         alert("Please fill in all required fields.");
//         return;
//       }

//       await updateDoc(docRef, {
//         pickupDate: formValues.pickupDate,
//         returnDate: formValues.returnDate,
//         pickupTime: formValues.pickupTime,
//         returnTime: formValues.returnTime,
//         tukCount: formValues.tukCount,
//         licenseCount: formValues.licenseCount,
//         name: formValues.name,
//         email: formValues.email,
//         whatsapp: formValues.whatsapp,
//       });
//     }

//     if (step === 1) {
//       await updateDoc(docRef, {
//         extras: formValues.extras,
//       });
//     }

//     if (step === 2) {
//       await updateDoc(docRef, {
//         licenseName: formValues.licenseName,
//         licenseAddress: formValues.licenseAddress,
//         licenseCountry: formValues.licenseCountry,
//         postalCode: formValues.postalCode,
//         licenseNumber: formValues.licenseNumber,
//         passportNumber: formValues.passportNumber,
//         uploadedDocs: formValues.uploadedDocs.map((f) => f.name),
//       });
//     }

//     if (step < 3) setStep((prev) => prev + 1);
//     else closeModal();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4">
//       <div className="relative bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 text-black shadow-2xl">
//         <button
//           onClick={closeModal}
//           className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
//           aria-label="Close"
//         >
//           ×
//         </button>

//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-bold text-gray-800">
//               {["Rental Details", "Extras", "License Details", "Payment"][step]}
//             </h2>
//             <span className="text-sm text-gray-500">{step + 1} / 4</span>
//           </div>
//           <div className="w-full bg-gray-200 h-2 rounded-full">
//             <div
//               className="bg-orange-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${((step + 1) / 4) * 100}%` }}
//             />
//           </div>
//         </div>

//         {step === 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-3">
//               {[
//                 { label: "Full Name", key: "name", type: "text" },
//                 { label: "Email", key: "email", type: "email" },
//                 { label: "WhatsApp", key: "whatsapp", type: "tel" },
//               ].map(({ label, key, type }) => (
//                 <div key={key}>
//                   <label className="text-sm font-semibold">{label}</label>
//                   <input
//                     type={type}
//                     value={formValues[key as keyof BookingFormValues] as string}
//                     onChange={(e) =>
//                       setFormValues({ ...formValues, [key]: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   />
//                 </div>
//               ))}

//               <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="text-sm font-semibold">Pickup Date</label>
//                   <input
//                     type="date"
//                     value={formValues.pickupDate}
//                     onChange={(e) =>
//                       setFormValues({ ...formValues, pickupDate: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-sm font-semibold">Pickup Time</label>
//                   <select
//                     value={formValues.pickupTime}
//                     onChange={(e) =>
//                       setFormValues({ ...formValues, pickupTime: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   >
//                     <option>Morning</option>
//                     <option>Noon</option>
//                     <option>Evening</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-2">
//                 <div className="flex-1">
//                   <label className="text-sm font-semibold">Return Date</label>
//                   <input
//                     type="date"
//                     value={formValues.returnDate}
//                     onChange={(e) =>
//                       setFormValues({ ...formValues, returnDate: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-sm font-semibold">Return Time</label>
//                   <select
//                     value={formValues.returnTime}
//                     onChange={(e) =>
//                       setFormValues({ ...formValues, returnTime: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   >
//                     <option>Morning</option>
//                     <option>Noon</option>
//                     <option>Evening</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <label className="text-sm font-semibold">Tuk Tuks</label>
//                   <select
//                     value={formValues.tukCount}
//                     onChange={(e) =>
//                       setFormValues({
//                         ...formValues,
//                         tukCount: parseInt(e.target.value),
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   >
//                     {Array.from({ length: 9 }, (_, i) => i + 1).map((val) => (
//                       <option key={val}>{val}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-sm font-semibold">Licenses</label>
//                   <select
//                     value={formValues.licenseCount}
//                     onChange={(e) =>
//                       setFormValues({
//                         ...formValues,
//                         licenseCount: parseInt(e.target.value),
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   >
//                     {Array.from({ length: 9 }, (_, i) => i + 1).map((val) => (
//                       <option key={val}>{val}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
//                 <h3 className="text-base font-semibold mb-2">Total Rentals Detail</h3>
//                 <p><strong>Per Day Charge:</strong> $13</p>
//                 <p><strong>License Charge:</strong> $35 × {formValues.licenseCount}</p>
//                 <p><strong>Rental Days:</strong> {rentalDays}</p>
//                 <p><strong>Extras Total:</strong> ${extrasTotal}</p>
//                 <p className="text-xl font-bold mt-2 text-emerald-600">
//                   Total Rentals: ${totalRental}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {step === 1 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Select Your Extras</h3>
//             {extrasList.map((extra) => (
//               <div key={extra.name} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <img src={extra.icon} alt={extra.name} className="w-6 h-6" />
//                   <span>{extra.name}</span>
//                 </div>
//                 <select
//                   value={formValues.extras[extra.name] || 0}
//                   onChange={(e) =>
//                     setFormValues({
//                       ...formValues,
//                       extras: {
//                         ...formValues.extras,
//                         [extra.name]: parseInt(e.target.value),
//                       },
//                     })
//                   }
//                   className="border border-gray-300 rounded px-2 py-1"
//                 >
//                   {Array.from({ length: 11 }, (_, i) => (
//                     <option key={i} value={i}>
//                       {i}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//             <div className="mt-4 border border-gray-200 p-4 rounded">
//               <p><strong>Extras Total:</strong> ${extrasTotal}</p>
//               <p className="text-xl font-bold mt-2 text-emerald-600">
//                 Updated Total: ${totalRental}
//               </p>
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">License & Identity Details</h3>
//             {[
//               { label: "Full Name", key: "licenseName" },
//               { label: "Address", key: "licenseAddress" },
//               { label: "Country", key: "licenseCountry" },
//               { label: "Postal Code", key: "postalCode" },
//               { label: "License Number", key: "licenseNumber" },
//               { label: "Passport Number", key: "passportNumber" },
//             ].map(({ label, key }) => (
//               <div key={key}>
//                 <label className="text-sm font-semibold">{label}</label>
//                 <input
//                   type="text"
//                   value={(formValues as any)[key] || ""}
//                   onChange={(e) =>
//                     setFormValues({ ...formValues, [key]: e.target.value })
//                   }
//                   className="w-full border border-gray-300 rounded px-3 py-2"
//                 />
//               </div>
//             ))}

//             <div>
//               <label className="text-sm font-semibold">Upload Documents</label>
//               <input
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 multiple
//                 onChange={(e) =>
//                   setFormValues({
//                     ...formValues,
//                     uploadedDocs: Array.from(e.target.files || []),
//                   })
//                 }
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//               {formValues.uploadedDocs && formValues.uploadedDocs.length > 0 && (
//                 <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
//                   {formValues.uploadedDocs.map((file, index) => (
//                     <li key={index}>{file.name}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Payment (Coming Soon)</h3>
//             <p>This step is reserved for payment or summary confirmation.</p>
//             <p>Total Rentals: ${totalRental}</p>
//           </div>
//         )}

//         <div className="flex justify-between mt-8">
//           <button
//             onClick={() => setStep((prev) => Math.max(0, prev - 1))}
//             disabled={step === 0}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
//           >
//             Back
//           </button>
//           <button
//             onClick={handleNext}
//             className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//           >
//             {step < 3 ? "Next" : "Close"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingModal;
