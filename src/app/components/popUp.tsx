"use client";

import React from 'react';

interface PopUpProps {
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
      <button className="popup-close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="tuk-tuk-ad-container">
        <div className="top-section">
        <h1 className="ad-title" style={{ margin: '0 35px' }}>Most Affordable Tuk Tuk Rental Service in Sri Lanka</h1>
          <img src="/add/add1.jpeg" alt="Tuk Tuk Comparison" style={{ width: '100%', height: 'auto', display: 'block', marginBottom: '10px' }} />
        </div>
          <div className="bottom-section">
            <h2 className="bottom-title">Ride Sri Lanka Legally & Safely With <span className="highlight-text">Tuk Tuk Drive</span></h2>
            <ul className="safety-features">
              <li>Authorised by Sri Lankan Government</li>
              <li>Issuing 100% legal & valid Sri Lankan permit</li>
              <li>2025 manufactured tuk tuks available</li>
              <li>Guaranteed 100% perfect technical condition during rental</li>
            </ul>
            <h3 className="demand-alert">HURRY UP! IT&apos;S HIGH DEMAND SEASON</h3>
            <button className="book-now-button" onClick={onClose}>
              Book Now!
            </button>
          </div> {/* End bottom-section */}

        </div> {/* End tuk-tuk-ad-container */}
      </div>

      {/* Styled-jsx for component-scoped CSS */}
      <style jsx>{`
          /* --- Popup Overlay and Content --- */
          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
          }

          .popup-content {
            background-color: rgba(255, 255, 255, 0.85);
            border-radius: 10px;
            padding: 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 650px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: fadeInScale 0.3s ease-out;
            border: none;
          }

          .popup-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #4CAF50; /* Green background */
            border: none;
            border-radius: 50%; /* Circular shape */
            width: 36px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 1001;
            transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* Highlight effect */
          }

          .popup-close-button:hover {
            background-color: #45a049; /* Darker green on hover */
            transform: scale(1.1); /* Slight scale-up for emphasis */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Enhanced shadow on hover */
          }

          .popup-close-button:active {
            transform: scale(0.95); /* Slight press effect */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .popup-close-button svg {
            display: block;
          }

          /* --- Tuk Tuk Ad Specific Styles --- */
          .tuk-tuk-ad-container {
            font-family: Arial, sans-serif;
            color: #333;
            border-radius: 10px;
            overflow: hidden;
          }

          .top-section {
            background-color: #e53935; /* Dark background for the top */
            color: white; /* White text for contrast */
            padding: 0; /* Adjust padding as needed */
            width: 100%; /* Full width */
          }

          .ad-title {
            background-color: #e53935;
            color: white;
            padding: 10px 8px;
            margin: 0;
            font-size: 1.4em;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.7px;
          }

          .bottom-section {
            background-color: #ffeb3b;
            padding: 15px;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .bottom-title {
            font-size: 1.1em;
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: bold;
          }

          .highlight-text {
            color: #e53935;
          }

          .safety-features {
            list-style-type: disc;
            text-align: left;
            margin: 0 auto 10px auto;
            padding-left: 20px;
            max-width: 400px;
            font-size: 0.9em;
            line-height: 1.5;
          }

          .safety-features li {
            margin-bottom: 3px;
          }

          .demand-alert {
            font-size: 1.2em;
            color: #e53935;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 15px;
          }

          .book-now-button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.2em;
            font-weight: bold;
            transition: background-color 0.2s ease, transform 0.1s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .book-now-button:hover {
            background-color: #45a049;
            transform: translateY(-1px);
          }

          .book-now-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          /* --- Animations --- */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* --- Responsive Adjustments --- */
          @media (max-width: 650px) {
            .popup-content {
              max-width: 90%;
            }
          }

          @media (max-width: 500px) {
            .ad-title {
              font-size: 1.2em;
              padding: 10px 5px;
            }
            .bottom-title {
              font-size: 1.1em;
            }
            .safety-features {
              font-size: 0.85em;
              padding-left: 10px;
            }
            .demand-alert {
              font-size: 1.0em;
            }
            .book-now-button {
              padding: 10px 20px;
              font-size: 1.1em;
            }
            .popup-close-button {
              width: 32px;
              height: 32px;
            }
            .popup-close-button svg {
              width: 20px;
              height: 20px;
            }
          }
        `}</style>
    </div>
  );
};

export default PopUp;