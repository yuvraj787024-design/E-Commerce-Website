import React, { useState } from 'react';
import Navbar from '../../components/Navbar';


const Help = () => {
  // State to track which FAQ item is expanded
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How do I track my food order?",
      answer: "Once your order is placed successfully, you will be redirected to your Dashboard where you can monitor real-time updates. You will also receive an SMS notification with the driver's contact details."
    },
    {
      question: "What payment options do you support?",
      answer: "We support both Cash on Delivery (COD) and Online Payments including all major Credit/Debit cards, UPI, and popular mobile wallets."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can only be modified or canceled within 2 minutes of placement. After this window, the kitchen begins preparing your food and modifications cannot be processed."
    },
    {
      question: "How do I use the Auto-Location detector?",
      answer: "Simply click the 'Use Live Location' button in the checkout address panel. Make sure to grant your browser permission to access your location when prompted!"
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        
        {/* Help Center Intro Header */}
        <section className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Browse our frequently asked questions, toggle answers instantly, or reach out to our dedicated support crew.
          </p>
        </section>

        {/* Dynamic FAQ Accordion Section */}
        <section className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-8 shadow-xs max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border-b border-slate-100 last:border-0 pb-4 last:pb-0"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 focus:outline-none group"
                  >
                    <span className="font-semibold text-sm sm:text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </span>
                    <span className={`ml-2 text-slate-400 transition-transform duration-300 transform ${
                      isOpen ? 'rotate-180 text-blue-600' : 'rotate-0'
                    }`}>
                      ▼
                    </span>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Alternate Contact Options Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Support Ticket Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 transition-all hover:shadow-md flex items-start space-x-4">
            <div className="text-2xl p-3 bg-blue-50 text-blue-600 rounded-xl">
              ✉️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Email Support</h3>
              <p className="text-xs text-slate-500 mt-1">
                Drop us a message and our customer agents will reply within 2 hours.
              </p>
              <a href="mailto:support@bitedash.com" className="inline-block mt-3 text-xs font-bold text-blue-600 hover:text-blue-700">
                support@bitedash.com →
              </a>
            </div>
          </div>

          {/* Emergency Hotline Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 transition-all hover:shadow-md flex items-start space-x-4">
            <div className="text-2xl p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              📞
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Hotline Desk</h3>
              <p className="text-xs text-slate-500 mt-1">
                Facing payment issues or critical delays? Call our urgent dispatch dispatchers.
              </p>
              <span className="inline-block mt-3 text-xs font-bold text-emerald-600">
                +91 (9798461503)
              </span>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};

export default Help;