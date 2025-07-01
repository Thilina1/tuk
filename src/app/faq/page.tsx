import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Content from './Content'
import FaqHeader from "./FaqHeader";


export default function AboutUsPage() {
  return (
    <main>
      <Navbar />
      <FaqHeader/>
        <Content />
      <Footer />
    </main>
  );
}
