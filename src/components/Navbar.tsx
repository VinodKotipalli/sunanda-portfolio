import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks } = data;
  const { theme, isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'nav-scrolled bg-[#060913]/90 backdrop-blur-md py-3.5 border-b border-sky-500/15 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Name (Left) */}
        <a
          href="#"
          id="navbar-brand-logo"
          className="text-white text-xs xs:text-sm sm:text-base md:text-lg font-black tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 group shrink-0 min-w-0"
        >
          <span className="bg-gradient-to-tr from-sky-500 to-blue-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-black text-[10px] sm:text-xs shadow-[0_0_15px_rgba(14,165,233,0.5)] border border-sky-400/30 shrink-0">
            SK
          </span>
          <span className="font-['Syne',sans-serif] font-bold tracking-tight text-slate-100 group-hover:text-sky-400 transition-colors whitespace-nowrap text-xs xs:text-sm sm:text-base inline-block">
            {personalInfo.name}
          </span>
        </a>

        {/* Centered Desktop Nav Links Pill */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-2 max-w-2xl">
          <div className="flex items-center gap-3 xl:gap-4.5 bg-[#0c1427]/80 border border-sky-500/25 rounded-full px-4 xl:px-5 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-sky-400 text-[11px] xl:text-xs font-['JetBrains_Mono',monospace] font-semibold tracking-wider uppercase transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Action Controls (Right) */}
        <div className="hidden md:flex items-center gap-2 xl:gap-2.5 font-['Outfit',sans-serif] shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2 rounded-full border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 transition-all duration-300 flex items-center justify-center group cursor-pointer shadow-sm"
            aria-label={isDark ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-sky-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Internal In-Portfolio Contact Link */}
          <a
            href="#contact"
            id="navbar-contact-action-btn"
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.4)] border border-sky-400/30 whitespace-nowrap"
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile Controls (Theme Toggle + Menu Trigger) */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            id="mobile-nav-theme-btn"
            className="p-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 flex items-center justify-center cursor-pointer"
            aria-label={isDark ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#060913]/98 border-b border-sky-500/20 px-6 py-6 flex flex-col gap-4 backdrop-blur-2xl animate-in slide-in-from-top duration-300">
          {/* Mobile Theme Toggle Status */}
          <div className="flex items-center justify-between py-2 px-1 border-b border-sky-500/15">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Theme: <span className="text-sky-400">{isDark ? 'Obsidian Dark' : 'High-Contrast Light'}</span>
            </span>
            <button
              onClick={toggleTheme}
              id="mobile-drawer-theme-toggle"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-xs font-bold text-sky-300 cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-sky-400 text-base font-bold uppercase tracking-wider py-1 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-sky-500/15 flex flex-col gap-3">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>GitHub Profile</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm tracking-wider uppercase text-center w-full shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            >
              Get In Touch
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

