"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import BookingModal from "../components/BookingModal";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import "react-phone-input-2/lib/style.css";
import { FaInstagram, FaFacebookF } from "react-icons/fa";


import dynamic from 'next/dynamic';
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });
import { FaWhatsapp } from "react-icons/fa";

type HeroProps = {
  onModalChange?: (open: boolean) => void;
};
 
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
  idpFiles: File[];
  passportFiles: File[];
  selfieWithLicense: File[];
  isBooked: boolean;
  hasIDP: string;
};

export default function HeroBookingSection({ onModalChange }: HeroProps) {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [docId, setDocId] = useState<string | null>(null);
  const [dateError, setDateError] = useState("");
  const [locationOptions, setLocationOptions] = useState<{ name: string; price: number }[]>([]);

  const [showUnavailablePopup, setShowUnavailablePopup] = useState(false);

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
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
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
    idpFiles: [],
    passportFiles: [],
    selfieWithLicense: [],
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
        .filter((loc) => loc.status !== "inactive")
        .sort((a, b) =>
          a.name.trim().localeCompare(b.name.trim(), undefined, {
            sensitivity: "base",
            numeric: true,
          })
        ); // ← alphabetical (case-insensitive)
  
      setLocationOptions(data);
    };
  
    fetchLocations();
  }, []);
  const [loading, setLoading] = useState(false);


    // whenever either overlay is shown/hidden, notify parent
    useEffect(() => {
      onModalChange?.(showModal || showUnavailablePopup);
    }, [showModal, showUnavailablePopup, onModalChange]);

// 👇 keep your sentinel
const SENTINEL_UNTIL = new Date("3000-01-01T00:00:00Z");

const isSentinel = (d: Date | null) =>
  !!d && d.getTime() === SENTINEL_UNTIL.getTime();

const formatUntil = (d: Date | null) =>
  d
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d)
    : "";


    useEffect(() => {
      const fetchDeactivateDate = async () => {
        try {
          const ref = doc(db, "vehicleStatus", "regularTukTuk");
          const snap = await getDoc(ref);
    
          if (!snap.exists()) {
            setUnavailableDate(SENTINEL_UNTIL);
            return;
          }
    
          const data = snap.data() as { deactivateUntil?: Timestamp | null | string };
    
          // Firestore Timestamp → Date
          if (data?.deactivateUntil instanceof Timestamp) {
            setUnavailableDate(data.deactivateUntil.toDate());
            return;
          }
    
          // ISO string in DB → Date
          if (typeof data?.deactivateUntil === "string" && data.deactivateUntil.trim()) {
            setUnavailableDate(new Date(data.deactivateUntil));
            return;
          }
    
          // null / missing → sentinel
          setUnavailableDate(SENTINEL_UNTIL);
        } catch (e) {
          console.error("Failed to fetch vehicleStatus:", e);
          setUnavailableDate(SENTINEL_UNTIL);
        }
      };
    
      fetchDeactivateDate();
    }, []);
  
  const [unavailableDate, setUnavailableDate] = useState<Date | null>(null);


  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const pickupDateTime = new Date(`${formValues.pickupDate}T${formValues.pickupTime}`);
      const returnDateTime = new Date(`${formValues.returnDate}T${formValues.returnTime}`);
  
      if (pickupDateTime >= returnDateTime) {
        setDateError("Return date & time must be after pickup date & time.");
        return;
      }
      let isDateValid = true;
      if (unavailableDate && pickupDateTime < unavailableDate) {
        setShowUnavailablePopup(true);
        isDateValid = false;
      }
      setDateError("");
      setLoading(true); // START loading
  
      try {
        // Ensure all form values, including file arrays, are saved
        const bookingData = {
          ...formValues,
          idpFiles: formValues.idpFiles.map(file => file.name), // Save file names instead of File objects
          passportFiles: formValues.passportFiles.map(file => file.name),
          selfieWithLicense: formValues.selfieWithLicense.map(file => file.name),
          createdAt: new Date(),
        };
  
        const docRef = await addDoc(collection(db, "bookings"), bookingData);
  
        setDocId(docRef.id);
        if (isDateValid) {
          setShowModal(true);
          setStep(0);
        }
        setSubmitted(true);
      } catch (err) {
        console.error("Error saving booking:", err);
      } finally {
        setLoading(false); // STOP loading
      }
    },
    [formValues, unavailableDate]
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

const timeOptions = Array.from({ length: 8 }, (_, i) => {
  const hour = i + 10; // 8 to 17
  const value = hour.toString().padStart(2, "0") + ":00";
  return (
    <option key={value} value={value}>
      {value}
    </option>
  );
});


  return (
    <>
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
          src="/hero/header1 (3).jpeg"
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
  style={{
    position: "relative",
    zIndex: 10,
    textAlign: "center", // mobile default
    maxWidth: "768px",
    margin: "0 auto", // center mobile
  }}
  className="promo-section"
>
  {/* Heading */}
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: "800",
      lineHeight: "1.2",
      color: "#fff",
      marginBottom: "0.5rem",
      textShadow: "0 2px 6px rgba(0,0,0,0.6)",
    }}
  >
    <span style={{ color: "#FFD700" }}>Lowest Prices in Sri Lanka</span>{" "}
    Guaranteed!
  </h2>

  {/* Budget line */}
  <p
    style={{
      fontSize: "1.25rem",
      fontWeight: "500",
      color: "#FFD700",
      margin: "0.25rem 0",
    }}
  >
    💰 Rate adjustments according to your budget.
  </p>

  {/* Book Now line */}
  <p
    style={{
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#fff",
      marginTop: "0.5rem",
    }}
  >
    📲 Book now to{" "}
    <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#FFD700" }}>
      grab limited-time offers!
    </span>
  </p>

  {/* WhatsApp CTA */}
  <a
    href="https://wa.me/94770063780?text=Hi%20I%27m%20interested%20in%20your%20offers!"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "0.75rem",
      padding: "0.625rem 1.25rem",
      borderRadius: "1rem",
      backgroundColor: "#22c55e",
      color: "#fff",
      fontWeight: "700",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      textDecoration: "none",
      transition: "all 0.3s ease",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#22c55e")}
  >
    <FaWhatsapp style={{ fontSize: "1.5rem" }} /> Chat on WhatsApp for
    Personalized Quotes
  </a>

  {/* Hurry Up */}
  <p
    style={{
      fontSize: "1.125rem",
      fontWeight: "700",
      color: "#FFD700",
      marginTop: "1rem",
    }}
  >
    ⚡ Hurry up – Demand is already high this Season!
  </p>

  {/* Social Icons */}
  <div
    className="social-icons"
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "1rem",
    }}
  >
    <a
      href="https://www.instagram.com/tuktukdrive_srilanka/?hl=en"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "2.75rem",
        height: "2.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.6)",
        transition: "opacity 0.3s",
        textDecoration: "none",
      }}
    >
      <FaInstagram style={{ fontSize: "1.25rem", color: "#fff" }} />
    </a>
    <a
      href="https://web.facebook.com/tuktukdrivesl?_rdc=1&_rdr#"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "2.75rem",
        height: "2.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.6)",
        transition: "opacity 0.3s",
        textDecoration: "none",
      }}
    >
      <FaFacebookF style={{ fontSize: "1.25rem", color: "#fff" }} />
    </a>
    <a
      href="https://wa.me/94770063780"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "2.75rem",
        height: "2.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.6)",
        transition: "opacity 0.3s",
        textDecoration: "none",
      }}
    >
      <FaWhatsapp style={{ fontSize: "1.25rem", color: "#fff" }} />
    </a>
  </div>
</div>

<style>
  {`
    /* Desktop overrides */
    @media (min-width: 1024px) {
      .promo-section {
        text-align: left !important;
        margin-left: 2rem !important;
        margin-right: 0 !important;
      }
      .social-icons {
        justify-content: flex-start !important;
      }
    }
  `}
</style>



        <div className="w-full md:w-[350px] bg-white/20 text-white rounded-xl p-4 shadow-md mt-6 md:mt-0 mb-8">
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

{showUnavailablePopup && (
  <div className="fixed inset-0 bg-gray-800/80 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
      <h2 className="text-xl font-bold text-black mb-4">
        Vehicles Currently Unavailable 🚗❌
      </h2>

      <p className="mb-4 text-black">
        Oops! 😞 Vehicles are not available{" "}
        {isSentinel(unavailableDate) ? (
          <>until <strong>further notice</strong>.</>
        ) : (
          <>
            until <strong>{formatUntil(unavailableDate)}</strong>.
          </>
        )}{" "}
        Your booking request has been saved 🎉, and we’ll notify you when availability changes 📅.
      </p>

      <p className="mb-4 text-black">
        Need help? Contact us for manual checks or assistance! 🤝
      </p>

      <a
        href="https://wa.me/94770063780"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 mb-4 rounded-lg flex items-center justify-center gap-2 font-semibold"
        style={{ background: "linear-gradient(to right, #42c90c, #225c0b)" }}
      >
        <FaWhatsapp className="mr-2" /> Chat on WhatsApp (+94 77 006 3780) 💬
      </a>

      <button
        className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold"
        style={{ background: "linear-gradient(to right, #fbbf24, #f97316)" }}
        onClick={() => setShowUnavailablePopup(false)}
      >
        Close 🙅‍♂️
      </button>
    </div>
  </div>
)}


    </section>
    </>
  );
}

