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
          🏰 Sigiriya Rock Fortress
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-800">
          Sigiriya: The Lion Rock of Sri Lanka
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
          Discover the legendary rock fortress of Sigiriya, an ancient engineering marvel, royal citadel, and UNESCO World Heritage Site — nestled in the cultural heart of Sri Lanka.

          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 py-12 px-4 md:px-8">
        {/* Main content */}
        <article className="prose prose-lg max-w-none text-gray-700">
          <p>
          Sigiriya, often dubbed the Eighth Wonder of the World, is a majestic rock fortress rising nearly 200 meters (660 feet) above the surrounding plains. Located in the heart of Sri Lanka, this UNESCO World Heritage Site is famed for its historical significance, architectural brilliance, and breathtaking views.
          </p>

          <Image
            src="/blog/blogPost/kandy_lake.jpeg"
            width={1200}
            height={700}
            alt="Kandy Lake"
            className="rounded-xl shadow-md my-8"
          />

<p>
            The fortress was constructed by King Kashyapa I in the 5th century AD as a royal palace and military stronghold. The site includes remarkable features such as the Mirror Wall, which was once so polished it reflected the king himself, and the world-famous frescoes known as the Sigiriya Damsels — paintings of graceful women with intricate jewelry and flowing garments.
          </p>

          <h2>Architectural Brilliance</h2>
          <p>
            Sigiriya’s layout reflects advanced urban planning with symmetrical water gardens, terraced landscapes, and an ingenious hydraulic system. The Lion’s Gate, flanked by two massive lion paws carved into the rock, leads to a stairway that ascends to the summit. At the top, visitors find the remains of a royal palace complex complete with bathing pools and panoramic views.
          </p>



          <h2>A Living Legacy</h2>
          <p>
            Today, Sigiriya stands as a symbol of Sri Lanka’s rich cultural history and enduring spirit. It continues to attract travelers, archaeologists, and history lovers from around the world, drawn by its mystery, beauty, and the tale of ambition carved into stone.
          </p>

          <p>
            Whether you’re climbing to the top for the view or exploring the ancient stories that linger in its walls, Sigiriya offers an unforgettable glimpse into the island’s royal past.
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
