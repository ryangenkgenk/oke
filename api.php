<?php
require_once 'config.php';
header('Content-Type: application/json');

function handleError($e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    die();
}

try {
    $action = $_GET['action'] ?? '';

    switch($action) {
        case 'create':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO books (title, author, year, price, stock) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$data['title'], $data['author'], $data['year'], $data['price'], $data['stock']]);
            echo json_encode(['message' => 'Book added successfully', 'id' => $pdo->lastInsertId()]);
            break;

        case 'read':
            $search = $_GET['search'] ?? '';
            $stmt = $pdo->prepare("SELECT * FROM books WHERE title LIKE ? OR author LIKE ?");
            $searchTerm = "%$search%";
            $stmt->execute([$searchTerm, $searchTerm]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            break;

        case 'update':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE books SET title=?, author=?, year=?, price=?, stock=? WHERE id=?");
            $stmt->execute([$data['title'], $data['author'], $data['year'], $data['price'], $data['stock'], $data['id']]);
            echo json_encode(['message' => 'Book updated successfully']);
            break;

        case 'delete':
            $id = $_GET['id'] ?? '';
            $stmt = $pdo->prepare("DELETE FROM books WHERE id=?");
            $stmt->execute([$id]);
            echo json_encode(['message' => 'Book deleted successfully']);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch(PDOException $e) {
    handleError($e);
}
?>


