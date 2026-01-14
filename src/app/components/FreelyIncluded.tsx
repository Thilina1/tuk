'use client';
import React from 'react';

const FreelyIncluded = () => {
  const includedItems = [
    'Full insurance',
    '24/7 roadside support',
    'Comprehensive lesson at pickup',
    'Basic toolkit',
    'Spare wheel',
    'Extra oil bottle',
    'Raincovers',
    'Phone holder for navigation',
    'Phone charging adapter part'
  ];

  return (
    <section
    className="py-16 px-6"
    style={{
      background: 'linear-gradient(to bottom, #ffffff, #fef9c3)',
      colorScheme: 'light',
    }}
  >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-amber-950">
            What's Freely Included
          </h2>
          <p className="text-lg text-slate-900 mt-4 max-w-2xl mx-auto">
            Every rental comes packed with these essentials at no extra cost, ensuring a worry-free adventure.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {includedItems.map((item, index) => (
              <div key={index} className="flex items-center p-2">
                <div className="bg-white rounded-full p-2 mr-4 shadow">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-lg text-slate-900">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelyIncluded;
