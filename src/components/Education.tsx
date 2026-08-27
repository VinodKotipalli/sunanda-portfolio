import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Education: React.FC = () => {
  const { data } = usePortfolio();
  const { education } = data;

  return (
    <section
      id="education"
      className="bg-[#060913] text-slate-100 pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-sky-500/15"
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 text-center md:text-left">
          <div className="inline-block border border-sky-500/30 rounded-full px-5 py-1.5 text-xs sm:text-sm text-sky-300 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-sky-500/10 backdrop-blur-sm uppercase tracking-[0.25em]">
            ✦ Academic Background
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight mb-4 uppercase font-['Syne',sans-serif]">
            EDUCATION
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
            Formal foundations in Computer Science principles, algorithms, operating systems, and software engineering.
          </p>
        </div>

        {/* Education Card */}
        <div
          data-aos="fade-up"
          className="bg-[#0c1427]/80 backdrop-blur-md border border-sky-500/20 rounded-3xl p-6 sm:p-8 md:p-10 max-w-3xl hover:border-sky-400/60 hover:shadow-[0_15px_35px_rgba(2,132,199,0.15)] transition-all duration-300 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-widest text-sky-300 bg-sky-500/15 px-3.5 py-1.5 rounded-full border border-sky-500/30">
              Graduation Degree
            </span>
            <span className="text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-bold text-slate-200 bg-[#060913]/80 px-4 py-1.5 rounded-full border border-sky-500/20">
              Score: {education.percentage}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-100 mb-2 font-['Outfit',sans-serif]">
            {education.degree}
          </h3>

          <p className="text-base sm:text-lg font-bold text-sky-400 mb-2 font-['Space_Grotesk',sans-serif]">
            {education.institution} • {education.university}
          </p>

          <p className="text-xs sm:text-sm font-['JetBrains_Mono',monospace] text-slate-400 mb-6">
            📍 {education.location}
          </p>

          <div className="pt-6 border-t border-sky-500/15 flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] text-slate-400">
            <span>Duration: {education.duration}</span>
            <span className="text-emerald-400">✓ Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
