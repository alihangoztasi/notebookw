<?php
header('Content-Type: application/json; charset=UTF-8');

$dosya = __DIR__ . '/notes.json';

if (!file_exists($dosya)) {
    file_put_contents($dosya, '[]');
}

$notlar = json_decode(file_get_contents($dosya), true) ?? [];$metot = $_SERVER['REQUEST_METHOD'];$gelenVeri = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($metot) {
    case 'GET':
        echo json_encode($notlar, JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $yeniNot = [
            'id' => uniqid(),
            'title' => htmlspecialchars($gelenVeri['title'] ?? ''),
            'content' => htmlspecialchars($gelenVeri['content'] ?? '')
        ];
        
        array_unshift($notlar, $yeniNot);
        file_put_contents($dosya, json_encode($notlar, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode($yeniNot, JSON_UNESCAPED_UNICODE);
        break;

    case 'PUT':
        $id =$gelenVeri['id'] ?? '';

        foreach ($notlar as &$not) {
            if ($not['id'] === $id) {
                $not['title'] = htmlspecialchars($gelenVeri['title'] ?? '');
                $not['content'] = htmlspecialchars($gelenVeri['content'] ?? '');
                break;
            }
        }

        file_put_contents($dosya, json_encode($notlar, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id =$_GET['id'] ?? '';

        $notlar = array_values(array_filter($notlar, function($not) use ($id) {
            return $not['id'] !== $id;
        }));

        file_put_contents($dosya, json_encode($notlar, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['hata' => 'Geçersiz istek metodu']);
        break;
}