<?php
/**
 * ============================================================================
 * PHP MANTIĞI (api.php)
 * ============================================================================
 * PHP burada "Aşçı / Mutfak" rolündedir:
 * 1. JavaScript'ten gelen isteği dinler (GET, POST, PUT, DELETE).
 * 2. notes.json dosyasından veriyi okur, günceller veya siler.
 * 3. Sonucu temiz bir JSON olarak JavaScript'e geri döner.
 */

// Tarayıcıya döneceğimiz verinin JSON formatında olduğunu söylüyoruz
header('Content-Type: application/json; charset=UTF-8');

// Notlarımızın saklanacağı dosya
$dosya = __DIR__ . '/notes.json';

// Eğer dosya henüz yoksa içine boş bir dizi [] yazarak oluşturalım
if (!file_exists($dosya)) {
    file_put_contents($dosya, '[]');
}

// Dosyadaki mevcut notları okuyup PHP dizisine (Array) dönüştürüyoruz
$notlar = json_decode(file_get_contents($dosya), true) ?? [];

// İstemcinin hangi HTTP metoduyla geldiğini öğreniyoruz
$metot = $_SERVER['REQUEST_METHOD'];

// JavaScript'ten POST veya PUT ile gönderilen JSON verisini karşılıyoruz
$gelenVeri = json_decode(file_get_contents('php://input'), true) ?? [];

// Metoda göre ilgili işlemi yapıyoruz (CRUD)
switch ($metot) {

    // [R] READ: Notları Listele
    case 'GET':
        echo json_encode($notlar, JSON_UNESCAPED_UNICODE);
        break;

    // [C] CREATE: Yeni Not Ekle
    case 'POST':
        $yeniNot = [
            'id' => uniqid(), // Benzersiz rastgele bir ID üretiyoruz
            'title' => htmlspecialchars($gelenVeri['title'] ?? ''),
            'content' => htmlspecialchars($gelenVeri['content'] ?? '')
        ];
        
        // Yeni notu dizinin en başına ekliyoruz
        array_unshift($notlar, $yeniNot);
        
        // Güncel listeyi notes.json dosyasına geri yazıyoruz
        file_put_contents($dosya, json_encode($notlar, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        // Yeni notu geri döndürüyoruz
        echo json_encode($yeniNot, JSON_UNESCAPED_UNICODE);
        break;

    // [U] UPDATE: Mevcut Notu Güncelle
    case 'PUT':
        $id = $gelenVeri['id'] ?? '';

        foreach ($notlar as &$not) {
            if ($not['id'] === $id) {
                $not['title'] = htmlspecialchars($gelenVeri['title'] ?? '');
                $not['content'] = htmlspecialchars($gelenVeri['content'] ?? '');
                break;
            }
        }

        // Güncellenmiş listeyi dosyaya kaydediyoruz
        file_put_contents($dosya, json_encode($notlar, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        break;

    // [D] DELETE: Notu Sil
    case 'DELETE':
        // URL'den gelen id parametresini alıyoruz: api.php?id=123
        $id = $_GET['id'] ?? '';

        // ID'si eşleşmeyen notları tutarak silinecek notu dışarıda bırakıyoruz
        $notlar = array_values(array_filter($notlar, function($not) use ($id) {
            return $not['id'] !== $id;
        }));

        // Yeni listeyi dosyaya kaydediyoruz
        file_put_contents($dosya, json_encode($notlar, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['hata' => 'Geçersiz istek metodu']);
        break;
}
