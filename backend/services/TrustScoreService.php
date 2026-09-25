<?php
/**
 * TRUSTLANCE AI — AI Trust Score Calculation Engine
 * Algorithmic, verifiable 0-100 score model grounded in platform activity
 */

require_once __DIR__ . '/../config/database.php';

class TrustScoreService {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function calculateScore($freelancerId) {
        $stmt = $this->db->prepare("
            SELECT 
                f.*,
                COALESCE(AVG(r.rating), 5.0) as avg_rating,
                COUNT(DISTINCT r.id) as total_reviews,
                COUNT(DISTINCT p.id) as total_projects,
                (SELECT COUNT(*) FROM disputes d JOIN projects pr ON d.project_id = pr.id WHERE pr.selected_freelancer_id = f.id) as dispute_count
            FROM freelancers f
            LEFT JOIN projects p ON p.selected_freelancer_id = f.id AND p.status = 'completed'
            LEFT JOIN reviews r ON r.reviewee_id = f.user_id
            WHERE f.id = :id
            GROUP BY f.id
        ");
        $stmt->execute([':id' => $freelancerId]);
        $data = $stmt->fetch();

        if (!$data) {
            return null;
        }

        // Component Math Weights:
        // 1. Completion Rate (25% weight)
        $completionFactor = min(100.0, max(0.0, (float)$data['on_time_delivery_rate']));

        // 2. Client Rating (30% weight) -> Rating out of 5 mapped to 100
        $ratingFactor = min(100.0, ((float)$data['avg_rating'] / 5.0) * 100.0);

        // 3. On-Time Delivery (20% weight)
        $onTimeFactor = (float)$data['on_time_delivery_rate'];

        // 4. Response Time (15% weight) -> Under 1hr = 100, 1-2hr = 95, etc.
        $resHours = (float)$data['response_time_hours'];
        $responseFactor = ($resHours <= 1.0) ? 100.0 : max(50.0, 100.0 - ($resHours * 10.0));

        // 5. Volume & Repeat Loyalty (10% weight)
        $volumeFactor = min(100.0, 60.0 + ((int)$data['completed_projects'] * 2.0));

        // 6. Dispute Penalty (Deduction of 10 points per open/lost dispute)
        $disputePenalty = (int)$data['dispute_count'] * 10.0;

        $rawScore = ($completionFactor * 0.25) +
                    ($ratingFactor * 0.30) +
                    ($onTimeFactor * 0.20) +
                    ($responseFactor * 0.15) +
                    ($volumeFactor * 0.10) -
                    $disputePenalty;

        $totalScore = round(min(100.0, max(0.0, $rawScore)), 2);

        // Determine Tier
        if ($totalScore >= 98.0) {
            $tier = 'Elite';
        } elseif ($totalScore >= 90.0) {
            $tier = 'Highly Trusted';
        } elseif ($totalScore >= 80.0) {
            $tier = 'Trusted';
        } elseif ($totalScore >= 70.0) {
            $tier = 'Good';
        } elseif ($totalScore >= 60.0) {
            $tier = 'Average';
        } else {
            $tier = 'Needs Improvement';
        }

        // Update database
        $upd = $this->db->prepare("
            INSERT INTO ai_scores (freelancer_id, total_score, tier_level, completion_factor, on_time_factor, rating_factor, response_factor, repeat_client_factor, dispute_penalty)
            VALUES (:fid, :score, :tier, :comp, :ontime, :rate, :resp, :vol, :disp)
            ON DUPLICATE KEY UPDATE 
                total_score = :score, tier_level = :tier, completion_factor = :comp,
                on_time_factor = :ontime, rating_factor = :rate, response_factor = :resp,
                repeat_client_factor = :vol, dispute_penalty = :disp
        ");
        $upd->execute([
            ':fid' => $freelancerId,
            ':score' => $totalScore,
            ':tier' => $tier,
            ':comp' => $completionFactor,
            ':ontime' => $onTimeFactor,
            ':rate' => $ratingFactor,
            ':resp' => $responseFactor,
            ':vol' => $volumeFactor,
            ':disp' => $disputePenalty
        ]);

        // Also sync to freelancers table
        $fUpd = $this->db->prepare("UPDATE freelancers SET trust_score = :ts WHERE id = :id");
        $fUpd->execute([':ts' => $totalScore, ':id' => $freelancerId]);

        // History entry
        $hist = $this->db->prepare("INSERT INTO ai_score_history (freelancer_id, score, reason) VALUES (:fid, :score, 'Automatic recalculation from verified platform metrics')");
        $hist->execute([':fid' => $freelancerId, ':score' => $totalScore]);

        return [
            "total_score" => $totalScore,
            "tier_level" => $tier,
            "breakdown" => [
                "completion_factor" => $completionFactor,
                "rating_factor" => $ratingFactor,
                "on_time_factor" => $onTimeFactor,
                "response_factor" => $responseFactor,
                "volume_factor" => $volumeFactor,
                "dispute_penalty" => $disputePenalty
            ]
        ];
    }
}
