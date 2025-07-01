// app/contactus/ContactForm.tsx
"use client";

export default function ContactForm() {
  return (
    <div
      className="p-8 w-full rounded-lg shadow-lg bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero/coconut-bg.jpg')",
      }}
    >
      <div className="bg-opacity-90 p-8 rounded-lg">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800">Any Questions?</h3>
          <h2 className="text-2xl text-yellow-500 font-bold">Let Us Know</h2>
        </div>

        <form className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Your Name*"
              required
              className="bg-white bg-opacity-90 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              placeholder="Your Email*"
              required
              className="bg-white bg-opacity-90 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <input
            type="text"
            placeholder="Subject*"
            required
            className="bg-white bg-opacity-90 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <textarea
            placeholder="Write Your Message"
            rows={5}
            required
            className="bg-white bg-opacity-90 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>

          <div className="text-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-md transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
