"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { BookingData } from "../BookingsPage";
import Select, {  SingleValue } from "react-select";

interface Props {
  booking: BookingData;
  onClose: () => void;
}

interface LocationOption {
  label: string;
  value: string;
  price: number;
  status?: string;
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



interface LocationDoc {
  name: string;
  price: number;
  status: string;
}


// WhatsApp helper (Click-to-Chat)
const buildWhatsAppLink = (phoneE164: string, text: string) =>
  `https://wa.me/${phoneE164.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`;



// Dark/light CSS vars scoped to the modal
const DarkVars = () => (
  <style>
    {`
      @media (prefers-color-scheme: dark) {
        .edit-booking-modal {
          --tw-color-bg: #111827;
          --tw-color-card: #0b1220;
          --tw-color-border: #374151;
          --tw-color-text: #e5e7eb;
          --tw-color-muted: #9ca3af;
        }
      }
      .edit-booking-modal {
        --tw-color-bg: #ffffff;
        --tw-color-card: #ffffff;
        --tw-color-border: #e5e7eb;
        --tw-color-text: #111827;
        --tw-color-muted: #6b7280;
      }
    `}
  </style>
);

export default function EditBookingModal({ booking, onClose }: Props) {
  const [formValues, setFormValues] = useState<BookingData>({ ...booking });
  const [enableRecalculation, setEnableRecalculation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string>("");
  const [activeLocations, setActiveLocations] = useState<LocationOption[]>([]);
  const [enableTrainTransfer, setEnableTrainTransfer] = useState(!!formValues.trainTransfer);

  const handleChange = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };
  //handle change remove after active change price
  // const handleExtrasChange = (key: string, value: number) => {
  //   setFormValues((prev) => ({
  //     ...prev,
  //     extras: { ...prev.extras, [key]: value },
  //   }));
  // };

  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "locations"));
      const filtered = snapshot.docs
        .map((doc) => {
          const data = doc.data() as LocationDoc;
          return {
            label: `${data.name} ($${data.price})`,
            value: data.name,
            price: data.price,
            status: data.status,
          };
        })
        .filter((loc) => loc.status === "active");
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
      return 23;
    };

    const perDayCharge = getPerDayCharge(rentalDays);
    const licenseCharge = 35;

    const extrasTotal = extrasList.reduce(
      (sum, extra) => sum + (formValues.extras?.[extra.name] || 0) * extra.price,
      0
    );

    const trainTransferCost = formValues.trainTransfer?.price || 0;
    const pickupPrice = formValues.pickupPrice || 0;
    const returnPrice = formValues.returnPrice || 0;

    return (
      rentalDays * formValues.tukCount * perDayCharge +
      formValues.licenseCount * licenseCharge +
      extrasTotal +
      trainTransferCost +
      pickupPrice +
      returnPrice +
      50
    );
  };

  //active deactive
  // const rentalDaysss =
  // new Date(formValues.returnDate).getTime() > new Date(formValues.pickupDate).getTime()
  //   ? Math.ceil(
  //       (new Date(formValues.returnDate).getTime() -
  //         new Date(formValues.pickupDate).getTime()) /
  //         (1000 * 60 * 60 * 24)
  //     ) + 1
  //   : 1;

  const handleAssign = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "bookings", booking.id);

      const updatedData: Partial<BookingData> & { paymentLink?: string } = {
        ...formValues,
        status: "PAID",
      };

      if (enableRecalculation) {
        updatedData.RentalPrice = calculateTotal().toString();
      }
      if (paymentLink) {
        updatedData.paymentLink = paymentLink;
      }

      await updateDoc(docRef, updatedData);


      // console.log("✅ Email sent after assignment");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to assign or send email:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputCls =
    "border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] text-[var(--tw-color-text)] placeholder-[var(--tw-color-muted)] p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition text-sm";

  const totalToSend =
    enableRecalculation ? calculateTotal() : Number(booking.RentalPrice || 0);

  const paymentMessage = [
    `Hi ${formValues.name},`,
    `Your TukTuk booking total is $${totalToSend.toFixed(2)}.`,
    ``,
    paymentLink ? `Pay securely here: ${paymentLink}` : ``,
    ``,
    `Pickup: ${formValues.pickup} · ${formValues.pickupDate} ${formValues.pickupTime}`,
    `Return: ${formValues.returnLoc} · ${formValues.returnDate} ${formValues.returnTime}`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleSendWhatsAppAPI = async () => {
    if (!paymentLink) return alert("Add a valid payment link first.");
    const res = await fetch("/api/send-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: formValues.whatsapp.replace(/[^\d]/g, ""),
        text: paymentMessage,
      }),
    });
    if (res.ok) {
      alert("Payment message sent on WhatsApp ✅");
    } else {
      alert("Failed to send WhatsApp message. Check server logs.");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <DarkVars />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div className="edit-booking-modal absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] overflow-hidden flex flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--tw-color-border)] bg-[var(--tw-color-card)]">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--tw-color-text)]">
              Confirm Booking Payment - {formValues.bookingId}

            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="px-3 py-1.5 rounded-lg border border-orange-400 text-orange-500 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10 text-sm font-medium transition"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1 min-h-0">
            <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5">
              <h3 className="text-sm font-semibold text-[var(--tw-color-text)] mb-4">
                Customer & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp</label>
                  <input
                    type="text"
                    value={formValues.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5">
              <h3 className="text-sm font-semibold text-[var(--tw-color-text)] mb-4">
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Pickup</label>
                  <Select
                    
                    options={activeLocations}
                    value={
                      formValues.pickup
                        ? activeLocations.find((loc) => loc.value === formValues.pickup) || null
                        : null
                    }
                    onChange={(selected: SingleValue<LocationOption>) => {
                      handleChange("pickup", selected?.value || "");
                      handleChange("pickupPrice", selected?.price || 0);
                    }}
                    
                    isClearable
                    placeholder="Select pickup location"
                    className="text-[var(--tw-color-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Return</label>
                  <Select
                    options={activeLocations}
                    value={
                      formValues.returnLoc
                        ? activeLocations.find((loc) => loc.value === formValues.returnLoc) || null
                        : null
                    }
                    onChange={(selected: SingleValue<LocationOption>) => {
                      handleChange("returnLoc", selected?.value || "");
                      handleChange("returnPrice", selected?.price || 0);
                    }}
                    
                    isClearable
                    placeholder="Select return location"
                    className="text-[var(--tw-color-text)]"
                  />
                </div>
                <div>
                  <label className={labelCls}>Pickup Date</label>
                  <input
                    type="date"
                    value={formValues.pickupDate}
                    onChange={(e) => handleChange("pickupDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Pickup Time</label>
                  <input
                    type="time"
                    value={formValues.pickupTime}
                    onChange={(e) => handleChange("pickupTime", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Return Date</label>
                  <input
                    type="date"
                    value={formValues.returnDate}
                    onChange={(e) => handleChange("returnDate", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Return Time</label>
                  <input
                    type="time"
                    value={formValues.returnTime}
                    onChange={(e) => handleChange("returnTime", e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Tuk Count</label>
                  <input
                    type="number"
                    min={1}
                    value={formValues.tukCount}
                    onChange={(e) => handleChange("tukCount", parseInt(e.target.value) || 1)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>License Count</label>
                  <input
                    type="number"
                    min={1}
                    value={formValues.licenseCount}
                    onChange={(e) => handleChange("licenseCount", parseInt(e.target.value) || 1)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5">
              <h3 className="text-sm font-semibold text-[var(--tw-color-text)] mb-4">
                Train Transfer
              </h3>
              <div className="flex items-center gap-3 mb-4 hidden">
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
                  className="text-sm font-medium text-[var(--tw-color-text)] select-none"
                >
                  Enable Train Transfer
                </label>
              </div>
           
            </div>
            <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5">
              <h3 className="text-sm font-semibold text-[var(--tw-color-text)] mb-4">Extras</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extrasList.map((extra) => (
                  <div
                    key={extra.name}
                    className="flex justify-between items-center text-sm border border-[var(--tw-color-border)] rounded-xl px-3 py-2 bg-[var(--tw-color-bg)]"
                  >
                    <span className="text-[var(--tw-color-text)]">
                      {extra.name}{" "}
                      <span className="text-[var(--tw-color-muted)]">(${extra.price} each)</span>
                    </span>
                    
                    <div className="font-semibold text-sm text-[var(--tw-color-text)] text-right">
  {(() => {
    const isFlatFee = extra.name === "Full-Time Driver" || extra.name === "Train Transfer";
    const quantity = formValues.extras?.[extra.name] || 0;

    // If quantity is 0, return "No"
    if (quantity === 0) {
      return "No";
    }

    if (isFlatFee) {
      // Flat-fee items: Display quantity only (e.g., "1")
      return quantity;
    }

    // Calculate rental days for per-day items
    const returnTime = new Date(formValues.returnDate).getTime();
    const pickupTime = new Date(formValues.pickupDate).getTime();
    
    const days = returnTime > pickupTime
      ? Math.ceil((returnTime - pickupTime) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    // Per-day items: Display "X days (Y items)"
    // Use Math.round() to ensure a whole number and remove floating points
    const ratio = Math.round(quantity / days);
    
    return `${days} days (${ratio} items)`;
  })()}
</div>
                    
                  </div>
                ))}
              </div>
            </div>
            {formValues.couponCode && (
              <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5">
                <h3 className="text-sm font-semibold text-[var(--tw-color-text)] mb-3">Coupon</h3>
                <label className={labelCls}>Coupon Code</label>
                <input
                  type="text"
                  value={formValues.couponCode}
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  className={`${inputCls} cursor-not-allowed opacity-80`}
                  readOnly
                />
              </div>
            )}
            <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 hidden">
                <input
                  id="recalcCheckbox"
                  type="checkbox"
                  checked={enableRecalculation}
                  disabled={!!formValues.couponCode}
                  onChange={() => setEnableRecalculation((prev) => !prev)}
                  className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 disabled:opacity-50"
                />
                <label
                  htmlFor="recalcCheckbox"
                  className="text-sm font-medium text-[var(--tw-color-text)] select-none"
                >
                  Recalculate Total Cost
                </label>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--tw-color-border)] bg-[var(--tw-color-bg)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--tw-color-muted)]">
                  {enableRecalculation ? "Updated Price" : "Original Price"}
                </span>
                <span
                  className={`text-base font-semibold ${
                    enableRecalculation ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  ${enableRecalculation ? calculateTotal().toFixed(2) : booking.RentalPrice || "N/A"}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--tw-color-border)] bg-[var(--tw-color-card)] p-4 md:p-5 flex flex-col gap-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Link (WebXPay / PayHere / etc.)
              </label>
              <input
                type="url"
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
              <div className="flex flex-wrap gap-3">
                <a
                  href={buildWhatsAppLink(formValues.whatsapp, paymentMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    try {
                      if (!paymentLink) {
                        e.preventDefault();
                        alert("Add a valid payment link first.");
                      } else {
                        new URL(paymentLink);
                      }
                    } catch {
                      e.preventDefault();
                      alert("Payment link is not a valid URL.");
                    }
                  }}
                >
                  Send Payment (WhatsApp)
                </a>
                <button
                  type="button"
                  className="hidden px-4 py-2 rounded-lg text-sm text-white bg-emerald-600 hover:bg-emerald-700"
                  onClick={async () => {
                    try {
                      if (!paymentLink) return alert("Add a valid payment link first.");
                      new URL(paymentLink);
                      await handleSendWhatsAppAPI();
                    } catch {
                      alert("Payment link is not a valid URL.");
                    }
                  }}
                >
                  Send Payment (API)
                </button>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--tw-color-border)] bg-[var(--tw-color-card)]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm border border-[var(--tw-color-border)] bg-[var(--tw-color-bg)] hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--tw-color-text)]"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm text-white ${
                loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              } shadow-sm`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Paying...
                </div>
              ) : (
                "Paid"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}