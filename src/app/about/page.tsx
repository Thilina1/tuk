import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Content from './Content'
import ContactHeader from "./AboutHeader";


export default function AboutUsPage() {
  return (
    <main>
      <Navbar />
      <ContactHeader />
        <Content />
      <Footer />
    </main>
  );
}
