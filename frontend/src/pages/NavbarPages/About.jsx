import React from 'react';
import Navbar from '../../components/Navbar';


const About = () => {
  // Stats data for quick display
  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Partner Restaurants", value: "350+" },
    { label: "Fast Deliveries", value: "1M+" },
  ];

  // Core values array
  const coreValues = [
    {
      icon: "⚡",
      title: "Lightning Fast Delivery",
      description: "We prioritize local route optimization to ensure your gourmet choices arrive piping hot and fresh at your door.",
    },
    {
      icon: "🥗",
      title: "Quality First",
      description: "We partner exclusively with certified, highly-rated local kitchens and restaurants to maintain premium standards.",
    },
    {
      icon: "🤝",
      title: "Customer Centric",
      description: "Our support system is online 24/7. Your satisfaction with every meal ordered is our ultimate promise.",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Integrated Header Navbar */}
      < Navbar />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Redefining the way you experience <span className="text-blue-600">Gourmet Food</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            At BiteDash, we bridge the gap between hungry food lovers and premium culinary artists. Discover signature dishes from the finest local spots and get them hand-delivered instantly.
          </p>
        </section>

        {/* Quick Numbers / Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-100 text-center transition-all duration-300 hover:shadow-md"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Core Values / Features Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Drives Us</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">The core philosophies behind every single order delivered.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
              >
                <div className="text-3xl mb-4 p-3 bg-slate-50 rounded-xl inline-block group-hover:bg-blue-50 transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Callout Card */}
        <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Hungry for something spectacular?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Skip the kitchen hassle and let us deliver restaurant-quality dishes right to your current location.
            </p>
            <div className="pt-2">
              <a 
                href="/dashboard" 
                className="inline-block bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-3 px-6 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20"
              >
                Explore Menu Now
              </a>
            </div>
          </div>
          {/* Subtle background gradient shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

      </div>
    </div>
  );
};

export default About;