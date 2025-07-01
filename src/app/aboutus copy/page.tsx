import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ContactHeader from "../contact/ContactHeader";
import ContactInfo from "../contact/ContactInfo";
import ContactForm from "../contact/ContactForm";
import ContactCTA from "../components/ContactCTA";


export default function AboutUsPage() {
  return (
    <main>
      <Navbar />
      <ContactHeader />
      <section className="py-16 px-4 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
  <ContactInfo />
  <ContactForm />
</section>

      <ContactCTA />
      <Footer />
    </main>
  );
}
