import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem } from '../data/portfolioData';
import { ExternalLink, X, CheckCircle2, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const projects = data.projects;
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section
      id="projects"
      className="bg-[#060913] pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-sky-500/15"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div data-aos="fade-up" className="mb-14 text-center md:text-left">
          <div className="inline-block border border-sky-500/30 rounded-full px-5 py-1.5 text-xs sm:text-sm text-sky-300 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-sky-500/10 backdrop-blur-sm uppercase tracking-[0.25em]">
            ✦ Technical Projects
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 leading-tight mb-4 tracking-tight uppercase font-['Syne',sans-serif]">
            FEATURED PROJECTS
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
            Production AWS multi-tier infrastructure, Amazon EKS Kubernetes orchestration, GitHub Actions CI/CD automation, Terraform remote state management, and full-stack observability.
          </p>
        </div>

        {/* 5 Square Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, pIndex) => {
            return (
              <div
                key={project.title}
                data-aos="fade-up"
                data-aos-delay={pIndex * 70}
                onClick={() => setSelectedProject(project)}
                className="aspect-square bg-[#0c1427]/70 backdrop-blur-md border border-sky-500/20 rounded-3xl p-6 sm:p-7 hover:border-sky-400/60 hover:bg-[#0f1b36]/80 hover:shadow-[0_15px_35px_rgba(2,132,199,0.2)] transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Subtle top corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-500/15 to-transparent pointer-events-none rounded-tr-3xl" />

                {/* Top Section: Category & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-sky-500/15">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-['JetBrains_Mono',monospace] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 uppercase tracking-wider truncate max-w-[170px]">
                      {project.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-['JetBrains_Mono',monospace] text-emerald-400 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Production Ready
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors leading-snug font-['Outfit',sans-serif] mb-1.5 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[11px] text-slate-400 font-['Plus_Jakarta_Sans',sans-serif] mb-3 line-clamp-1">
                    {project.subtitle}
                  </p>

                  {/* Concise Description */}
                  <p className="text-xs text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed line-clamp-3 mb-3">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Section: Tech Stack & Trigger Button */}
                <div className="pt-3 border-t border-sky-500/15">
                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#060913]/80 border border-sky-500/15 text-[10px] font-['JetBrains_Mono',monospace] text-slate-200 group-hover:border-sky-500/30 transition-all"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-sky-500/15 text-[10px] font-['JetBrains_Mono',monospace] text-slate-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Open Details Link */}
                  <div className="flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] font-bold text-sky-400 group-hover:text-sky-200 transition-colors">
                    <span>View Architecture Details</span>
                    <span className="w-6 h-6 rounded-full bg-sky-500/10 border border-sky-500/30 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-blue-600 group-hover:border-sky-400 flex items-center justify-center text-white transition-all text-xs shadow-sm">
                      ↗
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#060913]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="bg-[#0c1427] border border-sky-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-['JetBrains_Mono',monospace] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                {selectedProject.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-['JetBrains_Mono',monospace] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Production Architecture
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-100 font-['Outfit',sans-serif] mb-2 pr-8">
              {selectedProject.title}
            </h3>
            <p className="text-sm text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] mb-6">
              {selectedProject.subtitle}
            </p>

            {/* Description */}
            <div className="mb-6 p-4 rounded-2xl bg-[#060913]/70 border border-sky-500/20">
              <h4 className="text-xs font-['JetBrains_Mono',monospace] font-bold text-sky-300 uppercase tracking-wider mb-2">
                Overview & Design Purpose
              </h4>
              <p className="text-sm text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Key Deliverables & Architecture Highlights */}
            <div className="mb-6">
              <h4 className="text-xs font-['JetBrains_Mono',monospace] font-bold text-sky-400 uppercase tracking-wider mb-3">
                Key Architecture Deliverables ({selectedProject.highlights.length} Points)
              </h4>
              <div className="space-y-2.5">
                {selectedProject.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#060913]/70 border border-sky-500/10"
                  >
                    <span className="w-5 h-5 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="pt-4 border-t border-sky-500/15">
              <h4 className="text-xs font-['JetBrains_Mono',monospace] font-bold text-slate-200 uppercase tracking-wider mb-3">
                Technologies & Tools Applied
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-xs font-['JetBrains_Mono',monospace] text-sky-200 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* GitHub Link Action */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-sky-500/15">
                <a
                  href={data.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:from-sky-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>Explore Source Code on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
