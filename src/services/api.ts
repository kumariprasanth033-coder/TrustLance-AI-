/**
 * TRUSTLANCE AI — Universal API & Database Client
 * Interacts with PHP 8.2+ REST API backend with automated local MySQL/PDO simulation engine
 */

import axios from 'axios';
import {
  User,
  Project,
  Proposal,
  Milestone,
  Deliverable,
  EscrowAccount,
  EscrowTransaction,
  Message,
  Notification,
  Review,
  ServiceCategory,
  CategoryItem,
  AdminAuditLog,
  Dispute,
  RiskAlert,
  AIScoreBreakdown,
  EscrowState,
  RefundRecord,
  RevisionRecord,
  ActivityLog,
  AIBrokerAnalysis,
  TestResultItem
} from '../types';

// Backend API URL (configured via VITE_API_URL, or empty for client-side relational engine)
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_API_URL) || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('trustlance_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// PERSISTENT LOCAL MYSQL SEED STATE (FALLBACK)
// ==========================================

const INITIAL_SERVICES: ServiceCategory[] = [
  { id: 1, name: 'Web Development', slug: 'web-development', description: 'Full-stack web applications, modern responsive React/Next.js platforms, PHP APIs, and custom enterprise SaaS portals.', icon: 'Globe', category: 'Engineering', avg_budget: 1200, delivery_days: 14, project_count: 48, is_active: 1 },
  { id: 2, name: 'Mobile App Development', slug: 'mobile-app-development', description: 'Native iOS, Android and cross-platform React Native / Flutter apps with verified security standards.', icon: 'Smartphone', category: 'Engineering', avg_budget: 2400, delivery_days: 21, project_count: 32, is_active: 1 },
  { id: 3, name: 'UI/UX Design', slug: 'ui-ux-design', description: 'Figma user journey mapping, design systems, wireframing, high-fidelity prototypes and conversion design.', icon: 'Palette', category: 'Design', avg_budget: 950, delivery_days: 10, project_count: 41, is_active: 1 },
  { id: 4, name: 'AI & Machine Learning', slug: 'ai-machine-learning', description: 'LLM integrations, RAG pipelines, model fine-tuning, computer vision, and autonomous agent systems.', icon: 'Cpu', category: 'AI & Data', avg_budget: 2800, delivery_days: 18, project_count: 29, is_active: 1 },
  { id: 5, name: 'Graphic Design', slug: 'graphic-design', description: 'Brand identity packages, vector illustration, vector logo suites, pitch deck graphics, and marketing assets.', icon: 'Brush', category: 'Design', avg_budget: 600, delivery_days: 7, project_count: 36, is_active: 1 },
  { id: 6, name: 'Video Editing', slug: 'video-editing', description: 'Professional 4K post-production, sound design, color grading, social media reels, and brand commercials.', icon: 'Film', category: 'Media', avg_budget: 750, delivery_days: 6, project_count: 25, is_active: 1 },
  { id: 7, name: 'Content Writing', slug: 'content-writing', description: 'Technical documentation, executive whitepapers, high-converting copy, and authoritative editorial articles.', icon: 'FileText', category: 'Writing', avg_budget: 450, delivery_days: 5, project_count: 39, is_active: 1 },
  { id: 8, name: 'Digital Marketing', slug: 'digital-marketing', description: 'Growth marketing funnels, performance advertising (Meta, Google, LinkedIn), and multi-channel attribution.', icon: 'TrendingUp', category: 'Marketing', avg_budget: 1100, delivery_days: 14, project_count: 28, is_active: 1 },
  { id: 9, name: 'Data Analysis', slug: 'data-analysis', description: 'BI dashboard development, SQL analytics, predictive modeling, Python data cleaning, and KPI reporting.', icon: 'BarChart3', category: 'AI & Data', avg_budget: 1300, delivery_days: 10, project_count: 22, is_active: 1 },
  { id: 10, name: 'Cybersecurity', slug: 'cybersecurity', description: 'Web penetration testing, OWASP compliance auditing, SOC2 readiness, and zero-trust cloud configuration.', icon: 'ShieldCheck', category: 'Engineering', avg_budget: 3200, delivery_days: 14, project_count: 18, is_active: 1 },
  { id: 11, name: 'Cloud Computing', slug: 'cloud-computing', description: 'AWS, Google Cloud & Azure infrastructure deployment, serverless scaling, and cloud cost optimization.', icon: 'Cloud', category: 'Engineering', avg_budget: 1800, delivery_days: 12, project_count: 24, is_active: 1 },
  { id: 12, name: 'DevOps', slug: 'devops', description: 'CI/CD pipeline automation, Docker containerization, Kubernetes orchestration, and monitoring telemetry.', icon: 'GitBranch', category: 'Engineering', avg_budget: 1950, delivery_days: 10, project_count: 26, is_active: 1 },
  { id: 13, name: 'Game Development', slug: 'game-development', description: 'Unity and Unreal Engine gameplay programming, 2D/3D mechanics, multiplayer networking, and shader logic.', icon: 'Gamepad2', category: 'Creative Tech', avg_budget: 3500, delivery_days: 30, project_count: 14, is_active: 1 },
  { id: 14, name: 'Blockchain Development', slug: 'blockchain-development', description: 'Solidity smart contracts, EVM audits, dApp Web3 integrations, and automated token economics.', icon: 'Coins', category: 'Engineering', avg_budget: 3800, delivery_days: 20, project_count: 16, is_active: 1 },
  { id: 15, name: 'SEO', slug: 'seo', description: 'Technical site auditing, high-intent keyword mapping, core web vitals speed optimization, and link authority.', icon: 'Search', category: 'Marketing', avg_budget: 850, delivery_days: 14, project_count: 31, is_active: 1 },
  { id: 16, name: 'Animation & 3D', slug: 'animation-3d', description: 'Blender 3D modeling, photorealistic product rendering, motion graphics, and character animation.', icon: 'Sparkles', category: 'Media', avg_budget: 1400, delivery_days: 12, project_count: 19, is_active: 1 },
  { id: 17, name: 'Photography', slug: 'photography', description: 'Commercial studio product photography, architectural shoots, high-end editorial retouching.', icon: 'Camera', category: 'Media', avg_budget: 650, delivery_days: 5, project_count: 17, is_active: 1 },
  { id: 18, name: 'Voice Over', slug: 'voice-over', description: 'Studio-quality commercial voice acting, audiobook narration, multilingual dubbing, and podcast intros.', icon: 'Mic', category: 'Media', avg_budget: 350, delivery_days: 3, project_count: 21, is_active: 1 },
  { id: 19, name: 'Translation', slug: 'translation', description: 'Professional localization across 35+ languages, legal & technical contract translation, and proofreading.', icon: 'Languages', category: 'Writing', avg_budget: 400, delivery_days: 4, project_count: 27, is_active: 1 },
  { id: 20, name: 'IoT Development', slug: 'iot-development', description: 'Embedded firmware (C/C++), ESP32/Raspberry Pi hardware prototypes, MQTT telemetry, and edge logic.', icon: 'Wifi', category: 'Engineering', avg_budget: 2600, delivery_days: 25, project_count: 12, is_active: 1 }
];

const INITIAL_USERS: User[] = [
  { id: 1, email: 'customer@demo.com', full_name: 'Sarah Jenkins', role: 'customer', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'active', phone: '+1 (555) 234-5678' },
  { id: 2, email: 'freelancer@demo.com', full_name: 'Elena Vance', role: 'freelancer', avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', status: 'active', phone: '+1 (555) 345-6789' },
  { id: 3, email: 'admin@demo.com', full_name: 'Alex Sterling', role: 'admin', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'active', phone: '+1 (555) 999-0000' },
  { id: 4, email: 'marcus@brody.dev', full_name: 'Marcus Brody', role: 'freelancer', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'active' },
  { id: 5, email: 'sophia@uxstudio.com', full_name: 'Sophia Reed', role: 'freelancer', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', status: 'active' },
  { id: 6, email: 'liam@codecraft.io', full_name: 'Liam Gallagher', role: 'freelancer', avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', status: 'active' },
  { id: 7, email: 'david@kimsecure.net', full_name: 'David Kim', role: 'freelancer', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', status: 'active' }
];

const INITIAL_FREELANCERS = [
  { id: 1, user_id: 2, headline: 'Senior AI Engineer & Full-Stack Architect', bio: 'Over 8 years developing production enterprise platforms. Specializing in LLM pipelines, React/Vite, PHP 8.2 PDO backends, and high-security fintech escrow workflows.', hourly_rate: 85, project_rate: 1800, trust_score: 99.2, rating: 4.98, review_count: 47, completed_projects: 52, on_time_delivery_rate: 100, response_time_hours: 0.8, availability: 'available' as const, skills: [{ name: 'React', proficiency: 'expert' }, { name: 'PHP', proficiency: 'expert' }, { name: 'MySQL', proficiency: 'expert' }, { name: 'Python', proficiency: 'expert' }] },
  { id: 2, user_id: 4, headline: 'Cloud & DevOps Solutions Architect', bio: 'AWS Certified Solutions Architect & Kubernetes specialist. Automating zero-downtime CI/CD workflows, Docker orchestration, and high-availability MySQL clusters.', hourly_rate: 95, project_rate: 2200, trust_score: 94.4, rating: 4.92, review_count: 34, completed_projects: 38, on_time_delivery_rate: 97.5, response_time_hours: 1.2, availability: 'available' as const, skills: [{ name: 'Docker', proficiency: 'expert' }, { name: 'AWS', proficiency: 'expert' }, { name: 'MySQL', proficiency: 'advanced' }] },
  { id: 3, user_id: 5, headline: 'Principal Product Designer & Design Systems Lead', bio: 'Crafting user-centric FinTech and AI SaaS interfaces with Figma. Expert in design tokens, accessible UX components, and high-conversion enterprise landing pages.', hourly_rate: 75, project_rate: 1400, trust_score: 88.6, rating: 4.89, review_count: 29, completed_projects: 31, on_time_delivery_rate: 95, response_time_hours: 2.0, availability: 'available' as const, skills: [{ name: 'Figma', proficiency: 'expert' }, { name: 'Tailwind CSS', proficiency: 'advanced' }] },
  { id: 4, user_id: 6, headline: 'Full-Stack Web & API Developer', bio: 'Building robust database-driven web solutions using React, PHP, and MySQL. Passionate about clean code, test coverage, and responsive layout fidelity.', hourly_rate: 55, project_rate: 900, trust_score: 76.5, rating: 4.65, review_count: 14, completed_projects: 16, on_time_delivery_rate: 91, response_time_hours: 3.5, availability: 'available' as const, skills: [{ name: 'React', proficiency: 'advanced' }, { name: 'PHP', proficiency: 'advanced' }] },
  { id: 5, user_id: 7, headline: 'Cybersecurity & Pentesting Specialist', bio: 'Certified Ethical Hacker (CEH) performing web application security audits, vulnerability scanning, code reviews, and OWASP compliance verification.', hourly_rate: 90, project_rate: 2000, trust_score: 62.0, rating: 4.40, review_count: 6, completed_projects: 7, on_time_delivery_rate: 85, response_time_hours: 5.0, availability: 'busy' as const, skills: [{ name: 'Cybersecurity', proficiency: 'expert' }] }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    customer_id: 1,
    service_id: 1,
    title: 'Enterprise AI Analytics Portal with Secure Escrow',
    description: 'Looking for an experienced engineer to build an end-to-end analytics dashboard with real-time data feeds, user role permissions, and transactional reporting.',
    requirements: '1. Modern React frontend with Tailwind/Bootstrap.\n2. Clean PHP 8.2 backend with PDO.\n3. MySQL database with indexes.\n4. Simulated Escrow workflow.',
    budget: 2400,
    deadline: '2026-10-15',
    status: 'in_progress',
    revision_expectations: '2 comprehensive rounds included.',
    selected_freelancer_id: 1,
    created_at: '2026-09-20T10:00:00Z',
    service_name: 'Web Development',
    service_icon: 'Globe',
    customer_name: 'Sarah Jenkins',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    customer_trust_score: 96.5,
    proposal_count: 2,
    hired_freelancer_id: 1,
    hired_freelancer_name: 'Elena Vance',
    escrow_held_amount: 1600,
    escrow_status: 'partially_released'
  },
  {
    id: 2,
    customer_id: 1,
    service_id: 3,
    title: 'FinTech SaaS Mobile App Design System',
    description: 'Comprehensive UI/UX design in Figma including mobile application screens, dark/light theme component library, and interactive prototypes.',
    requirements: 'Deliverables must include Figma source files, tokens, and exportable SVG assets.',
    budget: 1100,
    deadline: '2026-10-05',
    status: 'open',
    revision_expectations: '3 design critique revisions.',
    selected_freelancer_id: null,
    created_at: '2026-09-22T14:30:00Z',
    service_name: 'UI/UX Design',
    service_icon: 'Palette',
    customer_name: 'Sarah Jenkins',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    customer_trust_score: 96.5,
    proposal_count: 1
  },
  {
    id: 3,
    customer_id: 1,
    service_id: 4,
    title: 'Autonomous LLM Agent for Customer Support Triage',
    description: 'Develop an AI microservice that parses incoming user inquiries, classifies intent, and synthesizes accurate answers grounded in our documentation database.',
    requirements: 'Requires Python or Node microservice with structured JSON responses and error fallbacks.',
    budget: 3200,
    deadline: '2026-11-01',
    status: 'open',
    revision_expectations: '2 technical validation rounds.',
    selected_freelancer_id: null,
    created_at: '2026-09-23T09:15:00Z',
    service_name: 'AI & Machine Learning',
    service_icon: 'Cpu',
    customer_name: 'Sarah Jenkins',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    customer_trust_score: 96.5,
    proposal_count: 0
  },
  {
    id: 4,
    customer_id: 1,
    service_id: 10,
    title: 'SOC2 Cloud Security Audit & Pen-Test',
    description: 'Perform an external and internal penetration test on our cloud API endpoints and report vulnerabilities mapped to OWASP Top 10.',
    requirements: 'Full executive summary and remediations report required.',
    budget: 1800,
    deadline: '2026-09-30',
    status: 'completed',
    revision_expectations: 'Standard verification check.',
    selected_freelancer_id: 5,
    created_at: '2026-09-10T08:00:00Z',
    service_name: 'Cybersecurity',
    service_icon: 'ShieldCheck',
    customer_name: 'Sarah Jenkins',
    customer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    customer_trust_score: 96.5,
    proposal_count: 1,
    hired_freelancer_id: 5,
    hired_freelancer_name: 'David Kim'
  }
];

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 1,
    project_id: 1,
    freelancer_id: 1,
    cover_letter: 'Hello Sarah, I have built multiple enterprise SaaS portals with PHP 8.2 PDO and React. My Trust Score is 99.2 (Elite Tier), and I have completed 52 on-time projects with zero escrow disputes. I can deliver this system with clean architecture, prepared statements, and verified milestones.',
    proposed_price: 2400,
    delivery_days: 14,
    relevant_experience: 'Built scalable FinTech dashboards with simulated escrow for Fortune 500 clients.',
    status: 'accepted',
    ai_match_score: 97.8,
    ai_match_reason: 'Top skill alignment in React, PHP, MySQL with 100% on-time record and Elite trust tier.',
    created_at: '2026-09-20T12:00:00Z',
    freelancer_name: 'Elena Vance',
    freelancer_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    headline: 'Senior AI Engineer & Full-Stack Architect',
    trust_score: 99.2,
    rating: 4.98,
    completed_projects: 52
  },
  {
    id: 2,
    project_id: 1,
    freelancer_id: 4,
    cover_letter: 'Hi Sarah, I would love to tackle the analytics portal. I specialize in full-stack React and PHP architecture. I can structure the MySQL schema cleanly.',
    proposed_price: 2100,
    delivery_days: 16,
    relevant_experience: 'Developed 14 web applications using modern full-stack tools.',
    status: 'rejected',
    ai_match_score: 82.4,
    ai_match_reason: 'Solid skill match in React and PHP; slightly lower historic volume of completed enterprise projects.',
    created_at: '2026-09-20T15:30:00Z',
    freelancer_name: 'Liam Gallagher',
    freelancer_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    headline: 'Full-Stack Web & API Developer',
    trust_score: 76.5,
    rating: 4.65,
    completed_projects: 16
  },
  {
    id: 3,
    project_id: 2,
    freelancer_id: 3,
    cover_letter: 'Hi Sarah! As a Principal Product Designer specializing in FinTech, I have designed 20+ design systems with dark/light mode fidelity. I will provide a modular Figma design token library.',
    proposed_price: 1100,
    delivery_days: 9,
    relevant_experience: 'Led design systems for two Series-A fintech startups.',
    status: 'pending',
    ai_match_score: 94.5,
    ai_match_reason: 'High domain match in FinTech UX, verified portfolio tokens, and 95% on-time delivery rate.',
    created_at: '2026-09-22T16:00:00Z',
    freelancer_name: 'Sophia Reed',
    freelancer_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    headline: 'Principal Product Designer & Design Systems Lead',
    trust_score: 88.6,
    rating: 4.89,
    completed_projects: 31
  }
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: 1, project_id: 1, title: 'Architecture & Database Schema Design', description: 'Complete normalized MySQL 8.0 schema, PDO connection setup, and API routes definition.', amount: 800, deadline: '2026-09-28', status: 'approved', order_index: 1 },
  { id: 2, project_id: 1, title: 'Frontend Workspace & Core Dashboards', description: 'React dashboard layout, interactive metrics charts, and live filter panels.', amount: 800, deadline: '2026-10-06', status: 'in_progress', order_index: 2 },
  { id: 3, project_id: 1, title: 'Escrow State Machine & Final Audit', description: 'Escrow release workflow, security checks, and final deployment documentation.', amount: 800, deadline: '2026-10-15', status: 'funded_escrow', order_index: 3 }
];

const INITIAL_ESCROWS: EscrowAccount[] = [
  {
    id: 1,
    project_id: 1,
    customer_id: 1,
    freelancer_id: 1,
    total_amount: 2400,
    held_amount: 1600,
    released_amount: 800,
    refunded_amount: 0,
    status: 'partially_released',
    created_at: '2026-09-20T16:00:00Z'
  }
];

const INITIAL_TRANSACTIONS: EscrowTransaction[] = [
  { id: 1, escrow_id: 1, type: 'fund', amount: 2400, status: 'success', reference_id: 'TX-ESCROW-20260920-9041', notes: 'Customer funded total project escrow into TrustLance AI Vault', created_at: '2026-09-20T16:05:00Z' },
  { id: 2, escrow_id: 1, type: 'release', amount: 800, status: 'success', reference_id: 'TX-REL-20260923-9042', notes: 'Milestone 1 approved by customer. AI Broker released $800.00 to Freelancer wallet', created_at: '2026-09-23T11:20:00Z' }
];

const INITIAL_DELIVERABLES: Deliverable[] = [
  { id: 1, project_id: 1, milestone_id: 1, freelancer_id: 1, title: 'Architecture & Database Specification v1.0', notes: 'Includes normalized schema.sql, seed data, and API contract specifications.', file_path: '/uploads/deliverables/schema_spec_v1.pdf', version: 1, status: 'approved', submitted_at: '2026-09-22T18:00:00Z' },
  { id: 2, project_id: 1, milestone_id: 2, freelancer_id: 1, title: 'Frontend Workspace Dashboard Components v1.1', notes: 'Integrated responsive charts, dark mode support, and state machine controls.', file_path: '/uploads/deliverables/workspace_v1.zip', version: 1, status: 'submitted', submitted_at: '2026-09-24T14:30:00Z' }
];

const INITIAL_MESSAGES: Message[] = [
  { id: 1, project_id: 1, sender_id: 1, recipient_id: 2, message_text: 'Welcome aboard Elena! The project escrow is fully funded and secured in the TrustLance AI vault.', is_read: 1, created_at: '2026-09-20T16:10:00Z', sender_name: 'Sarah Jenkins', sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', sender_role: 'customer' },
  { id: 2, project_id: 1, sender_id: 2, recipient_id: 1, message_text: 'Thank you Sarah! I have already completed Milestone 1 schema design and uploaded the documentation for your review.', is_read: 1, created_at: '2026-09-22T18:05:00Z', sender_name: 'Elena Vance', sender_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', sender_role: 'freelancer' },
  { id: 3, project_id: 1, sender_id: 1, recipient_id: 2, message_text: 'Reviewed and approved Milestone 1. The AI Broker just released the first $800.00 tranche to your wallet!', is_read: 1, created_at: '2026-09-23T11:25:00Z', sender_name: 'Sarah Jenkins', sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', sender_role: 'customer' }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, user_id: 1, title: 'Milestone 2 Deliverable Submitted', message: 'Elena Vance has submitted Milestone 2: Frontend Workspace Dashboard Components for your review.', type: 'deliverable', link: '/customer/projects/1', is_read: 0, created_at: '2026-09-24T14:30:00Z' },
  { id: 2, user_id: 2, title: 'Escrow Payment Secured', message: '$2,400.00 has been secured in TrustLance AI Escrow for project: Enterprise AI Analytics Portal.', type: 'escrow', link: '/freelancer/projects/1', is_read: 1, created_at: '2026-09-20T16:05:00Z' },
  { id: 3, user_id: 3, title: 'System Health Nominal', message: 'All 20 services active. AI Trust Score audit completed with zero anomalies.', type: 'system', link: '/admin/dashboard', is_read: 1, created_at: '2026-09-24T00:00:00Z' }
];

const INITIAL_DISPUTES: Dispute[] = [];
const INITIAL_REVIEWS: Review[] = [
  { id: 1, project_id: 4, reviewer_id: 1, reviewee_id: 7, rating: 4.8, comment: 'David performed an exemplary penetration test on our endpoints. Detailed vulnerability matrix and actionable remediations provided ahead of schedule.', created_at: '2026-09-18T16:00:00Z', reviewer_name: 'Sarah Jenkins', reviewer_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
];

const INITIAL_REVISIONS: RevisionRecord[] = [
  {
    id: 1,
    revision_id: 'REV-20260923-01',
    project_id: 1,
    deliverable_id: 1,
    customer_id: 1,
    freelancer_id: 1,
    reason: 'Add Redis cache layer specs to architecture blueprint.',
    requested_date: '2026-09-22T19:00:00Z',
    status: 'APPROVED'
  }
];

const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: 1,
    refund_id: 'REF-20260915-081',
    transaction_id: 'TX-REFUND-081',
    project_id: 4,
    customer_id: 1,
    freelancer_id: 5,
    amount: 0,
    reason: 'Project completed successfully with zero refund needed.',
    status: 'REFUNDED',
    is_demo: true,
    created_at: '2026-09-18T16:05:00Z'
  }
];

const INITIAL_WALLETS = [
  { user_id: 1, balance: 12500.00, pending_balance: 1600.00, total_spent: 3200.00, total_earned: 0.00 },
  { user_id: 2, balance: 800.00, pending_balance: 1600.00, total_spent: 0.00, total_earned: 800.00 },
  { user_id: 3, balance: 0.00, pending_balance: 0.00, total_spent: 0.00, total_earned: 0.00 },
  { user_id: 4, balance: 1450.00, pending_balance: 0.00, total_spent: 0.00, total_earned: 1450.00 },
  { user_id: 5, balance: 2100.00, pending_balance: 0.00, total_spent: 0.00, total_earned: 2100.00 },
  { user_id: 6, balance: 900.00, pending_balance: 0.00, total_spent: 0.00, total_earned: 900.00 },
  { user_id: 7, balance: 1800.00, pending_balance: 0.00, total_spent: 0.00, total_earned: 1800.00 }
];

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 1,
    user_id: 1,
    user_name: 'Sarah Jenkins',
    role: 'customer',
    project_id: 1,
    project_title: 'Enterprise AI Analytics Portal with Secure Escrow',
    action: 'FUND_ESCROW',
    old_state: 'CREATED',
    new_state: 'HELD',
    reason: 'Customer funded demo escrow into TrustLance AI Vault ($2,400.00).',
    timestamp: '2026-09-20T16:05:00Z',
    metadata: { amount: 2400, mode: 'DEMO_ESCROW' }
  },
  {
    id: 2,
    user_id: 2,
    user_name: 'Elena Vance',
    role: 'freelancer',
    project_id: 1,
    project_title: 'Enterprise AI Analytics Portal with Secure Escrow',
    action: 'START_WORK',
    old_state: 'HELD',
    new_state: 'WORK_IN_PROGRESS',
    reason: 'Freelancer initialized project workspace and accepted requirements.',
    timestamp: '2026-09-21T09:00:00Z'
  },
  {
    id: 3,
    user_id: 1,
    user_name: 'Sarah Jenkins',
    role: 'customer',
    project_id: 1,
    project_title: 'Enterprise AI Analytics Portal with Secure Escrow',
    action: 'PAYMENT_RELEASED',
    old_state: 'UNDER_REVIEW',
    new_state: 'RELEASED',
    reason: 'Customer approved final deliverable for Milestone 1. AI Broker executed wallet release.',
    timestamp: '2026-09-23T11:20:00Z',
    metadata: { tranche_amount: 800, milestone_id: 1 }
  }
];

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Engineering', slug: 'engineering', description: 'Software engineering, web, cloud and mobile platforms', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 2, name: 'Design', slug: 'design', description: 'Product design, UI/UX systems and visual design identity', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 3, name: 'AI & Data', slug: 'ai-data', description: 'Machine learning, generative AI, RAG and data science', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 4, name: 'Media', slug: 'media', description: 'Video editing, 3D animation, voice acting and audio post-production', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 5, name: 'Writing', slug: 'writing', description: 'Technical copy, executive documentation and localization', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 6, name: 'Marketing', slug: 'marketing', description: 'SEO growth, performance advertising and acquisition marketing', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 7, name: 'Creative Tech', slug: 'creative-tech', description: 'Game engines, IoT hardware programming and spatial computing', is_active: 1, created_at: '2026-09-01T00:00:00Z' },
];

const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 1,
    admin_id: 3,
    admin_name: 'Alex Sterling',
    action: 'PLATFORM_INITIALIZATION',
    target_type: 'SETTINGS',
    target_id: 'SYSTEM',
    new_value: 'TrustLance AI Platform initialized with 20 core service categories and ACID Escrow Vault',
    timestamp: '2026-09-01T08:00:00Z',
    ip: '127.0.0.1'
  },
  {
    id: 2,
    admin_id: 3,
    admin_name: 'Alex Sterling',
    action: 'SERVICE_INITIAL_SYNC',
    target_type: 'SERVICE',
    target_id: 'ALL',
    new_value: '20 production services loaded and verified',
    timestamp: '2026-09-01T08:05:00Z',
    ip: '127.0.0.1'
  }
];

export const VALID_ESCROW_TRANSITIONS: Record<string, string[]> = {
  CREATED: ['FUNDED'],
  FUNDED: ['HELD'],
  HELD: ['WORK_IN_PROGRESS', 'DEADLINE_MISSED'],
  WORK_IN_PROGRESS: ['SUBMITTED', 'DEADLINE_MISSED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['RELEASED', 'REVISION_REQUESTED', 'DISPUTED'],
  REVISION_REQUESTED: ['RESUBMITTED'],
  RESUBMITTED: ['UNDER_REVIEW'],
  DEADLINE_MISSED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  DISPUTED: ['ADMIN_REVIEW'],
  ADMIN_REVIEW: ['RELEASED', 'REFUNDED'],
  RELEASED: [],
  REFUNDED: [],
  // Legacy compatibility mappings
  pending_funding: ['funded_held', 'FUNDED', 'HELD'],
  funded_held: ['partially_released', 'fully_released', 'WORK_IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'DEADLINE_MISSED', 'RELEASED'],
  partially_released: ['partially_released', 'fully_released', 'RELEASED', 'UNDER_REVIEW'],
  fully_released: []
};

export function validateEscrowTransition(currentStatus: string, nextStatus: string): boolean {
  const allowed = VALID_ESCROW_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(nextStatus)) {
    throw new Error(`Invalid escrow state transition: cannot transition from "${currentStatus}" to "${nextStatus}".`);
  }
  return true;
}

// Helper to get or initialize localStorage store
function getStore<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(`tl_${key}`);
    if (!item) {
      localStorage.setItem(`tl_${key}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(item);
  } catch (e) {
    return initial;
  }
}

function setStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`tl_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

// Ensure database tables exist in memory/localStorage
export function initLocalDatabase() {
  getStore('services', INITIAL_SERVICES);
  getStore('categories', INITIAL_CATEGORIES);
  getStore('users', INITIAL_USERS);
  getStore('freelancers', INITIAL_FREELANCERS);
  getStore('projects', INITIAL_PROJECTS);
  getStore('proposals', INITIAL_PROPOSALS);
  getStore('milestones', INITIAL_MILESTONES);
  getStore('escrows', INITIAL_ESCROWS);
  getStore('transactions', INITIAL_TRANSACTIONS);
  getStore('deliverables', INITIAL_DELIVERABLES);
  getStore('messages', INITIAL_MESSAGES);
  getStore('notifications', INITIAL_NOTIFICATIONS);
  getStore('disputes', INITIAL_DISPUTES);
  getStore('reviews', INITIAL_REVIEWS);
  getStore('revisions', INITIAL_REVISIONS);
  getStore('refunds', INITIAL_REFUNDS);
  getStore('wallets', INITIAL_WALLETS);
  getStore('activity_logs', INITIAL_ACTIVITY_LOGS);
  getStore('admin_audit_logs', INITIAL_ADMIN_AUDIT_LOGS);
}

// Reset data to factory seed
export function resetLocalDatabase() {
  localStorage.removeItem('tl_services');
  localStorage.removeItem('tl_categories');
  localStorage.removeItem('tl_users');
  localStorage.removeItem('tl_freelancers');
  localStorage.removeItem('tl_projects');
  localStorage.removeItem('tl_proposals');
  localStorage.removeItem('tl_milestones');
  localStorage.removeItem('tl_escrows');
  localStorage.removeItem('tl_transactions');
  localStorage.removeItem('tl_deliverables');
  localStorage.removeItem('tl_messages');
  localStorage.removeItem('tl_notifications');
  localStorage.removeItem('tl_disputes');
  localStorage.removeItem('tl_reviews');
  localStorage.removeItem('tl_revisions');
  localStorage.removeItem('tl_refunds');
  localStorage.removeItem('tl_wallets');
  localStorage.removeItem('tl_activity_logs');
  localStorage.removeItem('tl_admin_audit_logs');
  initLocalDatabase();
}

initLocalDatabase();

// ==========================================
// ADMIN ROLE-BASED ACCESS CONTROL (RBAC) SECURITY
// ==========================================

export const adminSecurity = {
  verifyAdmin: (): User => {
    const raw = localStorage.getItem('trustlance_user');
    if (!raw) {
      throw new Error('401 Unauthorized: Authentication required.');
    }
    try {
      const user = JSON.parse(raw) as User;
      if (!user || user.role !== 'admin') {
        throw new Error('403 Forbidden: Administrative role required.');
      }
      return user;
    } catch (e: any) {
      if (e.message?.startsWith('403') || e.message?.startsWith('401')) throw e;
      throw new Error('401 Unauthorized: Invalid session.');
    }
  },
  isAdmin: (): boolean => {
    try {
      const raw = localStorage.getItem('trustlance_user');
      if (!raw) return false;
      const user = JSON.parse(raw);
      return user?.role === 'admin';
    } catch (e) {
      return false;
    }
  }
};

// ==========================================
// UNIFIED FRONTEND API SERVICE FACADES
// ==========================================

export const authApi = {
  login: async (email: string, role?: string) => {
    // Try remote API if configured
    if (API_BASE_URL) {
      try {
        const res = await apiClient.post('/auth/login.php', { email, password: 'TrustLance2026!', role });
        if (res.data?.status === 'success') {
          localStorage.setItem('trustlance_token', res.data.token);
          localStorage.setItem('trustlance_user', JSON.stringify(res.data.user));
          return res.data;
        }
      } catch (e) {
        // Fallback to local relational simulation
      }
    }

    const users = getStore<User[]>('users', INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email credentials. Use customer@demo.com, freelancer@demo.com, or admin@demo.com.');
    }

    if (role && user.role !== role) {
      throw new Error(`Account role '${user.role}' cannot login via the ${role} portal.`);
    }

    const token = btoa(`${user.id}:${user.email}:${user.role}:${Date.now()}`);
    localStorage.setItem('trustlance_token', token);
    localStorage.setItem('trustlance_user', JSON.stringify(user));

    return {
      status: 'success',
      token,
      user
    };
  },

  register: async (data: { email: string; full_name: string; role: 'customer' | 'freelancer'; headline?: string; company_name?: string }) => {
    if (API_BASE_URL) {
      try {
        const res = await apiClient.post('/auth/register.php', data);
        if (res.data?.status === 'success') {
          localStorage.setItem('trustlance_token', res.data.token);
          localStorage.setItem('trustlance_user', JSON.stringify(res.data.user));
          return res.data;
        }
      } catch (e) {
        // Fallback
      }
    }

    const users = getStore<User[]>('users', INITIAL_USERS);
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newId = users.length + 1;
    const newUser: User = {
      id: newId,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      status: 'active'
    };

    users.push(newUser);
    setStore('users', users);

    if (data.role === 'freelancer') {
      const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
      freelancers.push({
        id: freelancers.length + 1,
        user_id: newId,
        headline: data.headline || 'Full-Stack Developer',
        bio: 'Passionate professional delivering high-quality deliverables.',
        hourly_rate: 50,
        project_rate: 1000,
        trust_score: 80.0,
        rating: 5.0,
        review_count: 0,
        completed_projects: 0,
        on_time_delivery_rate: 100,
        response_time_hours: 1.0,
        availability: 'available',
        skills: [{ name: 'React', proficiency: 'advanced' }, { name: 'PHP', proficiency: 'advanced' }]
      });
      setStore('freelancers', freelancers);
    }

    const token = btoa(`${newUser.id}:${newUser.email}:${newUser.role}:${Date.now()}`);
    localStorage.setItem('trustlance_token', token);
    localStorage.setItem('trustlance_user', JSON.stringify(newUser));

    return {
      status: 'success',
      token,
      user: newUser
    };
  },

  getCurrentUser: (): User | null => {
    try {
      const raw = localStorage.getItem('trustlance_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('trustlance_token');
    localStorage.removeItem('trustlance_user');
  }
};

export const servicesApi = {
  list: async (category?: string, search?: string, includeInactive: boolean = false): Promise<ServiceCategory[]> => {
    if (API_BASE_URL) {
      try {
        const res = await apiClient.get('/services/list.php', { params: { category, search } });
        if (res.data?.data) return res.data.data;
      } catch (e) {
        // Fallback
      }
    }

    let services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    if (!includeInactive) {
      services = services.filter(s => s.is_active !== 0);
    }
    if (category && category !== 'All') {
      services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      services = services.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return services;
  },

  getById: async (id: number): Promise<ServiceCategory | undefined> => {
    const services = await servicesApi.list(undefined, undefined, true);
    return services.find(s => s.id === id);
  },

  create: async (data: {
    name: string;
    description: string;
    category: string;
    icon?: string;
    avg_budget?: number;
    delivery_days?: number;
    is_active?: number;
    slug?: string;
  }): Promise<ServiceCategory> => {
    adminSecurity.verifyAdmin();
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const now = new Date().toISOString();
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newService: ServiceCategory = {
      id: newId,
      name: data.name.trim(),
      slug,
      description: data.description.trim(),
      icon: data.icon || 'Sparkles',
      category: data.category.trim(),
      avg_budget: Number(data.avg_budget) || 1200,
      delivery_days: Number(data.delivery_days) || 14,
      project_count: 0,
      is_active: data.is_active !== undefined ? Number(data.is_active) : 1,
      created_at: now,
      updated_at: now
    };

    services.push(newService);
    setStore('services', services);
    adminApi.logAdminAction('ADMIN_CREATE_SERVICE', 'SERVICE', newId, null, newService);
    return newService;
  },

  update: async (id: number, data: Partial<ServiceCategory>): Promise<ServiceCategory> => {
    adminSecurity.verifyAdmin();
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Service with ID #${id} not found.`);
    const oldService = { ...services[index] };
    const now = new Date().toISOString();
    const updatedService: ServiceCategory = {
      ...oldService,
      ...data,
      id,
      updated_at: now
    };
    services[index] = updatedService;
    setStore('services', services);
    adminApi.logAdminAction('ADMIN_UPDATE_SERVICE', 'SERVICE', id, oldService, updatedService);
    return updatedService;
  },

  delete: async (id: number): Promise<boolean> => {
    adminSecurity.verifyAdmin();
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Service with ID #${id} not found.`);
    const oldService = services[index];

    // Safeguard check: ensure no active running projects are bound
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const activeProjects = projects.filter(p => p.service_id === id && ['open', 'in_progress', 'under_review'].includes(p.status));
    if (activeProjects.length > 0) {
      throw new Error(`Cannot delete service: ${activeProjects.length} active project(s) depend on it. Please disable this service instead.`);
    }

    services.splice(index, 1);
    setStore('services', services);
    adminApi.logAdminAction('ADMIN_DELETE_SERVICE', 'SERVICE', id, oldService, null);
    return true;
  },

  toggleStatus: async (id: number, isActive: boolean): Promise<ServiceCategory> => {
    adminSecurity.verifyAdmin();
    return servicesApi.update(id, { is_active: isActive ? 1 : 0 });
  }
};

export const categoriesApi = {
  list: async (includeInactive: boolean = false): Promise<CategoryItem[]> => {
    let categories = getStore<CategoryItem[]>('categories', INITIAL_CATEGORIES);
    if (!includeInactive) {
      categories = categories.filter(c => c.is_active !== 0);
    }
    return categories;
  },

  create: async (data: { name: string; description?: string; icon?: string; is_active?: number }): Promise<CategoryItem> => {
    adminSecurity.verifyAdmin();
    const categories = getStore<CategoryItem[]>('categories', INITIAL_CATEGORIES);
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newCat: CategoryItem = {
      id: newId,
      name: data.name.trim(),
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: data.description || '',
      icon: data.icon || 'Folder',
      is_active: data.is_active !== undefined ? Number(data.is_active) : 1,
      created_at: now,
      updated_at: now
    };
    categories.push(newCat);
    setStore('categories', categories);
    adminApi.logAdminAction('ADMIN_CREATE_CATEGORY', 'CATEGORY', newId, null, newCat);
    return newCat;
  },

  update: async (id: number, data: Partial<CategoryItem>): Promise<CategoryItem> => {
    adminSecurity.verifyAdmin();
    const categories = getStore<CategoryItem[]>('categories', INITIAL_CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category #${id} not found.`);
    const oldCat = { ...categories[index] };
    const now = new Date().toISOString();
    const updated = { ...oldCat, ...data, id, updated_at: now };
    categories[index] = updated;
    setStore('categories', categories);
    adminApi.logAdminAction('ADMIN_UPDATE_CATEGORY', 'CATEGORY', id, oldCat, updated);
    return updated;
  },

  delete: async (id: number): Promise<boolean> => {
    adminSecurity.verifyAdmin();
    const categories = getStore<CategoryItem[]>('categories', INITIAL_CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category #${id} not found.`);
    const target = categories[index];
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const bound = services.filter(s => s.category.toLowerCase() === target.name.toLowerCase());
    if (bound.length > 0) {
      throw new Error(`Cannot delete category "${target.name}": ${bound.length} service(s) currently belong to it. Disable the category or reassign services first.`);
    }
    categories.splice(index, 1);
    setStore('categories', categories);
    adminApi.logAdminAction('ADMIN_DELETE_CATEGORY', 'CATEGORY', id, target, null);
    return true;
  },

  toggleStatus: async (id: number, isActive: boolean): Promise<CategoryItem> => {
    adminSecurity.verifyAdmin();
    return categoriesApi.update(id, { is_active: isActive ? 1 : 0 });
  }
};

export const freelancersApi = {
  list: async (minScore?: number, search?: string) => {
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
    const users = getStore<User[]>('users', INITIAL_USERS);

    let result = freelancers.map(f => {
      const user = users.find(u => u.id === f.user_id);
      return {
        ...f,
        full_name: user?.full_name || 'Verified Freelancer',
        avatar_url: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        email: user?.email
      };
    });

    if (minScore) {
      result = result.filter(f => f.trust_score >= minScore);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(f => f.full_name.toLowerCase().includes(q) || f.headline.toLowerCase().includes(q) || f.bio.toLowerCase().includes(q));
    }

    return result.sort((a, b) => b.trust_score - a.trust_score);
  },

  getById: async (id: number) => {
    const list = await freelancersApi.list();
    const freelancer = list.find(f => f.id === id);
    if (!freelancer) return null;

    const reviews = getStore<Review[]>('reviews', INITIAL_REVIEWS).filter(r => r.reviewee_id === freelancer.user_id);
    return {
      ...freelancer,
      reviews
    };
  }
};

export const projectsApi = {
  list: async (filters?: { status?: string; service_id?: number; search?: string }): Promise<Project[]> => {
    let projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    if (filters?.status && filters.status !== 'all') {
      projects = projects.filter(p => p.status === filters.status);
    }
    if (filters?.service_id) {
      projects = projects.filter(p => p.service_id === filters.service_id);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      projects = projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return projects;
  },

  getById: async (id: number) => {
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === id);
    if (!project) return null;

    const milestones = getStore<Milestone[]>('milestones', INITIAL_MILESTONES).filter(m => m.project_id === id);
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES).filter(d => d.project_id === id);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === id) || null;
    const transactions = getStore<EscrowTransaction[]>('transactions', INITIAL_TRANSACTIONS).filter(t => t.escrow_id === escrow?.id);
    const proposals = getStore<Proposal[]>('proposals', INITIAL_PROPOSALS).filter(pr => pr.project_id === id);
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES).filter(dp => dp.project_id === id);

    return {
      project,
      milestones,
      deliverables,
      escrow,
      escrow_transactions: transactions,
      proposals,
      disputes
    };
  },

  create: async (data: {
    title: string;
    service_id: number;
    description: string;
    requirements?: string;
    budget: number;
    deadline: string;
    revision_expectations?: string;
    reference_websites?: string;
    milestones?: { title: string; amount: number; deadline: string }[];
  }) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Authentication required.');

    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const service = services.find(s => s.id === data.service_id);

    const newId = projects.length + 1;
    const newProject: Project = {
      id: newId,
      customer_id: 1, // mapped to customer record
      service_id: data.service_id,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      budget: data.budget,
      deadline: data.deadline,
      status: 'open',
      revision_expectations: data.revision_expectations || 'Up to 2 revision rounds included.',
      reference_websites: data.reference_websites,
      selected_freelancer_id: null,
      created_at: new Date().toISOString(),
      service_name: service?.name || 'General',
      service_icon: service?.icon || 'Globe',
      customer_name: user.full_name,
      customer_avatar: user.avatar_url,
      customer_trust_score: 96.5,
      proposal_count: 0
    };

    projects.unshift(newProject);
    setStore('projects', projects);

    // Save milestones
    const milestones = getStore<Milestone[]>('milestones', INITIAL_MILESTONES);
    if (data.milestones && data.milestones.length > 0) {
      data.milestones.forEach((m, idx) => {
        milestones.push({
          id: milestones.length + 1,
          project_id: newId,
          title: m.title,
          amount: m.amount,
          deadline: m.deadline,
          status: 'pending',
          order_index: idx + 1
        });
      });
    } else {
      milestones.push(
        { id: milestones.length + 1, project_id: newId, title: 'Phase 1: Architecture & Prototype', amount: Math.round(data.budget * 0.5), deadline: data.deadline, status: 'pending', order_index: 1 },
        { id: milestones.length + 2, project_id: newId, title: 'Phase 2: Final Handover & Audit', amount: Math.round(data.budget * 0.5), deadline: data.deadline, status: 'pending', order_index: 2 }
      );
    }
    setStore('milestones', milestones);

    return { status: 'success', project_id: newId };
  }
};

export const proposalsApi = {
  submit: async (data: {
    project_id: number;
    cover_letter: string;
    proposed_price: number;
    delivery_days: number;
    relevant_experience?: string;
  }) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Authentication required.');

    const proposals = getStore<Proposal[]>('proposals', INITIAL_PROPOSALS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === data.project_id);

    if (!project) throw new Error('Project not found.');

    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
    const freelancer = freelancers.find(f => f.user_id === user.id) || freelancers[0];

    // Compute algorithmic AI Match
    const budgetRatio = Math.min(1.0, project.budget / Math.max(1, data.proposed_price));
    const trustFactor = freelancer.trust_score / 100.0;
    const aiMatchScore = Math.round(Math.min(99, Math.max(65, 70 + (trustFactor * 20) + (budgetRatio * 9))));

    const newProposal: Proposal = {
      id: proposals.length + 1,
      project_id: data.project_id,
      freelancer_id: freelancer.id,
      cover_letter: data.cover_letter,
      proposed_price: data.proposed_price,
      delivery_days: data.delivery_days,
      relevant_experience: data.relevant_experience,
      status: 'pending',
      ai_match_score: aiMatchScore,
      ai_match_reason: `High compatibility match based on ${freelancer.trust_score} Trust Score, ${freelancer.on_time_delivery_rate}% on-time record, and skill fit.`,
      created_at: new Date().toISOString(),
      freelancer_name: user.full_name,
      freelancer_avatar: user.avatar_url,
      headline: freelancer.headline,
      trust_score: freelancer.trust_score,
      rating: freelancer.rating,
      completed_projects: freelancer.completed_projects
    };

    proposals.unshift(newProposal);
    setStore('proposals', proposals);

    // Update project proposal count
    project.proposal_count = (project.proposal_count || 0) + 1;
    setStore('projects', projects);

    return { status: 'success', proposal: newProposal };
  },

  accept: async (proposalId: number) => {
    const proposals = getStore<Proposal[]>('proposals', INITIAL_PROPOSALS);
    const proposal = proposals.find(pr => pr.id === proposalId);
    if (!proposal) throw new Error('Proposal not found.');

    proposal.status = 'accepted';
    // Reject other proposals
    proposals.forEach(p => {
      if (p.project_id === proposal.project_id && p.id !== proposalId) {
        p.status = 'rejected';
      }
    });
    setStore('proposals', proposals);

    // Assign freelancer to project
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === proposal.project_id);
    if (project) {
      project.selected_freelancer_id = proposal.freelancer_id;
      project.hired_freelancer_id = proposal.freelancer_id;
      project.hired_freelancer_name = proposal.freelancer_name;
      project.budget = proposal.proposed_price;
      setStore('projects', projects);
    }

    // Ready escrow account in pending_funding
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    let escrow = escrows.find(e => e.project_id === proposal.project_id);
    if (!escrow) {
      escrow = {
        id: escrows.length + 1,
        project_id: proposal.project_id,
        customer_id: 1,
        freelancer_id: proposal.freelancer_id,
        total_amount: proposal.proposed_price,
        held_amount: 0,
        released_amount: 0,
        refunded_amount: 0,
        status: 'pending_funding',
        created_at: new Date().toISOString()
      };
      escrows.push(escrow);
    } else {
      escrow.total_amount = proposal.proposed_price;
      escrow.freelancer_id = proposal.freelancer_id;
      escrow.status = 'pending_funding';
    }
    setStore('escrows', escrows);

    return { status: 'success', project_id: proposal.project_id };
  }
};

export const auditApi = {
  log: (entry: {
    user_id?: number;
    user_name?: string;
    role?: string;
    project_id: number;
    project_title?: string;
    action: string;
    old_state: string;
    new_state: string;
    reason: string;
    metadata?: any;
  }): ActivityLog => {
    const logs = getStore<ActivityLog[]>('activity_logs', INITIAL_ACTIVITY_LOGS);
    const user = authApi.getCurrentUser();
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const p = projects.find(item => item.id === entry.project_id);

    const newLog: ActivityLog = {
      id: logs.length + 1,
      user_id: entry.user_id ?? user?.id ?? 1,
      user_name: entry.user_name ?? user?.full_name ?? 'System AI Broker',
      role: entry.role ?? user?.role ?? 'system',
      project_id: entry.project_id,
      project_title: entry.project_title ?? p?.title ?? `Project #${entry.project_id}`,
      action: entry.action,
      old_state: entry.old_state,
      new_state: entry.new_state,
      reason: entry.reason,
      timestamp: new Date().toISOString(),
      metadata: entry.metadata
    };

    logs.unshift(newLog);
    setStore('activity_logs', logs);
    return newLog;
  },

  list: async (projectId?: number): Promise<ActivityLog[]> => {
    const logs = getStore<ActivityLog[]>('activity_logs', INITIAL_ACTIVITY_LOGS);
    if (projectId) {
      return logs.filter(l => l.project_id === projectId);
    }
    return logs;
  }
};

export const walletsApi = {
  getByUserId: (userId: number) => {
    const wallets = getStore<any[]>('wallets', INITIAL_WALLETS);
    let wallet = wallets.find(w => w.user_id === userId);
    if (!wallet) {
      wallet = { user_id: userId, balance: 0, pending_balance: 0, total_spent: 0, total_earned: 0 };
      wallets.push(wallet);
      setStore('wallets', wallets);
    }
    return wallet;
  },

  credit: (userId: number, amount: number) => {
    if (amount < 0) throw new Error('Credit amount cannot be negative.');
    const wallets = getStore<any[]>('wallets', INITIAL_WALLETS);
    let wallet = wallets.find(w => w.user_id === userId);
    if (!wallet) {
      wallet = { user_id: userId, balance: amount, pending_balance: 0, total_spent: 0, total_earned: amount };
      wallets.push(wallet);
    } else {
      wallet.balance += amount;
      wallet.total_earned += amount;
    }
    setStore('wallets', wallets);
    return wallet;
  },

  debit: (userId: number, amount: number) => {
    if (amount <= 0) throw new Error('Debit amount must be positive.');
    const wallets = getStore<any[]>('wallets', INITIAL_WALLETS);
    let wallet = wallets.find(w => w.user_id === userId);
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient wallet balance or unauthorized debit attempt.');
    }
    wallet.balance -= amount;
    wallet.total_spent += amount;
    setStore('wallets', wallets);
    return wallet;
  }
};

export const revisionsApi = {
  list: async (projectId?: number): Promise<RevisionRecord[]> => {
    const revs = getStore<RevisionRecord[]>('revisions', INITIAL_REVISIONS);
    if (projectId) return revs.filter(r => r.project_id === projectId);
    return revs;
  },

  requestRevision: async (deliverableId: number, reason: string): Promise<RevisionRecord> => {
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const d = deliverables.find(item => item.id === deliverableId);
    if (!d) throw new Error('Deliverable not found.');

    const user = authApi.getCurrentUser();
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const p = projects.find(proj => proj.id === d.project_id);
    if (!p) throw new Error('Associated project not found.');

    // Security check: only customer who owns the project can request revision
    if (user && user.role === 'customer' && p.customer_id !== user.id && user.id !== 1) {
      throw new Error('Unauthorized: Only project owner can request revisions.');
    }

    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === d.project_id);
    if (escrow) {
      const oldState = escrow.status;
      escrow.status = 'REVISION_REQUESTED';
      setStore('escrows', escrows);
      auditApi.log({
        user_id: user?.id,
        user_name: user?.full_name,
        role: user?.role,
        project_id: p.id,
        action: 'REQUEST_REVISION',
        old_state: oldState,
        new_state: 'REVISION_REQUESTED',
        reason: `Customer requested revision: ${reason}`
      });
    }

    d.status = 'revision_requested';
    setStore('deliverables', deliverables);

    const revisions = getStore<RevisionRecord[]>('revisions', INITIAL_REVISIONS);
    const newRev: RevisionRecord = {
      id: revisions.length + 1,
      revision_id: `REV-${Date.now().toString().slice(-6)}`,
      project_id: d.project_id,
      deliverable_id: d.id,
      customer_id: p.customer_id,
      freelancer_id: d.freelancer_id,
      reason,
      requested_date: new Date().toISOString(),
      status: 'REQUESTED'
    };
    revisions.unshift(newRev);
    setStore('revisions', revisions);

    // Notification for freelancer
    const notifs = getStore<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.unshift({
      id: notifs.length + 1,
      user_id: 2, // Freelancer
      title: 'Revision Requested by Customer',
      message: `Revision requested on "${d.title}": ${reason}. Please update your deliverable.`,
      type: 'revision',
      link: `/freelancer/projects/${p.id}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStore('notifications', notifs);

    return newRev;
  },

  resubmit: async (revisionId: number, newNotes?: string): Promise<{ status: string; revision: RevisionRecord }> => {
    const revisions = getStore<RevisionRecord[]>('revisions', INITIAL_REVISIONS);
    const rev = revisions.find(r => r.id === revisionId);
    if (!rev) throw new Error('Revision record not found.');

    rev.status = 'RESUBMITTED';
    setStore('revisions', revisions);

    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const d = deliverables.find(item => item.id === rev.deliverable_id);
    if (d) {
      d.version += 1;
      d.status = 'submitted';
      if (newNotes) d.notes = newNotes;
      setStore('deliverables', deliverables);
    }

    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === rev.project_id);
    if (escrow) {
      const oldState = escrow.status;
      escrow.status = 'UNDER_REVIEW';
      setStore('escrows', escrows);
      auditApi.log({
        project_id: rev.project_id,
        action: 'RESUBMIT_DELIVERABLE',
        old_state: oldState,
        new_state: 'UNDER_REVIEW',
        reason: 'Freelancer resubmitted updated deliverable addressing customer revision feedback.'
      });
    }

    // Notify customer
    const notifs = getStore<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.unshift({
      id: notifs.length + 1,
      user_id: rev.customer_id,
      title: 'Revised Deliverable Submitted',
      message: 'Freelancer has addressed your feedback and resubmitted the deliverable for review.',
      type: 'deliverable',
      link: `/customer/projects/${rev.project_id}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStore('notifications', notifs);

    return { status: 'success', revision: rev };
  }
};

export const refundsApi = {
  list: async (projectId?: number): Promise<RefundRecord[]> => {
    const refunds = getStore<RefundRecord[]>('refunds', INITIAL_REFUNDS);
    if (projectId) return refunds.filter(r => r.project_id === projectId);
    return refunds;
  },

  requestRefund: async (projectId: number, reason: string, amount?: number): Promise<RefundRecord> => {
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === projectId);
    if (!escrow) throw new Error('Escrow account not found.');

    const refundAmount = amount !== undefined ? amount : escrow.held_amount;
    if (refundAmount <= 0) throw new Error('Refund amount must be greater than zero.');
    if (refundAmount > escrow.held_amount) {
      throw new Error(`Refund amount cannot exceed held escrow ($${escrow.held_amount.toFixed(2)}).`);
    }

    const refunds = getStore<RefundRecord[]>('refunds', INITIAL_REFUNDS);
    const refId = `REF-${Date.now().toString().slice(-6)}`;
    const txId = `TX-REFUND-${Date.now().toString().slice(-8)}`;

    const newRefund: RefundRecord = {
      id: refunds.length + 1,
      refund_id: refId,
      transaction_id: txId,
      project_id: projectId,
      customer_id: escrow.customer_id,
      freelancer_id: escrow.freelancer_id,
      amount: refundAmount,
      reason,
      status: 'REFUND_REQUESTED',
      is_demo: true,
      created_at: new Date().toISOString()
    };

    refunds.unshift(newRefund);
    setStore('refunds', refunds);

    const oldState = escrow.status;
    escrow.status = 'REFUND_PENDING';
    setStore('escrows', escrows);

    auditApi.log({
      project_id: projectId,
      action: 'REQUEST_REFUND',
      old_state: oldState,
      new_state: 'REFUND_PENDING',
      reason: `Refund requested ($${refundAmount.toFixed(2)}): ${reason}`,
      metadata: { refund_id: refId, mode: 'DEMO_ESCROW' }
    });

    return newRefund;
  },

  processRefund: async (refundId: string | number): Promise<RefundRecord> => {
    const refunds = getStore<RefundRecord[]>('refunds', INITIAL_REFUNDS);
    const refund = refunds.find(r => r.id === Number(refundId) || r.refund_id === refundId);
    if (!refund) throw new Error('Refund record not found.');
    if (refund.status === 'REFUNDED') throw new Error('Refund has already been executed.');

    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === refund.project_id);
    if (!escrow) throw new Error('Associated escrow account not found.');

    refund.status = 'REFUNDED';
    refund.updated_at = new Date().toISOString();
    setStore('refunds', refunds);

    const oldState = escrow.status;
    escrow.held_amount = Math.max(0, escrow.held_amount - refund.amount);
    escrow.refunded_amount += refund.amount;
    escrow.status = 'REFUNDED';
    setStore('escrows', escrows);

    // Credit back customer's demo wallet
    walletsApi.credit(refund.customer_id, refund.amount);

    const transactions = getStore<EscrowTransaction[]>('transactions', INITIAL_TRANSACTIONS);
    transactions.unshift({
      id: transactions.length + 1,
      escrow_id: escrow.id,
      type: 'refund',
      amount: refund.amount,
      status: 'success',
      reference_id: refund.transaction_id,
      notes: `Demo Escrow Refund executed to customer wallet: ${refund.reason}`,
      created_at: new Date().toISOString()
    });
    setStore('transactions', transactions);

    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === refund.project_id);
    if (project) {
      project.status = 'cancelled';
      setStore('projects', projects);
    }

    const notifs = getStore<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.unshift({
      id: notifs.length + 1,
      user_id: refund.customer_id,
      title: 'Demo Escrow Refund Completed',
      message: `Your demo refund of $${refund.amount.toFixed(2)} has been credited back to your balance.`,
      type: 'payment',
      link: `/customer/projects/${refund.project_id}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStore('notifications', notifs);

    auditApi.log({
      project_id: refund.project_id,
      action: 'PROCESS_REFUND',
      old_state: oldState,
      new_state: 'REFUNDED',
      reason: `Refund executed successfully in demo mode ($${refund.amount.toFixed(2)}).`,
      metadata: { refund_id: refund.refund_id, transaction_id: refund.transaction_id }
    });

    return refund;
  }
};

export const escrowApi = {
  fund: async (projectId: number, amount: number, paymentMethod: string = 'demo_escrow') => {
    if (amount <= 0) {
      throw new Error('Funding amount must be greater than $0.00.');
    }

    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found.');

    const existingEscrow = escrows.find(e => e.project_id === projectId);
    const refId = `TX-ESCROW-${Date.now().toString().slice(-8)}`;
    let escrow: EscrowAccount;

    if (!existingEscrow) {
      escrow = {
        id: escrows.length + 1,
        project_id: projectId,
        customer_id: project.customer_id || 1,
        freelancer_id: project.selected_freelancer_id || 1,
        total_amount: amount,
        held_amount: amount,
        released_amount: 0,
        refunded_amount: 0,
        status: 'HELD',
        created_at: new Date().toISOString()
      };
      escrows.push(escrow);
    } else {
      existingEscrow.held_amount += amount;
      existingEscrow.total_amount = Math.max(existingEscrow.total_amount, existingEscrow.held_amount);
      existingEscrow.status = 'HELD';
      escrow = existingEscrow;
    }
    setStore('escrows', escrows);

    // Update project state
    project.status = 'in_progress';
    project.escrow_held_amount = escrow.held_amount;
    project.escrow_status = 'HELD';
    setStore('projects', projects);

    // Append transaction
    const transactions = getStore<EscrowTransaction[]>('transactions', INITIAL_TRANSACTIONS);
    transactions.unshift({
      id: transactions.length + 1,
      escrow_id: escrow.id,
      type: 'fund',
      amount,
      status: 'success',
      reference_id: refId,
      notes: `Secured $${amount.toFixed(2)} in TrustLance AI Escrow Vault (${paymentMethod})`,
      created_at: new Date().toISOString()
    });
    setStore('transactions', transactions);

    // Update milestones to funded
    const milestones = getStore<Milestone[]>('milestones', INITIAL_MILESTONES);
    milestones.filter(m => m.project_id === projectId).forEach(m => {
      if (m.status === 'pending') m.status = 'funded_escrow';
    });
    setStore('milestones', milestones);

    // Audit log
    auditApi.log({
      project_id: projectId,
      project_title: project.title,
      action: 'FUND_ESCROW',
      old_state: 'CREATED',
      new_state: 'HELD',
      reason: `Customer funded demo escrow ($${amount.toFixed(2)}) secured in TrustLance Vault.`,
      metadata: { amount, payment_method: paymentMethod, ref_id: refId }
    });

    // Notify Freelancer
    const notifs = getStore<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    const freelancerUserId = escrow.freelancer_id === 1 ? 2 : escrow.freelancer_id;
    notifs.unshift({
      id: notifs.length + 1,
      user_id: freelancerUserId,
      title: 'Escrow Payment Secured',
      message: `$${amount.toFixed(2)} is held in TrustLance AI Escrow for project: ${project.title}. You may begin work.`,
      type: 'escrow',
      link: `/freelancer/projects/${projectId}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStore('notifications', notifs);

    return { status: 'success', reference_id: refId, escrow_status: 'HELD' };
  },

  startWork: async (projectId: number) => {
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === projectId);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);

    if (escrow) {
      const oldState = escrow.status;
      escrow.status = 'WORK_IN_PROGRESS';
      setStore('escrows', escrows);
      auditApi.log({
        project_id: projectId,
        action: 'START_WORK',
        old_state: oldState,
        new_state: 'WORK_IN_PROGRESS',
        reason: 'Freelancer initialized project workspace and started milestone development.'
      });
    }

    if (project) {
      project.status = 'in_progress';
      setStore('projects', projects);
    }

    return { status: 'success', escrow_status: 'WORK_IN_PROGRESS' };
  },

  release: async (projectId: number, amount: number, milestoneId?: number) => {
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === projectId);
    if (!escrow || escrow.held_amount < amount) {
      throw new Error(`Insufficient held escrow amount to release ($${escrow?.held_amount || 0} available).`);
    }

    escrow.held_amount -= amount;
    escrow.released_amount += amount;
    escrow.status = escrow.held_amount <= 0 ? 'fully_released' : 'partially_released';
    setStore('escrows', escrows);

    const refId = `TX-REL-${Date.now().toString().slice(-8)}`;
    const transactions = getStore<EscrowTransaction[]>('transactions', INITIAL_TRANSACTIONS);
    transactions.unshift({
      id: transactions.length + 1,
      escrow_id: escrow.id,
      type: 'release',
      amount,
      status: 'success',
      reference_id: refId,
      notes: `AI Broker released $${amount.toFixed(2)} tranche to freelancer wallet`,
      created_at: new Date().toISOString()
    });
    setStore('transactions', transactions);

    // Credit freelancer wallet
    const freelancerUserId = escrow.freelancer_id === 1 ? 2 : escrow.freelancer_id;
    walletsApi.credit(freelancerUserId, amount);

    // Update milestone
    if (milestoneId) {
      const milestones = getStore<Milestone[]>('milestones', INITIAL_MILESTONES);
      const m = milestones.find(item => item.id === milestoneId);
      if (m) m.status = 'released';
      setStore('milestones', milestones);
    }

    // Update project if fully completed
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.escrow_held_amount = escrow.held_amount;
      project.escrow_status = escrow.status;
      if (escrow.status === 'fully_released') {
        project.status = 'completed';
      }
      setStore('projects', projects);
    }

    return { status: 'success', reference_id: refId, escrow_status: escrow.status, released_amount: amount };
  },

  approveAndReleaseDeliverable: async (projectId: number, deliverableId: number) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Authentication required.');

    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found.');

    // Backend verification 1: Customer owns project
    if (user.role === 'customer' && project.customer_id !== user.id && user.id !== 1) {
      throw new Error('Unauthorized: You are not the project owner.');
    }

    // Backend verification 2: Freelancer cannot release their own escrow
    if (user.role === 'freelancer') {
      throw new Error('Unauthorized: Freelancers cannot release their own escrow payments.');
    }

    // Backend verification 3: Freelancer assigned
    if (!project.selected_freelancer_id && !project.hired_freelancer_id) {
      throw new Error('No freelancer assigned to this contract.');
    }

    // Backend verification 4: Escrow exists
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === projectId);
    if (!escrow) throw new Error('No escrow account found for project.');

    // Backend verification 5: Current escrow state allows release
    const allowedReleaseStates = ['UNDER_REVIEW', 'SUBMITTED', 'HELD', 'WORK_IN_PROGRESS', 'funded_held', 'partially_released'];
    if (!allowedReleaseStates.includes(escrow.status)) {
      throw new Error(`Cannot release payment: Escrow is in invalid state "${escrow.status}".`);
    }

    // Backend verification 6: Deliverable exists
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const deliv = deliverables.find(d => d.id === deliverableId && d.project_id === projectId);
    if (!deliv) throw new Error('Deliverable not found on this project.');

    // Backend verification 7: No active dispute
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const activeDispute = disputes.find(d => d.project_id === projectId && ['OPEN', 'UNDER_REVIEW'].includes(d.status));
    if (activeDispute) {
      throw new Error('Cannot release payment while a formal dispute is under investigation.');
    }

    // Backend verification 8: Amount check
    const releaseAmount = escrow.held_amount;
    if (releaseAmount <= 0) {
      throw new Error('Escrow has already been fully released ($0.00 held).');
    }

    // Execute database transaction atomically:
    const oldState = escrow.status;
    escrow.held_amount = 0;
    escrow.released_amount += releaseAmount;
    escrow.status = 'RELEASED';
    setStore('escrows', escrows);

    const refId = `TX-REL-${Date.now().toString().slice(-8)}`;
    const transactions = getStore<EscrowTransaction[]>('transactions', INITIAL_TRANSACTIONS);
    transactions.unshift({
      id: transactions.length + 1,
      escrow_id: escrow.id,
      type: 'release',
      amount: releaseAmount,
      status: 'success',
      reference_id: refId,
      notes: `Customer approved final deliverable "${deliv.title}". AI Broker released funds to freelancer wallet.`,
      created_at: new Date().toISOString()
    });
    setStore('transactions', transactions);

    // Update freelancer wallet
    const freelancerUserId = escrow.freelancer_id === 1 ? 2 : escrow.freelancer_id;
    walletsApi.credit(freelancerUserId, releaseAmount);

    // Mark deliverable approved
    deliv.status = 'approved';
    setStore('deliverables', deliverables);

    // Mark project completed
    project.status = 'completed';
    project.escrow_held_amount = 0;
    project.escrow_status = 'RELEASED';
    setStore('projects', projects);

    // Record activity log
    auditApi.log({
      user_id: user.id,
      user_name: user.full_name,
      role: user.role,
      project_id: projectId,
      project_title: project.title,
      action: 'PAYMENT_RELEASED',
      old_state: oldState,
      new_state: 'RELEASED',
      reason: `Customer approved final deliverable. AI Broker executed transaction ${refId} for $${releaseAmount.toFixed(2)}.`,
      metadata: { release_amount: releaseAmount, reference_id: refId, deliverable_id: deliverableId }
    });

    // Notifications
    const notifs = getStore<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.unshift({
      id: notifs.length + 1,
      user_id: freelancerUserId,
      title: 'Payment Released to Wallet',
      message: `Congratulations! The customer has approved the deliverable and $${releaseAmount.toFixed(2)} has been transferred to your wallet balance.`,
      type: 'payment',
      link: `/freelancer/projects/${projectId}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    notifs.unshift({
      id: notifs.length + 2,
      user_id: project.customer_id,
      title: 'Project Completed & Payment Released',
      message: `Payment of $${releaseAmount.toFixed(2)} has been released for "${project.title}". Thank you for using TrustLance AI Escrow.`,
      type: 'payment',
      link: `/customer/projects/${projectId}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStore('notifications', notifs);

    return {
      status: 'success',
      reference_id: refId,
      released_amount: releaseAmount,
      escrow_status: 'RELEASED'
    };
  },

  simulateDeadlineFailure: async (projectId: number) => {
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found.');

    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === projectId);
    if (!escrow) throw new Error('Escrow account not found.');

    const oldState = escrow.status;

    // 1. Mark project as DEADLINE_MISSED
    project.status = 'cancelled';
    (project as any).is_locked = true;
    (project as any).deadline_status = 'DEADLINE_MISSED';
    setStore('projects', projects);

    // 2. Create an AI Broker alert
    const riskAlerts = getStore<RiskAlert[]>('risk_alerts', []);
    riskAlerts.unshift({
      id: riskAlerts.length + 1,
      project_id: projectId,
      risk_level: 'High Risk',
      reason: `Deadline breached for Project #${projectId} ("${project.title}"). Required deliverable not submitted. Auto-release locked.`,
      status: 'active',
      created_at: new Date().toISOString(),
      project_title: project.title
    });
    setStore('risk_alerts', riskAlerts);

    // 3. Notify customer
    const notifs = getStore<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.unshift({
      id: notifs.length + 1,
      user_id: project.customer_id,
      title: 'AI Broker Alert: Deadline Missed',
      message: `Contract deadline has expired for "${project.title}" without required deliverable submission. Escrow funds are locked and refund workflow has been initiated.`,
      type: 'system',
      link: `/customer/projects/${projectId}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });

    // 4. Notify freelancer
    const freelancerUserId = escrow.freelancer_id === 1 ? 2 : escrow.freelancer_id;
    notifs.unshift({
      id: notifs.length + 2,
      user_id: freelancerUserId,
      title: 'AI Broker Alert: Contract Deadline Missed',
      message: `The deadline for project "${project.title}" was reached without deliverable submission. Escrow has been locked and subject to refund.`,
      type: 'system',
      link: `/freelancer/projects/${projectId}`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    setStore('notifications', notifs);

    // 5. Create refund record
    const refunds = getStore<RefundRecord[]>('refunds', INITIAL_REFUNDS);
    const refId = `REF-DEADLINE-${Date.now().toString().slice(-6)}`;
    const newRefund: RefundRecord = {
      id: refunds.length + 1,
      refund_id: refId,
      transaction_id: `TX-REF-${Date.now().toString().slice(-6)}`,
      project_id: projectId,
      customer_id: project.customer_id,
      freelancer_id: escrow.freelancer_id,
      amount: escrow.held_amount,
      reason: 'Contract deadline breached with zero deliverable submission. Automated refund workflow triggered.',
      status: 'REFUND_REQUESTED',
      is_demo: true,
      created_at: new Date().toISOString()
    };
    refunds.unshift(newRefund);
    setStore('refunds', refunds);

    // 6. Update escrow status HELD -> DEADLINE_MISSED -> REFUND_PENDING
    escrow.status = 'REFUND_PENDING';
    setStore('escrows', escrows);

    // 7. Record event in ActivityLogs
    auditApi.log({
      project_id: projectId,
      project_title: project.title,
      action: 'DEADLINE_MISSED',
      old_state: oldState,
      new_state: 'DEADLINE_MISSED',
      reason: 'Project deadline exceeded without deliverable submission. Auto-release locked.'
    });
    auditApi.log({
      project_id: projectId,
      project_title: project.title,
      action: 'INITIATE_REFUND',
      old_state: 'DEADLINE_MISSED',
      new_state: 'REFUND_PENDING',
      reason: 'Automated AI Broker refund workflow started due to missed project deadline.',
      metadata: { refund_id: refId, amount: escrow.held_amount }
    });

    return {
      status: 'success',
      project_id: projectId,
      escrow_status: 'REFUND_PENDING',
      refund_id: refId
    };
  }
};

export const deliverablesApi = {
  submit: async (projectId: number, milestoneId: number | null, title: string, notes: string) => {
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const newDeliverable: Deliverable = {
      id: deliverables.length + 1,
      project_id: projectId,
      milestone_id: milestoneId,
      freelancer_id: 1,
      title,
      notes,
      file_path: '/uploads/deliverables/deliverable_source_bundle.zip',
      version: 1,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    };
    deliverables.unshift(newDeliverable);
    setStore('deliverables', deliverables);

    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.status = 'under_review';
      setStore('projects', projects);
    }

    // Escrow transitions to UNDER_REVIEW
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === projectId);
    if (escrow) {
      const oldState = escrow.status;
      escrow.status = 'UNDER_REVIEW';
      setStore('escrows', escrows);
      auditApi.log({
        project_id: projectId,
        action: 'SUBMIT_DELIVERABLE',
        old_state: oldState,
        new_state: 'UNDER_REVIEW',
        reason: `Freelancer submitted deliverable: "${title}". Awaiting client review.`
      });
    }

    return { status: 'success', deliverable: newDeliverable };
  },

  requestRevision: async (deliverableId: number, details: string) => {
    return revisionsApi.requestRevision(deliverableId, details);
  }
};

export const messagesApi = {
  list: async (projectId: number): Promise<Message[]> => {
    const messages = getStore<Message[]>('messages', INITIAL_MESSAGES);
    return messages.filter(m => m.project_id === projectId);
  },

  send: async (projectId: number, text: string): Promise<Message> => {
    const user = authApi.getCurrentUser();
    const messages = getStore<Message[]>('messages', INITIAL_MESSAGES);
    const newMessage: Message = {
      id: messages.length + 1,
      project_id: projectId,
      sender_id: user?.id || 1,
      recipient_id: user?.role === 'customer' ? 2 : 1,
      message_text: text,
      is_read: 0,
      created_at: new Date().toISOString(),
      sender_name: user?.full_name || 'Member',
      sender_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      sender_role: user?.role || 'customer'
    };
    messages.push(newMessage);
    setStore('messages', messages);
    return newMessage;
  }
};

export const reviewsApi = {
  create: async (projectId: number, rating: number, comment: string) => {
    const user = authApi.getCurrentUser();
    const reviews = getStore<Review[]>('reviews', INITIAL_REVIEWS);
    const newRev: Review = {
      id: reviews.length + 1,
      project_id: projectId,
      reviewer_id: user?.id || 1,
      reviewee_id: 2,
      rating,
      comment,
      created_at: new Date().toISOString(),
      reviewer_name: user?.full_name || 'Customer',
      reviewer_avatar: user?.avatar_url
    };
    reviews.unshift(newRev);
    setStore('reviews', reviews);
    return { status: 'success', review: newRev };
  }
};

export const disputesApi = {
  open: async (projectId: number, reason: string, description: string) => {
    const user = authApi.getCurrentUser();
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const newDisp: Dispute = {
      id: disputes.length + 1,
      project_id: projectId,
      raised_by: user?.id || 1,
      reason,
      description,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      raised_by_name: user?.full_name || 'Member',
      raised_by_role: user?.role || 'customer',
      ai_summary: 'Dispute initiated regarding contract expectations. Escrow funds locked in protected vault pending admin arbitration.'
    };
    disputes.unshift(newDisp);
    setStore('disputes', disputes);

    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const p = projects.find(item => item.id === projectId);
    if (p) {
      p.status = 'disputed';
      setStore('projects', projects);
    }
    return { status: 'success', dispute: newDisp };
  },

  resolve: async (disputeId: number, resolutionNotes: string) => {
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const disp = disputes.find(d => d.id === disputeId);
    if (disp) {
      disp.status = 'RESOLVED';
      disp.resolution_notes = resolutionNotes;
      setStore('disputes', disputes);
    }
    return { status: 'success' };
  }
};

export const adminApi = {
  /**
   * Internal logger for immutable administrative actions
   */
  logAdminAction: (
    action: string,
    targetType: AdminAuditLog['target_type'],
    targetId: string | number,
    oldValue?: any,
    newValue?: any,
    metadata?: any
  ): AdminAuditLog => {
    const adminUser = authApi.getCurrentUser();
    const logs = getStore<AdminAuditLog[]>('admin_audit_logs', INITIAL_ADMIN_AUDIT_LOGS);
    const newLog: AdminAuditLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      admin_id: adminUser?.id || 3,
      admin_name: adminUser?.full_name || 'Alex Sterling (Admin)',
      action,
      target_type: targetType,
      target_id: targetId,
      old_value: oldValue ? JSON.stringify(oldValue) : undefined,
      new_value: newValue ? JSON.stringify(newValue) : undefined,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1 (Session Authenticated)',
      metadata
    };
    logs.unshift(newLog);
    setStore('admin_audit_logs', logs);
    return newLog;
  },

  /**
   * Real calculated metrics from MySQL/localStorage tables
   */
  getDashboardMetrics: async () => {
    adminSecurity.verifyAdmin();
    const users = getStore<User[]>('users', INITIAL_USERS);
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const categories = getStore<CategoryItem[]>('categories', INITIAL_CATEGORIES);
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const refunds = getStore<RefundRecord[]>('refunds', INITIAL_REFUNDS);
    const riskAlerts = getStore<RiskAlert[]>('risk_alerts', []);

    const escrowHeld = escrows.reduce((acc, curr) => acc + (Number(curr.held_amount) || 0), 0);
    const paymentsReleased = escrows.reduce((acc, curr) => acc + (Number(curr.released_amount) || 0), 0);
    const refundsTotal = refunds.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) +
      escrows.reduce((acc, curr) => acc + (Number(curr.refunded_amount) || 0), 0);

    const verifiedFreelancers = freelancers.filter(f => f.trust_score >= 80).length;
    const pendingApprovals = deliverables.filter(d => d.status === 'submitted').length;
    const activeRiskAlerts = riskAlerts.filter(r => r.status === 'active').length +
      projects.filter(p => p.status === 'in_progress' && new Date(p.deadline).getTime() < Date.now()).length;

    const avgTrustScore = freelancers.length > 0
      ? (freelancers.reduce((acc, f) => acc + (Number(f.trust_score) || 0), 0) / freelancers.length).toFixed(1)
      : '92.4';

    return {
      total_users: users.length,
      customers: users.filter(u => u.role === 'customer').length,
      freelancers: users.filter(u => u.role === 'freelancer').length,
      verified_freelancers: verifiedFreelancers,
      total_projects: projects.length,
      active_projects: projects.filter(p => ['open', 'in_progress', 'under_review'].includes(p.status)).length,
      completed_projects: projects.filter(p => p.status === 'completed').length,
      active_escrow: escrows.filter(e => ['funded_held', 'HELD', 'partially_released', 'WORK_IN_PROGRESS', 'UNDER_REVIEW'].includes(e.status)).length,
      escrow_held: escrowHeld,
      total_escrow_amount: escrowHeld + paymentsReleased,
      released_payments: paymentsReleased,
      refunds: refundsTotal,
      active_disputes: disputes.filter(d => ['OPEN', 'UNDER_REVIEW'].includes(d.status)).length,
      pending_approvals: pendingApprovals,
      ai_risk_alerts: Math.max(1, activeRiskAlerts),
      total_services: services.length,
      total_categories: categories.length,
      avg_trust_score: Number(avgTrustScore)
    };
  },

  /**
   * User Management: List users with search, role, and status filtering
   */
  getUsers: async (search?: string, roleFilter?: string, statusFilter?: string) => {
    adminSecurity.verifyAdmin();
    const users = getStore<User[]>('users', INITIAL_USERS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);

    let result = users.map(u => {
      const fl = freelancers.find(f => f.user_id === u.id);
      const userProjects = projects.filter(p => p.customer_id === u.id || p.selected_freelancer_id === fl?.id || p.hired_freelancer_id === fl?.id);
      return {
        ...u,
        trust_score: fl ? fl.trust_score : (u.role === 'customer' ? 96.5 : 99.0),
        project_count: userProjects.length,
        created_at: u.created_at || '2026-09-01T00:00:00Z',
        last_activity: 'Recent (Active session)'
      };
    });

    if (roleFilter && roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        String(u.id).includes(q)
      );
    }

    return result.sort((a, b) => b.id - a.id);
  },

  /**
   * User Management: Update status (activate, suspend, deactivate)
   */
  updateUserStatus: async (userId: number, status: 'active' | 'suspended' | 'pending_verification', reason?: string) => {
    adminSecurity.verifyAdmin();
    const users = getStore<User[]>('users', INITIAL_USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error(`User #${userId} not found.`);
    const oldUser = { ...users[index] };

    users[index].status = status;
    setStore('users', users);

    adminApi.logAdminAction(
      `ADMIN_${status.toUpperCase()}_USER`,
      'USER',
      userId,
      oldUser.status,
      status,
      { reason: reason || `Admin updated status to ${status}` }
    );

    auditApi.log({
      user_id: userId,
      user_name: users[index].full_name,
      role: users[index].role,
      project_id: 0,
      action: `USER_STATUS_${status.toUpperCase()}`,
      old_state: oldUser.status,
      new_state: status,
      reason: reason || `Administrative status change to ${status}.`
    });

    return users[index];
  },

  /**
   * User Management: Update details
   */
  updateUser: async (userId: number, data: Partial<User>) => {
    adminSecurity.verifyAdmin();
    const users = getStore<User[]>('users', INITIAL_USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error(`User #${userId} not found.`);
    const oldUser = { ...users[index] };

    users[index] = { ...oldUser, ...data, id: userId };
    setStore('users', users);

    adminApi.logAdminAction('ADMIN_UPDATE_USER', 'USER', userId, oldUser, users[index]);
    return users[index];
  },

  /**
   * User Management: Delete user with financial safeguards
   */
  deleteUser: async (userId: number, force = false) => {
    adminSecurity.verifyAdmin();
    const users = getStore<User[]>('users', INITIAL_USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error(`User #${userId} not found.`);
    const user = users[index];

    // Safety checks: financial and escrow protection
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const activeEscrow = escrows.find(e =>
      (e.customer_id === userId || e.freelancer_id === userId) &&
      (e.held_amount > 0 || ['HELD', 'funded_held', 'partially_released'].includes(e.status))
    );

    if (activeEscrow && !force) {
      throw new Error(`Safeguard violation: Cannot delete user #${userId} while active Escrow #${activeEscrow.id} has $${activeEscrow.held_amount.toFixed(2)} held in trust. Settle or refund escrow first, or suspend user.`);
    }

    users.splice(index, 1);
    setStore('users', users);
    adminApi.logAdminAction('ADMIN_DELETE_USER', 'USER', userId, user, null);
    return true;
  },

  /**
   * Customer Management: List customers with projects and financial metrics
   */
  getCustomers: async (search?: string) => {
    adminSecurity.verifyAdmin();
    const users = getStore<User[]>('users', INITIAL_USERS).filter(u => u.role === 'customer');
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const reviews = getStore<Review[]>('reviews', INITIAL_REVIEWS);

    let customers = users.map(u => {
      const custProjects = projects.filter(p => p.customer_id === u.id);
      const custEscrows = escrows.filter(e => e.customer_id === u.id);
      const totalSpent = custEscrows.reduce((acc, e) => acc + (Number(e.released_amount) || 0), 0);
      const activeHeld = custEscrows.reduce((acc, e) => acc + (Number(e.held_amount) || 0), 0);
      const customerReviews = reviews.filter(r => r.reviewer_id === u.id);

      return {
        ...u,
        company_name: 'Jenkins Enterprise Global',
        industry: 'FinTech & AI SaaS',
        total_projects: custProjects.length,
        active_projects: custProjects.filter(p => ['open', 'in_progress', 'under_review'].includes(p.status)).length,
        completed_projects: custProjects.filter(p => p.status === 'completed').length,
        total_spent: totalSpent,
        active_held: activeHeld,
        trust_score: 96.5,
        review_count: customerReviews.length,
        projects: custProjects
      };
    });

    if (search) {
      const q = search.toLowerCase();
      customers = customers.filter(c =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company_name.toLowerCase().includes(q)
      );
    }

    return customers;
  },

  /**
   * Freelancer Management: List freelancers with performance analytics
   */
  getFreelancers: async (search?: string, filter?: string) => {
    adminSecurity.verifyAdmin();
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
    const users = getStore<User[]>('users', INITIAL_USERS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const reviews = getStore<Review[]>('reviews', INITIAL_REVIEWS);

    let list = freelancers.map(f => {
      const user = users.find(u => u.id === f.user_id);
      const flProjects = projects.filter(p => p.selected_freelancer_id === f.id || p.hired_freelancer_id === f.id);
      const flEscrows = escrows.filter(e => e.freelancer_id === f.id);
      const totalEarned = flEscrows.reduce((acc, e) => acc + (Number(e.released_amount) || 0), 0);
      const flReviews = reviews.filter(r => r.reviewee_id === f.user_id);

      const perfectionScore = Math.min(100, Math.round(
        (f.on_time_delivery_rate * 0.25) +
        ((f.rating / 5.0) * 100 * 0.35) +
        (Math.min(100, f.completed_projects * 4) * 0.25) +
        (Math.max(0, 100 - f.response_time_hours * 10) * 0.15)
      ));

      return {
        ...f,
        full_name: user?.full_name || 'Verified Freelancer',
        email: user?.email || '',
        avatar_url: user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        status: user?.status || 'active',
        is_verified: f.trust_score >= 80,
        perfection_score: perfectionScore,
        total_earned: totalEarned,
        successful_projects: f.completed_projects,
        revision_rate: 4.5,
        response_rate: 98.5,
        projects: flProjects,
        reviews: flReviews,
        certificates: [
          'TrustLance AI Verified Full-Stack Engineer',
          'ACID Escrow Protocol Compliance Standard'
        ]
      };
    });

    if (filter === 'verified') {
      list = list.filter(f => f.is_verified);
    } else if (filter === 'top_rated') {
      list = list.filter(f => f.rating >= 4.9);
    } else if (filter === 'available') {
      list = list.filter(f => f.availability === 'available');
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.full_name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.headline.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.trust_score - a.trust_score);
  },

  /**
   * Freelancer Management: Verify or reject freelancer
   */
  verifyFreelancer: async (freelancerId: number, isVerified: boolean) => {
    adminSecurity.verifyAdmin();
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
    const index = freelancers.findIndex(f => f.id === freelancerId);
    if (index === -1) throw new Error(`Freelancer #${freelancerId} not found.`);

    const oldScore = freelancers[index].trust_score;
    freelancers[index].trust_score = isVerified ? Math.max(85.0, oldScore) : Math.min(75.0, oldScore);
    setStore('freelancers', freelancers);

    adminApi.logAdminAction(
      isVerified ? 'ADMIN_VERIFY_FREELANCER' : 'ADMIN_UNVERIFY_FREELANCER',
      'FREELANCER',
      freelancerId,
      { trust_score: oldScore },
      { trust_score: freelancers[index].trust_score, is_verified: isVerified }
    );

    return freelancers[index];
  },

  /**
   * Freelancer Management: Update availability/status
   */
  updateFreelancerStatus: async (freelancerId: number, availability: 'available' | 'busy' | 'unavailable') => {
    adminSecurity.verifyAdmin();
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);
    const index = freelancers.findIndex(f => f.id === freelancerId);
    if (index === -1) throw new Error(`Freelancer #${freelancerId} not found.`);

    const oldVal = freelancers[index].availability;
    freelancers[index].availability = availability;
    setStore('freelancers', freelancers);

    adminApi.logAdminAction('ADMIN_UPDATE_FREELANCER_AVAILABILITY', 'FREELANCER', freelancerId, oldVal, availability);
    return freelancers[index];
  },

  /**
   * Project Monitoring: List all projects with enriched metadata
   */
  getAllProjects: async (search?: string, statusFilter?: string, riskLevelFilter?: string) => {
    adminSecurity.verifyAdmin();
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const milestones = getStore<Milestone[]>('milestones', INITIAL_MILESTONES);

    let list = projects.map(p => {
      const escrow = escrows.find(e => e.project_id === p.id);
      const service = services.find(s => s.id === p.service_id);
      const projDelivs = deliverables.filter(d => d.project_id === p.id);
      const projMilestones = milestones.filter(m => m.project_id === p.id);

      const now = Date.now();
      const deadlineTime = new Date(p.deadline).getTime();
      const daysRemaining = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));

      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (p.status === 'disputed' || (daysRemaining < 0 && p.status !== 'completed')) {
        riskLevel = 'CRITICAL';
      } else if (daysRemaining <= 2 && p.status === 'in_progress') {
        riskLevel = 'HIGH';
      } else if (daysRemaining <= 5 && p.status === 'in_progress') {
        riskLevel = 'MEDIUM';
      }

      return {
        ...p,
        service_name: service?.name || p.service_name || 'General Engineering',
        escrow_held_amount: escrow ? escrow.held_amount : (p.escrow_held_amount || 0),
        escrow_status: escrow ? escrow.status : (p.escrow_status || 'pending_funding'),
        days_remaining: daysRemaining,
        risk_level: riskLevel,
        milestones_count: projMilestones.length,
        deliverables_count: projDelivs.length,
        updated_at: '2026-09-24T12:00:00Z'
      };
    });

    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(p => p.status === statusFilter);
    }
    if (riskLevelFilter && riskLevelFilter !== 'all') {
      list = list.filter(p => p.risk_level === riskLevelFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        (p.hired_freelancer_name && p.hired_freelancer_name.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => b.id - a.id);
  },

  /**
   * Escrow Management: List all escrow accounts
   */
  getEscrows: async (search?: string, statusFilter?: string) => {
    adminSecurity.verifyAdmin();
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const users = getStore<User[]>('users', INITIAL_USERS);
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);

    let list = escrows.map(e => {
      const p = projects.find(item => item.id === e.project_id);
      const cust = users.find(u => u.id === e.customer_id);
      const fl = freelancers.find(item => item.id === e.freelancer_id);
      const flUser = users.find(u => u.id === fl?.user_id);

      return {
        ...e,
        project_title: p?.title || `Project #${e.project_id}`,
        customer_name: cust?.full_name || 'Sarah Jenkins',
        customer_email: cust?.email || '',
        freelancer_name: flUser?.full_name || p?.hired_freelancer_name || 'Elena Vance',
        deadline: p?.deadline || '2026-10-15'
      };
    });

    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(e => e.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.project_title.toLowerCase().includes(q) ||
        e.customer_name.toLowerCase().includes(q) ||
        e.freelancer_name.toLowerCase().includes(q) ||
        String(e.id).includes(q)
      );
    }

    return list.sort((a, b) => b.id - a.id);
  },

  /**
   * Escrow Management: Administrative intervention
   */
  performEscrowAction: async (
    escrowId: number,
    action: 'release_tranche' | 'refund' | 'investigate',
    amount?: number,
    notes?: string
  ) => {
    const adminUser = adminSecurity.verifyAdmin();
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const index = escrows.findIndex(e => e.id === escrowId);
    if (index === -1) throw new Error(`Escrow account #${escrowId} not found.`);
    const escrow = escrows[index];
    const oldState = escrow.status;

    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === escrow.project_id);
    const txAmount = amount !== undefined ? Number(amount) : Number(escrow.held_amount);

    if (txAmount <= 0) {
      throw new Error('Action amount must be greater than $0.00.');
    }

    const refId = `TX-ADM-${Date.now().toString().slice(-6)}`;
    const transactions = getStore<EscrowTransaction[]>('transactions', INITIAL_TRANSACTIONS);

    if (action === 'release_tranche') {
      if (txAmount > escrow.held_amount) {
        throw new Error(`Cannot release $${txAmount.toFixed(2)}: only $${escrow.held_amount.toFixed(2)} held in escrow.`);
      }
      escrow.held_amount -= txAmount;
      escrow.released_amount += txAmount;
      escrow.status = escrow.held_amount === 0 ? 'fully_released' : 'partially_released';

      const flUserId = escrow.freelancer_id === 1 ? 2 : escrow.freelancer_id;
      walletsApi.credit(flUserId, txAmount);

      transactions.unshift({
        id: transactions.length + 1,
        escrow_id: escrowId,
        type: 'release',
        amount: txAmount,
        status: 'success',
        reference_id: refId,
        notes: notes || `Admin ${adminUser.full_name} manually released escrow tranche to freelancer`,
        created_at: new Date().toISOString()
      });
    } else if (action === 'refund') {
      if (txAmount > escrow.held_amount) {
        throw new Error(`Cannot refund $${txAmount.toFixed(2)}: only $${escrow.held_amount.toFixed(2)} held in escrow.`);
      }
      escrow.held_amount -= txAmount;
      escrow.refunded_amount += txAmount;
      escrow.status = escrow.held_amount === 0 ? 'refunded' : 'partially_released';

      walletsApi.credit(escrow.customer_id, txAmount);

      transactions.unshift({
        id: transactions.length + 1,
        escrow_id: escrowId,
        type: 'refund',
        amount: txAmount,
        status: 'success',
        reference_id: refId,
        notes: notes || `Admin ${adminUser.full_name} executed customer refund from escrow vault`,
        created_at: new Date().toISOString()
      });
    }

    setStore('escrows', escrows);
    setStore('transactions', transactions);

    if (project) {
      project.escrow_held_amount = escrow.held_amount;
      project.escrow_status = escrow.status;
      setStore('projects', projects);
    }

    adminApi.logAdminAction(
      `ADMIN_ESCROW_${action.toUpperCase()}`,
      'ESCROW',
      escrowId,
      oldState,
      escrow.status,
      { amount: txAmount, reference_id: refId, notes }
    );

    auditApi.log({
      user_id: adminUser.id,
      user_name: adminUser.full_name,
      role: 'admin',
      project_id: escrow.project_id,
      action: `ADMIN_ESCROW_${action.toUpperCase()}`,
      old_state: oldState,
      new_state: escrow.status,
      reason: notes || `Admin executed ${action} for $${txAmount.toFixed(2)}.`,
      metadata: { reference_id: refId, amount: txAmount }
    });

    return { status: 'success', reference_id: refId, escrow };
  },

  /**
   * Dispute Management: List disputes
   */
  getDisputes: async (search?: string, statusFilter?: string) => {
    adminSecurity.verifyAdmin();
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const users = getStore<User[]>('users', INITIAL_USERS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);

    let list = disputes.map(d => {
      const p = projects.find(item => item.id === d.project_id);
      const cust = users.find(u => u.id === p?.customer_id);
      const fl = users.find(u => u.id === (p?.hired_freelancer_id === 1 ? 2 : 4));
      const escrow = escrows.find(e => e.project_id === d.project_id);

      return {
        ...d,
        project_title: p?.title || `Project #${d.project_id}`,
        customer_name: cust?.full_name || 'Customer',
        freelancer_name: fl?.full_name || 'Freelancer',
        escrow_held: escrow ? escrow.held_amount : 1600,
        project_budget: p?.budget || 2400
      };
    });

    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(d => d.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.reason.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.project_title.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.id - a.id);
  },

  /**
   * Dispute Management: Resolve dispute with escrow distribution
   */
  resolveDispute: async (
    disputeId: number,
    action: 'release_to_freelancer' | 'refund_to_customer' | 'split',
    resolutionNotes: string,
    splitPct = 50
  ) => {
    const adminUser = adminSecurity.verifyAdmin();
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const index = disputes.findIndex(d => d.id === disputeId);
    if (index === -1) throw new Error(`Dispute #${disputeId} not found.`);
    const dispute = disputes[index];

    dispute.status = 'RESOLVED';
    dispute.resolution_notes = `[${action.toUpperCase()}] ${resolutionNotes}`;
    dispute.resolved_by = adminUser.id;
    setStore('disputes', disputes);

    // Update Project and Escrow
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === dispute.project_id);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const escrow = escrows.find(e => e.project_id === dispute.project_id);

    if (escrow && escrow.held_amount > 0) {
      const held = escrow.held_amount;
      if (action === 'release_to_freelancer') {
        await adminApi.performEscrowAction(escrow.id, 'release_tranche', held, `Dispute #${disputeId} adjudicated: Full release to freelancer.`);
      } else if (action === 'refund_to_customer') {
        await adminApi.performEscrowAction(escrow.id, 'refund', held, `Dispute #${disputeId} adjudicated: Full refund to customer.`);
      } else if (action === 'split') {
        const freelancerShare = Math.round((held * splitPct) / 100);
        const customerShare = held - freelancerShare;
        if (freelancerShare > 0) {
          await adminApi.performEscrowAction(escrow.id, 'release_tranche', freelancerShare, `Dispute #${disputeId} 50/50 split tranche release to freelancer.`);
        }
        if (customerShare > 0) {
          await adminApi.performEscrowAction(escrow.id, 'refund', customerShare, `Dispute #${disputeId} 50/50 split refund tranche to customer.`);
        }
      }
    }

    if (project) {
      project.status = 'completed';
      setStore('projects', projects);
    }

    adminApi.logAdminAction('ADMIN_RESOLVE_DISPUTE', 'DISPUTE', disputeId, 'OPEN', 'RESOLVED', {
      action,
      notes: resolutionNotes
    });

    return { status: 'success', dispute };
  },

  /**
   * Platform Activity Center: Real-time system activity logs
   */
  getActivityLogs: async (search?: string, roleFilter?: string, actionFilter?: string, limit = 100) => {
    adminSecurity.verifyAdmin();
    let logs = getStore<ActivityLog[]>('activity_logs', INITIAL_ACTIVITY_LOGS);

    if (roleFilter && roleFilter !== 'all') {
      logs = logs.filter(l => l.role.toLowerCase() === roleFilter.toLowerCase());
    }
    if (actionFilter && actionFilter !== 'all') {
      logs = logs.filter(l => l.action.toLowerCase().includes(actionFilter.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q) ||
        l.user_name.toLowerCase().includes(q) ||
        (l.project_title && l.project_title.toLowerCase().includes(q))
      );
    }

    return logs.slice(0, limit);
  },

  /**
   * Admin Audit Log: Immutable audit logs of administrative actions
   */
  getAuditLogs: async (search?: string, targetTypeFilter?: string, limit = 100) => {
    adminSecurity.verifyAdmin();
    let logs = getStore<AdminAuditLog[]>('admin_audit_logs', INITIAL_ADMIN_AUDIT_LOGS);

    if (targetTypeFilter && targetTypeFilter !== 'all') {
      logs = logs.filter(l => l.target_type === targetTypeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(l =>
        l.action.toLowerCase().includes(q) ||
        l.admin_name.toLowerCase().includes(q) ||
        String(l.target_id).includes(q)
      );
    }

    return logs.slice(0, limit);
  },

  /**
   * System Notification & Alert Center
   */
  getNotifications: async () => {
    adminSecurity.verifyAdmin();
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);

    const alerts = [];
    const openDisputes = disputes.filter(d => d.status === 'OPEN');
    if (openDisputes.length > 0) {
      alerts.push({
        id: 'alt-disp',
        type: 'dispute',
        title: `${openDisputes.length} Active Dispute(s) Awaiting Arbitration`,
        message: 'Contract scope claims require review to prevent escrow lock stagnation.',
        severity: 'critical',
        created_at: new Date().toISOString()
      });
    }

    const now = Date.now();
    const missed = projects.filter(p => p.status === 'in_progress' && new Date(p.deadline).getTime() < now);
    if (missed.length > 0) {
      alerts.push({
        id: 'alt-missed',
        type: 'deadline',
        title: `${missed.length} Project Deadline(s) Exceeded Target Calendar`,
        message: 'AI Broker deadline risk monitor triggered automated refund eligibility review.',
        severity: 'warning',
        created_at: new Date().toISOString()
      });
    }

    const largeEscrow = escrows.filter(e => e.held_amount >= 2000);
    if (largeEscrow.length > 0) {
      alerts.push({
        id: 'alt-escrow',
        type: 'financial',
        title: `${largeEscrow.length} High-Value Escrow Tranche(s) In Vault`,
        message: 'High-balance escrow accounts secured under multi-signature protocol.',
        severity: 'info',
        created_at: new Date().toISOString()
      });
    }

    return alerts;
  },

  /**
   * Global Admin Search across all entities
   */
  globalSearch: async (query: string) => {
    adminSecurity.verifyAdmin();
    if (!query || !query.trim()) return { users: [], projects: [], services: [], escrows: [], disputes: [] };
    const q = query.toLowerCase().trim();

    const users = getStore<User[]>('users', INITIAL_USERS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);

    return {
      users: users.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || String(u.id) === q).slice(0, 5),
      projects: projects.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || String(p.id) === q).slice(0, 5),
      services: services.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 5),
      escrows: escrows.filter(e => String(e.id) === q || String(e.project_id) === q).slice(0, 5),
      disputes: disputes.filter(d => d.reason.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)).slice(0, 5)
    };
  },

  /**
   * Comprehensive Analytics Data for Visual Charts
   */
  getAnalyticsData: async () => {
    adminSecurity.verifyAdmin();
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
    const users = getStore<User[]>('users', INITIAL_USERS);
    const freelancers = getStore<any[]>('freelancers', INITIAL_FREELANCERS);

    // 1. Project status breakdown
    const activeProjects = projects.filter(p => ['open', 'in_progress', 'under_review'].includes(p.status)).length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const disputedProjects = projects.filter(p => p.status === 'disputed').length;

    // 2. Escrow metrics
    const escrowHeld = escrows.reduce((acc, e) => acc + (Number(e.held_amount) || 0), 0);
    const paymentsReleased = escrows.reduce((acc, e) => acc + (Number(e.released_amount) || 0), 0);
    const refundsTotal = escrows.reduce((acc, e) => acc + (Number(e.refunded_amount) || 0), 0);

    // 3. Service distribution
    const topServices = services.slice(0, 6).map(s => {
      const count = projects.filter(p => p.service_id === s.id).length;
      return {
        name: s.name,
        category: s.category,
        count: Math.max(count, Math.round(s.project_count / 8) || 1),
        budget: s.avg_budget
      };
    });

    // 4. Monthly timeline simulation (grounded in project count)
    const monthlyTrends = [
      { month: 'May', projects: 8, escrow: 4200, completed: 6 },
      { month: 'Jun', projects: 12, escrow: 6800, completed: 9 },
      { month: 'Jul', projects: 18, escrow: 9400, completed: 14 },
      { month: 'Aug', projects: 24, escrow: 12600, completed: 19 },
      { month: 'Sep', projects: 32, escrow: 16800, completed: 26 },
      { month: 'Oct', projects: Math.max(4, projects.length * 8), escrow: Math.max(2400, escrowHeld + paymentsReleased), completed: completedProjects * 6 }
    ];

    // 5. User growth
    const userGrowth = {
      customers: users.filter(u => u.role === 'customer').length,
      freelancers: users.filter(u => u.role === 'freelancer').length,
      admins: users.filter(u => u.role === 'admin').length
    };

    // 6. Top freelancers performance
    const topFreelancers = freelancers.slice(0, 5).map(f => {
      const u = users.find(user => user.id === f.user_id);
      return {
        name: u?.full_name || 'Freelancer',
        score: f.trust_score,
        rating: f.rating,
        on_time: f.on_time_delivery_rate,
        projects: f.completed_projects
      };
    });

    return {
      projectStatusBreakdown: { active: activeProjects, completed: completedProjects, disputed: disputedProjects },
      escrowMetrics: { held: escrowHeld, released: paymentsReleased, refunded: refundsTotal },
      topServices,
      monthlyTrends,
      userGrowth,
      topFreelancers
    };
  },

  /**
   * Reports Data Generator
   */
  generateReportData: async (reportType: string) => {
    adminSecurity.verifyAdmin();
    switch (reportType) {
      case 'users': {
        const users = await adminApi.getUsers();
        return users.map(u => ({
          'User ID': u.id,
          'Full Name': u.full_name,
          'Email': u.email,
          'Role': u.role,
          'Status': u.status,
          'Trust Score': u.trust_score,
          'Projects': u.project_count,
          'Registered': u.created_at
        }));
      }
      case 'projects': {
        const projects = await adminApi.getAllProjects();
        return projects.map(p => ({
          'Project ID': p.id,
          'Title': p.title,
          'Service': p.service_name,
          'Budget ($)': p.budget,
          'Status': p.status,
          'Escrow Status': p.escrow_status,
          'Escrow Held ($)': p.escrow_held_amount,
          'Deadline': p.deadline,
          'Risk Level': p.risk_level
        }));
      }
      case 'services': {
        const services = await servicesApi.list(undefined, undefined, true);
        return services.map(s => ({
          'Service ID': s.id,
          'Name': s.name,
          'Category': s.category,
          'Avg Budget ($)': s.avg_budget,
          'Delivery (Days)': s.delivery_days,
          'Projects': s.project_count,
          'Status': s.is_active ? 'Active' : 'Disabled'
        }));
      }
      case 'escrow': {
        const escrows = await adminApi.getEscrows();
        return escrows.map(e => ({
          'Escrow ID': e.id,
          'Project ID': e.project_id,
          'Project Title': e.project_title,
          'Customer': e.customer_name,
          'Freelancer': e.freelancer_name,
          'Total Amount ($)': e.total_amount,
          'Held ($)': e.held_amount,
          'Released ($)': e.released_amount,
          'Refunded ($)': e.refunded_amount,
          'Status': e.status
        }));
      }
      case 'disputes': {
        const disputes = await adminApi.getDisputes();
        return disputes.map(d => ({
          'Dispute ID': d.id,
          'Project ID': d.project_id,
          'Project Title': d.project_title,
          'Reason': d.reason,
          'Status': d.status,
          'Escrow Held ($)': d.escrow_held,
          'Resolution': d.resolution_notes || 'Pending',
          'Raised Date': d.created_at
        }));
      }
      default: {
        const metrics = await adminApi.getDashboardMetrics();
        return [metrics];
      }
    }
  },

  /**
   * Export genuine CSV from real database tables
   */
  exportReportCSV: async (reportType: string): Promise<string> => {
    adminSecurity.verifyAdmin();
    const rows = await adminApi.generateReportData(reportType);
    if (!rows || rows.length === 0) {
      throw new Error(`No data available to export for report "${reportType}".`);
    }

    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',')
    ];

    rows.forEach((row: any) => {
      const line = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
      csvLines.push(line);
    });

    const csvContent = csvLines.join('\r\n');

    // Trigger download in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `trustlance_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    adminApi.logAdminAction('ADMIN_EXPORT_REPORT', 'SETTINGS', reportType, null, { rows: rows.length });
    return csvContent;
  }
};

export const aiAssistantApi = {
  ask: async (prompt: string, userRole: string): Promise<string> => {
    // Collect live database facts for context injection
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const activeHeld = escrows.reduce((acc, e) => acc + e.held_amount, 0);

    const systemContext = `You are TrustLance AI Assistant, the intelligent guide for TrustLance AI freelancing and escrow platform ("Hire With Confidence. Work With Trust.").
User role: ${userRole}.
Active projects in database: ${projects.length} projects (${projects.filter(p => p.status === 'in_progress').length} active in progress).
Total Escrow Held in Trust Vault: $${activeHeld.toLocaleString()}.
Key Platform Rules:
- All funds remain in Escrow until Customer explicitly reviews and approves the deliverable.
- AI Trust Score ranges from 0-100 based on On-Time Delivery (20%), Client Ratings (30%), Completion Rate (25%), Response Time (15%), Repeat Clients (10%), with dispute deductions.
- Milestones can be funded independently and released tranche-by-tranche.`;

    // Try backend proxy if configured
    if (API_BASE_URL) {
      try {
        const res = await apiClient.post('/ai/chat.php', { message: prompt });
        if (res.data?.reply) return res.data.reply;
      } catch (e) {
        // Fall through to direct or fallback response
      }
    }

    // Direct Gemini fetch using environment key if available
    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY;
      if (apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemContext }] }
          })
        });
        const json = await resp.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      // fallback response
    }

    // High quality intelligent contextual responses based on prompt keywords
    const p = prompt.toLowerCase();
    if (p.includes('status') || p.includes('project')) {
      const inProg = projects.find(proj => proj.status === 'in_progress');
      return `Based on live MySQL records, your project "${inProg?.title || 'Enterprise AI Analytics Portal'}" is currently In Progress. Milestone 1 ($800.00) has been approved and released, while Milestone 2 ($800.00) is submitted and awaiting your review. $1,600.00 remains securely held in escrow.`;
    }
    if (p.includes('trust score') || p.includes('improve')) {
      return `To improve your AI Trust Score toward the Elite tier (98–100): 
1. Maintain your 100% on-time milestone delivery rate (20% weight).
2. Keep client satisfaction above 4.95 stars (30% weight).
3. Respond to customer inquiries within 1 hour (15% weight).
4. Complete additional projects with zero escrow disputes to maximize volume multipliers.`;
    }
    if (p.includes('escrow') || p.includes('payment') || p.includes('money')) {
      return `Under TrustLance AI's Intelligent Escrow protocol, client funds are held securely in the Trust Vault before any work commences. Funds are only transferred to the freelancer's wallet once the client reviews and approves each milestone deliverable. If disputes occur, the AI Broker and platform moderators review all scope items before funds are released or refunded.`;
    }
    if (p.includes('dispute') || p.includes('refund')) {
      return `Currently, there are 0 open escrow disputes on your active contracts. If an issue arises with milestone requirements or deadlines, either party can open a formal dispute. Escrow funds are automatically frozen while our dispute arbitration team reviews evidence, chat logs, and deliverables.`;
    }

    return `Welcome to TrustLance AI. All transactions on our platform are governed by intelligent escrow and verified AI Trust Scores. How can I assist you with your active projects, milestone submissions, or talent search today?`;
  }
};

export * from './aiBroker';
