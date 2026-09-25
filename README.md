# TRUSTLANCE AI
### "Hire With Confidence. Work With Trust."

TrustLance AI is a production-grade full-stack freelancing and intelligent escrow platform combining verifiable talent metrics, algorithmic AI Trust Scores, transactional project escrow workflows, and deep Gemini AI intelligence.

---

## 🌟 Architectural Overview

```
                      React.js + Bootstrap 5 + Tailwind CSS + Axios
                                           │
                                           ▼ (RESTful JSON APIs)
                              PHP 8.2+ RESTful Backend
                     (PDO Prepared Statements, Session / Bearer Auth)
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
         MySQL 8.0+ Relational DB    Google Gemini AI       Escrow State Engine
           (ACID Ledger, FKs)       (Context Grounded)     (Simulated / Gateways)
```

---

## 📋 Key Platform Modules

1. **Role-Based Access Control (RBAC)**:
   - **Customer Portal**: Post projects, compare freelancer AI Match scores, fund escrow, approve deliverables, release tranches, request revisions, and review.
   - **Freelancer Portal**: Browse jobs, view real-time AI Match compatibility, submit proposals, track secured escrow milestones, upload deliverables, and analyze Trust Score factors.
   - **Administrative Command Center**: Platform telemetry, dispute resolution, financial ledger auditing, risk alert monitoring, and service management.

2. **Verifiable AI Trust Score (0–100)**:
   - Real mathematical model based on completion rate (25%), client ratings (30%), on-time delivery (20%), response latency (15%), repeat client retention (10%), and dispute penalties.
   - Strict tiering:
     - `98–100`: **Elite**
     - `90–97`: **Highly Trusted**
     - `80–89`: **Trusted**
     - `70–79`: **Good**
     - `60–69`: **Average**
     - `< 60`: **Needs Improvement**

3. **Intelligent Escrow State Machine**:
   - `pending_funding` → `funded_held` (Payment Secured) → `partially_released` → `fully_released` (or `disputed` / `refunded`).
   - Every movement is audited in `escrow_transactions` with cryptographic reference IDs (`TX-ESCROW-YYYYMMDD-XXXXXX`).

4. **Context-Grounded Gemini AI Assistant**:
   - Secure backend proxy (`/api/ai/chat.php`) communicating with `gemini-3.8-flash`.
   - Never exposes API keys on the frontend.
   - Grounded directly in live MySQL database records (retrieves active milestones, held escrow, or dispute records before generating responses).

---

## 🔑 Demo Development Accounts

| Role | Email | Password | Trust Score / Access |
|---|---|---|---|
| **Customer** | `customer@demo.com` | `TrustLance2026!` | 96.50 Customer Trust |
| **Freelancer** | `freelancer@demo.com` | `TrustLance2026!` | 99.20 (Elite Tier) |
| **Admin** | `admin@demo.com` | `TrustLance2026!` | Super Admin Access |

---

## 🚀 Local XAMPP Setup Guide (Apache + PHP + MySQL)

### Step 1: Clone or Copy Repository to XAMPP
Copy the project folder into your XAMPP web root directory:
- **Windows**: `C:\xampp\htdocs\TrustLance-AI`
- **macOS (XAMPP-VM)**: `/Applications/XAMPP/xamppfiles/htdocs/TrustLance-AI`
- **Linux**: `/opt/lampp/htdocs/TrustLance-AI`

### Step 2: Start XAMPP Services
Open the XAMPP Control Panel and start:
1. **Apache** (Port 80/443)
2. **MySQL** (Port 3306)

### Step 3: Import Database Schema & Seed Data
Open phpMyAdmin at `http://localhost/phpmyadmin` or use the MySQL CLI:
```bash
# Using Terminal / Command Prompt:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
This creates the `trustlance_ai` database with all 26 relational tables and initial 20 services.

### Step 4: Configure PHP Database & Gemini Credentials
Check `/backend/config/database.php` (defaults to `127.0.0.1`, user `root`, no password).
In your `.env` or Apache environment, set:
```ini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Step 5: Start the React Frontend
In a separate terminal inside the project directory:
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🛡️ Security Implementation
- **Prepared Statements**: All database queries use PDO prepared statements with bounded parameters (`:param`).
- **Cryptographic Password Hashing**: Passwords stored via PHP `password_hash()` and verified via `password_verify()`.
- **Role Verification**: Auth middleware verifies role boundaries before executing privileged actions.
- **ACID Transactions**: Escrow funding and releasing execute inside `beginTransaction()` / `commit()` / `rollBack()`.
