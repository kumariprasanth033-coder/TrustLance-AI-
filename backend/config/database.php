<?php
/**
 * TRUSTLANCE AI — Database Configuration
 * High-performance PDO connection with UTF8mb4 and strict error mode
 */

class Database {
    private $host = "127.0.0.1";
    private $db_name = "trustlance_ai";
    private $username = "root";
    private $password = "";
    private $charset = "utf8mb4";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Database connection failure: " . $exception->getMessage()
            ]);
            exit;
        }
        return $this->conn;
    }
}
