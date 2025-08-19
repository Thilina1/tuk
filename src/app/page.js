"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import Vehicles from "./components/VehicleGrid";
import Reviews from "./components/Reviews";
import BookingProcess from "./components/BookingProcess";
import Specialities from "./components/Specialities";
import Locations from "./components/Locations";
import BlogSection from "./components/BlogGrid";
import Hero from "./components/Hero";
import WhoWeAre from "./components/WhoAreWe";
import FAQ from "./components/FAQ";
import Whatsapp from "./components/whatsapp";
import { useState } from "react";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main>
      <Navbar />
      <Hero onModalChange={setIsBookingOpen} />
      <Reviews />
      <WhoWeAre />
      <BookingProcess />
      <Vehicles />
      <Specialities />
      <Testimonials />
      <BlogSection />
      <Locations />
      <FAQ />
      <Footer />
      {!isBookingOpen && <Whatsapp />}
    </main>
  );
}
