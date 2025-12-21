'use client';

import { easeInOut, motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useLayoutEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

// --- Types ---
interface Blog {
  id: string;
  contentImage: string;
  title: string;
  previewDescription: string;
  featured?: boolean;
}

// --- Animation Variants ---
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeInOut } },
};

// --- Skeleton Component ---
const BlogCardSkeleton = () => (
  <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-md bg-white animate-pulse">
    <div className="relative h-48 bg-gray-200"></div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4 mt-auto"></div>
    </div>
  </div>
);

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const blogsCollection = collection(db, 'blogs');
        const q = query(blogsCollection, where("featured", "==", true));
        const blogsSnapshot = await getDocs(q);
        
        const fetchedList = blogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[];
        
        setBlogs(fetchedList.slice(0, 4)); // Take the first 4 featured blogs
      } catch (error) {
        console.error("Firebase Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section
      className="py-16 px-6"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #fef9c3)',
        colorScheme: 'light',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest font-semibold text-[#0d9488]">
            Our Blog
          </p>
          <h2 className="text-4xl font-extrabold mt-2 text-[#0f172a]">
            Read Our Latest Articles
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => <BlogCardSkeleton key={idx} />)
          ) : blogs.length > 0 ? (
            blogs.map((post) => (
              <motion.div
                key={post.id}
                variants={fadeInUp}
                className="flex flex-col h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {post.contentImage && post.contentImage.trim() !== "" ? (
                    <Image
                      src={post.contentImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg leading-tight text-[#0f172a] line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                    {post.previewDescription}
                  </p>

                  <Link
                    href={`/blog/blogsContent/${post.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#7c3aed] hover:underline underline-offset-4"
                  >
                    Read More <FiArrowRight className="mt-0.5" />
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
              No featured articles found.
            </div>
          )}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/blog"
            className="px-8 py-3 bg-[#f59e0b] text-[#0f172a] font-bold rounded-full transition hover:shadow-lg active:scale-95"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}
