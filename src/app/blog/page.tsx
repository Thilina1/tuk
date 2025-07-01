import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import  Content from './Content'
import BlogHeader from "./BlogHeader";


export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <BlogHeader />
        <Content />
      <Footer />
    </main>
  );
}
