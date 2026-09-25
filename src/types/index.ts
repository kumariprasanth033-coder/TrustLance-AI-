/**
 * TRUSTLANCE AI — TypeScript Data Models
 * Synchronized with MySQL 8.0 normalized relational schema
 */

export type UserRole = 'customer' | 'freelancer' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending_verification';
  created_at?: string;
}

export interface CustomerProfile {
  id: number;
  user_id: number;
  company_name: string;
  industry: string;
  trust_score: number;
  verified_payment: number;
  total_spent: number;
  completed_projects: number;
  dispute_count: number;
}

export interface FreelancerProfile {
  id: number;
  user_id: number;
  headline: string;
  bio?: string;
  hourly_rate: number;
  project_rate: number;
  trust_score: number;
  rating: number;
  review_count: number;
  completed_projects: number;
  on_time_delivery_rate: number;
  response_time_hours: number;
  availability: 'available' | 'busy' | 'unavailable';
  skills?: { name: string; proficiency: string }[];
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  banner?: string;
  category: string;
  avg_budget: number;
  delivery_days: number;
  project_count: number;
  is_active: number;
}

export interface Project {
  id: number;
  customer_id: number;
  service_id: number;
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline: string;
  status: 'draft' | 'open' | 'in_progress' | 'under_review' | 'completed' | 'cancelled' | 'disputed';
  revision_expectations?: string;
  reference_websites?: string;
  selected_freelancer_id?: number | null;
  created_at: string;
  // Joined fields
  service_name?: string;
  service_icon?: string;
  customer_name?: string;
  customer_avatar?: string;
  customer_trust_score?: number;
  proposal_count?: number;
  hired_freelancer_id?: number;
  hired_freelancer_name?: string;
  escrow_held_amount?: number;
  escrow_status?: string;
}

export interface Proposal {
  id: number;
  project_id: number;
  freelancer_id: number;
  cover_letter: string;
  proposed_price: number;
  delivery_days: number;
  milestones_json?: any;
  relevant_experience?: string;
  portfolio_refs?: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  ai_match_score: number;
  ai_match_reason?: string;
  created_at: string;
  // Joined fields
  freelancer_name?: string;
  freelancer_avatar?: string;
  headline?: string;
  trust_score?: number;
  rating?: number;
  completed_projects?: number;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'funded_escrow' | 'in_progress' | 'submitted' | 'approved' | 'released';
  order_index: number;
}

export interface Deliverable {
  id: number;
  project_id: number;
  milestone_id?: number | null;
  freelancer_id: number;
  title: string;
  notes?: string;
  file_path?: string;
  version: number;
  status: 'submitted' | 'revision_requested' | 'approved';
  submitted_at: string;
}

export interface Revision {
  id: number;
  deliverable_id: number;
  customer_id: number;
  reason: string;
  details: string;
  requested_at: string;
  status: 'open' | 'resolved';
}

export interface EscrowAccount {
  id: number;
  project_id: number;
  customer_id: number;
  freelancer_id: number;
  total_amount: number;
  held_amount: number;
  released_amount: number;
  refunded_amount: number;
  status: 'pending_funding' | 'funded_held' | 'partially_released' | 'fully_released' | 'refund_pending' | 'refunded' | 'disputed';
  created_at: string;
}

export interface EscrowTransaction {
  id: number;
  escrow_id: number;
  type: 'fund' | 'release' | 'refund' | 'fee_deduction';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  reference_id: string;
  notes?: string;
  created_at: string;
}

export interface Review {
  id: number;
  project_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
}

export interface Message {
  id: number;
  project_id: number;
  sender_id: number;
  recipient_id: number;
  message_text: string;
  attachment_url?: string;
  is_read: number;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
  sender_role?: UserRole;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'proposal' | 'escrow' | 'milestone' | 'deliverable' | 'revision' | 'payment' | 'dispute' | 'system';
  link?: string;
  is_read: number;
  created_at: string;
}

export interface AIScoreBreakdown {
  total_score: number;
  tier_level: 'Elite' | 'Highly Trusted' | 'Trusted' | 'Good' | 'Average' | 'Needs Improvement';
  completion_factor: number;
  on_time_factor: number;
  rating_factor: number;
  response_factor: number;
  repeat_client_factor: number;
  dispute_penalty: number;
}

export interface Dispute {
  id: number;
  project_id: number;
  raised_by: number;
  reason: string;
  description: string;
  evidence_url?: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'WAITING_FOR_CUSTOMER' | 'WAITING_FOR_FREELANCER' | 'RESOLVED' | 'CLOSED';
  ai_summary?: string;
  resolution_notes?: string;
  resolved_by?: number;
  created_at: string;
  project_title?: string;
  project_budget?: number;
  raised_by_name?: string;
  raised_by_role?: UserRole;
  escrow_held?: number;
}

export interface RiskAlert {
  id: number;
  user_id?: number;
  project_id?: number;
  risk_level: 'Low Risk' | 'Medium Risk' | 'High Risk';
  reason: string;
  status: 'active' | 'dismissed' | 'investigating';
  created_at: string;
  full_name?: string;
  project_title?: string;
}
