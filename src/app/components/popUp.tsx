'use client';

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
            <h2 className="ad-title">Explore Sri Lanka<br/>in Your Own Way</h2>
          </div>
          <div className="bottom-section">
            <ul className="features-list">
              <li>✅ 100% Legal Tuk Driving License</li>
              <li>✅ Premium Tuks with Best Service</li>
              <li>✅ 2025 Brand New Tuks | Cabrio Tuks | Electric Tuks Available</li>
              <li>✅ Fully Insurance with 24/7 Roadside Support</li>
              <li>✅ Unlimited Kilometers</li>
              <li>✅ Island wide Deliveries</li>
            </ul>

            <div className="pricing-section">
              <p className="highlight"><strong>Lowest Price in the Market - Guaranteed</strong></p>
              <p className="highlight">Starting from Just <span>$7 per Day...</span></p>
            </div>

            <div className="tuk-types">
              <div className="tuk-column">
                <ul>
                  <li>🛺 Regular Tuk Tuk</li>
                  <li>⚡️ E-Tuk Tuk</li>
                </ul>
              </div>
              <div className="tuk-column">
                <ul>
                  <li>✨ 2025 Brand New Tuks</li>
                  <li>☀️ Cabrio Tuk Tuk</li>
                </ul>
              </div>
            </div>

            <a
              href="https://wa.me/94770063780?text=Hello!%20I'm%20interested%20in%20renting%20a%20tuk-tuk%20and%20would%20like%20more%20details.%20I%20saw%20your%20ad%20and%20I'm%20interested%20in%20the%20lowest%20price%20guarantee%20starting%20from%20$7%20per%20day."
              target="_blank"
              rel="noopener noreferrer"
              className="book-now-button"
            >
              <svg style={{ width: '24px', height: '24px', marginRight: '8px' }} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2.06 22L7.31 20.62C8.75 21.41 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2ZM16.63 15.2C16.42 15.76 15.34 16.32 14.89 16.36C14.44 16.4 13.71 16.22 13.01 15.92C11.91 15.45 10.94 14.54 10.19 13.56C9.56 12.76 9.1 11.83 8.94 11.32C8.78 10.81 9.29 10.54 9.49 10.34C9.69 10.14 9.9 10.02 10.1 10.02C10.3 10.02 10.5 10.02 10.7 10.53C10.9 11.04 11.38 11.75 11.48 11.85C11.58 11.95 11.53 12.1 11.43 12.2C11.33 12.3 11.03 12.65 10.88 12.8C10.73 12.95 10.58 13.03 10.76 13.28C10.94 13.53 11.38 14.12 11.95 14.63C12.67 15.29 13.31 15.58 13.56 15.68C13.81 15.78 13.96 15.75 14.08 15.63C14.21 15.51 14.61 15.06 14.81 14.81C15.01 14.56 15.21 14.51 15.46 14.61C15.71 14.71 16.42 15.05 16.63 15.2Z"/></svg>
              Book Now via WhatsApp
            </a>
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
          line-height: 1.2;
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
        .highlight { background-color: #fff59d; padding: 5px; border-radius: 5px; }

        .tuk-types {
          display: flex;
          justify-content: space-around;
          width: 100%;
          margin-bottom: 15px;
        }
        .tuk-column ul {
          list-style-type: none;
          padding-left: 0;
          text-align: left;
        }
        .tuk-column li {
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .book-now-button {
          background-color: #4CAF50; /* Green */
          color: white; padding: 12px 25px; border: none; border-radius: 5px;
          cursor: pointer; font-size: 1.2em; font-weight: bold; width: 100%; max-width: 400px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .book-now-button:hover { background-color: #45a049; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; } }

        @media (max-width: 500px) {
          .ad-title { font-size: 1.5em; }
          .tuk-types {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PopUp;
