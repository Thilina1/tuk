'use client';

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import { colorPalettes, Palette } from '@/config/colorPalettes';
import Whatsapp from "../../../components/whatsapp";

// Define the interface based on your form structure
interface BlogPost {
  title: string;
  titleDescription: string;
  previewHeader: string;
  previewDescription: string;
  header1: string;
  content1: string;
  content2: string;
  contentImage: string;
  color: string;
  tags: string[];
  proTips: { title: string; description: string; buttonText: string }[];
  proTipButtonText?: string; // Optional since it might not exist in all blogs
  bookingButtonText: string;
  bookingButtonContent: string;
}

export default function BlogPostDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    // Force Light Mode styles
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
    document.body.style.colorScheme = "light";

    const fetchBlog = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "blogs", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const blogData = docSnap.data() as BlogPost;
          setBlog(blogData);
          setPalette(colorPalettes[blogData.color] || colorPalettes.amber);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!blog || !palette) return <div className="min-h-screen flex items-center justify-center">Post not found.</div>;

  return (
    <>
      <Navbar />
      <Head>
        <meta name="color-scheme" content="light only" />
        <title>{blog.title} | Tuk Tuk Drive</title>
      </Head>

      <div className="light bg-white text-gray-800">
        <main className="bg-white text-gray-800 min-h-screen font-sans">
          {/* Hero Section */}
          <section
            className="relative py-12 px-4 text-center shadow-sm"
            style={{ background: palette.hero_gradient }}
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xs tracking-widest uppercase font-bold" style={{ color: palette.primary_color }}>
                {blog.previewHeader || "Blog Post"}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
                {blog.title}
              </h1>
              <p className="mt-4 text-gray-700 text-sm md:text-base leading-relaxed">
                {blog.header1}
              </p>
            </div>
          </section>

          {/* Layout */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
            
            {/* Main content */}
            <article className="prose prose-lg max-w-none text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: blog.content1 }} />

              {blog.contentImage && (
                <Image
                  src={blog.contentImage}
                  width={1200}
                  height={700}
                  alt={blog.title}
                  className="rounded-xl shadow-md my-8"
                />
              )}

              <div dangerouslySetInnerHTML={{ __html: blog.content2 }} />

              <div className="flex flex-wrap gap-2 mt-8">
                {blog.tags?.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div
                className="rounded-2xl shadow p-6 text-center"
                style={{
                  background: palette.share_gradient,
                  border: `1px solid ${palette.share_border_color}`,
                }}
              >
                <h3 className="text-sm font-semibold mb-4" style={{ color: palette.primary_color }}>
                  Share this story
                </h3>
                <div className="flex justify-center gap-4">
                  {[FaXTwitter, FaFacebookF, FaLinkedinIn, FaWhatsapp].map((Icon, i) => (
                    <a
                      key={i}
                      href="#" // Replace with actual share URLs
                      aria-label="Share"
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow hover:scale-105 transition"
                      style={{
                        backgroundColor: palette.share_icon_bg_color,
                        color: palette.share_icon_color,
                      }}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>


                        {/* Booking Promo */}
          <div className="rounded-xl shadow-sm p-6 flex flex-col justify-between" style={{
                  background: palette.share_gradient,
                  border: `1px solid ${palette.share_border_color}`,
                }}>
            <div>
              <h3 className="text-lg font-bold text-orange-800">🧭 Explore with Ease</h3>
              <p className="mt-2 text-sm text-gray-600">
                {blog.bookingButtonContent}
              </p>
            </div>
            <a
              href="/index"
              className="mt-4 inline-block text-center font-semibold bg-orange-400 text-orange-900 px-4 py-2 rounded-full shadow hover:bg-orange-300 transition"
            >
              {blog.bookingButtonText} →
            </a>
          </div>

              {blog.proTipButtonText && (
                <div
                  className="text-center rounded-xl p-6 shadow-lg"
                  style={{ background: palette.button_container_gradient }}
                >
                  <Link
                    href="https://www.tuktukdrive.com/"
                    className="inline-block w-full text-white font-semibold px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
                    style={{ backgroundImage: palette.button_gradient }}
                  >
                    {blog.proTipButtonText}
                  </Link>
                </div>
              )}

              {blog.proTips && blog.proTips.length > 0 && (
                <div
                  className="rounded-xl shadow-sm p-6"
                  style={{ backgroundColor: palette.pro_tips_bg_color }}
                >
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    🌟 Pro Tips
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                    {blog.proTips.map((tip, index) => (
                      <li key={index}>
                        <strong>{tip.title}</strong> – {tip.description}.
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>
      <Footer />
      <Whatsapp/>
    </>
  );
}
