"use client";

import Image from "next/image";

export default function PrivacyPolicy() {
  return (
    <div
      className="p-6 rounded-md shadow-sm bg-cover bg-center border border-gray-200 max-w-3xl mx-auto my-8"
      style={{
        backgroundImage: "url('/hero/coconut-bg.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Privacy Policy – Tuktukdrive
        </h1>
        <p className="text-sm text-gray-800 mb-4 text-center">
          At Tuktukdrive, we respect your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and safeguard your data
          when you use our services.
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
            <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
            <p className="mb-2">
              When you make a booking or contact us, we may collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Full name</li>
              <li>Contact details (email address, phone number, WhatsApp)</li>
              <li>Payment information (processed securely through our payment provider)</li>
              <li>Driver’s license and passport details (for verification and license processing)</li>
              <li>Rental history and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and confirm your bookings</li>
              <li>Verify your eligibility to drive a tuk-tuk in Sri Lanka</li>
              <li>Communicate with you regarding your rental</li>
              <li>Process payments, deposits, and refunds</li>
              <li>Improve our services and customer experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Data Sharing & Disclosure</h2>
            <p className="mb-2">
              We do not sell or trade your personal information. However, we may share your data
              in the following cases:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                With trusted service providers (e.g., payment processors, insurance providers,
                licensing authorities)
              </li>
              <li>If required by law, regulation, or legal process</li>
              <li>
                To protect the rights, property, or safety of Tuktukdrive, our customers, or
                others
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Data Security</h2>
            <p>
              We take appropriate technical and organizational measures to safeguard your
              personal information. All payments are handled securely through encrypted systems,
              and sensitive documents are stored with restricted access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Customer data related to bookings will be retained only as long as necessary for
                legal, accounting, or operational purposes.
              </li>
              <li>
                Copies of driver’s license and passport may be securely deleted after the rental
                period, unless retention is required by law.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Cookies & Website Usage</h2>
            <p>
              Our website may use cookies or similar technologies to enhance your browsing
              experience and analyze site traffic. You can manage or disable cookies through your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Contact Us</h2>
            <p className="mb-2">
              If you have any questions about this Privacy Policy or how your information is
              handled, please contact:
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