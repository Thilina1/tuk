"use client";

import {
  FaRegSmile,
  FaGlobeAsia,
  FaClock,
  FaMoneyBillWave,
  FaRoute,
  FaHandshake,
} from "react-icons/fa";

export default function Content() {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #fef3c7, #ffffff)", // from-yellow-50 to-white
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        padding: "4rem 2rem",
        color: "#1f2937", // text-gray-800
      }}
    >
      {/* About Description */}
      <div style={{ textAlign: "center", maxWidth: "64rem", margin: "0 auto", marginBottom: "4rem" }}>
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            color: "#111827", // text-gray-900
            marginBottom: "1rem",
          }}
        >
          About TukTuk Drive
        </h2>
        <p style={{ fontSize: "1.125rem", color: "#374151", marginBottom: "1rem" }}>
          <strong>TukTuk Drive</strong> isn&apos;t just about transportation — it&apos;s about transformation.
        </p>
        <p style={{ color: "#4B5563" }}>
          From sandy coasts to misty hills, we provide more than just a vehicle. We offer training, curated routes, real-time support, and a warm welcome that makes every mile unforgettable.
        </p>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          maxWidth: "72rem",
          margin: "0 auto",
        }}
      >
        {[
          {
            icon: <FaRegSmile style={{ color: "#FACC15", fontSize: "2rem", marginBottom: "1rem" }} />,
            title: "Friendly Support",
            desc: "24/7 human help, in your language. We&apos;re locals, and we care.",
          },
          {
            icon: <FaRoute style={{ color: "#059669", fontSize: "2rem", marginBottom: "1rem" }} />,
            title: "Custom Routes",
            desc: "Pre-mapped scenic drives or off-the-grid adventures — your choice.",
          },
          {
            icon: <FaGlobeAsia style={{ color: "#3B82F6", fontSize: "2rem", marginBottom: "1rem" }} />,
            title: "Authentic Exploration",
            desc: "Experience Sri Lanka beyond tourist spots. Connect with real culture.",
          },
          {
            icon: <FaMoneyBillWave style={{ color: "#8B5CF6", fontSize: "2rem", marginBottom: "1rem" }} />,
            title: "Transparent Pricing",
            desc: "All-inclusive, no hidden fees. What you see is what you pay.",
          },
          {
            icon: <FaClock style={{ color: "#EC4899", fontSize: "2rem", marginBottom: "1rem" }} />,
            title: "Instant Booking",
            desc: "Get on the road in minutes with a few simple steps.",
          },
          {
            icon: <FaHandshake style={{ color: "#10B981", fontSize: "2rem", marginBottom: "1rem" }} />,
            title: "Built on Trust",
            desc: "Thousands of happy explorers, 5-star reviews, and growing.",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#ffffff",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.1)",
              transition: "box-shadow 0.3s ease",
              border: "1px solid #E5E7EB",
            }}
          >
            {item.icon}
            <h4 style={{ fontWeight: 600, fontSize: "1.125rem", color: "#1F2937", marginBottom: "0.5rem" }}>
              {item.title}
            </h4>
            <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Vision/Quote */}
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <blockquote
          style={{
            fontStyle: "italic",
            color: "#475569",
            fontSize: "1.125rem",
            maxWidth: "36rem",
            margin: "0 auto",
          }}
        >
          &ldquo;Not all those who wander are lost.&rdquo; –{" "}
          <span style={{ fontWeight: 600 }}>J.R.R. Tolkien</span>
        </blockquote>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6B7280" }}>
          ...and with TukTuk Drive, you&apos;ll always find adventure.
        </p>
      </div>
    </div>
  );
}
