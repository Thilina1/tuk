import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Whatsapp from "../components/whatsapp";

import Header from "./ContactHeader";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import ContactCTA from "../components/ContactCTA";

export default function ContactUsPage() {
  return (
    <main className="bg-white text-gray-800">
      <Navbar />
      <Header />
      <section className="py-16 px-4 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <ContactInfo />
        <ContactForm />
      </section>

      <ContactCTA />
      <Footer />
      <Whatsapp/>
    </main>
  );
}
