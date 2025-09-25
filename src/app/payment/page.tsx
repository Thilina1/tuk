import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Header from "./ContactHeader";
import ContactInfo from "./ContactInfo";
import ContactCTA from "../components/ContactCTA";
import Whatsapp from "../components/whatsapp";


export default function ContactUsPage() {
  return (
    <main className="bg-white text-gray-800">
      <Navbar />
      <Header />
        <ContactInfo />
        <ContactCTA />
      <Footer />
      <Whatsapp />
    </main>
  );
}
