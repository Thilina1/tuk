import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Content from './Content'
import FaqHeader from "./FaqHeader";
import Whatsapp from "../components/whatsapp";



export default function AboutUsPage() {
  return (
    <main>
      <Navbar />
      <FaqHeader/>
        <Content />
      <Footer />
      <Whatsapp/>
    </main>
  );
}
