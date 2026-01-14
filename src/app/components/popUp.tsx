"use client";

import React, { useEffect } from 'react';

interface PopUpProps {
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-button" onClick={onClose}>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div className="ad-container">
          <div className="top-section">
            <h1 className="ad-title">Explore Sri Lanka<br/>In Your Own Tuk</h1>
          </div>
          <div className="bottom-section">
            <ul className="features-list">
              <li>✅ 100% Legal License</li>
              <li>✅ 2025 Brand New Tuks | Cabrio Tuks | Electric Tuks</li>
              <li>✅ Fully Insurance</li>
              <li>✅ 24/7 Support</li>
            </ul>
            <div className="pricing-section">
              <p><strong>Lowest Price - Guaranteed</strong></p>
              <p>Starting from Just <span>$7 per Day...</span></p>
            </div>
            <button className="book-now-button" onClick={onClose}>
              Book Now
            </button>
            <h3 className="demand-alert">⚡ Hurry up – Demand is already high this Season!</h3>
          </div>
        </div>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
          display: flex; justify-content: center; align-items: center; z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }
        .popup-content {
          background-color: #ffeb3b; /* Yellow background */
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
          overflow: hidden;
        }
        .popup-close-button {
          position: absolute; top: 10px; right: 10px;
          background: #4CAF50; /* Green */
          border: none; border-radius: 50%;
          width: 36px; height: 36px;
          display: flex; justify-content: center; align-items: center;
          cursor: pointer; z-index: 1001;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .popup-close-button:hover { background-color: #45a049; }

        .ad-container { font-family: Arial, sans-serif; color: #333; }
        
        .top-section { 
          background-color: #e53935; /* Red */
          padding: 20px 10px;
        }
        .ad-title { 
          color: white;
          padding: 0; margin: 0; font-size: 2em; font-weight: bold;
          text-transform: uppercase; line-height: 1.2;
        }
        
        .bottom-section { 
          background-color: #ffeb3b; /* Yellow */
          padding: 15px;
          display: flex; flex-direction: column; align-items: center; 
        }
        
        .features-list { 
          list-style: none; text-align: left; margin: 0 auto 15px auto; padding: 0;
          font-size: 1em; line-height: 1.6;
        }
        .features-list li { margin-bottom: 5px; font-weight: 500; }
        
        .pricing-section { margin-bottom: 15px; }
        .pricing-section p { margin: 2px 0; font-weight: 600; font-size: 1.1em; }
        .pricing-section span { color: #16a34a; font-weight: 700; }
        
        .demand-alert { 
          font-size: 1.2em; color: #e53935; /* Red */
          font-weight: bold; text-transform: uppercase; margin-top: 15px; margin-bottom: 15px;
        }
        
        .book-now-button {
          background-color: #4CAF50; /* Green */
          color: white; padding: 12px 25px; border: none; border-radius: 5px;
          cursor: pointer; font-size: 1.2em; font-weight: bold; width: 100%; max-width: 400px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .book-now-button:hover { background-color: #45a049; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; } }

        @media (max-width: 500px) {
          .ad-title { font-size: 1.5em; }
        }
      `}</style>
    </div>
  );
};

export default PopUp;
