import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  personalInfo as initialPersonalInfo,
  heroContent as initialHeroContent,
  technicalSkillsCategories as initialSkillsCategories,
  experienceData as initialExperienceData,
  keyAchievements as initialKeyAchievements,
  certificationsList as initialCertificationsList,
  educationData as initialEducationData,
  projectsList as initialProjectsList,
  footerContent as initialFooterContent,
  socialLinks as initialSocialLinks,
  SkillCategory,
  ExperienceItem,
  AchievementItem,
  CertificateItem,
  EducationItem,
  ProjectItem,
} from '../data/portfolioData';

export interface PortfolioFullData {
  personalInfo: typeof initialPersonalInfo;
  heroContent: typeof initialHeroContent;
  technicalSkills: SkillCategory[];
  experience: ExperienceItem;
  achievements: AchievementItem[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  education: EducationItem;
  footerContent: typeof initialFooterContent;
  socialLinks: typeof initialSocialLinks;
}

const defaultFullData: PortfolioFullData = {
  personalInfo: initialPersonalInfo,
  heroContent: initialHeroContent,
  technicalSkills: initialSkillsCategories,
  experience: initialExperienceData,
  achievements: initialKeyAchievements,
  projects: initialProjectsList,
  certificates: initialCertificationsList,
  education: initialEducationData,
  footerContent: initialFooterContent,
  socialLinks: initialSocialLinks,
};

interface PortfolioContextType {
  data: PortfolioFullData;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purge any stale cached versions so user always sees the latest data
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('portfolio_data') || key.includes('sunanda_') || key.includes('saivinod_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ data: defaultFullData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
