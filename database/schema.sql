-- ========================================================
-- TRUSTLANCE AI — DATABASE SCHEMA (MySQL 8.0+)
-- "Hire With Confidence. Work With Trust."
-- Normalized relational schema with strict Foreign Keys,
-- Indexes, Financial Escrow Ledger, and AI Metrics
-- ========================================================

CREATE DATABASE IF NOT EXISTS `trustlance_ai` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `trustlance_ai`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `role` ENUM('customer', 'freelancer', 'admin') NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('active', 'suspended', 'pending_verification') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB;

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `company_name` VARCHAR(150) DEFAULT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `trust_score` DECIMAL(5,2) DEFAULT 85.00,
  `verified_payment` TINYINT(1) DEFAULT 1,
  `total_spent` DECIMAL(12,2) DEFAULT 0.00,
  `completed_projects` INT UNSIGNED DEFAULT 0,
  `dispute_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. FREELANCERS TABLE
CREATE TABLE IF NOT EXISTS `freelancers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `headline` VARCHAR(190) NOT NULL,
  `bio` TEXT DEFAULT NULL,
  `hourly_rate` DECIMAL(10,2) DEFAULT 45.00,
  `project_rate` DECIMAL(10,2) DEFAULT 500.00,
  `trust_score` DECIMAL(5,2) DEFAULT 88.00,
  `rating` DECIMAL(3,2) DEFAULT 4.90,
  `review_count` INT UNSIGNED DEFAULT 0,
  `completed_projects` INT UNSIGNED DEFAULT 0,
  `on_time_delivery_rate` DECIMAL(5,2) DEFAULT 98.00,
  `response_time_hours` DECIMAL(4,1) DEFAULT 1.5,
  `availability` ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_freelancers_trust_score` (`trust_score`),
  INDEX `idx_freelancers_rating` (`rating`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. ADMINS TABLE
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `department` VARCHAR(100) DEFAULT 'Platform Operations',
  `access_level` ENUM('super_admin', 'moderator', 'finance_officer') DEFAULT 'super_admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. SERVICES TABLE (20 Standard Categories)
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(60) NOT NULL,
  `banner` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(60) NOT NULL,
  `avg_budget` DECIMAL(10,2) DEFAULT 800.00,
  `delivery_days` INT UNSIGNED DEFAULT 7,
  `project_count` INT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_services_slug` (`slug`),
  INDEX `idx_services_active` (`is_active`)
) ENGINE=InnoDB;

-- 6. SKILLS TABLE
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `category` VARCHAR(100) DEFAULT 'General'
) ENGINE=InnoDB;

-- 7. FREELANCER SKILLS (M:N)
CREATE TABLE IF NOT EXISTS `freelancer_skills` (
  `freelancer_id` INT UNSIGNED NOT NULL,
  `skill_id` INT UNSIGNED NOT NULL,
  `proficiency` ENUM('intermediate', 'advanced', 'expert') DEFAULT 'expert',
  PRIMARY KEY (`freelancer_id`, `skill_id`),
  FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT UNSIGNED NOT NULL,
  `service_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `requirements` TEXT DEFAULT NULL,
  `budget` DECIMAL(12,2) NOT NULL,
  `deadline` DATE NOT NULL,
  `status` ENUM('draft', 'open', 'in_progress', 'under_review', 'completed', 'cancelled', 'disputed') DEFAULT 'open',
  `revision_expectations` VARCHAR(255) DEFAULT 'Up to 2 comprehensive revision rounds included.',
  `reference_websites` TEXT DEFAULT NULL,
  `selected_freelancer_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_status` (`status`),
  INDEX `idx_projects_budget` (`budget`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`selected_freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 9. PROJECT FILES TABLE
CREATE TABLE IF NOT EXISTS `project_files` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size` INT UNSIGNED NOT NULL,
  `file_type` VARCHAR(60) NOT NULL,
  `uploaded_by` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS `proposals` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `freelancer_id` INT UNSIGNED NOT NULL,
  `cover_letter` TEXT NOT NULL,
  `proposed_price` DECIMAL(12,2) NOT NULL,
  `delivery_days` INT UNSIGNED NOT NULL,
  `milestones_json` JSON DEFAULT NULL,
  `relevant_experience` TEXT DEFAULT NULL,
  `portfolio_refs` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'shortlisted', 'accepted', 'rejected') DEFAULT 'pending',
  `ai_match_score` DECIMAL(5,2) DEFAULT 88.00,
  `ai_match_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_project_freelancer` (`project_id`, `freelancer_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. MILESTONES TABLE
CREATE TABLE IF NOT EXISTS `milestones` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(190) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `deadline` DATE NOT NULL,
  `status` ENUM('pending', 'funded_escrow', 'in_progress', 'submitted', 'approved', 'released') DEFAULT 'pending',
  `order_index` INT UNSIGNED DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. DELIVERABLES TABLE
CREATE TABLE IF NOT EXISTS `deliverables` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `milestone_id` INT UNSIGNED DEFAULT NULL,
  `freelancer_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(190) NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `file_path` VARCHAR(255) DEFAULT NULL,
  `version` INT UNSIGNED DEFAULT 1,
  `status` ENUM('submitted', 'revision_requested', 'approved') DEFAULT 'submitted',
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`milestone_id`) REFERENCES `milestones`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. REVISIONS TABLE
CREATE TABLE IF NOT EXISTS `revisions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `deliverable_id` INT UNSIGNED NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `details` TEXT NOT NULL,
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('open', 'resolved') DEFAULT 'open',
  FOREIGN KEY (`deliverable_id`) REFERENCES `deliverables`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. ESCROW ACCOUNTS (Intelligent Escrow State Machine)
CREATE TABLE IF NOT EXISTS `escrow_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL UNIQUE,
  `customer_id` INT UNSIGNED NOT NULL,
  `freelancer_id` INT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `held_amount` DECIMAL(12,2) NOT NULL,
  `released_amount` DECIMAL(12,2) DEFAULT 0.00,
  `refunded_amount` DECIMAL(12,2) DEFAULT 0.00,
  `status` ENUM('pending_funding', 'funded_held', 'partially_released', 'fully_released', 'refund_pending', 'refunded', 'disputed') DEFAULT 'funded_held',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_escrow_status` (`status`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. ESCROW TRANSACTIONS (Audited Transaction Ledger)
CREATE TABLE IF NOT EXISTS `escrow_transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `escrow_id` INT UNSIGNED NOT NULL,
  `type` ENUM('fund', 'release', 'refund', 'fee_deduction') NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('success', 'pending', 'failed') DEFAULT 'success',
  `reference_id` VARCHAR(100) NOT NULL,
  `notes` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`escrow_id`) REFERENCES `escrow_accounts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. PAYMENTS TABLE (Simulated Payment Mode for Demo & Future Gateway)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `customer_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_method` ENUM('demo_escrow', 'stripe_sandbox', 'razorpay_sandbox', 'bank_transfer') DEFAULT 'demo_escrow',
  `payment_status` ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'completed',
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. REFUNDS TABLE
CREATE TABLE IF NOT EXISTS `refunds` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `escrow_id` INT UNSIGNED NOT NULL,
  `project_id` INT UNSIGNED NOT NULL,
  `requested_by` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `approved_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`escrow_id`) REFERENCES `escrow_accounts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`requested_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 18. WALLETS TABLE
CREATE TABLE IF NOT EXISTS `wallets` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `balance` DECIMAL(12,2) DEFAULT 0.00,
  `pending_balance` DECIMAL(12,2) DEFAULT 0.00,
  `total_withdrawn` DECIMAL(12,2) DEFAULT 0.00,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `reviewer_id` INT UNSIGNED NOT NULL,
  `reviewee_id` INT UNSIGNED NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL,
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 20. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `sender_id` INT UNSIGNED NOT NULL,
  `recipient_id` INT UNSIGNED NOT NULL,
  `message_text` TEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 21. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('proposal', 'escrow', 'milestone', 'deliverable', 'revision', 'payment', 'dispute', 'system') NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notif_user` (`user_id`, `is_read`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 22. AI TRUST SCORES (Verifiable Math Model)
CREATE TABLE IF NOT EXISTS `ai_scores` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `freelancer_id` INT UNSIGNED NOT NULL UNIQUE,
  `total_score` DECIMAL(5,2) NOT NULL DEFAULT 85.00,
  `tier_level` ENUM('Elite', 'Highly Trusted', 'Trusted', 'Good', 'Average', 'Needs Improvement') DEFAULT 'Trusted',
  `completion_factor` DECIMAL(5,2) DEFAULT 95.00,
  `on_time_factor` DECIMAL(5,2) DEFAULT 98.00,
  `rating_factor` DECIMAL(5,2) DEFAULT 96.00,
  `response_factor` DECIMAL(5,2) DEFAULT 90.00,
  `repeat_client_factor` DECIMAL(5,2) DEFAULT 80.00,
  `dispute_penalty` DECIMAL(5,2) DEFAULT 0.00,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 23. AI SCORE HISTORY TABLE
CREATE TABLE IF NOT EXISTS `ai_score_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `freelancer_id` INT UNSIGNED NOT NULL,
  `score` DECIMAL(5,2) NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `recorded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`freelancer_id`) REFERENCES `freelancers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 24. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS `disputes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT UNSIGNED NOT NULL,
  `raised_by` INT UNSIGNED NOT NULL,
  `reason` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `evidence_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('OPEN', 'UNDER_REVIEW', 'WAITING_FOR_CUSTOMER', 'WAITING_FOR_FREELANCER', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
  `ai_summary` TEXT DEFAULT NULL,
  `resolution_notes` TEXT DEFAULT NULL,
  `resolved_by` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`raised_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 25. RISK ALERTS TABLE (AI Fraud & Compliance Engine)
CREATE TABLE IF NOT EXISTS `risk_alerts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `project_id` INT UNSIGNED DEFAULT NULL,
  `risk_level` ENUM('Low Risk', 'Medium Risk', 'High Risk') DEFAULT 'Low Risk',
  `reason` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'dismissed', 'investigating') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 26. ACTIVITY LOGS (Immutable Platform Audit Trail)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity` VARCHAR(60) NOT NULL,
  `entity_id` INT UNSIGNED NOT NULL,
  `metadata` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_activity_entity` (`entity`, `entity_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;
