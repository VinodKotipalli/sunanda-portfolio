import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import TechnicalSkills from './components/TechnicalSkills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GeminiChatbot from './components/GeminiChatbot';

function MainLayout() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200 relative transition-colors duration-300">
      <Preloader />
      <Navbar />
      <Hero />
      <AboutMe />
      <TechnicalSkills />
      <Experience />
      <Projects />
      <Certificates />
      <Education />
      <Contact />
      <Footer />
      <GeminiChatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <MainLayout />
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

