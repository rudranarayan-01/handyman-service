import React from 'react';
import { ShieldCheck, Clock, Users, Award } from 'lucide-react'; // Optional: Use any icon library

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              We’re Redefining <span className="text-blue-500">Home Care</span> in India.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Handyman Service Pro started with a simple idea: booking a reliable plumber, 
              electrician, or carpenter should be as easy as ordering food online. 
              No more endless phone calls or bargaining. Just professional service at your doorstep.
            </p>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Services Completed', value: '10k+' },
              { label: 'Verified Experts', value: '500+' },
              { label: 'Cities Covered', value: '15+' },
              { label: 'Avg. Rating', value: '4.9/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Why Thousands Trust Us</h2>
            <p className="text-slate-500">We aren't just a platform; we are your partners in maintaining your most valuable asset—your home.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Background Verified</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Every professional on our platform goes through a rigorous 3-step verification process including criminal background checks.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">On-Time, Every Time</h3>
              <p className="text-slate-600 leading-relaxed text-sm">We value your time. If our professional is late, we provide a 10% discount on the service fee, no questions asked.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Not happy with the fix? We offer a 15-day service warranty on all jobs completed through Handyman Service Pro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Connection Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
             {/* Remember to replace with your converted WebP image! */}
            <div className="aspect-square bg-slate-200 rounded-[40px] overflow-hidden">
                <img 
                  src="/images/our-team.webp" 
                  alt="Our Handyman Team in India" 
                  className="w-full h-full object-cover"
                />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Built for the Indian Home</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We understand the unique challenges of Indian households—from monsoon-related leakages 
              to heavy-duty electrical requirements. Our experts are local, they speak your language, 
              and they know exactly how to fix Indian fixtures and appliances.
            </p>
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Book a Service Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;