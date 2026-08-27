import { jsPDF } from 'jspdf';

export function createResumePdfDoc(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  });

  const marginX = 36;
  const pageWidth = 612;
  const contentWidth = pageWidth - marginX * 2; // 540 pt
  let y = 36;

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 25, 35);
  doc.text('SUNANDA SRI KARUMURI', pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 50, 65);
  doc.text('AWS Cloud Operations Engineer', pageWidth / 2, y, { align: 'center' });
  y += 14;

  // Contact Info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 75, 85);
  doc.text(
    'Tenali, Andhra Pradesh 522213  |  +91 9347260159  |  karumuri2003@gmail.com  |  linkedin.com/in/karumuri-sunanda-sri-972189278  |  github.com/Sunanda-2003',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 14;

  const drawSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), marginX, y);
    y += 3;
    doc.setDrawColor(20, 25, 35);
    doc.setLineWidth(0.75);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 10;
  };

  // 1. PROFESSIONAL SUMMARY
  drawSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const summaryText =
    'AWS Cloud Operations Engineer with 2+ years of experience designing, deploying, and maintaining cloud monitoring and infrastructure solutions on AWS. Skilled in Infrastructure as Code using Terraform, CI/CD automation with Jenkins, and implementing centralized monitoring platforms using Prometheus, Grafana, Node Exporter, and Alert manager. Experienced in monitoring AWS EC2 instances, Linux servers, and Docker containers, developing Grafana dashboards with PromQL, and configuring automated alerting through Slack and email notifications. Proficient in Linux administration, AWS services including EC2, IAM, and CloudWatch, and applying AWS Well-Architected Framework principles to improve reliability, security, performance, and operational excellence. Strong experience in technical documentation, incident response, and collaborating with cross-functional teams to enhance system availability and reduce Mean Time to Detect (MTTD).';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, marginX, y, { lineHeightFactor: 1.15 });
  y += summaryLines.length * 9.8 + 6;

  // 2. TECHNICAL SKILLS
  drawSectionHeader('Technical Skills');
  const skillsList = [
    { cat: 'Programming Languages', val: 'Python, Java, Bash, Shell Scripting' },
    { cat: 'Cloud Platforms (AWS – Compute & Storage)', val: 'EC2, S3, Lambda, RDS, ECR, EKS, Auto Scaling, SNS, CloudWatch' },
    { cat: 'AWS Networking', val: 'VPC, Subnets, Route 53, Elastic Load Balancing (ALB/NLB/CLB), NAT Gateway, Internet Gateway, VPC Peering, CloudFront, Direct Connect' },
    { cat: 'AWS Security', val: 'IAM, AWS KMS, Secrets Manager, Security Groups, NACLs, AWS WAF, AWS Shield, Guard Duty, Security Hub, ACM, AWS Config, CloudTrail' },
    { cat: 'Containerization & Orchestration', val: 'Docker, Kubernetes, Amazon EKS, Helm' },
    { cat: 'Infrastructure as Code (IaC)', val: 'Terraform, AWS CloudFormation' },
    { cat: 'Monitoring & Observability', val: 'Amazon CloudWatch, Prometheus, Grafana, Dynatrace, Node Exporter, Alert manager, PromQL' },
    { cat: 'Configuration Management', val: 'Ansible' },
    { cat: 'Version Control & CI/CD', val: 'Git, GitHub, GitLab, Jenkins, GitHub Actions, AWS Code Pipeline' },
    { cat: 'Databases', val: 'MySQL, PostgreSQL' },
    { cat: 'Operating Systems', val: 'Linux, Ubuntu, Amazon Linux' },
    { cat: 'Methodologies', val: 'DevOps, IaC, GitOps, CI/CD Automation, SRE, Cloud Security, Disaster Recovery & Backup, AWS Well-Architected Framework, Technical Documentation & Runbooks' },
  ];

  skillsList.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(20, 25, 35);
    const prefix = `${s.cat}: `;
    const prefixWidth = doc.getTextWidth(prefix);
    
    // Check if combined line wraps
    const fullText = `${prefix}${s.val}`;
    const lines = doc.splitTextToSize(fullText, contentWidth);
    
    // Render first line with bold prefix
    doc.text(prefix, marginX, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    
    // Render text with word wrap
    const valLines = doc.splitTextToSize(s.val, contentWidth - prefixWidth);
    doc.text(valLines[0], marginX + prefixWidth, y);
    
    if (valLines.length > 1) {
      for (let i = 1; i < valLines.length; i++) {
        y += 9.5;
        doc.text(valLines[i], marginX + 12, y);
      }
    }
    y += 9.6;
  });
  y += 4;

  // 3. PROFESSIONAL EXPERIENCE
  drawSectionHeader('Professional Experience');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('AWS Cloud Operations Engineer', marginX, y);
  y += 10.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 60, 75);
  doc.text('Tata Consultancy Services (TCS), Hyderabad  |  June 2024 – June 2026', marginX, y);
  y += 10;

  const expBullets = [
    'Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers and cloud environments.',
    'Automated provisioning and configuration of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.',
    'Integrated Jenkins CI/CD pipelines with the monitoring stack to validate application health post-deployment, trigger automated alerts on failed builds, and accelerate release cycles from weekly to daily.',
    'Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, filesystem, network, and system load metrics; configured Prometheus scrape jobs, service discovery, recording rules, and alerting rules for continuous infrastructure and application monitoring.',
    'Developed interactive Grafana dashboards using PromQL queries to visualize infrastructure performance, server availability, application health, and resource utilization.',
    'Integrated Alertmanager with email and Slack notifications for automated alerting on CPU, memory, disk, and service downtime; tuned alert thresholds, grouping, and deduplication policies to reduce alert fatigue and improve incident response efficiency.',
    'Monitored AWS EC2 instances, Linux servers, and Docker containers to improve operational visibility and system reliability; performed proactive capacity planning and troubleshot exporter, scrape, and connectivity issues by analyzing Prometheus target status and logs.',
    'Applied AWS Well-Architected Framework best practices across the Reliability, Security, Cost Optimization, Performance Efficiency, and Operational Excellence pillars when designing and reviewing monitoring and cloud infrastructure solutions.',
    'Authored and maintained technical documentation, dashboard guides, operational runbooks, and standard operating procedures (SOPs) for monitoring, alerting, and incident response, improving knowledge transfer and reducing onboarding time.',
    'Collaborated with DevOps, Cloud Operations, and application teams to implement monitoring standards and support production incident management through faster root cause analysis and reduced Mean Time to Detect (MTTD).'
  ];

  expBullets.forEach((bullet) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(30, 41, 59);
    doc.text('●', marginX + 2, y);
    const lines = doc.splitTextToSize(bullet, contentWidth - 14);
    doc.text(lines, marginX + 12, y, { lineHeightFactor: 1.12 });
    y += lines.length * 9.3 + 1.8;
  });
  y += 3;

  // 4. KEY ACHIEVEMENTS
  drawSectionHeader('Key Achievements');
  const achievements = [
    'Reduced application release cycles from weekly to daily by standardizing CI/CD workflows and deployment automation.',
    'Accelerated infrastructure delivery with reusable Infrastructure as Code (IaC) templates, reducing provisioning time by 80%.',
    'Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access, resulting in zero critical security findings.'
  ];

  achievements.forEach((ach) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(30, 41, 59);
    doc.text('●', marginX + 2, y);
    const lines = doc.splitTextToSize(ach, contentWidth - 14);
    doc.text(lines, marginX + 12, y, { lineHeightFactor: 1.12 });
    y += lines.length * 9.3 + 1.8;
  });
  y += 3;

  // 5. CERTIFICATIONS
  drawSectionHeader('Certifications');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 41, 59);
  doc.text('AWS Certified Solutions Architect – Associate (SAA-C03), Amazon Web Services, 2026', marginX, y);
  y += 9.8;
  doc.text('AWS Certified CloudOps Engineer – Associate (SOA-C03), Amazon Web Services, 2026', marginX, y);
  y += 12;

  // 6. EDUCATION
  drawSectionHeader('Education');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(20, 25, 35);
  doc.text(
    'B.Sc. Computer Science',
    marginX,
    y
  );
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 55, 72);
  doc.text(
    ' — ASN Degree College, ANU University, Tenali, Andhra Pradesh',
    marginX + doc.getTextWidth('B.Sc. Computer Science'),
    y
  );
  y += 9.8;
  doc.text('June 2021 – April 2024  |  Percentage: 90.00%', marginX, y);

  return doc;
}

export function downloadResumePdf(filename = 'Sunanda_Sri_Karumuri_Resume.pdf') {
  const doc = createResumePdfDoc();
  doc.save(filename);
}
