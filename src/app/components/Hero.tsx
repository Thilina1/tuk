"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import BookingModal from "../components/BookingModal";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import "react-phone-input-2/lib/style.css";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import dynamic from "next/dynamic";
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });

type HeroProps = {
  onModalChange?: (open: boolean) => void;
};

type Location = {
  name: string;
  price: number;
  status: string;
};

type Vehicle = {
  id: string;
  name: string;
  isActive: boolean;
  deactivateUntil?: Timestamp | Date | null | string;
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
  selectedVehicleId: string;
  selectedVehicleName: string;
};

// Vehicle icon mapping
const vehicleIconMap: Record<string, string> = {
  regularTukTuk: "/tukIcon/regular.png",
  eTukTuk: "/tukIcon/etuk.png",
  cambioTukTuks: "/tukIcon/cab.png",
  scooterBikes: "/tukIcon/bike.png",
};

// Custom Vehicle Dropdown Component
function VehicleDropdown({
  vehicleOptions,
  formValues,
  setFormValues,
}: {
  vehicleOptions: Vehicle[];
  formValues: BookingFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<BookingFormValues>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle vehicle selection
  const handleSelect = (vehicle: Vehicle) => {
    setFormValues((prev) => ({
      ...prev,
      selectedVehicleId: vehicle.id,
      selectedVehicleName: vehicle.name,
    }));
    setIsOpen(false);
  };

  // Get selected vehicle for display
  const selectedVehicle = vehicleOptions.find((v) => v.id === formValues.selectedVehicleId);

  // Check if a vehicle is unavailable
  const isVehicleUnavailable = (vehicle: Vehicle) => {
    if (!vehicle.deactivateUntil || vehicle.id === "regularTukTuk") return false;
    const deactivateDate =
      vehicle.deactivateUntil instanceof Timestamp
        ? vehicle.deactivateUntil.toDate()
        : typeof vehicle.deactivateUntil === "string" && vehicle.deactivateUntil.trim()
        ? new Date(vehicle.deactivateUntil)
        : null;
    return deactivateDate ? deactivateDate > new Date() : false;
  };

  return (
    <div className="relative">
      <label className="text-xs font-medium text-white">Select Vehicle Type</label>
      <div ref={dropdownRef}>
        <div
          className={`w-full bg-white/20 border border-white/30 p-2 rounded-md text-sm flex items-center justify-between cursor-pointer ${
            !formValues.selectedVehicleId ? "text-white/60" : "text-white"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="vehicle-dropdown"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsOpen(!isOpen);
            }
          }}
        >
          <div className="flex items-center gap-2">
            {selectedVehicle ? (
              <>
                <Image
                  src={vehicleIconMap[selectedVehicle.id] || "/tukicon/regular.png"}
                  alt={`${selectedVehicle.name} icon`}
                  width={25}
                  height={25}
                  className="object-contain"
                />
                <span>
                  {selectedVehicle.name}
                  {isVehicleUnavailable(selectedVehicle)}
                </span>
              </>
            ) : (
              "Select a Vehicle"
            )}
          </div>
          <svg
            className={`w-4 h-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <ul
            id="vehicle-dropdown"
            className="absolute z-10 w-full bg-white/90 backdrop-blur-md border border-white/30 rounded-md mt-1 max-h-60 overflow-auto text-sm text-gray-900"
            role="listbox"
          >
            {vehicleOptions.map((vehicle) => {
              const isUnavailable = isVehicleUnavailable(vehicle);
              return (
                <li
                  key={vehicle.id}
                  className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-orange-100/50 transition ${
                    isUnavailable ? "opacity-50" : ""
                  } ${formValues.selectedVehicleId === vehicle.id ? "bg-orange-100/70" : ""}`}
                  onClick={() => (!isUnavailable || vehicle.id === "regularTukTuk") && handleSelect(vehicle)}
                  role="option"
                  aria-selected={formValues.selectedVehicleId === vehicle.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (!isUnavailable || vehicle.id === "regularTukTuk") {
                        handleSelect(vehicle);
                      }
                    }
                  }}
                >
                  <Image
                    src={vehicleIconMap[vehicle.id] || "/tukicon/default.png"}
                    alt={`${vehicle.name} icon`}
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                  <span>
                    {vehicle.name}
                    {isUnavailable}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <input
        type="hidden"
        name="selectedVehicleId"
        value={formValues.selectedVehicleId}
        required
      />
    </div>
  );
}

export default function HeroBookingSection({ onModalChange }: HeroProps) {
  const sectionRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [docId, setDocId] = useState<string | null>(null);
  const [dateError, setDateError] = useState("");
  const [locationOptions, setLocationOptions] = useState<Location[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<Vehicle[]>([]);
  const [showUnavailablePopup, setShowUnavailablePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unavailableDate, setUnavailableDate] = useState<Date | null>(null);

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
    hasIDP: "",
    selectedVehicleId: "",
    selectedVehicleName: "",
  });

  const inputClass =
    "w-full bg-white/20 border border-white/30 p-2 rounded-md text-sm placeholder-white/60 text-white";

  const SENTINEL_UNTIL = new Date("3000-01-01T00:00:00Z");

  const isSentinel = (d: Date | null) => !!d && d.getTime() === SENTINEL_UNTIL.getTime();

  const formatUntil = (d: Date | null) =>
    d
      ? new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(d)
      : "";

  // Fetch vehicles from vehicleStatus collection
  useEffect(() => {
    const fetchVehicles = async () => {
      const snapshot = await getDocs(collection(db, "vehicleStatus"));
      const data: Vehicle[] = snapshot.docs
        .map((doc) => {
          const vehicleData = doc.data() as Omit<Vehicle, "id">;
          return { id: doc.id, ...vehicleData } as Vehicle;
        })
        .filter((vehicle) => {
          if (!vehicle.isActive) {
            return false;
          }
          if (vehicle.id === "regularTukTuk") {
            return true;
          }
          const deactivateDate =
            vehicle.deactivateUntil instanceof Timestamp
              ? vehicle.deactivateUntil.toDate()
              : typeof vehicle.deactivateUntil === "string" && vehicle.deactivateUntil.trim()
              ? new Date(vehicle.deactivateUntil)
              : null;
          return !deactivateDate || deactivateDate > new Date();
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      setVehicleOptions(data);

      if (data.length > 0 && !formValues.selectedVehicleId) {
        const defaultVehicle = data.find((v) => v.id === "regularTukTuk") || data[0];
        setFormValues((prev) => ({
          ...prev,
          selectedVehicleId: defaultVehicle.id,
          selectedVehicleName: defaultVehicle.name,
        }));
      }
    };
    fetchVehicles();
  }, [formValues.selectedVehicleId]);

  // Fetch regularTukTuk deactivateUntil for validation
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
        if (data?.deactivateUntil instanceof Timestamp) {
          setUnavailableDate(data.deactivateUntil.toDate());
          return;
        }
        if (typeof data?.deactivateUntil === "string" && data.deactivateUntil.trim()) {
          setUnavailableDate(new Date(data.deactivateUntil));
          return;
        }
        setUnavailableDate(SENTINEL_UNTIL);
      } catch (e) {
        console.error("Failed to fetch vehicleStatus for regularTukTuk:", e);
        setUnavailableDate(SENTINEL_UNTIL);
      }
    };
    fetchDeactivateDate();
  }, []);

  // Fetch locations
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
        );
      setLocationOptions(data);
    };
    fetchLocations();
  }, []);

  // Notify parent of modal changes
  useEffect(() => {
    onModalChange?.(showModal || showUnavailablePopup);
  }, [showModal, showUnavailablePopup, onModalChange]);

  // Handle form submission
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
      let selectedVehicleDeactivateUntil: Date | null = null;
      let selectedVehicleIsActive = true;

      const selectedVehicle = vehicleOptions.find((v) => v.id === formValues.selectedVehicleId);

      if (selectedVehicle) {
        selectedVehicleIsActive = selectedVehicle.isActive;
        if (selectedVehicle.deactivateUntil instanceof Timestamp) {
          selectedVehicleDeactivateUntil = selectedVehicle.deactivateUntil.toDate();
        } else if (
          typeof selectedVehicle.deactivateUntil === "string" &&
          selectedVehicle.deactivateUntil.trim()
        ) {
          selectedVehicleDeactivateUntil = new Date(selectedVehicle.deactivateUntil);
        }
      } else {
        console.error("Selected vehicle not found in options!");
        setDateError("Please select a valid vehicle.");
        setLoading(false);
        return;
      }

      if (!selectedVehicleIsActive) {
        setShowUnavailablePopup(true);
        isDateValid = false;
      }

      if (isDateValid && selectedVehicleDeactivateUntil && pickupDateTime < selectedVehicleDeactivateUntil) {
        setShowUnavailablePopup(true);
        isDateValid = false;
      }

      setDateError("");
      setLoading(true);

      try {
        const bookingData = {
          ...formValues,
          idpFiles: formValues.idpFiles.map((file) => file.name),
          passportFiles: formValues.passportFiles.map((file) => file.name),
          selfieWithLicense: formValues.selfieWithLicense.map((file) => file.name),
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
        setLoading(false);
      }
    },
    [formValues, vehicleOptions]
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
    const hour = i + 10;
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
        className="relative min-h-screen bg-fixed bg-center bg-cover bg-no-repeat text-white flex items-start justify-center px-6 sm:px-8 hero-booking-section"
        style={{ backgroundImage: "url('/hero/mobilehero.jpg')" }}
      >
        <style jsx>{`
          .hero-booking-section {
            position: relative;
            min-height: 100vh;
          }

          .content-container {
            position: relative;
            z-index: 20;
            max-width: 1280px;
            margin: 0 auto;
            padding: 1.5rem 0;
            overflow-y: auto;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }

          @media (min-width: 768px) {
            .content-container {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding-top: 1.5rem;
            }

            .hero-booking-section {
              background-image: url('/hero/webhero.jpg');
              background-attachment: scroll;
            }
          }

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

          select option {
            color: black !important;
            background-color: white !important;
          }
        `}</style>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Content */}
        <div className="content-container">
          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              maxWidth: "808px",
              margin: "0 auto",
            }}
            className="promo-section"
          >
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                lineHeight: "1.2",
                color: "#fff",
                marginBottom: "0.5rem",
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              <span style={{ color: "#FFD700" }}> Adventure Awaits: </span>{" "}
              Explore Sri Lanka in Your Own Tuk-Tuk!
            </h1>

            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                color: "#FFD700",
                margin: "0.25rem 0",
              }}
            >
              Low prices, Full insurance, 24/7 support. Book now, no sign-up!
            </p>

            <p
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#fff",
                marginTop: "0.5rem",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 215, 0, 0.7)",
                }}
              >
                <Image src="/icons/babyseat.png" alt="Baby Seat" width={28} height={28} />
              </span>
              <span
                style={{
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 215, 0, 0.7)",
                  fontSize: "1.5rem",
                }}
              >
                🏄‍♂️
              </span>
              <span
                style={{
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 215, 0, 0.7)",
                  fontSize: "1.5rem",
                }}
              >
                🔊
              </span>
              <span
                style={{
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 215, 0, 0.7)",
                }}
              >
                <Image src="/icons/train.png" alt="Train Transfer" width={28} height={28} />
              </span>
            </p>

            <br />

            <a
              href="https://wa.me/94770063780?text=Hi%20I%27m%20interested%20in%20your%20offers!"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.3rem",
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
              Book Now via WhatsApp
              <FaWhatsapp style={{ fontSize: "1.5rem" }} />
            </a>

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

          <div className="w-full md:w-[425px] bg-white/20 text-white rounded-xl p-4 shadow-md mt-6 md:mt-0 mb-8">
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
                    required: true,
                  }}
                />
              </div>

              <VehicleDropdown
                vehicleOptions={vehicleOptions}
                formValues={formValues}
                setFormValues={setFormValues}
              />

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
                  className={inputClass}
                  style={{ color: "white" }}
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
                  <option value="" style={{ color: "black" }}>
                    Select Return Location
                  </option>
                  {locationOptions.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} ({loc.price === 0 ? "Free" : `$${loc.price}`})
                    </option>
                  ))}
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
                  backgroundImage: !loading
                    ? "linear-gradient(to right, #fbbf24, #f97316)"
                    : undefined,
                  color: "#fff",
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
            vehicleOptions={vehicleOptions}
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