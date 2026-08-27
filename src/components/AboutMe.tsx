import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadResumePdf } from '../utils/generateResumePdf';

const AboutMe: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  return (
    <section id="about" className="relative w-full min-h-screen flex flex-col justify-center items-center py-24 px-5 sm:px-8 md:px-12 bg-[#080d1a] overflow-hidden border-t border-sky-500/15">
      {/* Decorative Ambient Tech Vectors & Glows */}
      <motion.div
        className="absolute top-[8%] left-[3%] sm:left-[5%] w-28 sm:w-36 h-28 sm:h-36 rounded-full border border-sky-500/20 bg-sky-500/5 backdrop-blur-sm flex items-center justify-center pointer-events-none z-0 shadow-[0_0_30px_rgba(56,189,248,0.1)]"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
      >
        <div className="w-16 h-16 rounded-full border border-dashed border-sky-400/40 animate-spin" style={{ animationDuration: '20s' }} />
        <span className="absolute text-xl opacity-80">☁️</span>
      </motion.div>

      <motion.div
        className="absolute bottom-[8%] left-[4%] sm:left-[6%] w-24 sm:w-32 h-24 sm:h-32 rounded-2xl border border-sky-500/20 bg-[#0c1427]/80 backdrop-blur-sm flex items-center justify-center pointer-events-none z-0 rotate-12 shadow-lg"
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="text-center font-mono text-[10px] text-slate-400">
          <span className="text-emerald-400 block font-bold text-sm">99.9%</span>
          UPTIME
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[10%] right-[3%] sm:right-[5%] w-28 sm:w-36 h-28 sm:h-36 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm flex items-center justify-center pointer-events-none z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="w-20 h-20 rounded-full border border-dotted border-cyan-400/40 animate-spin" style={{ animationDuration: '25s' }} />
        <span className="absolute text-xl opacity-80">⚡</span>
      </motion.div>

      <motion.div
        className="absolute bottom-[6%] right-[4%] sm:right-[6%] w-28 sm:w-40 h-24 sm:h-28 rounded-2xl border border-sky-500/20 bg-[#0c1427]/80 backdrop-blur-sm flex flex-col justify-center p-3 pointer-events-none z-0 -rotate-6 shadow-lg"
        initial={{ x: 40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-slate-300">OBSERVABILITY</span>
        </div>
        <div className="flex gap-1 items-end h-6">
          <div className="w-2 h-3 bg-sky-500/40 rounded-t" />
          <div className="w-2 h-5 bg-sky-400 rounded-t" />
          <div className="w-2 h-4 bg-cyan-400 rounded-t" />
          <div className="w-2 h-6 bg-emerald-400 rounded-t" />
          <div className="w-2 h-5 bg-sky-500 rounded-t" />
        </div>
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl text-center"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-block border border-sky-500/30 rounded-full px-5 py-1.5 text-xs sm:text-sm text-sky-300 font-['JetBrains_Mono',monospace] font-semibold mb-6 shadow-sm bg-sky-500/10 backdrop-blur-md uppercase tracking-[0.25em]">
          ✦ Professional Summary
        </div>

        <h2 className="text-slate-100 text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-tight tracking-tight mb-8 font-['Syne',sans-serif] uppercase">
          ABOUT ME
        </h2>

        {/* Word-for-word Summary from Resume */}
        <p className="text-slate-200 text-base sm:text-lg md:text-xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed max-w-3xl mx-auto mb-10 text-justify sm:text-center">
          {personalInfo.summary}
        </p>

        {/* Core Competencies Badges */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-12">
          {[
            'AWS Cloud Infrastructure',
            'Terraform IaC',
            'Prometheus & Grafana',
            'Jenkins CI/CD',
            'Node Exporter & PromQL',
            'Alertmanager & SRE',
            'AWS Well-Architected Framework',
            'Incident Response & MTTD Reduction',
          ].map((badge) => (
            <span
              key={badge}
              className="px-4 py-1.5 rounded-full bg-[#0c1427]/80 border border-sky-500/25 text-slate-200 text-xs md:text-sm font-['Space_Grotesk',sans-serif] font-medium backdrop-blur-md hover:border-sky-400 hover:text-sky-300 transition-all duration-300 shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Buttons Row */}
        <div className="flex flex-row justify-center items-center gap-4 sm:gap-8 font-['Outfit',sans-serif]">
          <motion.a
            href="#experience"
            className="flex items-center gap-3 px-7 py-3.5 rounded-[30px] bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base md:text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(14,165,233,0.4)] border border-sky-400/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs">
              →
            </span>
            Experience
          </motion.a>

          <motion.button
            onClick={() => downloadResumePdf('Sunanda_Sri_Karumuri_Resume.pdf')}
            className="flex items-center gap-3 px-7 py-3.5 rounded-[30px] border border-sky-500/30 bg-[#0c1427] text-slate-200 font-bold text-base md:text-lg hover:bg-white hover:text-black transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Resume
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMe;
