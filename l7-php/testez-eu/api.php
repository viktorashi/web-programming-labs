<?php
session_start();
header('Content-Type: application/json');
require 'db.php';
require 'env.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$data = json_decode(file_get_contents('php://input'), true);

// lmaooo
// define('ADMIN_PASSWORD', 'smeker123');
// $dotenv = Dotenv::createImmutable(__DIR__);
// $dotenv->load();

loadEnv();
$ADMIN_PASSWORD = getenv("ADMIN_PASSWORD");
error_log("admin pass: " . $ADMIN_PASSWORD);


function is_admin()
{
    return isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
}

switch (true) {
    case $action === 'login' && $method === 'POST':
        error_log("dam loginn");
        error_log("No da oareee o fi bun ? :");
        error_log("data: " . json_encode($data));
        // error_log(
        //     "password corect: " . $data['password'] . " == " . $ADMIN_PASSWORD . "?"
        // );

        if (($data['password'] ?? '') === $ADMIN_PASSWORD) {
            $_SESSION['is_admin'] = true;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
        break;

    case $action === 'logout' && $method === 'POST':
        error_log("dam logoutt");
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case $action === 'list' && $method === 'POST':
        error_log("dam list");
        error_log("data: " . json_encode($data));

        $offset = intval($data['offset'] ?? 0);
        $filters = $data['filters'] ?? [];

        $where = [];
        $params = [];

        // TODO n-o sa mearga ambele in acelasi timp prolly
        if (!empty($filters['author_email'])) {
            $where[] = 'author_email LIKE ?';
            $params[] = '%' . $filters['author_email'] . '%';
        }
        if (!empty($filters['title'])) {
            $where[] = 'title LIKE ?';
            $params[] = '%' . $filters['title'] . '%';
        }

        $whereClause = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM entries $whereClause");
        $stmt->execute($params);
        $no_entries = $stmt->fetchColumn();

        if ($offset >= $no_entries) {
            http_response_code(400);
            echo json_encode(['message' => 'No more entries']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM entries $whereClause ORDER BY date DESC LIMIT 4 OFFSET $offset");
        $stmt->execute($params);
        $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'entries' => $entries,
            'total' => $no_entries
        ]);

        break;

    case $action === 'insert' && $method === 'POST':
        error_log("dam insert");
        error_log("data: " . json_encode($data));

        $stmt = $pdo->prepare("INSERT INTO entries (author_email, title, comment) VALUES (?, ?, ?)");
        $stmt->execute([
            filter_var($data['author_email'], FILTER_VALIDATE_EMAIL),
            htmlspecialchars($data['title']),
            htmlspecialchars($data['comment'])
        ]);
        echo json_encode(['success' => true]);
        break;

    case $action === 'update' && $method === 'PUT':
        error_log("dam update");
        error_log("data: " . json_encode($data));

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

    case $action === 'delete' && $method === 'DELETE':
        error_log("dam delete");
        error_log("data: " . json_encode($data));


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
        error_log("Nu-i buna ba actiunea asta:");
        error_log($action);

        http_response_code(405);
        echo json_encode(['error' => 'nuj ce-ai incercat sa faci acl da nu recunosc actiunea: ' . $action . ' cu metoda / verbu : ' . $method]);
}
