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
import FreelyIncluded from "./components/FreelyIncluded";
import Whatsapp from "./components/whatsapp";
import PopUp from "./components/popUp";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname from Next.js

const HAS_SHOWN_AD_KEY = "hasShownAdPopup";

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const pathname = usePathname(); // Get the current URL path

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasShownAd = sessionStorage.getItem(HAS_SHOWN_AD_KEY);

    // Show popup only if it hasn't been shown in this session and the current path is the base URL ("/")
    if (!hasShownAd && pathname === "/") {
      setShowAdPopup(true);
      // Set the flag in sessionStorage to prevent showing the popup again in this session
      sessionStorage.setItem(HAS_SHOWN_AD_KEY, "true");
    }
  }, [pathname]); // Re-run effect when pathname changes

  const handleCloseAdPopup = () => {
    setShowAdPopup(false);
  };



  return (
    <main>
      {showAdPopup && <PopUp onClose={handleCloseAdPopup} />}
      <Navbar />
      <Hero onModalChange={setIsBookingOpen} />
      <Reviews />
      <WhoWeAre />
      <Vehicles />
      <Specialities />
      <BookingProcess />
      <Testimonials />
      <BlogSection />
      <Locations />
      <FAQ />
      <FreelyIncluded />
      <Footer />
      {!isBookingOpen && <Whatsapp />}
    </main>
  );
}
