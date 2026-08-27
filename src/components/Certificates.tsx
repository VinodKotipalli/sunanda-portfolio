import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateItem } from '../data/portfolioData';

// 1. AWS Logo with clear, unmistakable 'AWS' typography and vibrant orange smile arrow
const AwsProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-white border border-white/20 flex flex-col items-center justify-center p-1.5 shadow-md shrink-0 group-hover:scale-105 transition-transform overflow-hidden select-none">
    <span className="text-[#232F3E] font-black text-sm leading-none tracking-tight font-['Outfit',sans-serif]">
      AWS
    </span>
    <svg viewBox="0 0 36 8" className="w-6 h-auto mt-1" fill="none">
      <path
        d="M2 2.5C10 6.5 24 6.5 32 2.5"
        stroke="#FF9900"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 1.5L34.5 3L32.5 6"
        fill="#FF9900"
      />
    </svg>
  </div>
);

// 2. Microsoft Logo matching uploaded image (4-color square logo)
const MicrosoftProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-white border border-white/20 flex items-center justify-center p-2.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
    <div className="grid grid-cols-2 gap-1 w-6 h-6">
      <div className="bg-[#F25022] rounded-[1px] w-full h-full" />
      <div className="bg-[#7FBA00] rounded-[1px] w-full h-full" />
      <div className="bg-[#00A4EF] rounded-[1px] w-full h-full" />
      <div className="bg-[#FFB900] rounded-[1px] w-full h-full" />
    </div>
  </div>
);

// 3. GitHub Logo matching uploaded image (Black rounded badge with white circle and black cat)
const GitHubProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-black border border-white/20 flex items-center justify-center p-1.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    </div>
  </div>
);

// 4. Anthropic Claude Logo matching uploaded image (Off-white / cream background with bold Anthropic 'A\' mark)
const AnthropicProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-[#FBF9F4] border border-white/20 flex items-center justify-center p-2 shadow-md shrink-0 group-hover:scale-105 transition-transform">
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#141413]">
      <path d="M17.4 3h-3.3L8.3 18.5h3.4l1.2-3.4h5.8l1.2 3.4h3.4L17.4 3zm-3.5 9.5l1.9-5.3 1.9 5.3h-3.8zM6.6 18.5H3.2L9 3h3.4L6.6 18.5z" />
    </svg>
  </div>
);

const ProviderLogo: React.FC<{ issuer: string; name: string }> = ({ issuer, name }) => {
  const text = (issuer + ' ' + name).toLowerCase();
  if (text.includes('amazon') || text.includes('aws')) return <AwsProviderLogo />;
  if (text.includes('anthropic') || text.includes('claude')) return <AnthropicProviderLogo />;
  if (text.includes('github')) return <GitHubProviderLogo />;
  return <MicrosoftProviderLogo />;
};

const getIssuerCategory = (issuer: string) => {
  const lower = issuer.toLowerCase();
  if (lower.includes('amazon') || lower.includes('aws')) return 'AWS';
  if (lower.includes('microsoft')) return 'Microsoft Azure';
  if (lower.includes('anthropic') || lower.includes('claude')) return 'Anthropic Claude';
  if (lower.includes('github')) return 'GitHub';
  return 'Cloud & AI';
};

const CertificateCard: React.FC<{ cert: CertificateItem; index: number }> = ({ cert, index }) => {
  const issuerCat = getIssuerCategory(cert.issuer);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={String(Math.min((index % 6) * 80, 400))}
      className="bg-[#0c1427]/70 backdrop-blur-md border border-sky-500/20 rounded-2xl p-6 hover:border-sky-400/60 hover:bg-[#0f1b36]/80 hover:shadow-[0_15px_35px_rgba(2,132,199,0.15)] transition-all duration-300 group flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Provider Logo, Code Badge & Dates */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <ProviderLogo issuer={cert.issuer} name={cert.name} />
            <div>
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] font-bold text-slate-200 block">
                {cert.issuer}
              </span>
              <span className="text-[10px] font-['JetBrains_Mono',monospace] text-slate-400">
                {cert.issueDate ? `Issued ${cert.issueDate}` : cert.year}
                {cert.expiryDate ? ` · Exp ${cert.expiryDate}` : ''}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider shrink-0">
            {cert.code}
          </span>
        </div>

        {/* Certificate Title */}
        <h3 className="text-slate-100 font-bold text-base sm:text-lg tracking-tight group-hover:text-sky-300 transition-colors leading-snug mb-2 font-['Outfit',sans-serif]">
          {cert.name}
        </h3>

        {/* Description */}
        {cert.description && (
          <p className="text-xs text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed mb-3">
            {cert.description}
          </p>
        )}

        {/* Skills Chips */}
        {cert.skills && cert.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 pt-2 border-t border-sky-500/10">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded bg-[#060913]/70 border border-sky-500/15 text-[9px] font-['JetBrains_Mono',monospace] text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Verification Badge */}
      <div className="pt-3 border-t border-sky-500/15 flex items-center justify-between gap-2 text-xs font-['JetBrains_Mono',monospace] text-slate-400">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Verified Credential
        </span>

        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold shrink-0">
          {issuerCat}
        </span>
      </div>
    </div>
  );
};

export const Certificates: React.FC = () => {
  const { data } = usePortfolio();
  const certs = data.certificates;

  return (
    <section
      id="certifications"
      className="bg-[#080d1a] text-slate-100 pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-sky-500/15"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-12 text-center md:text-left">
          <div className="inline-block border border-sky-500/30 rounded-full px-5 py-1.5 text-xs sm:text-sm text-sky-300 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-sky-500/10 backdrop-blur-sm uppercase tracking-[0.25em]">
            ✦ Credentials & Certifications ({certs.length})
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 tracking-tight mb-4 uppercase font-['Syne',sans-serif]">
            CERTIFICATIONS
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
            Industry-recognized credentials across Amazon Web Services (AWS), Microsoft Azure, Anthropic Claude GenAI, and GitHub DevOps.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, index) => (
            <CertificateCard key={cert.name + cert.code} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
