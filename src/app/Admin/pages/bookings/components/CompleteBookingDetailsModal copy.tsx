// "use client";

// import { useEffect, useState } from "react";
// import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import { BookingData } from "../BookingsPage";
// import Select from "react-select";




// interface Props {
//   booking: BookingData;
//   onClose: () => void;
// }

// const extrasList = [
//   "Local License",
//   "Full-Time Driver",
//   "Surf-Board Rack",
//   "Bluetooth Speakers",
//   "Cooler Box",
//   "Baby Seat",
// ];

// export default function EditBookingModal({ booking, onClose }: Props) {
//   const [formValues, setFormValues] = useState({ ...booking });
//   const [enableRecalculation, setEnableRecalculation] = useState(false);

//   const [loading, setLoading] = useState(false);
  

//   const handleChange = (key: string, value: any) => {
//     setFormValues((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleExtrasChange = (key: string, value: number) => {
//     setFormValues((prev) => ({
//       ...prev,
//       extras: { ...prev.extras, [key]: value },
//     }));
//   };

//   const calculateTotal = () => {
//     const rentalDays =
//       new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
//         ? Math.ceil(
//             (new Date(formValues.returnDate).getTime() -
//               new Date(formValues.pickupDate).getTime()) /
//               (1000 * 60 * 60 * 24)
//           ) + 1
//         : 1;

//     const perDayCharge = 13;
//     const licenseCharge = 35;
//     const extrasTotal = Object.values(formValues.extras || {}).reduce(
//       (sum, qty) => sum + qty * 2,
//       0
//     );

//     return (
//       rentalDays * formValues.tukCount * perDayCharge +
//       formValues.licenseCount * licenseCharge +
//       extrasTotal
//     );
//   };

//   const [activeTuks, setActiveTuks] = useState<{ label: string; value: string }[]>([]);


//   useEffect(() => {
//     const fetchActiveTuks = async () => {
//       const snapshot = await getDocs(collection(db, "tuktuks"));
//       const activeList = snapshot.docs
//         .map((doc) => ({ id: doc.id, ...doc.data() }))
//         .filter((doc: any) => doc.active)
//         .map((doc: any) => ({
//           label: `${doc.vehicleNumber} (${doc.district || 'Unknown'})`,
//           value: doc.vehicleNumber,
//         }));
//       setActiveTuks(activeList);
//     };
//     fetchActiveTuks();
//   }, []);
  
  

//   const [activePersons, setActivePersons] = useState<{ label: string; value: string }[]>([]);

// useEffect(() => {
//   const fetchPersons = async () => {
//     const snapshot = await getDocs(collection(db, "persons"));
//     const personsList = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         value: data.name,
//         label: `${data.name} (${data.district})`,
//       };
//     });
//     setActivePersons(personsList);
//   };

//   fetchPersons();
// }, []);


//   const handleAssign = async () => {
//     const missingTuks = !formValues.assignedTuks || formValues.assignedTuks.length !== formValues.tukCount || formValues.assignedTuks.some((tuk) => tuk.trim() === "");
//     const missingPerson = !(formValues as any).assignedPerson || (formValues as any).assignedPerson.trim() === "";
  
//     if (missingTuks || missingPerson) {
//       alert("Please fill all required fields: Assigned Tuk Tuks and Assigned Person.");
//       return;
//     }
  
//     setLoading(true); // ⏳ Start loading
  
//     try {
//       const docRef = doc(db, "bookings", booking.id);
  
//       const updatedData: Partial<BookingData> = {
//         ...formValues,
//         status: "assigned",
//       };
  
//       if (enableRecalculation) {
//         updatedData.RentalPrice = calculateTotal().toString();
//       }
  
//       await updateDoc(docRef, updatedData);
  
//       await fetch('/api/send-email/assignEmail', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formValues.name,
//           email: formValues.email,
//           whatsapp: formValues.whatsapp,
//           pickup: formValues.pickup,
//           pickupDate: formValues.pickupDate,
//           pickupTime: formValues.pickupTime,
//           returnLoc: formValues.returnLoc,
//           returnDate: formValues.returnDate,
//           returnTime: formValues.returnTime,
//           tukCount: formValues.tukCount,
//           licenseCount: formValues.licenseCount,
//           extras: formValues.extras,
//           assignedTuks: formValues.assignedTuks,
//           //assignedPerson: formValues.assignedPerson,
//           rentalPrice: enableRecalculation ? calculateTotal() : booking.RentalPrice,
          
       
//         }),
//       });
  
//       console.log("✅ Email sent after assignment");
//       onClose();
//       window.location.reload();

//     } catch (err) {
//       console.error("❌ Failed to assign or send email:", err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false); // ✅ Stop loading
//     }
//   };
  
  

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//     <div className="bg-white max-h-[90vh] w-full max-w-3xl rounded shadow flex flex-col overflow-hidden">
//       {/* Scrollable content */}
//       <div className="overflow-y-auto p-6">
//         <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label className="block text-xs">Name</label>
//             <input
//               type="text"
//               value={formValues.name}
//               onChange={(e) => handleChange("name", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Email</label>
//             <input
//               type="email"
//               value={formValues.email}
//               onChange={(e) => handleChange("email", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">WhatsApp</label>
//             <input
//               type="text"
//               value={formValues.whatsapp}
//               onChange={(e) => handleChange("whatsapp", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Pickup</label>
//             <input
//               type="text"
//               value={formValues.pickup}
//               onChange={(e) => handleChange("pickup", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Pickup Date</label>
//             <input
//               type="date"
//               value={formValues.pickupDate}
//               onChange={(e) => handleChange("pickupDate", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Pickup Time</label>
//             <input
//               type="time"
//               value={formValues.pickupTime}
//               onChange={(e) => handleChange("pickupTime", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Return</label>
//             <input
//               type="text"
//               value={formValues.returnLoc}
//               onChange={(e) => handleChange("returnLoc", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Return Date</label>
//             <input
//               type="date"
//               value={formValues.returnDate}
//               onChange={(e) => handleChange("returnDate", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Return Time</label>
//             <input
//               type="time"
//               value={formValues.returnTime}
//               onChange={(e) => handleChange("returnTime", e.target.value)}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">Tuk Count</label>
//             <input
//               type="number"
//               min={1}
//               value={formValues.tukCount}
//               onChange={(e) => handleChange("tukCount", parseInt(e.target.value))}
//               className="border p-1 w-full"
//             />
//           </div>

//           <div>
//             <label className="block text-xs">License Count</label>
//             <input
//               type="number"
//               min={1}
//               value={formValues.licenseCount}
//               onChange={(e) => handleChange("licenseCount", parseInt(e.target.value))}
//               className="border p-1 w-full"
//             />
//           </div>




//           <div className="md:col-span-2">
//       <label className="block text-xs text-gray-500">Train Transfer</label>
//       {booking.trainTransfer ? (
//         <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border">
//           <div><strong>From:</strong> {booking.trainTransfer.from}</div>
//           <div><strong>To:</strong> {booking.trainTransfer.to}</div>
//           <div><strong>Pickup Time:</strong> {booking.trainTransfer.pickupTime}</div>
//           <div><strong>Price:</strong> ${booking.trainTransfer.price}</div>
//         </div>
//       ) : (
//         <div className="text-gray-500">No train transfer details</div>
//       )}
//     </div>




//           <div className="md:col-span-2">
//             <label className="block text-xs">Extras</label>
//             <div className="grid grid-cols-2 gap-2">
//               {extrasList.map((extra) => (
//                 <div key={extra} className="flex justify-between">
//                   <span>{extra}</span>
//                   <select
//                     value={formValues.extras?.[extra] || 0}
//                     onChange={(e) => handleExtrasChange(extra, parseInt(e.target.value))}
//                     className="border px-2"
//                   >
//                     {Array.from({ length: 11 }, (_, i) => (
//                       <option key={i} value={i}>
//                         {i}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="md:col-span-2">
//   <label className="block text-xs">Assigned Tuk Tuks *</label>
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
  


// {Array.from({ length: formValues.tukCount || 1 }, (_, index) => (
//   <div key={index}>
//     <label className="block text-xs">Tuk Tuk {index + 1}</label>
//     <Select
//       options={activeTuks}
//       value={
//         formValues.assignedTuks?.[index]
//           ? { value: formValues.assignedTuks[index], label: formValues.assignedTuks[index] }
//           : null
//       }
//       onChange={(selectedOption) => {
//         const updated = [...(formValues.assignedTuks || [])];
//         updated[index] = selectedOption?.value || "";
//         handleChange("assignedTuks", updated);
//       }}
//       isClearable
//       placeholder="Search or select tuk tuk"
//     />
//   </div>
// ))}



//   </div>
// </div>


// <div>
//   <label className="block text-xs text-red-600 font-medium">
//     Assigned Person *
//   </label>

//   <Select
//     options={activePersons}
//     value={
//       (formValues as any).assignedPerson
//         ? activePersons.find((person) => person.value === (formValues as any).assignedPerson)
//         : null
//     }
//     onChange={(selectedOption) => {
//       handleChange("assignedPerson", selectedOption?.value || "");
//     }}
//     isClearable
//     placeholder="Search or select a person"
//   />
// </div>



//         </div>

//         <div className="flex items-center gap-2 mt-4">
//           <input
//             type="checkbox"
//             checked={enableRecalculation}
//             onChange={() => setEnableRecalculation((prev) => !prev)}
//           />
//           <label className="text-sm">Recalculate Total Cost</label>
//           <div>
//             {enableRecalculation ? (
//               <strong>Updated Price: ${calculateTotal().toFixed(2)}</strong>
//               ) : (
//               <strong>Original Price: ${booking.RentalPrice || "N/A"}</strong>
//             )}
//           </div>


//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded text-sm"
//           >
//             Cancel
//           </button>
//           <button
//   onClick={handleAssign}
//   disabled={loading}
//   className={`px-4 py-2 rounded text-sm text-white ${loading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
// >
//   {loading ? (
//     <div className="flex items-center gap-2">
//       <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//       Assigning...
//     </div>
//   ) : (
//     "Assign"
//   )}
// </button>

//         </div>
//       </div>
//     </div>
//     </div>
//   );
// }
