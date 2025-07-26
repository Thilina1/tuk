"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import BookingModal from "../components/BookingModal";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import "react-phone-input-2/lib/style.css";
import Script from 'next/script';


import dynamic from 'next/dynamic';
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });
import { FaWhatsapp } from "react-icons/fa";


// Define a proper type for Location
type Location = {
  name: string;
  price: number;
  status: string;
};

type Extras = {
  [key: string]: number;
};

type BookingFormValues = {
  name: string;
  email: string;
  whatsapp: string;
  pickup: string;
  pickupPrice?: number;
  returnLoc: string;
  returnPrice?: number;
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
  isBooked: boolean;
  hasIDP: string;
};

export default function HeroBookingSection() {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [docId, setDocId] = useState<string | null>(null);
  const [dateError, setDateError] = useState("");
  const [locationOptions, setLocationOptions] = useState<{ name: string; price: number }[]>([]);








  
useEffect(() => {
  if (typeof window !== "undefined" && window.payhere) {
    window.payhere.onCompleted = function onCompleted(orderId) {
      console.log("✅ Payment completed. OrderID:", orderId);
      // e.g., update Firestore, show success, close modal
    };

    window.payhere.onDismissed = function onDismissed() {
      console.log("❌ Payment dismissed by user");
    };

    window.payhere.onError = function onError(error) {
      console.error("🚨 PayHere error", error);
    };
  }
}, []);


const handlePayNow = () => {
  const payment = {
    sandbox: true,
    merchant_id: "1231320",
    return_url: "https://yourdomain.com/return",
    cancel_url: "https://yourdomain.com/cancel",
    notify_url: "https://yourdomain.com/api/payhere-notify",

    order_id: "ORDER1001",
    items: "TukTuk Rental",
    amount: "10.00",
    currency: "USD",

    first_name: "Thilina",
    last_name: "Weerasinghe",
    email: "thilina@example.com",
    phone: "0768408835",
    address: "1, Matale Road",
    city: "Kandy",
    country: "Sri Lanka",
  };

  // Launch payment popup
  window.payhere.startPayment(payment);
};













  const extrasList = [
    "Train Transfer",
    "Local License",
    "Full-Time Driver",
    "Surf-Board Rack",
    "Bluetooth Speakers",
    "Cooler Box",
    "Baby Seat",
  ];

  const [formValues, setFormValues] = useState<BookingFormValues>({
    name: "",
    email: "",
    whatsapp: "",
    pickup: "",
    pickupPrice: 0,
    returnLoc: "",
    returnPrice: 0,
    pickupDate: "",
    pickupTime: "08:00",
    returnDate: "",
    returnTime: "08:00",
    tukCount: 1,
    licenseCount: 1,
    extras: extrasList.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Extras),
    licenseName: "",
    licenseAddress: "",
    licenseCountry: "",
    postalCode: "",
    licenseNumber: "",
    passportNumber: "",
    uploadedDocs: [],
    isBooked: false,
    hasIDP: ""
  });

  const inputClass =
  "w-full bg-white/20 border border-white/30 p-2 rounded-md text-sm placeholder-white/60 text-white";



  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "locations"));
      const data: Location[] = snapshot.docs
        .map((doc) => doc.data() as Location)
        .filter((loc) => loc.status !== "inactive");
  
      setLocationOptions(data);
    };
  
    fetchLocations();
  }, []);

  const [loading, setLoading] = useState(false);


  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const pickupDateTime = new Date(`${formValues.pickupDate}T${formValues.pickupTime}`);
      const returnDateTime = new Date(`${formValues.returnDate}T${formValues.returnTime}`);
  
      if (pickupDateTime >= returnDateTime) {
        setDateError("Return date & time must be after pickup date & time.");
        return;
      }
      setDateError("");
      setLoading(true); // START loading
  
      try {
        const docRef = await addDoc(collection(db, "bookings"), {
          ...formValues,
          createdAt: new Date(),
        });
  
        setDocId(docRef.id);
        setShowModal(true);
        setStep(0);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } catch (err) {
        console.error("Error saving booking:", err);
      } finally {
        setLoading(false); // STOP loading
      }
    },
    [formValues]
  );
  

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);


  const [, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

  const timeOptions = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 6;
    const value = hour.toString().padStart(2, "0") + ":00";
    return <option key={value} value={value}>{value}
      <style jsx>{`
    select option {
      color: black !important;
      background-color: white !important;
    }
  `}</style>
    </option>;
    
  });

  return (
    <>
    <Script src="https://www.payhere.lk/lib/payhere.js" strategy="afterInteractive" />

    <section
      ref={sectionRef}
      className="relative w-full text-white overflow-hidden min-h-screen bg-fixed bg-cover bg-center"
    >
          <style jsx global>{`
      select option {
        color: black !important;
        background-color: white !important;
      }
    `}</style>
      
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero/hero2.jpg"
          alt="Hero background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
          quality={60}
        />
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-14 md:pt-6 flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between min-h-[90vh] md:min-h-[85vh]">
      <div
  className="md:w-1/2 text-center md:text-left space-y-4"
  style={{
    colorScheme: "light",          // Force light theme interpretation
    color: "#ffffff",              // Main text color
  }}
>
  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-xl" style={{ color: "#ffffff" }}>
    Rent <span style={{ color: "#fbbf24" }}>Tuk Tuk</span> with unlimited mileage!
  </h1>
  <p className="text-lg font-medium" style={{ color: "#facc15" }}>
    From just $8 per day.
  </p>
  <p className="text-sm sm:text-base" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
    Book instantly with peace of mind. 24/7 roadside support and easy pickup. <br />

    <a
  href="https://wa.me/94770063780"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#fbbf24",
    fontWeight: 500,
    fontSize: "1.6rem",
    marginTop: "10px",
    textDecoration: "none", // optional: remove underline
  }}
>
  Chat with us: +94 77 006 3780
  <FaWhatsapp color="#25D366" size={35} />

</a>

  </p>
</div>
<button
  onClick={handlePayNow}
  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
>
  Pay $10 via PayHere 💳
</button>

        <div className="w-full md:w-[350px] bg-white/10 text-white rounded-xl p-4 shadow-md mt-6 md:mt-0 mb-8">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className={inputClass}
                value={formValues.name}
                onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className={inputClass}
                value={formValues.email}
                onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
  {/* <label className="text-xs font-medium">WhatsApp Number:</label>
  {isMounted && (
    <PhoneInput
      country={"lk"}
      value={formValues.whatsapp}
      onChange={(phone) =>
        setFormValues((prev) => ({ ...prev, whatsapp: phone }))
      }
      inputClass="w-full bg-white/20 border border-white/30 p-2 rounded-md text-sm text-white"
      buttonStyle={{ backgroundColor: "transparent", borderRight: "1px solid #ccc" }}
    />
  )} */}
              <div>
              <label className="text-xs font-medium">WhatsApp Number</label>
              <PhoneInput
                country={"lk"}
                value={formValues.whatsapp}
                onChange={(phone) => setFormValues((prev) => ({ ...prev, whatsapp: phone }))}
                inputClass="!w-full !bg-white/20 !border-none !pl-16 !pr-2 !py-2 !rounded-md !text-sm !text-white placeholder-white/60"
                containerClass="!w-full !relative"
                buttonClass="!bg-white/10 !border-r !border-white/30 !rounded-l-md !px-2"
                dropdownStyle={{ color: "#000" }}
                enableSearch
                placeholder="+94 XXX XX XXXX XXXX XXXX"
                inputProps={{
                  required: true, // ✅ Correct way
                 // autoFocus: true, // optional
                }}
              />
            </div>

            </div>

            <div>
              <label className="text-xs font-medium">Pick-Up Location</label>
              <select
  value={formValues.pickup}
  onChange={(e) => {
    const selected = locationOptions.find((loc) => loc.name === e.target.value);
    setFormValues((prev) => ({
      ...prev,
      pickup: selected?.name || "",
      pickupPrice: selected?.price || 0,
    }));
  }}
  required
  className="w-full bg-white/20 border border-white/30 p-2 rounded-md text-sm placeholder-white/60"
  style={{ color: 'white' }} // selected value
>
  <option value="">Select Pick-Up Location</option>
  {locationOptions.map((loc) => (
    <option key={loc.name} value={loc.name}>
      {loc.name} ({loc.price === 0 ? "Free" : `$${loc.price}`})
    </option>
  ))}


</select>

            </div>
            
            <label className="text-xs font-medium">Pick-Up Date and Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                className={`${inputClass} flex-1`}
                value={formValues.pickupDate}
                onChange={(e) => setFormValues((prev) => ({ ...prev, pickupDate: e.target.value }))}
                required
              />
              <select
                className={`${inputClass} flex-1`}
                value={formValues.pickupTime}
                onChange={(e) => setFormValues((prev) => ({ ...prev, pickupTime: e.target.value }))}
                required
              >
                {timeOptions}

              </select>
            </div>

            <div>
              <label className="text-xs font-medium">Return Location</label>
              <select
                className={inputClass}
                value={formValues.returnLoc}
                onChange={(e) => {
                  const selected = locationOptions.find((loc) => loc.name === e.target.value);
                  setFormValues((prev) => ({
                    ...prev,
                    returnLoc: selected?.name || "",
                    returnPrice: selected?.price || 0,
                  }));
                }}
                required
              >
                <option value="" style={{ color: 'black' }}>Select Return Location</option>
                {locationOptions.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.price === 0 ? "Free" : `$${loc.price}`})
                  </option>
                ))}
                  {/* Scoped CSS */}

              </select>
            </div>
            <label className="text-xs font-medium">Return Date and Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                className={`${inputClass} flex-1`}
                value={formValues.returnDate}
                onChange={(e) => setFormValues((prev) => ({ ...prev, returnDate: e.target.value }))}
                required
              />
              <select
                className={`${inputClass} flex-1`}
                value={formValues.returnTime}
                onChange={(e) => setFormValues((prev) => ({ ...prev, returnTime: e.target.value }))}
                required
              >
                {timeOptions}
              </select>
            </div>

            {dateError && (
              <p className="text-red-400 text-xs font-medium text-center">{dateError}</p>
            )}

<button
  type="submit"
  disabled={loading}
  className={`w-full font-semibold text-sm py-2 rounded-lg shadow transition-colors duration-300 ${
    loading
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-90"
  }`}
  style={{
    backgroundImage: !loading ? "linear-gradient(to right, #fbbf24, #f97316)" : undefined,
    color: '#fff',
  }}
>
  {loading ? (
    <div className="flex items-center justify-center gap-2">
      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
      Booking...
    </div>
  ) : (
    "Book Your TukTuk"
  )}
</button>





          </form>

          

          {submitted && (
            <p className="mt-2 text-green-300 text-xs text-center font-medium">
              Booking submitted successfully!
            </p>
          )}
          
        </div>


        
      </div>

      

      {showModal && docId && (
        <BookingModal
          formValues={formValues}
          setFormValues={setFormValues}
          step={step}
          setStep={setStep}
          closeModal={() => setShowModal(false)}
          docId={docId}
          locationOptions={locationOptions}
        />
      )}
    </section>
    </>
  );
}
// function setLoading(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }

