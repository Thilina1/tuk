import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Header from "./returnheader";
import Termns from "./return";
import ContactCTA from "../components/ContactCTA";

export default function ContactUsPage() {
  return (
    <main className="bg-white text-gray-800">
      <Navbar />
      <Header />
        <Termns />
      <ContactCTA />
      <Footer />
    </main>
  );
}
