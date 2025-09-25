"use client";

import Image from "next/image";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div
      className="p-6 rounded-md shadow-sm bg-cover bg-center border border-gray-200 max-w-3xl mx-auto my-8"
      style={{
        backgroundImage: "url('/hero/coconut-bg.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Terms and Conditions – Tuktukdrive
        </h1>
        <p className="text-sm text-gray-800 mb-4 text-center">
          Welcome to Tuktukdrive. These Terms and Conditions govern your use of our website and
          rental services. By booking a tuk-tuk with us, you agree to comply with these terms.
          Please read them carefully before proceeding with your reservation.
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
            <h2 className="text-lg font-semibold mb-2">1. Eligibility & Use of Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                You must be at least 18 years old and hold a valid driver’s license to rent a
                tuk-tuk from Tuktukdrive.
              </li>
              <li>
                Customers are required to provide a valid international driver’s license and
                passport, which will be used to issue the necessary local permit for driving in
                Sri Lanka.
              </li>
              <li>
                You agree to provide accurate and up-to-date information when making a booking.
              </li>
              <li>
                You may not use our website or services for any unlawful, fraudulent, or
                unauthorized purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Bookings & Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                By placing a booking, you are making an offer to rent the selected vehicle under
                the conditions outlined here.
              </li>
              <li>
                A $50 refundable deposit is required at the time of booking. This will be
                returned after the rental period, subject to compliance with the rental
                agreement.
              </li>
              <li>
                Payments are processed securely through trusted third-party payment providers.
                Tuktukdrive does not store or have access to your full payment details.
              </li>
              <li>
                We reserve the right to cancel or refuse a booking if there is an issue with
                availability, payment authorization, or suspected fraudulent activity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Rental Terms</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vehicles must be returned on or before the agreed rental return date.</li>
              <li>
                Customers are responsible for the proper use and care of the rented vehicle. Any
                damage caused by misuse or negligence may result in deductions from the deposit.
              </li>
              <li>
                The vehicle must not be used for illegal activities, reckless driving, or
                sub-leasing to others.
              </li>
              <li>
                Fuel, fines, and traffic violations during the rental period are the
                responsibility of the customer.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Refunds & Cancellations</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Refunds for early returns, cancellations, or deposit refunds are subject to our{' '}
                <Link href="/return-policy" className="hover:text-amber-400">
                  Refund & Cancellation Policy
                </Link>
                , available on our website.
              </li>
              <li>
                Refunds are always processed to the original payment method and may take 7–14
                business days, depending on your bank or payment provider.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Intellectual Property</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All content and materials on our website, including text, logos, images, and
                graphics, are the property of Tuktukdrive or its licensors.
              </li>
              <li>
                You may not copy, distribute, or modify any content from our website without our
                prior written consent.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Amendments & Termination</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We reserve the right to update or modify these Terms and Conditions at any time
                without prior notice.
              </li>
              <li>
                Continued use of our website or services after changes are posted constitutes
                your acceptance of the revised terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Contact Us</h2>
            <p className="mb-2">
              If you have any questions regarding these Terms and Conditions, please contact us:
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