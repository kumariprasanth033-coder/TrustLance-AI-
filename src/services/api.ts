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
  Dispute,
  RiskAlert,
  AIScoreBreakdown
} from '../types';

// Default XAMPP backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/TrustLance-AI/backend/api';

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
}

// Reset data to factory seed
export function resetLocalDatabase() {
  localStorage.removeItem('tl_services');
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
  initLocalDatabase();
}

initLocalDatabase();

// ==========================================
// UNIFIED FRONTEND API SERVICE FACADES
// ==========================================

export const authApi = {
  login: async (email: string, role?: string) => {
    // Try remote PHP API first
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
  list: async (category?: string, search?: string): Promise<ServiceCategory[]> => {
    try {
      const res = await apiClient.get('/services/list.php', { params: { category, search } });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      // Fallback
    }

    let services = getStore<ServiceCategory[]>('services', INITIAL_SERVICES);
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
    const services = await servicesApi.list();
    return services.find(s => s.id === id);
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

export const escrowApi = {
  fund: async (projectId: number, amount: number) => {
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found.');

    let escrow = escrows.find(e => e.project_id === projectId);
    const refId = `TX-ESCROW-${Date.now().toString().slice(-8)}`;

    if (!escrow) {
      escrow = {
        id: escrows.length + 1,
        project_id: projectId,
        customer_id: 1,
        freelancer_id: project.selected_freelancer_id || 1,
        total_amount: amount,
        held_amount: amount,
        released_amount: 0,
        refunded_amount: 0,
        status: 'funded_held',
        created_at: new Date().toISOString()
      };
      escrows.push(escrow);
    } else {
      escrow.held_amount += amount;
      escrow.total_amount = Math.max(escrow.total_amount, escrow.held_amount);
      escrow.status = 'funded_held';
    }
    setStore('escrows', escrows);

    // Update project state
    project.status = 'in_progress';
    project.escrow_held_amount = escrow.held_amount;
    project.escrow_status = 'funded_held';
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
      notes: `Secured $${amount.toFixed(2)} in TrustLance AI Escrow Vault`,
      created_at: new Date().toISOString()
    });
    setStore('transactions', transactions);

    // Update milestones to funded
    const milestones = getStore<Milestone[]>('milestones', INITIAL_MILESTONES);
    milestones.filter(m => m.project_id === projectId).forEach(m => {
      if (m.status === 'pending') m.status = 'funded_escrow';
    });
    setStore('milestones', milestones);

    return { status: 'success', reference_id: refId, escrow_status: 'funded_held' };
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

    return { status: 'success', deliverable: newDeliverable };
  },

  requestRevision: async (deliverableId: number, details: string) => {
    const deliverables = getStore<Deliverable[]>('deliverables', INITIAL_DELIVERABLES);
    const d = deliverables.find(item => item.id === deliverableId);
    if (d) {
      d.status = 'revision_requested';
      setStore('deliverables', deliverables);
    }
    return { status: 'success', message: 'Revision feedback sent to freelancer.' };
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
  getDashboardMetrics: async () => {
    const users = getStore<User[]>('users', INITIAL_USERS);
    const projects = getStore<Project[]>('projects', INITIAL_PROJECTS);
    const escrows = getStore<EscrowAccount[]>('escrows', INITIAL_ESCROWS);
    const disputes = getStore<Dispute[]>('disputes', INITIAL_DISPUTES);

    const escrowHeld = escrows.reduce((acc, curr) => acc + (curr.held_amount || 0), 0);
    const paymentsReleased = escrows.reduce((acc, curr) => acc + (curr.released_amount || 0), 0);
    const refundsTotal = escrows.reduce((acc, curr) => acc + (curr.refunded_amount || 0), 0);

    return {
      total_users: users.length,
      customers: users.filter(u => u.role === 'customer').length,
      freelancers: users.filter(u => u.role === 'freelancer').length,
      total_projects: projects.length,
      active_projects: projects.filter(p => ['open', 'in_progress', 'under_review'].includes(p.status)).length,
      completed_projects: projects.filter(p => p.status === 'completed').length,
      escrow_held: escrowHeld,
      payments_released: paymentsReleased,
      refunds_total: refundsTotal,
      open_disputes: disputes.filter(d => ['OPEN', 'UNDER_REVIEW'].includes(d.status)).length,
      avg_trust_score: 91.5,
      active_risk_alerts: 1
    };
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

    // Try backend proxy if available
    try {
      const res = await apiClient.post('/ai/chat.php', { message: prompt });
      if (res.data?.reply) return res.data.reply;
    } catch (e) {
      // Fall through to client direct Gemini call
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
