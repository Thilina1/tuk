import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import  Content from './Content'
import BlogHeader from "./BlogHeader";
import Whatsapp from "../components/whatsapp";



export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <BlogHeader />
        <Content />
      <Footer />
      <Whatsapp />
    </main>
  );
}
