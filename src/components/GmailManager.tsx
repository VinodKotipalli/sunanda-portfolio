import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Inbox,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import {
  getGmailProfile,
  listGmailMessages,
  getGmailMessage,
  sendGmailMessage,
  deleteGmailMessage,
  ParsedEmail,
  GmailProfile,
} from '../lib/gmail';

interface GmailManagerProps {
  onClose?: () => void;
  initialRecipient?: string;
  defaultSubject?: string;
  defaultMessage?: string;
}

export const GmailManager: React.FC<GmailManagerProps> = ({
  onClose,
  initialRecipient,
  defaultSubject = '',
  defaultMessage = '',
}) => {
  const { user, accessToken, signInWithGoogle, logout, authError } = useAuth();
  const { data } = usePortfolio();
  const { personalInfo } = data;

  const targetRecipient = initialRecipient || personalInfo.email || 'karumuri2003@gmail.com';

  const [activeTab, setActiveTab] = useState<'compose' | 'inbox'>('compose');
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Compose State
  const [recipient, setRecipient] = useState(targetRecipient);
  const [subject, setSubject] = useState(defaultSubject || 'Professional Opportunity / Project Inquiry');
  const [emailBody, setEmailBody] = useState(
    defaultMessage ||
      `Hi Sunanda,\n\nI came across your Cloud DevOps & AWS portfolio and would like to discuss an opportunity.\n\nBest regards,\n`
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Confirmation Modal State (Mandatory for Workspace mutative operations)
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<ParsedEmail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inbox state
  const [messages, setMessages] = useState<ParsedEmail[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<ParsedEmail | null>(null);
  const [inboxError, setInboxError] = useState<string | null>(null);

  // Fetch profile when access token changes
  useEffect(() => {
    if (accessToken) {
      loadProfile(accessToken);
      loadRecentMessages(accessToken);
    } else {
      setProfile(null);
      setMessages([]);
    }
  }, [accessToken]);

  const loadProfile = async (token: string) => {
    setProfileLoading(true);
    try {
      const prof = await getGmailProfile(token);
      setProfile(prof);
    } catch (err: any) {
      console.warn('Profile fetch note:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadRecentMessages = async (token: string) => {
    setInboxLoading(true);
    setInboxError(null);
    try {
      const list = await listGmailMessages(token, '', 8);
      if (list.messages && list.messages.length > 0) {
        const details = await Promise.all(
          list.messages.slice(0, 6).map(async (m) => {
            try {
              return await getGmailMessage(token, m.id);
            } catch {
              return null;
            }
          })
        );
        setMessages(details.filter((d): d is ParsedEmail => d !== null));
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setInboxError(err?.message || 'Failed to retrieve messages from Gmail.');
    } finally {
      setInboxLoading(false);
    }
  };

  const handleSendInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !emailBody.trim()) {
      setSendError('Please provide a recipient, subject, and email body.');
      return;
    }
    setSendError(null);
    setShowSendConfirm(true);
  };

  const handleExecuteSend = async () => {
    if (!accessToken) {
      setSendError('Gmail access token is missing. Please sign in with Google.');
      setShowSendConfirm(false);
      return;
    }

    setShowSendConfirm(false);
    setIsSending(true);
    setSendError(null);
    setSendSuccess(null);

    try {
      await sendGmailMessage(
        accessToken,
        recipient.trim(),
        subject.trim(),
        emailBody.trim()
      );

      setSendSuccess(`Email successfully sent to ${recipient} via your authorized Gmail account!`);
      // Refresh inbox/sent count
      if (accessToken) {
        loadProfile(accessToken);
        loadRecentMessages(accessToken);
      }
    } catch (err: any) {
      console.error('Send error:', err);
      setSendError(err?.message || 'Failed to dispatch email via Gmail API.');
    } finally {
      setIsSending(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteCandidate || !accessToken) return;

    setIsDeleting(true);
    try {
      await deleteGmailMessage(accessToken, deleteCandidate.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteCandidate.id));
      if (selectedEmail?.id === deleteCandidate.id) {
        setSelectedEmail(null);
      }
      setDeleteCandidate(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setInboxError(err?.message || 'Failed to move email to trash.');
    } finally {
      setIsDeleting(false);
    }
  };

  const applyTemplate = (type: 'recruiter' | 'project' | 'mentorship') => {
    if (type === 'recruiter') {
      setSubject('Interview Opportunity: Cloud & DevOps Role at [Company]');
      setEmailBody(
        `Hi Sunanda,\n\nI reviewed your portfolio and was impressed by your experience with AWS, Terraform, Docker, and CI/CD pipelines.\n\nWe have an exciting Cloud Engineer / DevOps role that aligns well with your background. Would you be open for a brief 15-minute introductory call this week?\n\nBest regards,\n${user?.displayName || '[Your Name]'}`
      );
    } else if (type === 'project') {
      setSubject('Freelance / Contract Cloud Architecture Inquiry');
      setEmailBody(
        `Hi Sunanda,\n\nWe are looking for expertise in deploying secure AWS Infrastructure (VPC, ECS, Lambda, Terraform) for our upcoming project.\n\nPlease let me know your current availability and consultation rates.\n\nBest regards,\n${user?.displayName || '[Your Name]'}`
      );
    } else if (type === 'mentorship') {
      setSubject('Networking & Professional Connect via Portfolio');
      setEmailBody(
        `Hi Sunanda,\n\nI came across your portfolio website and wanted to connect regarding your experience with AWS certifications and Cloud DevOps practices.\n\nLooking forward to staying in touch!\n\nBest regards,\n${user?.displayName || '[Your Name]'}`
      );
    }
  };

  return (
    <div
      id="gmail-workspace-container"
      className="bg-[#0b1222] border border-sky-500/30 rounded-3xl p-6 md:p-8 text-slate-100 shadow-[0_20px_50px_rgba(2,132,199,0.18)] backdrop-blur-xl relative overflow-hidden font-sans"
    >
      {/* Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-sky-500/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-inner">
            <Mail className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                Google Workspace Integration
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Live Gmail API
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-['Syne',sans-serif] text-slate-100">
              Official Gmail Mailbox & Dispatcher
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors self-end sm:self-auto cursor-pointer"
            aria-label="Close Gmail Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Auth State & Content */}
      {!user || !accessToken ? (
        <div className="py-12 flex flex-col items-center text-center max-w-lg mx-auto relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-6 shadow-[0_0_30px_rgba(2,132,199,0.2)]">
            <ShieldCheck className="w-8 h-8 text-sky-400" />
          </div>

          <h4 className="text-xl font-bold text-slate-100 mb-2 font-['Syne',sans-serif]">
            Connect Your Google Account
          </h4>
          <p className="text-sm text-slate-300 mb-8 leading-relaxed">
            Authorize Gmail with secure OAuth to send genuine inquiries directly from your verified email address, view message threads, and communicate with Sunanda seamlessly.
          </p>

          {/* Official Sign in with Google Button (GSI standard style) */}
          <button
            onClick={signInWithGoogle}
            id="gmail-official-signin-btn"
            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-sky-500/20 border border-slate-300 active:scale-98 cursor-pointer group"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span className="font-['Plus_Jakarta_Sans',sans-serif]">Sign in with Google</span>
          </button>

          {authError && (
            <div className="mt-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OAuth 2.0 In-Memory Authorization with Least-Privilege Scopes</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 relative z-10">
          {/* User Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-sky-950/40 border border-sky-500/25">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-10 h-10 rounded-full border border-sky-400/40 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-100">{user.displayName || 'Authenticated User'}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{user.email || profile?.emailAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center bg-[#070d1a] border border-sky-500/20 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('compose')}
                  id="tab-compose-btn"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'compose'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Compose
                </button>
                <button
                  onClick={() => setActiveTab('inbox')}
                  id="tab-inbox-btn"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'inbox'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  Inbox
                  {messages.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-sky-900 text-sky-200 border border-sky-400/40">
                      {messages.length}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={logout}
                id="gmail-logout-btn"
                className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors flex items-center justify-center cursor-pointer"
                title="Sign out from Google"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick AI Templates */}
          {activeTab === 'compose' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-sky-300 flex items-center gap-1 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Quick Templates:
              </span>
              <button
                onClick={() => applyTemplate('recruiter')}
                className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 hover:bg-sky-500/25 border border-sky-500/30 text-sky-200 transition-colors cursor-pointer"
              >
                💼 Recruiter Opportunity
              </button>
              <button
                onClick={() => applyTemplate('project')}
                className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 hover:bg-sky-500/25 border border-sky-500/30 text-sky-200 transition-colors cursor-pointer"
              >
                🚀 AWS / Cloud Project
              </button>
              <button
                onClick={() => applyTemplate('mentorship')}
                className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 hover:bg-sky-500/25 border border-sky-500/30 text-sky-200 transition-colors cursor-pointer"
              >
                🤝 Professional Connect
              </button>
            </div>
          )}

          {/* Tab 1: Compose Form */}
          {activeTab === 'compose' && (
            <form onSubmit={handleSendInitiate} className="flex flex-col gap-4 font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
                    To (Recipient) *
                  </label>
                  <input
                    type="email"
                    id="gmail-recipient-input"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    className="w-full bg-[#060a14] border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-400 font-mono transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="gmail-subject-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full bg-[#060a14] border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300 block mb-1.5">
                  Email Message Body *
                </label>
                <textarea
                  id="gmail-body-input"
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                  className="w-full bg-[#060a14] border border-sky-500/30 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors font-normal resize-y min-h-[140px]"
                />
              </div>

              {/* Status alerts */}
              {sendSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{sendSuccess}</span>
                </div>
              )}
              {sendError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-400">
                  Sending as <strong className="text-sky-300 font-mono">{user.email}</strong>
                </p>

                <button
                  type="submit"
                  disabled={isSending}
                  id="gmail-send-dispatch-btn"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Sending via Gmail...' : 'Send with Gmail API'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Inbox & Recent Messages */}
          {activeTab === 'inbox' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-sky-400" /> Recent Gmail Messages
                </h4>
                <button
                  onClick={() => accessToken && loadRecentMessages(accessToken)}
                  disabled={inboxLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-xs font-medium text-sky-300 border border-sky-500/30 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${inboxLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {inboxError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{inboxError}</span>
                </div>
              )}

              {inboxLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
                  <p className="text-xs font-mono">Fetching latest messages from Gmail...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-[#060a14] rounded-2xl border border-sky-500/20 p-8">
                  <Inbox className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-300">No messages found in your mailbox.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Send an inquiry using the Compose tab to see live activity.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Message List */}
                  <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedEmail(msg)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                          selectedEmail?.id === msg.id
                            ? 'bg-sky-900/40 border-sky-400/60 shadow-[0_0_15px_rgba(2,132,199,0.2)]'
                            : 'bg-[#060a14]/80 border-sky-500/20 hover:border-sky-500/40 hover:bg-[#080f20]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                            {msg.from || 'Unknown Sender'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                            {msg.date.split(',')[0]}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-sky-300 truncate">{msg.subject}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                          {msg.snippet || msg.bodyText}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Message Detail View */}
                  <div className="bg-[#060a14] border border-sky-500/25 rounded-2xl p-4 flex flex-col justify-between max-h-[360px] overflow-y-auto">
                    {selectedEmail ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2 border-b border-sky-500/15 pb-3">
                          <div>
                            <h5 className="text-sm font-bold text-slate-100">{selectedEmail.subject}</h5>
                            <p className="text-xs font-mono text-sky-400 mt-0.5">From: {selectedEmail.from}</p>
                            <p className="text-[10px] text-slate-400">{selectedEmail.date}</p>
                          </div>
                          <button
                            onClick={() => setDeleteCandidate(selectedEmail)}
                            id="gmail-trash-trigger-btn"
                            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                            title="Move message to Trash"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
                          {selectedEmail.bodyText || selectedEmail.snippet}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                        <FileText className="w-8 h-8 text-slate-500 mb-2" />
                        <p className="text-xs">Select a message from the list to preview details.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for SENDING EMAIL (MANDATORY per Workspace Integration skill) */}
      <AnimatePresence>
        {showSendConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c1427] border border-sky-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_20px_50px_rgba(2,132,199,0.3)] text-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-100 font-['Syne',sans-serif]">
                  Confirm Email Dispatch
                </h4>
              </div>

              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Are you sure you want to send this email on behalf of your Google Account (
                <strong className="text-sky-300 font-mono">{user?.email}</strong>)?
              </p>

              <div className="bg-[#060a14] border border-sky-500/20 rounded-xl p-3.5 text-xs mb-6 font-mono flex flex-col gap-1 text-slate-300">
                <p>
                  <strong className="text-sky-400">To:</strong> {recipient}
                </p>
                <p>
                  <strong className="text-sky-400">Subject:</strong> {subject}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSendConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSend}
                  id="confirm-gmail-send-btn"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold shadow-[0_0_15px_rgba(14,165,233,0.4)] cursor-pointer"
                >
                  Confirm & Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for TRASHING / DELETING EMAIL (MANDATORY per Workspace Integration skill) */}
      <AnimatePresence>
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c1427] border border-rose-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[0_20px_50px_rgba(244,63,94,0.2)] text-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-100 font-['Syne',sans-serif]">
                  Move Message to Trash?
                </h4>
              </div>

              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Are you sure you want to move the message <strong>"{deleteCandidate.subject}"</strong> to the trash bin in your Gmail account?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDelete}
                  disabled={isDeleting}
                  id="confirm-gmail-delete-btn"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Moving to Trash...' : 'Confirm Trash'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
