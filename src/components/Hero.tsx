import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadResumePdf } from '../utils/generateResumePdf';

const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, heroContent, socialLinks } = data;

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden bg-gradient-to-b from-[#060913] via-[#090e1a] to-[#060913]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle radial azure & cyan gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Large Decorative Text Outline */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none text-center w-full overflow-hidden opacity-5">
          <span className="text-[12vw] font-black tracking-tighter text-transparent stroke-text uppercase whitespace-nowrap">
            DEVOPS • CLOUD • SRE
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col items-start justify-center flex-grow w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          {/* Badge 1: Role Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 backdrop-blur-md shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-sky-300 text-xs font-['JetBrains_Mono',monospace] font-bold tracking-wider uppercase">
              AWS CLOUD OPERATIONS ENGINEER
            </span>
          </div>

          {/* Badge 2: Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c1427]/80 border border-sky-500/20 backdrop-blur-md">
            <span className="text-xs">📍</span>
            <span className="text-slate-300 text-xs font-['JetBrains_Mono',monospace] tracking-wide">
              {personalInfo.location}
            </span>
          </div>
        </div>

        {/* Hero Title & Identity */}
        <div className="mb-8 w-full">
          {/* Candidate Name - Responsive and mobile-safe */}
          <h1
            id="hero-candidate-name"
            className="text-slate-100 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight sm:tracking-normal uppercase font-['Syne',sans-serif] mb-3 sm:mb-6 leading-tight break-words sm:whitespace-nowrap select-none max-w-full"
          >
            {personalInfo.name}
          </h1>

          {/* Role Title in Unified Single Color */}
          <div className="font-['Outfit',sans-serif] font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[1.05] tracking-tight text-slate-100">
            <div className="mb-1">
              AWS Cloud
            </div>
            <div>
              Operations Engineer
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg md:text-xl font-light mb-8 max-w-3xl leading-relaxed">
          {heroContent.subtitle}
        </p>

        {/* Contact Info Pills */}
        <div className="flex flex-wrap gap-3 text-xs font-mono text-slate-300 mb-10 pb-6 border-b border-sky-500/15 w-full">
          <a
            href={`mailto:${personalInfo.email}`}
            className="hover:text-white flex items-center gap-2 transition-colors bg-[#0c1427]/80 hover:bg-sky-500/20 px-3.5 py-2 rounded-lg border border-sky-500/20"
          >
            ✉️ {personalInfo.email}
          </a>
          <a
            href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
            className="hover:text-white flex items-center gap-2 transition-colors bg-[#0c1427]/80 hover:bg-sky-500/20 px-3.5 py-2 rounded-lg border border-sky-500/20"
          >
            📞 {personalInfo.phone}
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-2 transition-colors bg-[#0c1427]/80 hover:bg-sky-500/20 px-3.5 py-2 rounded-lg border border-sky-500/20 group cursor-pointer"
            title="GitHub: Sunanda-2003"
          >
            <svg className="w-4 h-4 text-slate-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>GitHub Profile</span>
          </a>
          <span className="flex items-center gap-2 bg-[#0c1427]/80 px-3.5 py-2 rounded-lg border border-sky-500/20 text-slate-300">
            🏢 TCS (June 2024 – June 2026)
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row flex-wrap items-center gap-4">
          <a
            href={heroContent.ctaPrimary.href}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(14,165,233,0.4)] flex items-center gap-2 border border-sky-400/30"
          >
            <span>{heroContent.ctaPrimary.text}</span>
            <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs">
              ↓
            </span>
          </a>

          <a
            href={heroContent.ctaSecondary.href}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-[#0c1427] hover:bg-[#121c36] text-sky-300 font-bold border border-sky-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
          >
            {heroContent.ctaSecondary.text}
          </a>

          <button
            onClick={() => downloadResumePdf('Sunanda_Sri_Karumuri_Resume.pdf')}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-[#0c1427]/90 border border-slate-700 text-slate-200 font-bold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{heroContent.ctaResume.text}</span>
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-20 flex justify-center mt-6">
        <a href="#about" className="animate-bounce text-white/50 hover:text-white transition-colors" aria-label="Scroll to About section">
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7 7m7-7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
