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

const STORAGE_KEY = 'sunanda_portfolio_data_v5';

interface PortfolioContextType {
  data: PortfolioFullData;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear any old obsolete keys from earlier versions
  useEffect(() => {
    try {
      localStorage.removeItem('saivinod_portfolio_data_v15');
      localStorage.removeItem('saivinod_portfolio_data_v1');
      localStorage.removeItem('sunanda_portfolio_data_v1');
      localStorage.removeItem('sunanda_portfolio_data_v2');
      localStorage.removeItem('sunanda_portfolio_data_v3');
      localStorage.removeItem('sunanda_portfolio_data_v4');
    } catch (e) {
      // ignore
    }
  }, []);

  const [data] = useState<PortfolioFullData>(() => {
    try {
      localStorage.removeItem('saivinod_portfolio_data_v15');
      localStorage.removeItem('sunanda_portfolio_data_v1');
      localStorage.removeItem('sunanda_portfolio_data_v2');
      localStorage.removeItem('sunanda_portfolio_data_v3');
      localStorage.removeItem('sunanda_portfolio_data_v4');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only use if name, email, education, github, and linkedin match current updated profile
        if (
          parsed?.personalInfo?.name === initialPersonalInfo.name &&
          parsed?.personalInfo?.email === initialPersonalInfo.email &&
          parsed?.education?.institution === initialEducationData.institution &&
          parsed?.socialLinks?.github === initialSocialLinks.github &&
          parsed?.socialLinks?.linkedin === initialSocialLinks.linkedin
        ) {
          return { ...defaultFullData, ...parsed };
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio data from localStorage', e);
    }
    return defaultFullData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data to localStorage', e);
    }
  }, [data]);

  return (
    <PortfolioContext.Provider value={{ data }}>
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
