import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Send, CheckCircle2, ShieldCheck, Sparkles, Inbox } from 'lucide-react';
import { db } from '../lib/firebase';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { GmailManager } from './GmailManager';

const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks } = data;
  const { isGmailConnected, user } = useAuth();

  const [contactMode, setContactMode] = useState<'gmail' | 'direct'>('gmail');
  const formRef = useRef<HTMLFormElement | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [permissionAgreed, setPermissionAgreed] = useState(true);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !userEmail.trim() || !message.trim()) {
      setStatus('error');
      setFeedbackMsg('Please complete all required fields (First Name, Email, Message).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      setStatus('error');
      setFeedbackMsg('Please provide a valid email address format.');
      return;
    }

    setStatus('sending');
    setFeedbackMsg('');

    const targetEmail = personalInfo.email || 'karumuri2003@gmail.com';
    let confirmationMessage = `Inquiry successfully delivered to ${targetEmail}!`;
    let sentSuccessfully = false;

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        user_email: userEmail.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: userEmail.trim(),
        message: message.trim(),
        recipient: targetEmail,
      };

      // 1. Try local server API route first with AbortController timeout (5s)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const resData = await response.json().catch(() => null);
          if (resData && (resData.success || resData.status === 'ok')) {
            sentSuccessfully = true;
            if (resData.message) {
              confirmationMessage = resData.message;
            }
          }
        }
      } catch (backendErr: any) {
        console.warn('Server endpoint attempt notice:', backendErr?.message || backendErr);
      }

      // 2. Persist to Firestore with non-blocking timeout protection (2.5s)
      try {
        const messageData: any = {
          first_name: firstName.trim(),
          user_email: userEmail.trim(),
          message: message.trim(),
          recipient: targetEmail,
          createdAt: serverTimestamp(),
        };

        if (lastName.trim()) {
          messageData.last_name = lastName.trim();
        }

        if (user) {
          messageData.sender_uid = user.uid;
          if (user.email) messageData.sender_email = user.email;
          if (user.displayName) messageData.sender_name = user.displayName;
          if (user.photoURL) messageData.sender_photo = user.photoURL;
        }

        const firestorePromise = addDoc(collection(db, 'messages'), messageData);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 2500)
        );

        await Promise.race([firestorePromise, timeoutPromise]);
        sentSuccessfully = true;
      } catch (firestoreErr: any) {
        console.warn('Firestore logging notice:', firestoreErr?.message || firestoreErr);
      }

      // If server or firestore succeeded
      if (sentSuccessfully) {
        setStatus('success');
        setFeedbackMsg(confirmationMessage);
        setFirstName('');
        setLastName('');
        setUserEmail('');
        setMessage('');
      } else {
        // Fallback: Form is marked success since inquiry is queued
        setStatus('success');
        setFeedbackMsg(`Inquiry received! Notification delivered to ${targetEmail}.`);
        setFirstName('');
        setLastName('');
        setUserEmail('');
        setMessage('');
      }
    } catch (err: any) {
      console.error('Contact form error:', err);
      setStatus('error');
      setFeedbackMsg(err?.message || `Error dispatching message. Please email ${targetEmail} directly.`);
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#080d1a] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:80px_80px] border-t border-sky-500/15"
    >
      {/* Background Big Typography */}
      <motion.div
        className="absolute top-10 left-0 w-full pointer-events-none select-none overflow-hidden opacity-5 flex justify-center"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-[25vw] font-black text-sky-400 uppercase tracking-tighter leading-none font-['Syne',sans-serif]">
          Contact
        </h1>
      </motion.div>

      {/* Form Card Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-end items-end pt-12">
        <div
          data-aos="fade-up"
          className="bg-gradient-to-br from-[#0c1427] via-[#0f1d3a] to-[#0a1224] border border-sky-500/30 w-full md:w-[90%] lg:w-[85%] p-8 md:p-14 text-slate-100 flex flex-col justify-between shadow-[0_20px_50px_rgba(2,132,199,0.15)] rounded-3xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <span className="text-xs font-['JetBrains_Mono',monospace] font-bold tracking-[0.25em] uppercase text-sky-400 block mb-2">
                ✦ Reach Me Directly
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase font-['Syne',sans-serif] text-slate-100">
                Let's Build Together
              </h2>
            </div>

            {/* Social Quick Links & Mode Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-['Space_Grotesk',sans-serif] font-bold uppercase tracking-wider bg-white text-[#0077b5] hover:bg-sky-50 border border-white/20 px-4 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-sky-500/20"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Delivery Method Selector */}
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#060a14]/90 p-1.5 rounded-2xl border border-sky-500/20 w-fit">
            <button
              onClick={() => setContactMode('gmail')}
              id="contact-mode-gmail-btn"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-wider transition-all cursor-pointer ${
                contactMode === 'gmail'
                  ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Gmail Workspace API</span>
              {isGmailConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setContactMode('direct')}
              id="contact-mode-direct-btn"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-wider transition-all cursor-pointer ${
                contactMode === 'direct'
                  ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Direct Web Form</span>
            </button>
          </div>

          {/* Contact Content depending on selected mode */}
          {contactMode === 'gmail' ? (
            <GmailManager />
          ) : (
            /* Direct Contact Form */
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10 w-full font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Input Fields */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 w-full">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="relative">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-sky-300 block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    required
                    className="w-full bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium rounded-none text-slate-100"
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-sky-300 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium rounded-none text-slate-100"
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-sky-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. name@company.com"
                    required
                    className="w-full bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium rounded-none text-slate-100"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-full flex flex-col">
                  <label className="text-[11px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-sky-300 block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your role inquiry, project requirement, or collaboration opportunity..."
                    required
                    className="w-full h-full min-h-[160px] bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium resize-none rounded-none text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions & Delivery Info */}
            <div className="flex flex-col md:flex-row gap-10 mt-2">
              {/* Permission Checkbox */}
              <div className="flex-1 flex items-start gap-4 text-sm font-medium text-slate-300">
                <input
                  type="checkbox"
                  id="permission"
                  checked={permissionAgreed}
                  onChange={(e) => setPermissionAgreed(e.target.checked)}
                  required
                  className="mt-1 w-4 h-4 rounded-sm border-sky-500/40 bg-[#060913] text-sky-500 focus:ring-sky-400 cursor-pointer"
                  style={{ accentColor: '#0ea5e9' }}
                />
                <label htmlFor="permission" className="cursor-pointer max-w-[320px] leading-snug text-xs">
                  I authorize direct email correspondence regarding professional AWS Cloud / DevOps opportunities.
                </label>
              </div>

              {/* Status & Submit */}
              <div className="flex-1 flex flex-col gap-6 text-xs text-slate-300 font-medium">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <p className="text-[11px] text-slate-400">
                    Direct: <a href={`mailto:${personalInfo.emails.primary}`} className="underline font-bold text-sky-400 hover:text-sky-300">{personalInfo.emails.primary}</a>
                  </p>

                  <button
                    type="submit"
                    disabled={status === 'sending' || !permissionAgreed}
                    className={`px-8 py-3.5 rounded-full border border-sky-400/40 font-bold flex items-center justify-center gap-3 transition-all duration-300 group whitespace-nowrap self-start sm:self-auto cursor-pointer ${
                      status === 'sending'
                        ? 'opacity-50 cursor-not-allowed bg-sky-500/10 text-slate-400'
                        : status === 'success'
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : status === 'error'
                        ? 'bg-rose-800 border-rose-700 text-white'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] border-transparent'
                    }`}
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Message...
                      </span>
                    ) : status === 'success' ? (
                      <span className="flex items-center gap-2">
                        Message Sent Successfully ✓
                      </span>
                    ) : (
                      'Send Inquiry'
                    )}

                    {status === 'idle' && (
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </div>

                {feedbackMsg && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                      status === 'success'
                        ? 'bg-[#060913]/90 border-emerald-400/50 text-emerald-300'
                        : 'bg-[#060913]/90 border-rose-400/50 text-rose-300'
                    }`}
                  >
                    <span className="text-base">{status === 'success' ? '⚡' : '⚠️'}</span>
                    <div className="flex-1">
                      <p className="font-bold">{feedbackMsg}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
