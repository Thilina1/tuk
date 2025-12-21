"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Destination from './destination';

// --- Types ---
interface Blog {
  id: string;
  contentImage: string;
  title: string;
  previewDescription: string;
  featured: boolean;
  featuredPosition?: number;
  tags?: string[];
}

// --- Main Component ---
export default function BlogContent() {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [otherBlogs, setOtherBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, 'blogs');
        const allBlogsSnapshot = await getDocs(blogsCollection);
        
        const allBlogs = allBlogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[];

        const featured = allBlogs.filter(b => b.featured === true);
        const nonFeatured = allBlogs.filter(b => b.featured !== true);

        // Sort featured blogs by their position
        const sortedFeatured = featured.sort((a, b) => (a.featuredPosition || 0) - (b.featuredPosition || 0));

        // Top 3 for the trending section
        const trending = sortedFeatured.slice(0, 3);
        // The rest of featured blogs go into the "experiences" section
        const otherFeatured = sortedFeatured.slice(3);

        setFeaturedBlogs(trending);
        setOtherBlogs([...nonFeatured, ...otherFeatured]);

      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const firstFeatured = featuredBlogs[0];
  const nextTwoFeatured = featuredBlogs.slice(1);
  const visibleOtherBlogs = otherBlogs.slice(0, visibleCount);
  const showMoreButton = otherBlogs.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount(otherBlogs.length); // Show all remaining blogs
  };

  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 px-4 md:px-8 space-y-6"
      style={{ backgroundColor: "#ffffff", color: "#1a1a1a", colorScheme: "light" }}
    >
      {/* Trending Topics */}
      <div>
        <div className="text-center mb-12">
          <h4 className="text-4xl font-extrabold" style={{ color: "#1a1a1a" }}>
            Trending Topics on Island Life
          </h4>
          <p className="mt-1 max-w-2xl mx-auto text-sm md:text-base" style={{ color: "#4b5563" }}>
            Discover hidden gems, breathtaking destinations, and cultural treasures across Sri Lanka with our featured articles.
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          featuredBlogs.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Featured Card */}
              {firstFeatured && (
                <div className="rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full h-60 bg-gray-200">
                    {firstFeatured.contentImage && firstFeatured.contentImage.trim() !== "" ? (
                      <Image src={firstFeatured.contentImage} alt={firstFeatured.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{firstFeatured.title}</h3>
                    <div className="flex flex-wrap gap-2 my-2">
                        {firstFeatured.tags?.map((tag, idx) => (
                            <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-5 line-clamp-3">{firstFeatured.previewDescription}</p>
                    <Link href={`/blog/blogsContent/${firstFeatured.id}`}>
                      <button className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300" style={{ backgroundColor: "#facc15", color: "#1f2937" }}>
                        View Blog
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Right Column Cards */}
              <div className="md:col-span-2 flex flex-col gap-6">
                {nextTwoFeatured.map(blog => (
                  <div key={blog.id} className="rounded-2xl shadow-lg border flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative w-full md:w-1/2 h-60 bg-gray-200">
                      {blog.contentImage && blog.contentImage.trim() !== "" ? (
                        <Image src={blog.contentImage} alt={blog.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col justify-between md:w-1/2">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                        <div className="flex flex-wrap gap-2 my-2">
                            {blog.tags?.map((tag, idx) => (
                                <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{blog.previewDescription}</p>
                      </div>
                      <div className="mt-4">
                        <Link href={`/blog/blogsContent/${blog.id}`}>
                          <button className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300" style={{ backgroundColor: "#facc15", color: "#1f2937" }}>
                            View Blog
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* DESTINATIONS Section */}
      <Destination />

      {/* EXPERIENCES Section */}
      <section className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold">EXPERIENCES</h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base" style={{ color: "#4b5563" }}>
            At Tuk Tuk Drive, we believe in immersing yourself in local culture and nature.
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {visibleOtherBlogs.map(blog => (
                <div key={blog.id} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border">
                  <div className="relative w-full h-56 bg-gray-200">
                    {blog.contentImage && blog.contentImage.trim() !== "" ? (
                      <Image src={blog.contentImage} alt={blog.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                      <div className="flex flex-wrap gap-2 my-2">
                          {blog.tags?.map((tag, idx) => (
                              <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/blog/blogsContent/${blog.id}`}>
                        <button className="text-sm font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300" style={{ backgroundColor: "#facc15", color: "#1f2937" }}>
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showMoreButton && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleShowMore}
                  className="text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition duration-300"
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "#0f172a",
                  }}
                >
                  More Blogs
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}
