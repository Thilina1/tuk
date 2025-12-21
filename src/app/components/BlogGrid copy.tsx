'use client';

import { easeInOut, motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const articles = [
  {
    link: '/blog/blogsContent/sigiriya',
    title: '🏯 Sigiriya – The Ancient Rock Fortress',
    image: '/blog/sigiriya.jpg',
    excerpt:
      'Climbing Sigiriya is like stepping into an ancient world. As you ascend past centuries-old frescoes and lion-paw carvings, the views get better with every step. From the summit, sweeping landscapes stretch out in every direction. It’s not just a hike — it’s a journey through Sri Lanka’s royal history.',
  },
  {
    link: '/blog/blogsContent/templeOfTooth',
    title: '🕍 Temple of the Sacred Tooth Relic – Kandy',
    image: '/blog/kandyTemple.jpg',
    excerpt:
      'This sacred temple in Kandy holds one of Sri Lanka’s most treasured relics — a tooth believed to belong to the Buddha. During the evening ceremonies, the sound of traditional drums and the scent of incense fill the air. It’s a deeply spiritual place that offers a unique glimpse into Buddhist culture.',
  },
  {
    link: '/blog/blogsContent/yala',
    title: '🐘 Yala National Park – Into the Wild',
    image: '/blog/yala.jpg',
    excerpt:
      'Get ready for one of the most thrilling wildlife experiences in Sri Lanka. Yala is home to elephants, crocodiles, sloth bears, and the elusive leopard. As you explore its mix of jungle and open plains, every moment feels like part of a real-life nature documentary.',
  },
  {
    link: '/blog/blogsContent/arugambay',
    title: '🌊 Arugam Bay – Surf, Chill, Repeat',
    image: '/blog/arugambay.jpg',
    excerpt:
      "With its world-famous waves and relaxed atmosphere, Arugam Bay is a surfer’s paradise. Even if you're not into surfing, you’ll love the beach cafés, yoga spots, and laid-back vibe. It’s the perfect place to slow down and soak up some sun.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeInOut },
  },
};

interface Blog {
  id: string;
  color: string;
  contentImage: string;
  title: string;
  previewDescription: string;
  featured: boolean;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsCollection = collection(db, 'blogs');
      const blogsSnapshot = await getDocs(blogsCollection);
      const blogsList = blogsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];
      setBlogs(blogsList);
    };

    fetchBlogs();
  }, []);

  return (
    <section
      className="py-4 pt-15 pb-13 px-6"
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #fef9c3)',
        colorScheme: 'light',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <p
            className="text-sm uppercase tracking-widest font-semibold"
            style={{ color: '#0d9488' }}
          >
            Our Blog
          </p>
          <h2
            className="text-4xl font-extrabold mt-2"
            style={{ color: '#0f172a' }}
          >
            Read Our Latest Articles
          </h2>
          <p
            className="mt-2 text-base max-w-2xl mx-auto"
            style={{ color: '#475569' }}
          >
            Get inspired by stories, guides, and local insights for your Sri
            Lankan adventures.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {articles.map((post, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group relative"
              style={{ backgroundColor: '#ffffff' }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
                    opacity: 0.6,
                    transition: 'opacity 300ms',
                  }}
                />
              </div>

              {/* Text */}
              <div className="p-5">
                <h3
                  className="font-semibold text-lg leading-snug line-clamp-2 transition-colors"
                  style={{ color: '#0f172a' }}
                >
                  {post.title}
                </h3>
                <p
                  className="mt-2 text-sm line-clamp-3"
                  style={{ color: '#475569' }}
                >
                  {post.excerpt}
                </p>

                {/* Fixed Color Button */}
                <button
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition hover:underline underline-offset-4"
                  style={{ color: '#7c3aed' }}
                  onClick={() => (window.location.href = post.link)}
                >
                  Read More{' '}
                  <FiArrowRight
                    className="text-base mt-0.5"
                    style={{ color: 'inherit' }}
                  />
                </button>
              </div>
            </motion.div>
          ))}
          {blogs.filter(post => post.featured).map((post, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group relative"
              style={{ backgroundColor: post.color || '#ffffff' }}
            >
              {/* Image */}
              {post.contentImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.contentImage}
                    alt={post.title}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
                      opacity: 0.6,
                      transition: 'opacity 300ms',
                    }}
                  />
                </div>
              )}

              {/* Text */}
              <div className="p-5">
                <h3
                  className="font-semibold text-lg leading-snug line-clamp-2 transition-colors"
                  style={{ color: '#0f172a' }}
                >
                  {post.title}
                </h3>
                <p
                  className="mt-2 text-sm line-clamp-3"
                  style={{ color: '#475569' }}
                >
                  {post.previewDescription}
                </p>

                {/* Fixed Color Button */}
                <button
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition hover:underline underline-offset-4"
                  style={{ color: '#7c3aed' }}
                  onClick={() =>
                    (window.location.href = `/blog/blogsContent/${post.id}`)
                  }
                >
                  Read More{' '}
                  <FiArrowRight
                    className="text-base mt-0.5"
                    style={{ color: 'inherit' }}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More Button */}
        <div className="mt-8 flex justify-center">
          <button
            className="text-sm font-semibold px-6 py-2 rounded-full transition shadow-md hover:shadow-lg"
            style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
            }}
            onClick={() => (window.location.href = '/blog')}
          >
            More
          </button>
        </div>
      </div>
    </section>
  );
}
