// ============================================================
// portfolioData.ts — Accurate configuration for Sunanda Sri Karumuri
// Strictly aligned with the AWS Cloud Operations Engineer resume.
// ============================================================

export interface CertificateItem {
  name: string;
  code: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  year: string;
  icon: string;
  skills?: string[];
  description?: string;
  badgeUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  duration: string;
  highlights: string[];
}

export interface AchievementItem {
  metric: string;
  title: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  university: string;
  location: string;
  duration: string;
  percentage: string;
}

export interface ProjectItem {
  title: string;
  subtitle?: string;
  category: string;
  technologies: string[];
  description: string;
  highlights: string[];
  architectureLayers?: {
    tier: string;
    description: string;
  }[];
}

export const personalInfo = {
  name: "Sunanda Sri Karumuri",
  firstName: "Sunanda",
  brandName: "Sunanda Sri Karumuri",
  title: "AWS Cloud Operations Engineer",
  location: "Tenali, Andhra Pradesh 522213",
  phone: "+91 9347260159",
  email: "karumuri2003@gmail.com",
  emails: {
    primary: "karumuri2003@gmail.com",
  },
  summary:
    "AWS Cloud Operations Engineer with 2+ years of experience designing, deploying, and maintaining cloud monitoring and infrastructure solutions on AWS. Skilled in Infrastructure as Code using Terraform, CI/CD automation with Jenkins, and implementing centralized monitoring platforms using Prometheus, Grafana, Node Exporter, and Alert manager. Experienced in monitoring AWS EC2 instances, Linux servers, and Docker containers, developing Grafana dashboards with PromQL, and configuring automated alerting through Slack and email notifications. Proficient in Linux administration, AWS services including EC2, IAM, and CloudWatch, and applying AWS Well-Architected Framework principles to improve reliability, security, performance, and operational excellence. Strong experience in technical documentation, incident response, and collaborating with cross-functional teams to enhance system availability and reduce Mean Time to Detect (MTTD).",
  resumeUrl: "/Sunanda_Sri_Karumuri_Resume.pdf",
};

export const socialLinks = {
  github: "https://github.com/Sunanda-2003",
  linkedin: "https://www.linkedin.com/in/karumuri-sunanda-sri-972189278",
  instagram: "https://www.linkedin.com/in/karumuri-sunanda-sri-972189278",
};

export const heroContent = {
  greeting: "Hi, I'm Sunanda Sri Karumuri",
  titleHighlight: "AWS Cloud Operations Engineer",
  subtitle:
    "AWS Cloud Operations Engineer with 2+ years of experience in AWS Cloud Infrastructure, Terraform IaC, Prometheus & Grafana Monitoring, Jenkins CI/CD, Docker & Kubernetes.",
  ctaPrimary: { text: "View Experience", href: "#experience" },
  ctaSecondary: {
    text: "Contact Me",
    href: "mailto:karumuri2003@gmail.com?subject=Opportunity Inquiry – Sunanda Sri Karumuri&body=Hello Sunanda,%0D%0A%0D%0AI reviewed your AWS Cloud Operations Engineer profile and would like to discuss an opportunity.%0D%0A%0D%0ABest Regards,",
  },
  ctaResume: { text: "Download Resume", href: "/Sunanda_Sri_Karumuri_Resume.pdf" },
};

export const technicalSkillsCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: ["Python", "Java", "Bash", "Shell Scripting"],
  },
  {
    title: "Cloud Platforms (AWS – Compute & Storage)",
    skills: ["EC2", "S3", "Lambda", "RDS", "ECR", "EKS", "Auto Scaling", "SNS", "CloudWatch"],
  },
  {
    title: "AWS Networking",
    skills: [
      "VPC",
      "Subnets",
      "Route 53",
      "Elastic Load Balancing (ALB/NLB/CLB)",
      "NAT Gateway",
      "Internet Gateway",
      "VPC Peering",
      "CloudFront",
      "Direct Connect",
    ],
  },
  {
    title: "AWS Security",
    skills: [
      "IAM",
      "AWS KMS",
      "Secrets Manager",
      "Security Groups",
      "NACLs",
      "AWS WAF",
      "AWS Shield",
      "Guard Duty",
      "Security Hub",
      "ACM",
      "AWS Config",
      "CloudTrail",
    ],
  },
  {
    title: "Containerization & Orchestration",
    skills: ["Docker", "Kubernetes", "Amazon EKS", "Helm"],
  },
  {
    title: "Infrastructure as Code (IaC)",
    skills: ["Terraform", "AWS CloudFormation"],
  },
  {
    title: "Monitoring & Observability",
    skills: [
      "Amazon CloudWatch",
      "Prometheus",
      "Grafana",
      "Dynatrace",
      "Node Exporter",
      "Alert manager",
      "PromQL",
    ],
  },
  {
    title: "Configuration Management",
    skills: ["Ansible"],
  },
  {
    title: "Version Control & CI/CD",
    skills: ["Git", "GitHub", "GitLab", "Jenkins", "GitHub Actions", "AWS Code Pipeline"],
  },
  {
    title: "Databases",
    skills: ["MySQL", "PostgreSQL"],
  },
  {
    title: "Operating Systems",
    skills: ["Linux", "Ubuntu", "Amazon Linux"],
  },
  {
    title: "Methodologies",
    skills: [
      "DevOps",
      "IaC",
      "GitOps",
      "CI/CD Automation",
      "SRE",
      "Cloud Security",
      "Disaster Recovery & Backup",
      "AWS Well-Architected Framework",
      "Technical Documentation & Runbooks",
    ],
  },
];

export const experienceData: ExperienceItem = {
  role: "AWS Cloud Operations Engineer",
  company: "Tata Consultancy Services (TCS)",
  location: "Hyderabad",
  duration: "June 2024 – June 2026",
  highlights: [
    "Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers, Docker containers, and AWS environments.",
    "Automated provisioning and configuration of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.",
    "Integrated Jenkins CI/CD pipelines with the monitoring stack to validate application health post-deployment, trigger automated alerts on failed builds, and accelerate release cycles from weekly to daily.",
    "Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, network, and system load metrics, developing interactive Grafana dashboards using PromQL queries for multi-tier performance visualization.",
    "Integrated Alertmanager with email and Slack notifications for automated threshold alerts, deduplication, and grouping—reducing alert fatigue, accelerating root cause analysis, and minimizing Mean Time to Detect (MTTD).",
    "Applied AWS Well-Architected Framework best practices across EC2, IAM, and CloudWatch while authoring standard operating procedures (SOPs), operational runbooks, and incident response workflows to ensure enterprise system reliability.",
  ],
};

export const keyAchievements: AchievementItem[] = [
  {
    metric: "Weekly → Daily",
    title: "Release Acceleration",
    description:
      "Reduced application release cycles from weekly to daily by standardizing CI/CD workflows and deployment automation.",
  },
  {
    metric: "80% Reduction",
    title: "IaC Provisioning Speed",
    description:
      "Accelerated infrastructure delivery with reusable Infrastructure as Code (IaC) templates, reducing provisioning time by 80%.",
  },
  {
    metric: "0 Critical Issues",
    title: "Cloud Governance & Security",
    description:
      "Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access, resulting in zero critical security findings.",
  },
];

export const certificationsList: CertificateItem[] = [
  {
    name: "AWS Certified Data Engineer - Associate",
    code: "DEA-C01",
    issuer: "Amazon",
    issueDate: "Aug 2026",
    expiryDate: "Aug 2029",
    year: "2026",
    icon: "📊",
    skills: ["AWS Data Engineering & ETL", "Data Lakes & Data Storage", "Data Ingestion & Pipelines"],
    description:
      "Validates expertise in designing, implementing, and managing data solutions and pipelines on AWS, covering data ingestion, transformation, and security.",
  },
  {
    name: "AWS Certified Solutions Architect - Associate",
    code: "SAA-C03",
    issuer: "Amazon",
    issueDate: "Jul 2026",
    expiryDate: "Jul 2029",
    year: "2026",
    icon: "☁️",
    skills: ["Solution Architecture", "Amazon VPC & Networking", "High Availability & Resilience", "Cost Optimization"],
    description:
      "Validates expertise in designing secure, resilient, high-performing, and cost-optimized AWS architectures.",
  },
  {
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    code: "AZ-305",
    issuer: "Microsoft",
    issueDate: "Jul 2026",
    expiryDate: "Jul 2027",
    year: "2026",
    icon: "🔷",
    skills: ["Azure Infrastructure Design", "Azure Identity & Security (Microsoft Entra ID, RBAC, Key Vault)", "Azure Compute & Networking"],
    description:
      "Validated expertise in designing secure, scalable, and reliable Microsoft Azure solutions across compute, networking, storage, and identity.",
  },
  {
    name: "Microsoft Certified: Azure Administrator Associate",
    code: "AZ-104",
    issuer: "Microsoft",
    issueDate: "May 2026",
    expiryDate: "May 2027",
    year: "2026",
    icon: "🛡️",
    skills: ["Azure Infrastructure as a Service (IaaS)", "Identity and Access Management (IAM)", "Virtual Networks & Governance"],
    description:
      "Demonstrating proficiency in implementing, managing, and monitoring identity, governance, storage, compute, and virtual networks in Azure.",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    code: "AZ-900",
    issuer: "Microsoft",
    issueDate: "Feb 2026",
    year: "2026",
    icon: "🌐",
    skills: ["Microsoft Azure", "Cloud Computing Concepts", "Core Architecture Services", "Security & Compliance"],
    description:
      "Demonstrating foundational knowledge of cloud computing concepts and Microsoft Azure architecture, workloads, and security.",
  },
  {
    name: "GitHub Foundations",
    code: "GH-FOUND",
    issuer: "Microsoft / GitHub",
    issueDate: "Aug 2026",
    expiryDate: "Aug 2028",
    year: "2026",
    icon: "🐙",
    skills: ["Git Version Control", "GitHub Repository Management", "Branching & Merging", "Pull Requests & CI/CD"],
    description:
      "Validated foundational knowledge of Git and GitHub, including version control, repository management, branching and merging, and collaborative workflows.",
  },
  {
    name: "Claude Certified Architect - Foundations",
    code: "CCA-Foundations",
    issuer: "Anthropic",
    issueDate: "Aug 2026",
    expiryDate: "Aug 2027",
    year: "2026",
    icon: "🧠",
    skills: ["Claude API & Application Development", "Prompt Engineering & Context Management", "AI Agents & Tool Use", "Model Context Protocol (MCP)"],
    description:
      "Skilled in Claude API and AI application development, prompt engineering and context management, AI agents and tool use, and Model Context Protocol (MCP).",
  },
  {
    name: "Claude Certified Developer - Foundations",
    code: "CCD-Foundations",
    issuer: "Anthropic",
    issueDate: "Aug 2026",
    expiryDate: "Aug 2027",
    year: "2026",
    icon: "💻",
    skills: ["Claude AI / Anthropic Claude", "AI Application Development", "LLM Integration & Prompt Design"],
    description:
      "Demonstrating foundational knowledge of building and working with AI-powered applications using Anthropic Claude.",
  },
  {
    name: "Claude Certified Associate - Foundations",
    code: "CCA-Assoc",
    issuer: "Anthropic",
    issueDate: "Aug 2026",
    expiryDate: "Aug 2027",
    year: "2026",
    icon: "⚡",
    skills: ["Claude AI", "Generative AI", "AI Safety & Responsible Usage", "Context Optimization"],
    description:
      "Demonstrates foundational proficiency in using Claude and generative AI effectively, safely, and responsibly.",
  },
];

export const educationData: EducationItem = {
  degree: "B.Sc. Computer Science",
  institution: "ASN Degree College",
  university: "ANU University",
  location: "Tenali, Andhra Pradesh",
  duration: "June 2021 – April 2024",
  percentage: "90.00%",
};

export const projectsList: ProjectItem[] = [
  {
    title: "01 — AWS Multi-Tier Infrastructure with Terraform",
    subtitle: "Enterprise 3-Tier Cloud Architecture & Automated Infrastructure as Code",
    category: "Cloud Infrastructure & IaC",
    technologies: [
      "Terraform",
      "AWS",
      "VPC",
      "EC2",
      "Application Load Balancer",
      "Amazon RDS",
      "Auto Scaling",
      "IAM",
      "Security Groups",
      "Linux",
    ],
    description:
      "Designed and automated a scalable, highly available three-tier cloud infrastructure on AWS using reusable Terraform modules. The architecture isolates presentation, application logic, and persistence layers across multiple Availability Zones with dedicated public/private subnets, automated load balancing, Auto Scaling, and centralized security controls.",
    highlights: [
      "Automated complete AWS infrastructure provisioning using modular, reusable Terraform configurations.",
      "Configured custom VPC architecture with public subnets, private application subnets, database subnets, Internet Gateways, and NAT Gateways across multiple AZs.",
      "Implemented Application Load Balancers (ALBs) with health check target groups, SSL/TLS termination, and path-based routing rules.",
      "Deployed Launch Templates and Auto Scaling Groups (ASG) ensuring elastic scaling and self-healing compute capacity.",
      "Configured Multi-AZ Amazon RDS PostgreSQL database tier with automated snapshots, KMS encryption at rest, and automated failover.",
      "Enforced least-privilege IAM policies, security group ingress/egress isolation, and secure Bastion host access.",
    ],
  },
  {
    title: "02 — Amazon EKS Kubernetes Deployment Platform",
    subtitle: "Production Container Orchestration, Microservices & Elastic Pod Autoscaling",
    category: "Containerization & Orchestration",
    technologies: [
      "Amazon EKS",
      "Kubernetes",
      "Docker",
      "Helm",
      "Amazon ECR",
      "HPA",
      "IRSA",
      "CoreDNS",
      "Linux",
    ],
    description:
      "Architected and deployed a resilient Kubernetes container platform on Amazon EKS for running microservices workloads. Containerized applications with Docker, packaged deployment manifests into Helm charts, and configured autoscaling policies with secure IAM Roles for Service Accounts (IRSA).",
    highlights: [
      "Provisioned Amazon EKS control plane and managed EC2 worker node groups using infrastructure-as-code.",
      "Containerized backend and frontend microservices using multi-stage Docker builds optimized for minimal image footprint.",
      "Created standardized Helm charts managing Kubernetes Deployments, Services, ConfigMaps, Secrets, and Ingress resources.",
      "Configured Horizontal Pod Autoscaler (HPA) to dynamically scale pods based on CPU and memory utilization thresholds.",
      "Configured Kubernetes liveness and readiness health probes enabling self-healing and zero-downtime rolling updates.",
      "Implemented IAM Roles for Service Accounts (IRSA) granting fine-grained AWS permissions directly to Kubernetes pods.",
    ],
  },
  {
    title: "03 — GitHub Actions CI/CD Automation",
    subtitle: "End-to-End Automated Build, Security Scan & GitOps Deployment Pipeline",
    category: "CI/CD & DevOps Automation",
    technologies: [
      "GitHub Actions",
      "Docker",
      "Amazon ECR",
      "Helm",
      "Trivy",
      "GitOps",
      "Bash",
      "AWS CLI",
    ],
    description:
      "Engineered an automated end-to-end continuous integration and continuous deployment (CI/CD) pipeline using GitHub Actions. The pipeline automates code validation, container security scans, artifact publishing to Amazon ECR, and automated deployments to Kubernetes clusters with rollback safeguards.",
    highlights: [
      "Constructed multi-stage GitHub Actions workflows triggered on pull requests and branch merges.",
      "Integrated automated code linting, unit testing, and static container image vulnerability scanning with Trivy.",
      "Automated Docker container builds, semantic version tagging, and secure publishing to Amazon Elastic Container Registry (ECR).",
      "Automated zero-downtime Helm upgrades and rolling releases on target Kubernetes environments upon merge.",
      "Configured automated deployment verification and post-deployment health check validation with automated rollback triggers.",
      "Secured pipeline credentials using GitHub Encrypted Secrets, OpenID Connect (OIDC), and least-privilege IAM roles.",
    ],
  },
  {
    title: "04 — Terraform Remote State & Multi-Environment Automation",
    subtitle: "Enterprise State Management, S3 Locking, KMS Encryption & Environment Workspaces",
    category: "Infrastructure as Code (IaC)",
    technologies: [
      "Terraform",
      "Amazon S3",
      "DynamoDB",
      "AWS KMS",
      "Terraform Workspaces",
      "IAM",
      "Bash",
    ],
    description:
      "Implemented a secure, centralized remote state management architecture for Terraform with state locking and multi-environment isolation (Dev, Staging, Production). Prevented concurrent execution conflicts and enforced cryptographic security for infrastructure state files.",
    highlights: [
      "Configured Amazon S3 remote state backend with versioning, server-side encryption via AWS KMS, and public access blocks.",
      "Implemented DynamoDB state locking table preventing simultaneous state modifications and race conditions during team deployments.",
      "Structured multi-environment parameterization using Terraform Workspaces and environment-specific `.tfvars` variable files.",
      "Built standardized, modular infrastructure components with strict input type constraints and validation rules.",
      "Automated `terraform fmt`, `terraform validate`, and drift detection checks within automated workflow steps.",
      "Enforced strict IAM bucket policies ensuring only authorized automation roles and administrators can access state objects.",
    ],
  },
  {
    title: "05 — AWS Observability with Prometheus & Grafana",
    subtitle: "Real-Time Telemetry, Cluster Health Dashboards & Alertmanager Notification System",
    category: "Monitoring & Observability",
    technologies: [
      "Prometheus",
      "Grafana",
      "Amazon CloudWatch",
      "Alertmanager",
      "Node Exporter",
      "kube-state-metrics",
      "PromQL",
      "Slack Webhooks",
    ],
    description:
      "Deployed a full-stack observability and monitoring platform on AWS using Prometheus, Grafana, and Alertmanager. Provided deep visibility into Kubernetes workloads, node resource saturation, application request rates, latency distributions, and automated operational alerts.",
    highlights: [
      "Deployed Prometheus server, kube-state-metrics, and Node Exporters to collect cluster and infrastructure telemetry.",
      "Designed dynamic Grafana dashboards visualizing CPU/Memory utilization, pod restart frequencies, network throughput, and response latency.",
      "Constructed custom PromQL alerting rules tracking SLA breaches, elevated error rates, and resource bottlenecks.",
      "Configured Alertmanager dispatch routing to send prioritized notification alerts to Slack channels and incident responder emails.",
      "Integrated Amazon CloudWatch Logs and CloudWatch Alarms for comprehensive AWS managed service monitoring.",
      "Significantly improved system observability, reducing Mean Time to Detect (MTTD) and Mean Time to Resolve (MTTR).",
    ],
  },
];

export const footerContent = {
  futureQuotes: [
    {
      heading: "Architecting Tomorrow",
      caption: "The best way to predict the future is to engineer it with precision and resilience.",
    },
    {
      heading: "Limitless Scalability",
      caption: "Driven by curiosity, building high-availability cloud platforms for the next generation.",
    },
    {
      heading: "Continuous Evolution",
      caption: "Always learning, automating, and deploying solutions that empower tomorrow.",
    },
  ],
  taglines: [
    "Architecting the Cloud of Tomorrow",
    "Turning bold visions into resilient, automated systems.",
    "Engineered for scale · Built for the future",
  ],
  credential: "The future belongs to those who build with purpose.",
  copyright: `© ${new Date().getFullYear()} Sunanda Sri Karumuri | AWS Cloud Operations Engineer`,
};

export const emailjsConfig = {
  serviceId: (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || "service_default",
  templateId: (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || "template_default",
  publicKey: (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || "user_public_key",
};
