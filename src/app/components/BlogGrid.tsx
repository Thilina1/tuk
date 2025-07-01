"use client";

import { easeInOut, motion, Variants } from "framer-motion";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

const articles = [
  {
    title: "🏯 Sigiriya – The Ancient Rock Fortress",
    image: "/blog/friends.jpg",
    excerpt:
      "Climbing Sigiriya is like stepping into an ancient world. As you ascend past centuries-old frescoes and lion paw carvings, the views get better with every step. From the summit, sweeping landscapes stretch out in every direction. It’s not just a hike — it’s a journey through Sri Lanka’s royal history.",
  },
  {
    title: "🕍 Temple of the Sacred Tooth Relic – Kandy",
    image: "/blog/wild.jpg",
    excerpt:
      "This sacred temple in Kandy holds one of Sri Lanka’s most treasured relics — a tooth believed to belong to the Buddha. During the evening ceremonies, the sound of traditional drums and the scent of incense fill the air. It’s a deeply spiritual place that offers a unique glimpse into Buddhist culture.",
  },
  {
    title: "🐘 Yala National Park – Into the Wild",
    image: "/blog/honey.jpg",
    excerpt:
      "Get ready for one of the most thrilling wildlife experiences in Sri Lanka. Yala is home to elephants, crocodiles, sloth bears, and the elusive leopard. As you explore its mix of jungle and open plains, every moment feels like part of a real-life nature documentary.",
  },
  {
    title: "🌊 Arugam Bay – Surf, Chill, Repeat",
    image: "/blog/beach.jpg",
    excerpt:
      "With its world-famous waves and relaxed atmosphere, Arugam Bay is a surfer’s paradise. Even if you're not into surfing, you’ll love the beach cafés, yoga spots, and laid-back vibe. It’s the perfect place to slow down and soak up some sun.",
  },
];

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeInOut, // ✅ imported easing function
    },
  },
};


export default function BlogSection() {
  return (
    <section className="bg-gradient-to-b from-white to-yellow-50 py-4 pb-13 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <p className="text-sm text-teal-600 uppercase tracking-widest font-semibold">
            Our Blog
          </p>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2">
            Read Our Latest Articles
          </h2>
          <p className="text-slate-600 mt-2 text-base max-w-2xl mx-auto">
            Get inspired by stories, guides, and local insights for your Sri Lankan adventures.
          </p>
        </motion.div>

        {/* Blog Grid */}
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
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group relative"
            >
              {/* Image Wrapper with Overlay */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Button */}
                <button className="mt-4 inline-flex items-center gap-1 text-sm text-purple-700 font-semibold group-hover:underline underline-offset-4 transition">
                  Read More <FiArrowRight className="text-base mt-0.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-8 flex justify-center">
                <button className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-2 rounded-full transition shadow-md">
                  More
                </button>
        </div>
      </div>
    </section>
  );
}
