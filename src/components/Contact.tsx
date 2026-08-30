import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Mail, Send, CheckCircle2, Inbox, ExternalLink, RefreshCw, MessageSquare, Copy, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { usePortfolio } from '../context/PortfolioContext';

interface SavedMessage {
  id: string;
  first_name: string;
  last_name?: string;
  user_email: string;
  message: string;
  recipient?: string;
  createdAt?: any;
}

const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, socialLinks } = data;

  const [activeTab, setActiveTab] = useState<'form' | 'inbox'>('form');
  const formRef = useRef<HTMLFormElement | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [permissionAgreed, setPermissionAgreed] = useState(true);

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [lastSentData, setLastSentData] = useState<{
    name: string;
    email: string;
    message: string;
    targetEmail: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Live Inbox State
  const [inquiries, setInquiries] = useState<SavedMessage[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const targetEmail = personalInfo.email || 'karumuri2003@gmail.com';

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(15));
      const snap = await getDocs(q);
      const list: SavedMessage[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          first_name: d.first_name || 'Anonymous',
          last_name: d.last_name || '',
          user_email: d.user_email || d.sender_email || '',
          message: d.message || '',
          recipient: d.recipient || targetEmail,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : new Date().toLocaleString(),
        });
      });
      setInquiries(list);
    } catch (err: any) {
      console.warn('Inquiries fetch notice:', err?.message || err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inbox') {
      loadInquiries();
    }
  }, [activeTab]);

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

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    let confirmationMessage = `Inquiry delivered directly to ${targetEmail}!`;

    const sentRecord = {
      name: fullName,
      email: userEmail.trim(),
      message: message.trim(),
      targetEmail,
    };

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        user_email: userEmail.trim(),
        name: fullName,
        email: userEmail.trim(),
        message: message.trim(),
        recipient: targetEmail,
      };

      // 1. Dispatch to server endpoint
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

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
            if (resData.message) {
              confirmationMessage = resData.message;
            }
          }
        }
      } catch (backendErr: any) {
        console.warn('Server endpoint notice:', backendErr?.message || backendErr);
      }

      // 2. Client-side relay
      try {
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: fullName,
            email: userEmail.trim(),
            message: message.trim(),
            _subject: `[Portfolio Inquiry] New message from ${fullName}`,
            _replyto: userEmail.trim(),
            _captcha: 'false',
          }),
        }).catch(() => null);
      } catch (fsErr) {
        console.warn('Client relay notice:', fsErr);
      }

      // 3. Persist to Firestore
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

        const firestorePromise = addDoc(collection(db, 'messages'), messageData);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 3000)
        );

        await Promise.race([firestorePromise, timeoutPromise]);
      } catch (firestoreErr: any) {
        console.warn('Firestore logging notice:', firestoreErr?.message || firestoreErr);
      }

      // Complete submission
      setLastSentData(sentRecord);
      setStatus('success');
      setFeedbackMsg(confirmationMessage);
    } catch (err: any) {
      console.error('Contact form error:', err);
      setStatus('error');
      setFeedbackMsg(err?.message || `Error sending message. Please email ${targetEmail} directly.`);
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setFeedbackMsg('');
    setFirstName('');
    setLastName('');
    setUserEmail('');
    setMessage('');
    setLastSentData(null);
  };

  const handleCopyMessage = () => {
    if (!lastSentData) return;
    const text = `To: ${lastSentData.targetEmail}\nFrom: ${lastSentData.name} <${lastSentData.email}>\n\n${lastSentData.message}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                Let's Connect
              </h2>
            </div>

            {/* Social Quick Links */}
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

          {/* Tab Selector */}
          <div className="flex items-center gap-2 mb-8 bg-[#060a14]/90 p-1.5 rounded-2xl border border-sky-500/20 w-fit">
            <button
              onClick={() => setActiveTab('form')}
              id="contact-tab-form-btn"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Contact Form</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              id="contact-tab-inbox-btn"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Messages Received ({inquiries.length > 0 ? inquiries.length : 'Live'})</span>
            </button>
          </div>

          {/* View Tab */}
          {activeTab === 'inbox' ? (
            /* Live Inquiries Viewer */
            <div className="flex flex-col gap-6 w-full font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="flex items-center justify-between border-b border-sky-500/20 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-['Syne',sans-serif] text-slate-100 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-sky-400" />
                    Direct Inquiries Received
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Delivered directly to <span className="text-sky-300 font-bold">{targetEmail}</span>
                  </p>
                </div>
                <button
                  onClick={loadInquiries}
                  disabled={loadingInquiries}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {loadingInquiries ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400" />
                  <span>Loading inquiries from database...</span>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm bg-[#060913]/60 rounded-2xl border border-sky-500/20 p-8">
                  <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-slate-300">No messages yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Send a test inquiry using the Contact Form tab to see it appear here instantly!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-[#060913]/80 border border-sky-500/25 rounded-2xl p-5 hover:border-sky-400/50 transition-all flex flex-col gap-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                        <div>
                          <span className="font-bold text-slate-100 text-sm mr-2">
                            {inq.first_name} {inq.last_name}
                          </span>
                          <a
                            href={`mailto:${inq.user_email}`}
                            className="text-xs text-sky-400 hover:underline font-mono"
                          >
                            &lt;{inq.user_email}&gt;
                          </a>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">{inq.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {inq.message}
                      </p>
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <a
                          href={`mailto:${inq.user_email}?subject=Re: Inquiry from ${inq.first_name}&body=Hi ${inq.first_name},\n\nThank you for reaching out!`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                      disabled={status === 'success'}
                      className="w-full bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium rounded-none text-slate-100 disabled:opacity-50"
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
                      disabled={status === 'success'}
                      className="w-full bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium rounded-none text-slate-100 disabled:opacity-50"
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
                      disabled={status === 'success'}
                      className="w-full bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium rounded-none text-slate-100 disabled:opacity-50"
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
                      disabled={status === 'success'}
                      className="w-full h-full min-h-[160px] bg-transparent border-b border-sky-500/30 pb-2 text-lg focus:outline-none focus:border-sky-400 transition-colors placeholder-slate-500 font-medium resize-none rounded-none text-slate-100 disabled:opacity-50"
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
                    disabled={status === 'success'}
                    className="mt-1 w-4 h-4 rounded-sm border-sky-500/40 bg-[#060913] text-sky-500 focus:ring-sky-400 cursor-pointer"
                    style={{ accentColor: '#0ea5e9' }}
                  />
                  <label htmlFor="permission" className="cursor-pointer max-w-[320px] leading-snug text-xs">
                    I authorize direct email correspondence regarding professional AWS Cloud / DevOps opportunities.
                  </label>
                </div>

                {/* Status & Submit */}
                <div className="flex-1 flex flex-col gap-5 text-xs text-slate-300 font-medium">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <p className="text-[11px] text-slate-400">
                      Direct: <a href={`mailto:${targetEmail}`} className="underline font-bold text-sky-400 hover:text-sky-300">{targetEmail}</a>
                    </p>

                    {status !== 'success' ? (
                      <button
                        type="submit"
                        disabled={status === 'sending' || !permissionAgreed}
                        className={`px-8 py-3.5 rounded-full border border-sky-400/40 font-bold flex items-center justify-center gap-3 transition-all duration-300 group whitespace-nowrap self-start sm:self-auto cursor-pointer ${
                          status === 'sending'
                            ? 'opacity-50 cursor-not-allowed bg-sky-500/10 text-slate-400'
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
                            Delivering Inquiry...
                          </span>
                        ) : (
                          <>
                            <span>Send Inquiry</span>
                            <svg
                              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    )}
                  </div>

                  {/* Success or Error Card */}
                  {status === 'success' && lastSentData && (
                    <div className="p-4 rounded-2xl border bg-[#060e20] border-emerald-400/40 text-slate-200 flex flex-col gap-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Inquiry Delivered Successfully!</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Your message has been forwarded directly to <strong className="text-sky-300">{lastSentData.targetEmail}</strong> and logged in the portfolio inquiry database.
                      </p>

                      {/* Quick Direct Email Launcher Options */}
                      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2.5">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lastSentData.targetEmail)}&su=${encodeURIComponent(`[Portfolio Inquiry] From ${lastSentData.name}`)}&body=${encodeURIComponent(lastSentData.message)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all group cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                          <span>Open in Gmail (Web)</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>

                        <a
                          href={`mailto:${lastSentData.targetEmail}?subject=${encodeURIComponent(`[Portfolio Inquiry] From ${lastSentData.name}`)}&body=${encodeURIComponent(lastSentData.message)}`}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all group cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                          <span>Open in Mail Client</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleCopyMessage}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium transition-all cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy Text'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {status === 'error' && feedbackMsg && (
                    <div className="p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 bg-[#060913]/90 border-rose-400/50 text-rose-300">
                      <span className="text-base">⚠️</span>
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
