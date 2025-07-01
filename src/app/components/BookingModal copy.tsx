
// "use client";

// import React from "react";

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
// };

// const BookingModal = ({
//   formValues,
//   setFormValues,
//   step,
//   setStep,
//   closeModal,
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
//       : 0;

//   const perDayCharge = 13;
//   const licenseCharge = 35;
//   const extrasTotal: number = Object.values(formValues.extras || {}).reduce(
//     (sum: number, qty: number) => sum + qty * 2,
//     0
//   );

//   const totalRental =
//     rentalDays * formValues.tukCount * perDayCharge +
//     formValues.licenseCount * licenseCharge +
//     extrasTotal ;

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
//                   {formValues.uploadedDocs.map((file: File, index: number) => (
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
//             <p>Total Rental: ${totalRental}</p>
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
//             onClick={() => {
//               if (step < 3) setStep((prev) => prev + 1);
//               else closeModal();
//             }}
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
