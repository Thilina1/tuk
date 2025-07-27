"use client";

import { motion } from "framer-motion";

export default function WhoWeAre() {
  return (
    <section
      className="relative min-h-screen bg-fixed bg-center bg-cover bg-no-repeat flex items-center justify-center px-6 sm:px-8"
      style={{ backgroundImage: "url('/hero/header1 (5).jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <div className=" gap-10 items-center">
            {/* Left: Text Content */}
            <div>
           

              {/* Tagline */}
              <p className="text-sm text-white/80 uppercase tracking-wider text-center md:text-left">
                Authentic Journeys. Local Passion.
              </p>

              {/* Heading */}
              <h3 className="text-4xl font-extrabold text-amber-400 text-center md:text-left mb-2">
                Who Are We
              </h3>

              {/* Divider */}
              <div className="w-16 h-1 bg-amber-400 mx-auto md:mx-0 mb-6 rounded" />

              {/* Paragraphs */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-base md:text-lg leading-relaxed text-slate-100 text-center md:text-left"
              >
                Welcome to <strong>TukTuk Drive Rentals</strong> – your gateway to exploring Sri Lanka
                in true island style. With our premium TukTuks, enjoy unbeatable prices, full driver
                permits, 24/7 roadside support, and optional local tour guides.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-5 text-base md:text-lg leading-relaxed text-slate-100 text-center md:text-left"
              >
                We’re a team of passionate locals and wanderers committed to meaningful travel.
                Our mission is to help you experience Sri Lanka authentically — through its
                vibrant culture, warm communities, and the iconic tuk tuk.
              </motion.p>

              {/* Testimonial */}
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="italic text-white/80 text-center md:text-left mt-6"
              >
                “The best way to experience Sri Lanka is in a TukTuk — with these guys!”
              </motion.blockquote>

              {/* Button */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
  {/* Learn More Button */}
  <button
    type="button"
    className="w-full sm:w-auto font-semibold text-sm py-2 px-5 rounded-lg shadow transition-colors duration-300 bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-90"
    style={{
      backgroundImage: "linear-gradient(to right, #fbbf24, #f97316)",
      color: "#fff",
    }}
    onClick={() => window.location.href = "/aboutus"}

  >
    Learn More About Us
  </button>
</div>

              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
