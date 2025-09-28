"use client";

import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, updateDoc, increment, Timestamp, writeBatch } from "firebase/firestore";
import { db } from "../../config/firebase";
import Image from "next/image";
import { FaIdCard, FaPassport, FaUser } from "react-icons/fa";
import Script from "next/script";

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: Record<string, unknown>) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
    };
  }
}

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
  hasIDP: string;
  postalCode: string;
  licenseNumber: string;
  passportNumber: string;
  idpFiles: File[];
  passportFiles: File[];
  selfieWithLicense: File[];
  isBooked: boolean;
  pickupPrice?: number;
  returnPrice?: number;
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

type MasterPrices = {
  dailyRates: { duration: string; pricePerDay: number }[];
  licenseFee: { amount: number; description?: string };
  optionalExtras: { name: string; price: number; type: string }[];
  refundableDeposit: { amount: number; description?: string };
  updatedAt?: Timestamp | Date | string | number;
};

/** Get next booking ID from counter */
const getNextBookingId = async (): Promise<string> => {
  try {
    const settingsSnap = await getDocs(collection(db, "settings"));
    if (settingsSnap.empty) {
      throw new Error("Settings collection not found");
    }
    
    const settingsDoc = settingsSnap.docs[0];
    const currentCount = settingsDoc.data().countContent || 0;
    
    const batch = writeBatch(db);
    batch.update(settingsDoc.ref, { countContent: increment(1) });
    await batch.commit();
    
    return `BK${String(currentCount + 1).padStart(4, '0')}`; // BK0001, BK0002, etc.
  } catch (error) {
    console.error("Error getting next booking ID:", error);
    return `BK${Date.now().toString().slice(-6)}`;
  }
};

/** time options */
const timeOptions = Array.from({ length: 8 }, (_, i) => {
  const hour = i + 10;
  const value = hour.toString().padStart(2, "0") + ":00";
  return (
    <option key={value} value={value}>
      {value}
    </option>
  );
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [isLoadingBookingId, setIsLoadingBookingId] = useState(false);
  const [prices, setPrices] = useState<MasterPrices | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "masterPrices"));
        const first = snap.docs[0]?.data() as MasterPrices | undefined;
        if (first) setPrices(first);
      } catch (e) {
        console.warn("Failed to load masterPrices; using defaults.", e);
        setPrices(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (step === 3 && !bookingId && !isLoadingBookingId) {
      const loadBookingId = async () => {
        setIsLoadingBookingId(true);
        try {
          const nextId = await getNextBookingId();
          setBookingId(nextId);
        } catch (error) {
          console.error("Failed to load booking ID:", error);
        } finally {
          setIsLoadingBookingId(false);
        }
      };
      
      loadBookingId();
    }
  }, [step, bookingId, isLoadingBookingId]);

  const rentalDays =
    new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
      ? Math.ceil(
          (new Date(formValues.returnDate).getTime() - new Date(formValues.pickupDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

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

  const perDayCharge = getPerDayCharge(rentalDays);
  const licenseCharge = prices?.licenseFee?.amount ?? 35;
  const deposit = prices?.refundableDeposit?.amount ?? 50;

  const DISPLAY_MAP: Record<string, { label: string; icon: string }> = {
    TrainTransfer: { label: "Train Transfer", icon: "/icons/train.png" },
    FullTimeDriver: { label: "Full-Time Driver", icon: "/icons/Driver.png" },
    SurfBoardRack: { label: "Surf-Board Rack", icon: "/icons/surfboard.png" },
    BluetoothSpeakers: { label: "Bluetooth Speakers", icon: "/icons/speaker.png" },
    CoolerBox: { label: "Cooler Box", icon: "/icons/cooler.png" },
    DashCam: { label: "Dash Cam", icon: "/icons/cam.png" },
    BabySeat: { label: "Baby Seat", icon: "/icons/babyseat.png" },
    HoodRack: { label: "Hood Rack", icon: "/icons/Hood Rack.png" },
  };
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  const extrasList = useMemo(() => {
    const fallback = [
      { name: "Train Transfer", icon: "/icons/train.png", price: 30, type: " per unit" },
      { name: "Full-Time Driver", icon: "/icons/Driver.png", price: 25, type: " per day" },
      { name: "Surf-Board Rack", icon: "/icons/surfboard.png", price: 1, type: " per day" },
      { name: "Bluetooth Speakers", icon: "/icons/speaker.png", price: 1, type: " per day" },
      { name: "Cooler Box", icon: "/icons/cooler.png", price: 1, type: " per day" },
      { name: "Dash Cam", icon: "/icons/cam.png", price: 1, type: " per day" },
      { name: "Baby Seat", icon: "/icons/babyseat.png", price: 2, type: " per day" },
      { name: "Hood Rack", icon: "/icons/Hood Rack.png", price: 3, type: " per day" },
    ];
    if (!prices?.optionalExtras?.length) return fallback;

    return prices.optionalExtras.map((e) => {
      const fsKey = norm(e.name);
      const matchKey =
        Object.keys(DISPLAY_MAP).find((k) => norm(k) === fsKey) ||
        (fsKey.includes("surfboard") ? "SurfBoardRack" : undefined);

      const display = matchKey ? DISPLAY_MAP[matchKey] : null;
      const label =
        display?.label ||
        e.name
          .replace(/([A-Z])/g, " $1")
          .replace(/\s+/g, " ")
          .trim();
      const icon = display?.icon || "/icons/cooler.png";
      return { name: label, icon, price: e.price, type: ` ${e.type}` };
    });
  }, [prices]);

  const extrasTotal = extrasList.reduce(
    (sum, extra) => sum + (formValues.extras[extra.name] || 0) * extra.price,
    0
  );

  const orderId = bookingId || `${formValues.email.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now()}`;

  const totalRental = useMemo(() => {
    let total =
      rentalDays * formValues.tukCount * perDayCharge +
      formValues.licenseCount * licenseCharge +
      extrasTotal +
      (formValues.pickupPrice || 0) +
      (formValues.returnPrice || 0) +
      deposit;

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
    appliedCoupon,
    perDayCharge,
    licenseCharge,
    deposit,
  ]);

  const handleConfirmBooking = async () => {
    if (step === 3 && !bookingId) {
      setValidationError("Loading booking details... Please wait.");
      return;
    }
  
    setLoading(true);
    setPaymentError("");
    try {
      const docRef = doc(db, "bookings", docId);
  
      // Validate inputs
      if (!formValues.name.trim() || !formValues.email.trim() || !formValues.licenseCountry.trim()) {
        setPaymentError("Please ensure all required fields (name, email, country) are filled.");
        setLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
        setPaymentError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
  
      // Update Firestore with booking details
      const baseUpdates = {
        bookingId,
        orderId,
        RentalPrice: Number(totalRental.toFixed(2)),
        isBooked: true,
        status: "PENDING_PAYMENT",
        ...(appliedCoupon && couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
        billBreakdown: {
          perDayCharge,
          rentalDays,
          licenseChargePer: licenseCharge,
          extrasTotal,
          pickupPrice: formValues.pickupPrice || 0,
          returnPrice: formValues.returnPrice || 0,
          deposit,
        },
      };
  
      const pruneUndefined = <T extends object>(obj: T): T =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
  
      await updateDoc(docRef, pruneUndefined(baseUpdates));
  
      // Update coupon usage if applicable
      if (appliedCoupon) {
        const couponRef = doc(db, "discounts", appliedCoupon.id);
        await updateDoc(couponRef, { currentUsers: increment(1) });
      }
  
      // Fetch PayHere hash
      const hashRes = await fetch("/api/payhere/checkout/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: Number(totalRental.toFixed(2)),
          currency: "USD",
        }),
      });
  
      if (!hashRes.ok) {
        const hashText = await hashRes.text();
        const errorMessage = hashText.includes("404")
          ? "API route not found. Please check /api/payhere/checkout/api."
          : hashText || `HTTP ${hashRes.status}`;
        setPaymentError(errorMessage);
        setLoading(false);
        return;
      }
  
      const { hash } = await hashRes.json();
  
      // Prepare payment object
      const payment = {
        sandbox: true,
        merchant_id: "1231320", // Replace with your Merchant ID
        return_url: "https://yourdomain.com/payment-success", // Replace
        cancel_url: "https://yourdomain.com/payment-cancel", // Replace
        notify_url: "https://yourdomain.com/api/payhere-notify", // Replace
        order_id: orderId,
        items: `Tuk Tuk Rental - ${bookingId}`,
        amount: totalRental.toFixed(2),
        currency: "USD",
        hash,
        first_name: formValues.name.split(" ")[0] || "Guest",
        last_name: formValues.name.split(" ").slice(1).join(" ") || "User",
        email: formValues.email,
        phone: formValues.whatsapp || undefined,
        address: formValues.licenseAddress || undefined,
        city: formValues.pickup || undefined,
        country: formValues.licenseCountry || "UK",
        delivery_address: formValues.pickup || undefined,
        delivery_city: formValues.pickup || undefined,
        delivery_country: formValues.licenseCountry || undefined,
        custom_1: bookingId,
        custom_2: "",
      };
  
      // Start payment
      if (!sdkLoaded || !window.payhere) {
        setPaymentError("Payment system not ready. Please try again.");
        setLoading(false);
        return;
      }
  
      window.payhere.startPayment(payment);
  
      // Payment event handlers
      window.payhere.onCompleted = async (orderId) => {
        console.log("Payment completed. OrderID:", orderId);
        try {
          // Update Firestore to PAID status
          await updateDoc(docRef, { status: "PAID" });
  
          // Send guest confirmation email
          const emailPayload = {
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
            orderId,
            totalRental: Number(totalRental.toFixed(2)),
            couponCode: appliedCoupon ? couponCode.trim() : undefined,
            billBreakdown: {
              perDayCharge,
              rentalDays,
              licenseChargePer: licenseCharge,
              extrasTotal,
              pickupPrice: formValues.pickupPrice || 0,
              returnPrice: formValues.returnPrice || 0,
              deposit,
            },
            extrasCounts: formValues.extras,
            mode: "PAID",
            messageType: "GUEST_CONFIRMATION",
            bookingId,
          };
  
          await fetch("/api/send-email/bookingEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          });
  
          // Send operations notification
          await fetch("/api/send-email/opsNotify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              docId,
              orderId,
              totalRental,
              customer: { name: formValues.name, email: formValues.email, whatsapp: formValues.whatsapp },
              pickup: { date: formValues.pickupDate, time: formValues.pickupTime, loc: formValues.pickup },
              return: { date: formValues.returnDate, time: formValues.returnTime, loc: formValues.returnLoc },
              status: "PAID",
            }),
          }).catch(() => {});
  
          // Send admin booking email
          await fetch("/api/send-email/bookingAdminMail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
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
              totalRental: Number(totalRental.toFixed(2)),
              couponCode: appliedCoupon ? couponCode.trim() : undefined,
              extrasCounts: formValues.extras,
              status: "PAID",
            }),
          });
  
          // Send WhatsApp notification
          await fetch("/api/whatsapp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              template: "hello_world",
              langCode: "en_US",
              to: formValues.whatsapp,
            }),
          });
  
          setShowThankYou(true);
        } catch (e) {
          console.error("Failed to update payment status or send notifications:", e);
          setPaymentError("Payment completed, but failed to update booking status or send notifications.");
        } finally {
          setLoading(false);
        }
      };
  
      window.payhere.onDismissed = () => {
        console.log("Payment dismissed");
        setPaymentError("Payment was cancelled.");
        setLoading(false);
      };
  
      window.payhere.onError = (error) => {
        console.log("Payment error:", error);
        setPaymentError(`Payment error: ${error}`);
        setLoading(false);
      };
    } catch (e) {
      console.error("Confirm booking or payment initiation failed:", e);
      setPaymentError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    const today = new Date();
    const snapshot = await getDocs(collection(db, "discounts"));
    const matched = snapshot.docs
      .map((docx) => ({ id: docx.id, ...docx.data() } as CouponDoc))
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
      setCouponCode("");
      return;
    }

    setAppliedCoupon({
      id: matched.id,
      discountMode: matched.discountMode,
      discountValue: matched.discountValue,
    });
  };

  const handleNext = async () => {
    setLoading(true);
    try {
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
          idpFiles: (formValues.idpFiles || []).map((f) => f.name),
          passportFiles: (formValues.passportFiles || []).map((f) => f.name),
          selfieWithLicense: (formValues.selfieWithLicense || []).map((f) => f.name),
        });
      }

      if (step < 3) setStep((prev) => prev + 1);
      else closeModal();
    } finally {
      setLoading(false);
    }
  };

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

        <div className="relative w-full">
          <div className="px-4 mb-4">
            <div className="flex flex-row space-x-1">
              {[
                { number: 1, title: "Rental Details", subtitle: "Request Details" },
                { number: 2, title: "Extras", subtitle: "Extras Selection" },
                { number: 3, title: "License Details", subtitle: "Documents" },
                { number: 4, title: "Payment", subtitle: "Confirm & Pay" },
              ].map((stepItem, index) => {
                const isActiveOrCompleted = index <= step;

                return (
                  <div
                    key={index}
                    className="flex-1 text-center p-2 rounded-lg transition-all duration-300 sm:flex sm:flex-col sm:items-center"
                    style={{
                      backgroundColor: isActiveOrCompleted ? "#22C55E" : "var(--bg-color)",
                      color: isActiveOrCompleted ? "#FFFFFF" : "var(--text-color)",
                    }}
                  >
                    <style jsx>{`
                      div {
                        --bg-color: #E5E7EB;
                        --text-color: #1F2937;
                      }
                      @media (prefers-color-scheme: dark) {
                        div {
                          --bg-color: #374151;
                          --text-color: #E5E7EB;
                        }
                      }
                    `}</style>
                    <div className="text-sm font-semibold sm:flex sm:items-center">
                      {stepItem.number}
                      <span className="hidden sm:inline sm:ml-1">. {stepItem.title}</span>
                    </div>
                    <div className="text-xs font-medium sm:text-sm">
                      <span className="sm:hidden">{stepItem.title}</span>
                      <span className="hidden sm:block">{stepItem.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showThankYou ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg p-6 shadow-md text-gray-800">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4 text-center">✅🎉 Booking Confirmed!</h2>
            <p className="text-gray-700 mb-6 text-center max-w-xl">
              Your tuk-tuk adventure is ready to roll 🚐💨
              <br />
              Adventure, smiles, and three wheels of fun are coming your way! 🛺💨
              <br />
              We’ll be in touch soon with all the details.
              <br />
            </p>
            <button
              onClick={() => {
                closeModal();
                window.location.reload();
              }}
              className="px-5 py-2 rounded-lg text-white font-semibold shadow transition hover:scale-105"
              style={{
                background: "linear-gradient(to right, #fb923c, #f97316)",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {step === 0 && validationError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{validationError}</div>
            )}
            {step === 3 && paymentError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{paymentError}</div>
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
                        onChange={(e) => setFormValues({ ...formValues, [key]: e.target.value })}
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
                        onChange={(e) => setFormValues({ ...formValues, pickupDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold">Pickup Time</label>
                      <select
                        value={formValues.pickupTime}
                        onChange={(e) => setFormValues({ ...formValues, pickupTime: e.target.value })}
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
                        onChange={(e) => setFormValues({ ...formValues, returnDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold">Return Time</label>
                      <select
                        value={formValues.returnTime}
                        onChange={(e) => setFormValues({ ...formValues, returnTime: e.target.value })}
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
                          <option key={loc.name} value={loc.name}>
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
                        onChange={(e) => setFormValues({ ...formValues, tukCount: parseInt(e.target.value) })}
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
                        onChange={(e) => setFormValues({ ...formValues, licenseCount: parseInt(e.target.value) })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      >
                        {Array.from({ length: 9 }, (_, i) => i + 1).map((val) => (
                          <option key={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg text-sm shadow-sm">
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-sm">
                      <h3 className="text-base font-semibold text-gray-900">Total Rentals Detail</h3>
                      {(() => {
                        const money = (n: number = 0) => `$${Number(n).toLocaleString()}`;
                        const pickupPrice = Number(formValues.pickupPrice || 0);
                        const returnPrice = Number(formValues.returnPrice || 0);
                        const days = Number(rentalDays || 0);
                        const dayRate = Number(perDayCharge || 0);
                        const licenseCount = Number(formValues.licenseCount || 0);
                        const licenseTotal = licenseCharge * licenseCount;
                        const extras = Number(extrasTotal || 0);
                        const depositAmt = Number(deposit || 0);
                        const rental = dayRate * days;
                        const totalActual = pickupPrice + returnPrice + rental + licenseTotal + extras;
                        const grandTotal = totalActual + depositAmt;

                        return (
                          <dl className="mt-3 space-y-1">
                            <div className="flex justify-between">
                              <dt className="text-gray-700">Pickup - {formValues.pickup || "-"}</dt>
                              <dd className="font-semibold tabular-nums text-gray-800">{money(pickupPrice)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-700">Return - {formValues.returnLoc || "-"}</dt>
                              <dd className="font-semibold tabular-nums text-gray-800">{money(returnPrice)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-700">Rental for {days} days ({money(dayRate)})</dt>
                              <dd className="font-semibold tabular-nums text-gray-800">{money(rental)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-700">Local License (${licenseCharge} × {licenseCount})</dt>
                              <dd className="font-semibold tabular-nums text-gray-800">{money(licenseTotal)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-700">Extras Total</dt>
                              <dd className="font-semibold tabular-nums text-gray-800">{money(extras)}</dd>
                            </div>
                            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                              <dt className="text-base font-semibold text-gray-800">Total Actual</dt>
                              <dd className="text-base font-semibold text-emerald-600 tabular-nums">{money(totalActual)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-700">Deposit (Refundable)</dt>
                              <dd className="font-semibold tabular-nums text-gray-800">{money(depositAmt)}</dd>
                            </div>
                            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                              <dt className="text-base font-semibold text-gray-800">Grand Total</dt>
                              <dd className="text-base font-semibold text-emerald-600 tabular-nums">{money(grandTotal)}</dd>
                            </div>
                          </dl>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold">Select Your Extras</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {extrasList.map((extra) => (
                    <div
                      key={extra.name}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-sm p-3 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <Image src={extra.icon} alt={extra.name} width={32} height={32} className="w-8 h-8 object-contain" />
                        <div>
                          <div className="font-medium text-sm text-gray-900">{extra.name}</div>
                          <div className="text-xs text-gray-500">${extra.price} {extra.type}</div>
                        </div>
                      </div>
                      {["Full-Time Driver", "Train Transfer"].includes(extra.name) ? (
                        <input
                          type="number"
                          min="0"
                          value={formValues.extras[extra.name] || 0}
                          onChange={(e) =>
                            setFormValues({
                              ...formValues,
                              extras: {
                                ...formValues.extras,
                                [extra.name]: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="0"
                        />
                      ) : (
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
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          <option value="0">No</option>
                          <option value={rentalDays}>{rentalDays} days</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 text-sm">
                  <h3 className="text-base font-semibold text-gray-900">Total Rentals Detail</h3>
                  {(() => {
                    const money = (n: number = 0) => `$${Number(n).toLocaleString()}`;
                    const pickupPrice = Number(formValues.pickupPrice || 0);
                    const returnPrice = Number(formValues.returnPrice || 0);
                    const days = Number(rentalDays || 0);
                    const dayRate = Number(perDayCharge || 0);
                    const licenseCount = Number(formValues.licenseCount || 0);
                    const licenseTotal = licenseCharge * licenseCount;
                    const extras = Number(extrasTotal || 0);
                    const depositAmt = Number(deposit || 0);
                    const rental = dayRate * days;
                    const totalActual = pickupPrice + returnPrice + rental + licenseTotal + extras;
                    const grandTotal = totalActual + depositAmt;

                    return (
                      <dl className="mt-3 space-y-1">
                        <div className="flex justify-between">
                          <dt className="text-gray-700">Pickup - {formValues.pickup || "-"}</dt>
                          <dd className="font-semibold tabular-nums text-gray-800">{money(pickupPrice)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-700">Return - {formValues.returnLoc || "-"}</dt>
                          <dd className="font-semibold tabular-nums text-gray-800">{money(returnPrice)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-700">Rental for {days} days ({money(dayRate)})</dt>
                          <dd className="font-semibold tabular-nums text-gray-800">{money(rental)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-700">Local License (${licenseCharge} × {licenseCount})</dt>
                          <dd className="font-semibold tabular-nums text-gray-800">{money(licenseTotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-700">Extras Total</dt>
                          <dd className="font-semibold tabular-nums text-gray-800">{money(extras)}</dd>
                        </div>
                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                          <dt className="text-base font-semibold text-gray-800">Total Actual</dt>
                          <dd className="text-base font-semibold text-emerald-600 tabular-nums">{money(totalActual)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-700">Deposit (Refundable)</dt>
                          <dd className="font-semibold tabular-nums text-gray-800">{money(depositAmt)}</dd>
                        </div>
                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                          <dt className="text-base font-semibold text-gray-800">Grand Total</dt>
                          <dd className="text-base font-semibold text-emerald-600 tabular-nums">{money(grandTotal)}</dd>
                        </div>
                      </dl>
                    );
                  })()}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">License & Identity Details</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-sm text-gray-800">
                  <p className="font-semibold">📢 Important Notice</p>
                  <p>
                    As per the Sri Lankan government regulation effective March 30th, 2025, all foreign visitors must have a valid
                    International Driving Permit (IDP) to obtain a local driving license.
                  </p>
                  <p className="mt-2">
                    Don’t have an IDP? No problem! 😊 We can create that for you{" "}
                    <a
                      href="https://wa.me/+94770063780"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      📱 Contact us on WhatsApp
                    </a>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold">International Driving Permit (IDP)</label>
                    <select
                      value={formValues.hasIDP || ""}
                      onChange={(e) => setFormValues({ ...formValues, hasIDP: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    >
                      <option value="" disabled>
                        Select Yes or No
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={formValues.licenseName}
                      onChange={(e) => setFormValues({ ...formValues, licenseName: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Address</label>
                    <input
                      type="text"
                      placeholder="Enter Address"
                      value={formValues.licenseAddress}
                      onChange={(e) => setFormValues({ ...formValues, licenseAddress: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Country</label>
                    <input
                      type="text"
                      placeholder="Enter Country"
                      value={formValues.licenseCountry}
                      onChange={(e) => setFormValues({ ...formValues, licenseCountry: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Postal Code</label>
                    <input
                      type="text"
                      placeholder="Enter Postal Code"
                      value={formValues.postalCode}
                      onChange={(e) => setFormValues({ ...formValues, postalCode: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">License Number</label>
                    <input
                      type="text"
                      placeholder="Enter License Number"
                      value={formValues.licenseNumber}
                      onChange={(e) => setFormValues({ ...formValues, licenseNumber: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Passport Number</label>
                    <input
                      type="text"
                      placeholder="Enter Passport Number"
                      value={formValues.passportNumber}
                      onChange={(e) => setFormValues({ ...formValues, passportNumber: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg text-sm text-gray-800">
                  <p className="font-semibold">📋 Document Submission Instructions</p>
                  <p>
                    After filling out your license details, please send the following required documents via{" "}
                    <a
                      href="mailto:info@tuktukdrive.com"
                      className="text-blue-600 hover:underline font-semibold"
                      aria-label="Email to TukTukDrive for document submission"
                    >
                      Email (info@tuktukdrive.com)
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://wa.me/+94770063780"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold"
                      aria-label="WhatsApp for document submission"
                    >
                      WhatsApp (+94770063780)
                    </a>{" "}
                    to prepare your local driving license:
                  </p>
                  <ul className="mt-2 list-disc pl-6">
                    <li>Clear photo of your passport details.</li>
                    <li>Clear photos or a PDF of your International Driving Permit (IDP).</li>
                    <li>Your photo for the new local license (similar to a passport photo, with a white or light background).</li>
                  </ul>
                </div>
                <div className="hidden">
                  <label className="flex items-center text-sm font-semibold mb-2">
                    <FaIdCard className="text-orange-500 mr-2" />
                    Upload International Driving Permit (PDF or up to 3 Images)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => setFormValues({ ...formValues, idpFiles: Array.from(e.target.files || []) })}
                    className="w-full border border-dashed border-gray-300 bg-white rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                  {formValues.idpFiles?.length > 0 && (
                    <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
                      {formValues.idpFiles.map((file: File, index: number) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="hidden">
                  <label className="flex items-center text-sm font-semibold mb-2">
                    <FaPassport className="text-blue-500 mr-2" />
                    Upload Passport (PDF or Image)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormValues({ ...formValues, passportFiles: Array.from(e.target.files || []) })}
                    className="w-full border border-dashed border-gray-300 bg-white rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  {formValues.passportFiles?.length > 0 && (
                    <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
                      {formValues.passportFiles.map((file: File, index: number) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="hidden">
                  <label className="flex items-center text-sm font-semibold mb-2">
                    <FaUser className="text-green-600 mr-2" />
                    Upload a Photo of Yourself (Image only)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setFormValues({ ...formValues, selfieWithLicense: Array.from(e.target.files || []) })}
                    className="w-full border border-dashed border-gray-300 bg-white rounded-lg px-4 py-3 text-sm cursor-pointer hover:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  {formValues.selfieWithLicense?.length > 0 && (
                    <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
                      {formValues.selfieWithLicense.map((file: File, index: number) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 p-6 rounded-2xl bg-white shadow-xl border border-gray-100 text-gray-900">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Order Summary & Confirm</h3>
                    <p className="text-sm text-gray-500">Review your booking details</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Rental Price</span>
                          <p className="text-xs text-gray-500">Base rental cost</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-gray-900">${totalRental.toFixed(2)}</span>
                      </div>
                    </div>
                    {appliedCoupon ? (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-emerald-800">Coupon Applied!</p>
                              <p className="text-sm text-emerald-700">{couponCode} - {appliedCoupon.discountMode} {appliedCoupon.discountValue}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setAppliedCoupon(null);
                              setCouponCode('');
                            }}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-500">No discount applied</span>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon code?</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim()}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-red-700">{couponError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">Final Total</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-orange-700">${totalRental.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading || !sdkLoaded || isLoadingBookingId}
                  className="w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    background: loading || !sdkLoaded || isLoadingBookingId
                      ? '#9CA3AF' 
                      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        />
                      </svg>
                      <span>Processing your booking...</span>
                    </>
                  ) : (
                    <>
                      <Image src="/icons/tuktuk.png" alt="Tuk Tuk" width={24} height={24} />
                      <span className="text-lg">Confirm Booking and Pay</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
<p>
  After confirming, you will be redirected to a secure payment page to complete your payment of ${totalRental.toFixed(2)}. Upon successful payment, we&apos;ll email your bill and our team will contact you via WhatsApp & email with further details.
</p>
                    </div>
                  </div>
                </div>
                <Script
                  src="https://www.payhere.lk/lib/payhere.js"
                  strategy="afterInteractive"
                  onLoad={() => {
                    console.log("✅ PayHere SDK loaded");
                    setSdkLoaded(true);
                  }}
                />
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-gray-50 disabled:hover:bg-transparent"
                style={{
                  backgroundColor: "#F9FAFB",
                  color: "#374151",
                  border: "1px solid #E5E7EB"
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
              
              {step === 3 && (
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">Step {step + 1} of 4</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              )}

              {step < 3 && (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-4 py-2 rounded hover:opacity-80 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#F97316",
                    color: "#1F2937",
                  }}
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    <span>Next</span>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;