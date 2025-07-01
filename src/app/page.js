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

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Reviews />
      <WhoWeAre/>
      <BookingProcess/>
      <Vehicles />
      <Specialities/>
      <Testimonials/>
      <BlogSection/>
      <Locations/>
      <FAQ/>
      <Footer />
      <Whatsapp/>

    </main>
  );
}
