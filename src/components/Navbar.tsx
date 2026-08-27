import React, { useState, useEffect } from 'react';
import { Sun, Moon, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks } = data;
  const { theme, isDark, toggleTheme } = useTheme();
  const { isGmailConnected } = useAuth();
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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Name */}
        <a
          href="#"
          className="text-white text-lg sm:text-xl font-black tracking-wider uppercase flex items-center gap-2 group"
        >
          <span className="bg-gradient-to-tr from-sky-500 to-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(14,165,233,0.5)] border border-sky-400/30">
            SK
          </span>
          <span className="font-['Syne',sans-serif] font-bold tracking-tight text-slate-100 group-hover:text-sky-400 transition-colors">{personalInfo.name}</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 bg-[#0c1427]/70 border border-sky-500/20 rounded-full px-6 py-2 backdrop-blur-md shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-sky-400 text-xs font-['JetBrains_Mono',monospace] font-semibold tracking-wider uppercase transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3 font-['Outfit',sans-serif]">
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

          {/* Gmail Integration Shortcut */}
          <a
            href="#contact"
            id="navbar-gmail-link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 transition-all duration-300 text-xs font-bold font-mono group"
            title="Gmail Workspace Suite"
          >
            <Mail className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="hidden xl:inline">Gmail</span>
            {isGmailConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </a>

          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-[#0077b5] transition-colors"
            aria-label="LinkedIn Profile"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300 flex items-center justify-center group"
            aria-label="GitHub Profile (Sunanda-2003)"
            title="GitHub: Sunanda-2003"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.4)] border border-sky-400/30"
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

