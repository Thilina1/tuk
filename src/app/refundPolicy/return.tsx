"use client";

import Image from "next/image";

export default function ReturnPolicy() {
  return (
    <div
      className="p-6 rounded-md shadow-sm bg-cover bg-center border border-gray-200 max-w-3xl mx-auto my-8"
      style={{
        backgroundImage: "url('/hero/coconut-bg.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Refund Policy – Tuktukdrive
        </h1>
        <p className="text-sm text-gray-800 mb-4 text-center">
          Thank you for choosing Tuktukdrive for your Sri Lankan tuk-tuk rental experience. We value
          your trust and are committed to providing a transparent and fair refund process. Please read
          our policy carefully before making a booking.
        </p>

        <div className="mb-4 text-center">
          <Image
            src="/logo/TukTukDrive-Logo-Footer.png"
            alt="Tuktukdrive Logo"
            width={200}
            height={100}
            className="mx-auto rounded"
          />
        </div>

        <div className="space-y-6 text-sm text-gray-800">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Security Deposit Refund</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>A $50 refundable deposit is collected at the time of booking.</li>
              <li>This deposit will be refunded to the same payment method used for the initial transaction.</li>
              <li>Refunds are typically processed within 7–14 business days after the return of the vehicle, depending on your bank or payment provider.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Early Return Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>If a customer chooses to return their tuk-tuk before the agreed return date, they are eligible for a 50% refund of the unused rental days.</li>
              <li>Customers must notify us at least 2 days prior to their new expected return date to qualify for this early return and refund.</li>
              <li>Refunds for early returns will be processed to the original payment method within 7–14 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Non-Refundable Items</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Rental charges for days already used are non-refundable.</li>
              <li>Additional services (e.g., insurance, add-ons, accessories) are non-refundable once used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Processing Time</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Refunds are initiated by Tuktukdrive within the specified timeframe; however, the exact crediting of funds depends on the customer’s bank/payment provider.</li>
              <li>Please allow additional time for international transactions to reflect in your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Contact Us</h2>
            <p className="mb-2">
              If you have any questions or concerns regarding refunds, please contact our support team:
            </p>
            <ul className="list-none pl-0 space-y-2 text-center">
              <li>
                📧 <strong>Email:</strong>{' '}
                <a href="mailto:info@tuktukdrive.com" className="hover:text-amber-400">
                  info@tuktukdrive.com
                </a>
              </li>
              <li>
                📞 <strong>Phone/WhatsApp:</strong>{' '}
                <a href="tel:+94770063780" className="hover:text-amber-400">
                  +94 770063780
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}