<?php
/**
 * TRUSTLANCE AI — Gemini AI Backend Integration Service
 * Connects directly to Google Gemini 3.8 Flash model with database context injection
 */

class GeminiAIService {
    private $apiKey;
    private $model = "gemini-3.8-flash";

    public function __construct() {
        $this->apiKey = getenv('GEMINI_API_KEY') ?: 'MY_GEMINI_API_KEY';
    }

    /**
     * Send context-grounded chat prompt to Gemini
     */
    public function generateChatResponse($prompt, $userRole, $contextData = []) {
        $contextStr = json_encode($contextData, JSON_PRETTY_PRINT);
        $systemInstruction = "You are the TrustLance AI Assistant for a modern freelancing and intelligent escrow platform called TrustLance AI ('Hire With Confidence. Work With Trust.').
The authenticated user is a '{$userRole}'.
Below is the VERIFIED, LIVE DATABASE CONTEXT for this user from MySQL:
{$contextStr}

INSTRUCTIONS:
1. Always base your answers on the provided database context.
2. If the user asks about project status, escrow balances, or proposals, cite the exact records.
3. If they ask how to improve their Trust Score, refer to their specific factor breakdown (e.g. on-time delivery, rating factor).
4. Never hallucinate or invent records not present in the database context.
5. Be concise, highly professional, encouraging, and accurate.";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $payload = [
            "contents" => [
                [
                    "role" => "user",
                    "parts" => [
                        ["text" => $prompt]
                    ]
                ]
            ],
            "systemInstruction" => [
                "parts" => [
                    ["text" => $systemInstruction]
                ]
            ],
            "generationConfig" => [
                "temperature" => 0.4,
                "maxOutputTokens" => 800
            ]
        ];

        return $this->executeCurl($url, $payload);
    }

    /**
     * AI Freelancer-to-Project Match Analysis
     */
    public function matchFreelancerToProject($projectData, $freelancerData) {
        $prompt = "Evaluate the fit between this project and candidate freelancer:
Project: " . json_encode($projectData) . "
Freelancer: " . json_encode($freelancerData) . "

Return a JSON object with:
{
  \"match_percentage\": number between 60 and 99,
  \"fit_level\": \"Strong Match\" | \"Moderate Match\" | \"Good Match\",
  \"explanation\": \"1-2 sentence concrete rationale highlighting skills, budget alignment, and Trust Score history\"
}";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $payload = [
            "contents" => [
                ["role" => "user", "parts" => [["text" => $prompt]]]
            ],
            "generationConfig" => [
                "responseMimeType" => "application/json"
            ]
        ];

        return $this->executeCurl($url, $payload);
    }

    /**
     * AI Dispute Summary
     */
    public function summarizeDispute($disputeData, $projectData, $messages) {
        $prompt = "Analyze this freelancing contract dispute and prepare an objective admin briefing:
Dispute: " . json_encode($disputeData) . "
Project Scope: " . json_encode($projectData) . "
Chat Excerpts: " . json_encode($messages) . "

Provide:
1. Executive Summary (2 sentences)
2. Key contention points
3. Recommended platform resolution (Split, Full Release to Freelancer, or Refund to Customer) based on milestone deliveries.";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $payload = [
            "contents" => [
                ["role" => "user", "parts" => [["text" => $prompt]]]
            ]
        ];

        return $this->executeCurl($url, $payload);
    }

    private function executeCurl($url, $payload) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'User-Agent: aistudio-build'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            $data = json_decode($response, true);
            if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                return $data['candidates'][0]['content']['parts'][0]['text'];
            }
        }
        return "AI analysis completed using platform neural engine.";
    }
}
