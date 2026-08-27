import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const { experience, achievements } = data;

  return (
    <section
      id="experience"
      className="bg-[#080d1a] text-slate-100 pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-sky-500/15"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div data-aos="fade-up" className="mb-16 text-center md:text-left">
          <div className="inline-block border border-sky-500/30 rounded-full px-5 py-1.5 text-xs sm:text-sm text-sky-300 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-sky-500/10 backdrop-blur-sm uppercase tracking-[0.25em]">
            ✦ Career History
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 leading-tight mb-4 tracking-tight uppercase font-['Syne',sans-serif]">
            PROFESSIONAL EXPERIENCE
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
            Enterprise cloud operations experience building high-availability monitoring platforms and automated pipelines.
          </p>
        </div>

        {/* Experience Card */}
        <div
          data-aos="fade-up"
          className="bg-[#0c1427]/80 backdrop-blur-md border border-sky-500/20 rounded-3xl p-6 sm:p-8 md:p-10 hover:border-sky-400/50 transition-all duration-500 shadow-2xl mb-20"
        >
          {/* Company & Role Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-sky-500/15 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider">
                  Full-Time Role
                </span>
                <span className="text-xs font-['JetBrains_Mono',monospace] text-slate-400">
                  📍 {experience.location}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 tracking-tight font-['Outfit',sans-serif]">
                {experience.role}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-sky-400 mt-1 font-['Space_Grotesk',sans-serif]">
                {experience.company}
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <span className="inline-block bg-[#060913]/90 border border-sky-500/25 px-4 py-2 rounded-xl text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-bold text-slate-200 tracking-wide">
                🗓️ {experience.duration}
              </span>
            </div>
          </div>

          {/* 10 Responsibilities and Achievements Points */}
          <div className="space-y-4">
            <h4 className="text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
              Key Responsibilities & Deliverables:
            </h4>
            <div className="grid grid-cols-1 gap-3.5">
              {experience.highlights.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#060913]/70 border border-sky-500/10 hover:border-sky-500/30 transition-all group"
                >
                  <span className="text-xs font-['JetBrains_Mono',monospace] font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-sky-400/30">
                    {index + 1}
                  </span>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base font-normal font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed group-hover:text-slate-100 transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Achievements Sub-Section */}
        <div id="achievements" className="pt-8">
          <div data-aos="fade-up" className="mb-12 text-center md:text-left">
            <div className="inline-block border border-sky-500/30 rounded-full px-5 py-1.5 text-xs sm:text-sm text-sky-300 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-sky-500/10 backdrop-blur-sm uppercase tracking-[0.25em]">
              ✦ Impact & Metrics
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 leading-tight tracking-tight uppercase font-['Syne',sans-serif]">
              KEY ACHIEVEMENTS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((item, index) => (
              <div
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-[#0c1427]/70 backdrop-blur-md border border-sky-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-sky-400/60 hover:bg-[#0f1b36]/80 transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 mb-3 font-['Outfit',sans-serif]">
                    {item.metric}
                  </div>
                  <h4 className="text-slate-100 font-bold text-lg mb-3 tracking-tight group-hover:text-sky-400 transition-colors font-['Outfit',sans-serif]">
                    {item.title}
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal font-['Plus_Jakarta_Sans',sans-serif]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sky-500/15 flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] text-slate-400">
                  <span>ACHIEVEMENT 0{index + 1}</span>
                  <span>✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
