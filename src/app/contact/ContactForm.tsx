"use client";

export default function ContactForm() {
  return (
    <div
      className="p-8 w-full shadow-lg bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero/coconut-bg.jpg')",
        borderRadius: "0", // no rounded corners
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)", // white background with opacity
          padding: "2rem",
          borderRadius: "0", // remove rounded corners
        }}
      >
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1F2937" }}>
            Any Questions?
          </h3>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FACC15" }}>
            Let Us Know
          </h2>
        </div>

        <form className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Your Name*"
              required
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                outline: "none",
                borderRadius: "0",
              }}
              className="focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              placeholder="Your Email*"
              required
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #D1D5DB",
                outline: "none",
                borderRadius: "0",
              }}
              className="focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <input
            type="text"
            placeholder="Subject*"
            required
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #D1D5DB",
              outline: "none",
              borderRadius: "0",
            }}
            className="focus:ring-2 focus:ring-yellow-400"
          />

          <textarea
            placeholder="Write Your Message"
            rows={5}
            required
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #D1D5DB",
              outline: "none",
              borderRadius: "0",
            }}
            className="focus:ring-2 focus:ring-yellow-400"
          ></textarea>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#FACC15",
                color: "#ffffff",
                fontWeight: 600,
                padding: "0.75rem 1.5rem",
                borderRadius: "0",
                transition: "background-color 0.3s ease",
              }}
              className="hover:bg-yellow-600"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
