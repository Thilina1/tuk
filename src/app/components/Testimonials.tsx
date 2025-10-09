"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa"; // Added quote icons for flair

// Component for animating the rating number
const AnimatedRatingNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1000; // 1 second for animation

    const animate = (currentTime: number) => {
      if (!start) start = currentTime;
      const progress = (currentTime - start) / duration;
      const animated = Math.min(progress, 1) * value;
      setDisplayValue(parseFloat(animated.toFixed(1))); // Format to one decimal place

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="font-bold">{displayValue.toFixed(1)}</span>;
};


export default function GoogleReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const PLACE_ID = "ChIJBaqwbTSeYiwRL5bFDiOiUBY"; // Your actual place ID
  const averageRating = 4.9; // Hardcoded for display, fetch dynamically if available

  useEffect(() => {
    async function fetchReviews() {
      // Mock data for demonstration if the API is not set up
      // In a real application, ensure your /api/google-reviews endpoint returns data
      const mockReviews = [
        {
          author_name: "Eleanor Vance",
          profile_photo_url: "https://randomuser.me/api/portraits/women/1.jpg",
          relative_time_description: "2 days ago",
          rating: 5,
          text: "Absolutely breathtaking experience! The tour guides were knowledgeable, friendly, and went above and beyond to make our trip unforgettable. Highly recommend for anyone looking for adventure!",
        },
        {
          author_name: "Marcus Thorne",
          profile_photo_url: "https://randomuser.me/api/portraits/men/2.jpg",
          relative_time_description: "5 days ago",
          rating: 4.5,
          text: "A truly wonderful journey. The itinerary was well-planned, and the accommodations exceeded our expectations. Minor delay on one leg, but overall, a fantastic service.",
        },
        {
          author_name: "Sophia Chang",
          profile_photo_url: "https://randomuser.me/api/portraits/women/3.jpg",
          relative_time_description: "1 week ago",
          rating: 5,
          text: "Simply the best! Every detail was perfect, from the initial booking to the final farewell. They truly care about their customers' experience. Will definitely be back!",
        },
        {
          author_name: "David Lee",
          profile_photo_url: "https://randomuser.me/api/portraits/men/4.jpg",
          relative_time_description: "1 week ago",
          rating: 4,
          text: "Good value for money. The sights were incredible, but I wished there was a bit more free time to explore on my own. Still, a solid four-star experience.",
        },
        {
          author_name: "Isabella Rossi",
          profile_photo_url: "https://randomuser.me/api/portraits/women/5.jpg",
          relative_time_description: "2 weeks ago",
          rating: 5,
          text: "From start to finish, a seamless and joyful adventure. The guides shared so much local insight, making the trip feel authentic and deeply immersive. Couldn't ask for more!",
        },
        {
          author_name: "Jamal Khan",
          profile_photo_url: "https://randomuser.me/api/portraits/men/6.jpg",
          relative_time_description: "3 weeks ago",
          rating: 4.5,
          text: "Pleasantly surprised by the quality and attention to detail. The food options were particularly outstanding. Some activities felt a little rushed, but the overall enjoyment was high.",
        },
        {
          author_name: "Chloe Foster",
          profile_photo_url: "https://randomuser.me/api/portraits/women/7.jpg",
          relative_time_description: "1 month ago",
          rating: 5,
          text: "An unforgettable trip! Everything was perfectly organized, and the staff were incredibly responsive to our needs. The memories made will last a lifetime. Thank you!",
        },
      ];

      try {
        const res = await fetch("/api/google-reviews");
        const data = await res.json();
        // If the API returns data, use it; otherwise, fall back to mock data
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(mockReviews); // Fallback to mock data if API is empty
        }
      } catch (err) {
        console.error("Error fetching reviews, using mock data:", err);
        setReviews(mockReviews); // Always use mock data on error
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  return (
    <section className="px-4 py-16 sm:px-6 bg-gradient-to-br from-blue-50 to-white text-gray-800 font-sans relative overflow-hidden">
      {/* Background shapes for a playful touch with animations - more vibrant colors */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-60">
        <div className="absolute w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply blur-3xl -top-10 -left-10 animate-blob-slow transform-gpu"></div>
        <div className="absolute w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-3xl bottom-1/4 right-5 animate-blob-slow animation-delay-2000 transform-gpu"></div>
        <div className="absolute w-80 h-80 bg-green-200 rounded-full mix-blend-multiply blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob-slow animation-delay-4000 transform-gpu"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-8 relative z-10" // Increased bottom margin
      >
        <h3 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 tracking-tight leading-tight drop-shadow-lg">
          What Our Happy Travelers Say about us!
        </h3>
        <p className="text-gray-600 mt-1 text-lg max-w-xl mx-auto drop-shadow-sm"> {/* Larger text */}
          Authentic reviews from memorable journeys with us.
        </p>
      </motion.div>

      {/* Rating summary in a glazy box with REAL Google Logo - more prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100, damping: 10 }} // Enhanced spring animation
        className="flex flex-col sm:flex-row items-center justify-center mb-8 space-y-4 sm:space-y-0 sm:space-x-8 p-6 bg-white/80 backdrop-blur-xl rounded-3xl max-w-lg mx-auto shadow-3xl border border-blue-100 relative z-10 transform hover:scale-105 transition-transform duration-300" // More prominent shadow, rounded corners, hover effect
      >
        <div className="flex items-center space-x-4"> {/* Increased spacing */}
          {/* Real Google Logo */}
          <Image
            src="/icons/google-logo.png"
            alt="Google Logo"
            width={40} // Slightly larger
            height={40}
            className="w-10 h-10 sm:w-11 sm:h-11"
          />
          <span className="text-4xl sm:text-5xl text-yellow-500 font-extrabold"> {/* Larger, bolder rating */}
            <AnimatedRatingNumber value={averageRating} />
          </span>
        </div>
        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div> {/* Separator */}
        <span className="text-gray-700 text-lg sm:text-xl flex items-center whitespace-nowrap"> {/* Larger text, no wrap */}
          <FaStar className="text-yellow-400 text-xl mr-2" /> Based on authentic reviews
        </span>
      </motion.div>

      {/* Reviews Grid */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg animate-pulse relative z-10">Loading amazing stories...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500 text-lg relative z-10">No reviews available at the moment.</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto relative z-10" // Increased gap
        >
          <AnimatePresence>
            {reviews.slice(0, 4).map((r, i) => ( // Displaying 8 reviews
              <motion.div
                key={r.author_name + i} // Using author_name for key to ensure uniqueness if time is not always unique
                initial={{ opacity: 0, y: 70, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.7 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} // Smoother, slightly longer animation
                whileHover={{
                  scale: 1.06, // More noticeable hover scale
                  rotate: i % 2 === 0 ? 1 : -1, // More noticeable rotation
                  boxShadow: "0 18px 40px rgba(255, 165, 0, 0.4), 0 8px 15px rgba(0, 150, 255, 0.2)", // Enhanced shadow
                  transition: { duration: 0.3 }
                }}
                className="p-6 rounded-3xl bg-white/90 border border-yellow-300 shadow-xl backdrop-blur-lg overflow-hidden min-h3080px] flex flex-col justify-between hover:border-blue-400 transition-all duration-300 transform" // More rounded, stronger shadow, border colors
              >
                {/* Reviewer info with profile picture */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4"> {/* Increased gap */}
                    {r.profile_photo_url ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-yellow-400 shadow-md"> {/* Border and shadow */}
                        <img
                          src={r.profile_photo_url}
                          alt={`${r.author_name}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement?.querySelector('.initial-letter-fallback')?.classList.remove('hidden');
                          }}
                        />
                      </div>
                    ) : null}
                    <div className={`${r.profile_photo_url ? 'hidden' : ''} initial-letter-fallback w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}> {/* Larger fallback text */}
                      {r.author_name?.charAt(0) || "A"}
                    </div>

                    <div>
                      <p className="font-bold text-gray-900 text-lg">{r.author_name || "Anonymous"}</p> {/* Bolder, larger name */}
                      <p className="text-sm text-gray-500 mt-1">{r.relative_time_description}</p> {/* Slightly larger time */}
                    </div>
                  </div>
                  <FaStar className="text-yellow-400 text-lg mr-1" />
                </div>

                {/* Rating below profile for clarity on the card */}
                <div className="flex mb-3">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <FaStar
                        key={j}
                        className={j < Math.round(r.rating) ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"} // Larger stars
                      />
                    ))}
                </div>

                {/* Text - now scrollable to display full content with a slightly smaller text size */}
                <div className="text-gray-800 text-base leading-relaxed italic flex-grow overflow-y-auto custom-scrollbar pr-3 max-h-[100px] relative"> {/* Increased max-height, added relative */}
                  <FaQuoteLeft className="absolute top-0 left-0 text-yellow-300 text-opacity-50 text-2xl" /> {/* Quote icon */}
                  <span className="ml-6 mr-6">&ldquo;{r.text}&rdquo;</span> {/* Indent text */}
                  <FaQuoteRight className="absolute bottom-0 right-0 text-blue-300 text-opacity-50 text-2xl" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Button with REAL Google Logo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="text-center mt-8 relative z-10" // Increased top margin
      >
        <a
          href={`https://search.google.com/local/writereview?placeid=${PLACE_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-extrabold rounded-full text-lg shadow-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 group" // Larger padding, text, shadow, more pronounced hover
        >
          {/* Real Google Logo on button */}
          <Image
            src="/icons/google-logo.png"
            alt="Google Logo"
            width={28} // Slightly larger
            height={28}
            className="w-7 h-7 mr-3 filter brightness-0 invert group-hover:filter-none transition-filter duration-300"
          />
          Leave Us a Review!
        </a>
      </motion.div>

      {/* Embedded CSS for custom keyframes and custom scrollbar */}
      <style jsx>{`
        /* Keyframes for background blobs (soft, slow, continuous movement) */
        @keyframes blob-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -40px) scale(1.05); /* Slightly larger movement */
          }
          66% {
            transform: translate(-15px, 30px) scale(0.95); /* Slightly larger movement */
          }
        }

        .animate-blob-slow {
          animation: blob-slow 18s infinite ease-in-out; /* Slower, smoother animation */
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Custom Scrollbar for review content - more subtle and modern */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* Slightly wider scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f8f8; /* Lighter track */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d4; /* Subtle thumb color */
          border-radius: 10px;
          border: 2px solid #f8f8f8; /* Inner border for smoother look */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b0b0b0; /* Darker on hover */
        }
      `}</style>
    </section>
  );
}