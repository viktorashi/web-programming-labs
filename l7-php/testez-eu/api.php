<?php
session_start();
header('Content-Type: application/json');
require 'db.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

// lmap
define('ADMIN_PASSWORD', 'admin123'); 

function is_admin() {
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

switch ($action) {
    case 'login':
        if (($data['password'] ?? '') === ADMIN_PASSWORD) {
            $_SESSION['is_admin'] = true;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case 'list':
        $offset = intval($data['offset'] ?? 0);
        $filters = $data['filters'] ?? [];

        $where = [];
        $params = [];

        if (!empty($filters['author_email'])) {
            $where[] = 'author_email LIKE ?';
            $params[] = '%' . $filters['author_email'] . '%';
        }
        if (!empty($filters['title'])) {
            $where[] = 'title LIKE ?';
            $params[] = '%' . $filters['title'] . '%';
        }

        $whereClause = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
        $stmt = $pdo->prepare("SELECT * FROM entries $whereClause ORDER BY date DESC LIMIT 4 OFFSET $offset");
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'insert':
        $stmt = $pdo->prepare("INSERT INTO entries (author_email, title, comment) VALUES (?, ?, ?)");
        $stmt->execute([
            filter_var($data['author_email'], FILTER_VALIDATE_EMAIL),
            htmlspecialchars($data['title']),
            htmlspecialchars($data['comment'])
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'update':
        if (!is_admin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $stmt = $pdo->prepare("UPDATE entries SET title=?, comment=? WHERE id=?");
        $stmt->execute([
            htmlspecialchars($data['title']),
            htmlspecialchars($data['comment']),
            intval($data['id'])
        ]);
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        if (!is_admin()) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $stmt = $pdo->prepare("DELETE FROM entries WHERE id = ?");
        $stmt->execute([intval($data['id'])]);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}
?>
