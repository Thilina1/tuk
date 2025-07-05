import Image from "next/image";
import {
  FaXTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

export default function Kandy() {
  return (
    <main className="bg-white min-h-screen font-sans text-gray-800">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-amber-100 to-orange-50 py-12 px-4 text-center shadow-sm">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-amber-700">
            🏞️ Kandy World Heritage
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
            A Journey Through Kandy’s Cultural Heart
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
            Discover the sacred city of Kandy — home to timeless traditions,
            spiritual serenity, and stunning natural beauty nestled in Sri
            Lanka’s hill country.
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Main content */}
        <article className="prose prose-lg max-w-none text-gray-700">
          <p>
            Kandy, the last royal capital of Sri Lanka, stands as a living
            testament to the island’s rich heritage. Its spiritual center is
            the Temple of the Sacred Tooth Relic, which draws thousands of
            pilgrims each year. The atmosphere is one of reverence, with
            colorful offerings, rhythmic drumming, and the scent of incense
            filling the air.
          </p>

          <Image
            src="/blog/blogPost/kandy_lake.jpeg"
            width={1200}
            height={700}
            alt="Kandy Lake"
            className="rounded-xl shadow-md my-8"
          />

          <p>
            Walking around the tranquil Kandy Lake, created by the last king of
            Kandy in 1807, you’ll find yourself immersed in the soothing sights
            and sounds of nature. Beyond the lake, narrow streets lead to
            bustling markets full of spices, handicrafts, and street food that
            showcase Sri Lanka’s vibrant daily life.
          </p>

          <h2>The Sacred Festivals</h2>
          <p>
            If you visit in July or August, you may witness the Esala Perahera
            — a grand cultural parade featuring elephants, dancers, drummers,
            and fire-breathers. It’s an unforgettable experience that embodies
            centuries of tradition.
          </p>

          <h2>Botanical Beauty</h2>
          <p>
            Just outside the city, the Royal Botanic Gardens of Peradeniya
            offer lush landscapes and rare plant species, a peaceful escape
            into nature’s splendor.
          </p>

          <p>
            Whether you come for the history, the culture, or the serene
            landscapes, Kandy promises a journey like no other — one that
            leaves a lasting impression on your soul.
          </p>
        </article>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Share */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 shadow p-6 text-center border border-amber-200">
  <h3 className="text-sm font-semibold text-amber-900 mb-4">
    Share this story
  </h3>

  <div className="flex justify-center gap-4">
    {[
      { icon: <FaXTwitter />, label: "Twitter" },
      { icon: <FaFacebookF />, label: "Facebook" },
      { icon: <FaLinkedinIn />, label: "LinkedIn" },
      { icon: <FaWhatsapp />, label: "WhatsApp" },
    ].map(({ icon, label }, i) => (
      <a
        key={i}
        href="#"
        aria-label={label}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-200/40 text-amber-800 shadow hover:bg-amber-300/60 hover:scale-105 transition transform duration-200 ease-out"
      >
        {icon}
      </a>
    ))}
  </div>
</div>


          {/* Booking promo */}
          <div className="rounded-xl bg-amber-50 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-amber-800">
                🚗 Ready to Explore?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Book your tuk tuk today and experience Kandy like a local — at
                your own pace, with the wind in your hair!
              </p>
            </div>
            <a
              href="/book"
              className="mt-4 inline-block text-center font-semibold bg-amber-400 text-amber-900 px-4 py-2 rounded-full shadow hover:bg-amber-300 transition"
            >
              Book Now →
            </a>
          </div>

          {/* Tips */}
          <div className="rounded-xl bg-white shadow-sm p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              🌟 Pro Tips
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Arrive early to beat crowds at the Temple.</li>
              <li>Try local snacks at the market stalls.</li>
              <li>Take a boat ride on the lake for sunset views.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
