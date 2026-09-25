<?php
/**
 * TRUSTLANCE AI — Escrow Transaction & State Engine
 * Enforces transactional ACID guarantees for project funds
 */

require_once __DIR__ . '/../config/database.php';

class EscrowService {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    /**
     * Fund Escrow for a Project
     */
    public function fundEscrow($projectId, $customerId, $amount, $paymentMethod = 'demo_escrow') {
        $this->db->beginTransaction();
        try {
            // 1. Verify project exists and belongs to customer
            $projStmt = $this->db->prepare("SELECT id, selected_freelancer_id, status FROM projects WHERE id = :id AND customer_id = :cid");
            $projStmt->execute([':id' => $projectId, ':cid' => $customerId]);
            $project = $projStmt->fetch();

            if (!$project) {
                throw new Exception("Project not found or not owned by customer.");
            }
            if (!$project['selected_freelancer_id']) {
                throw new Exception("Cannot fund escrow before hiring an approved freelancer.");
            }

            $freelancerId = $project['selected_freelancer_id'];

            // 2. Insert or update escrow account
            $escStmt = $this->db->prepare("
                INSERT INTO escrow_accounts (project_id, customer_id, freelancer_id, total_amount, held_amount, status)
                VALUES (:pid, :cid, :fid, :amt, :amt, 'funded_held')
                ON DUPLICATE KEY UPDATE 
                    held_amount = held_amount + :amt_dup,
                    total_amount = total_amount + :amt_dup,
                    status = 'funded_held'
            ");
            $escStmt->execute([
                ':pid' => $projectId,
                ':cid' => $customerId,
                ':fid' => $freelancerId,
                ':amt' => $amount,
                ':amt_dup' => $amount
            ]);

            $escrowId = $this->db->lastInsertId();
            if (!$escrowId) {
                $chk = $this->db->prepare("SELECT id FROM escrow_accounts WHERE project_id = :pid");
                $chk->execute([':pid' => $projectId]);
                $escrowId = $chk->fetchColumn();
            }

            // 3. Log escrow transaction
            $refId = 'TX-ESCROW-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            $txStmt = $this->db->prepare("
                INSERT INTO escrow_transactions (escrow_id, type, amount, status, reference_id, notes)
                VALUES (:eid, 'fund', :amt, 'success', :ref, 'Customer funded project escrow vault')
            ");
            $txStmt->execute([':eid' => $escrowId, ':amt' => $amount, ':ref' => $refId]);

            // 4. Record payment record
            $payStmt = $this->db->prepare("
                INSERT INTO payments (project_id, customer_id, amount, payment_method, payment_status, transaction_ref)
                VALUES (:pid, :cid, :amt, :pm, 'completed', :ref)
            ");
            $payStmt->execute([
                ':pid' => $projectId,
                ':cid' => $customerId,
                ':amt' => $amount,
                ':pm' => $paymentMethod,
                ':ref' => $refId
            ]);

            // 5. Update project status to in_progress
            $updProj = $this->db->prepare("UPDATE projects SET status = 'in_progress' WHERE id = :id");
            $updProj->execute([':id' => $projectId]);

            // 6. Notify Freelancer
            $notifStmt = $this->db->prepare("
                INSERT INTO notifications (user_id, title, message, type, link)
                SELECT u.id, 'Escrow Payment Secured', CONCAT('Payment of $', :amt, ' is secured in TrustLance Escrow. You can start work.'), 'escrow', CONCAT('/freelancer/projects/', :pid)
                FROM freelancers f
                JOIN users u ON f.user_id = u.id
                WHERE f.id = :fid
            ");
            $notifStmt->execute([':amt' => number_format($amount, 2), ':pid' => $projectId, ':fid' => $freelancerId]);

            // 7. Audit log
            $audit = $this->db->prepare("INSERT INTO activity_logs (user_id, action, entity, entity_id, metadata) VALUES (:uid, 'FUND_ESCROW', 'escrow_accounts', :eid, :meta)");
            $audit->execute([
                ':uid' => $customerId,
                ':eid' => $escrowId,
                ':meta' => json_encode(['amount' => $amount, 'project_id' => $projectId, 'tx' => $refId])
            ]);

            $this->db->commit();
            return [
                "success" => true,
                "escrow_id" => $escrowId,
                "transaction_ref" => $refId,
                "status" => "funded_held",
                "message" => "Escrow successfully funded. Funds secured in TrustLance AI Vault."
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Release Escrow Tranche / Milestone Payment
     */
    public function releaseEscrow($projectId, $customerId, $amount, $milestoneId = null) {
        $this->db->beginTransaction();
        try {
            $escStmt = $this->db->prepare("SELECT * FROM escrow_accounts WHERE project_id = :pid AND customer_id = :cid FOR UPDATE");
            $escStmt->execute([':pid' => $projectId, ':cid' => $customerId]);
            $escrow = $escStmt->fetch();

            if (!$escrow) {
                throw new Exception("Escrow account not found for this project.");
            }
            if ($escrow['held_amount'] < $amount) {
                throw new Exception("Insufficient escrow held amount to release ($" . $escrow['held_amount'] . " available).");
            }

            $newHeld = $escrow['held_amount'] - $amount;
            $newReleased = $escrow['released_amount'] + $amount;
            $newStatus = ($newHeld <= 0) ? 'fully_released' : 'partially_released';

            $updEsc = $this->db->prepare("
                UPDATE escrow_accounts 
                SET held_amount = :held, released_amount = :rel, status = :st
                WHERE id = :id
            ");
            $updEsc->execute([':held' => $newHeld, ':rel' => $newReleased, ':st' => $newStatus, ':id' => $escrow['id']]);

            // Credit Freelancer Wallet
            $walStmt = $this->db->prepare("
                INSERT INTO wallets (user_id, balance, pending_balance)
                SELECT u.id, :amt, 0
                FROM freelancers f
                JOIN users u ON f.user_id = u.id
                WHERE f.id = :fid
                ON DUPLICATE KEY UPDATE balance = balance + :amt_dup
            ");
            $walStmt->execute([':amt' => $amount, ':fid' => $escrow['freelancer_id'], ':amt_dup' => $amount]);

            // Log Transaction
            $refId = 'TX-REL-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            $txStmt = $this->db->prepare("
                INSERT INTO escrow_transactions (escrow_id, type, amount, status, reference_id, notes)
                VALUES (:eid, 'release', :amt, 'success', :ref, 'Tranche released to freelancer after customer approval')
            ");
            $txStmt->execute([':eid' => $escrow['id'], ':amt' => $amount, ':ref' => $refId]);

            if ($milestoneId) {
                $mUpd = $this->db->prepare("UPDATE milestones SET status = 'released' WHERE id = :mid AND project_id = :pid");
                $mUpd->execute([':mid' => $milestoneId, ':pid' => $projectId]);
            }

            // Check if fully released, mark project completed
            if ($newStatus === 'fully_released') {
                $pUpd = $this->db->prepare("UPDATE projects SET status = 'completed' WHERE id = :pid");
                $pUpd->execute([':pid' => $projectId]);
            }

            $this->db->commit();
            return [
                "success" => true,
                "status" => $newStatus,
                "released_amount" => $amount,
                "remaining_held" => $newHeld,
                "reference_id" => $refId
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
