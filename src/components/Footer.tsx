import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Footer: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks, footerContent } = data;

  return (
    <footer className="bg-[#050811] text-slate-300 py-16 px-6 md:px-12 w-full font-mono text-[10px] md:text-xs tracking-widest flex flex-col justify-between min-h-[45vh] border-t border-sky-500/20">
      {/* Top Row - Future & Motivational Captions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 w-full font-mono max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sky-400 text-[11px] font-bold tracking-wider">
            <span>✦</span>
            <span className="uppercase">Architecting Tomorrow</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] md:text-xs">
            "The best way to predict the future is to engineer it with precision and resilience."
          </p>
          <p className="text-slate-500 text-[10px]">
            Transforming bold visions into scalable, autonomous cloud systems.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:items-center md:text-center">
          <div className="flex items-center gap-2 text-sky-400 text-[11px] font-bold tracking-wider">
            <span>✦</span>
            <span className="uppercase">Limitless Innovation</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] md:text-xs">
            "Driven by curiosity, fueled by relentless learning."
          </p>
          <p className="text-slate-500 text-[10px]">
            Every deployment is a step toward a smarter, more connected future.
          </p>
        </div>

        <div className="flex flex-col gap-2 md:items-end md:text-right">
          <div className="flex items-center gap-2 text-sky-400 text-[11px] font-bold tracking-wider">
            <span>✦</span>
            <span className="uppercase">Building The Future</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] md:text-xs">
            "The future belongs to those who build with purpose and passion."
          </p>
          <p className="text-slate-500 text-[10px]">
            Ready to shape what's next • {new Date().getFullYear()} & Beyond
          </p>
        </div>
      </div>

      {/* Middle Typography */}
      <div className="w-full flex justify-center items-center py-6 md:py-12 px-4 overflow-hidden">
        <h2
          id="footer-candidate-name"
          className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-['Syne',sans-serif] font-black tracking-tight sm:tracking-normal uppercase select-none text-slate-800 hover:text-slate-700 transition-colors duration-300 text-center leading-tight break-words max-w-full"
        >
          {personalInfo.name}
        </h2>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 w-full items-end font-medium max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <a
            href="#contact"
            className="underline hover:text-sky-300 transition-colors underline-offset-4 decoration-1 font-bold text-sm text-slate-100"
          >
            Get In Touch
          </a>
          <p className="text-slate-500 font-mono text-[9px] md:text-[10px]">
            {footerContent.copyright}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-center">
          <a
            href={`mailto:${personalInfo.email}`}
            className="underline hover:text-sky-300 transition-colors underline-offset-4 decoration-1 lowercase text-xs text-slate-300"
          >
            {personalInfo.email}
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-sky-400 transition-colors duration-300"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:items-end">
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-300 transition-colors underline-offset-4 decoration-1 font-bold text-xs text-slate-300"
          >
            Connect on LinkedIn
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-300 transition-colors underline-offset-4 decoration-1 font-bold text-xs text-slate-300 mt-1"
          >
            Explore GitHub Profile
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
