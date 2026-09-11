# 📝 Basit Not Defteri (Junior Mantık Rehberi)

Bu proje; **PHP, JavaScript ve CSS** üçlüsünün bir web uygulamasında nasıl birlikte çalıştığını **en sade ve dolaysız** şekilde kavramanız için tasarlanmıştır.

Tüm süslü kodlar, karmaşık modal pencereleri ve binlerce satırlık stiller elenmiş; yalnızca mantığı anlamanız için gereken **saf ve temiz** kodlar bırakılmıştır.

---

## 🍽️ Büyük Resim: "Restoran Analojisi"

Web geliştirmeyi anlamanın en kolay yolu bir restoranı hayal etmektir:

| Teknoloji | Restorandaki Rolü | Bu Projede Ne Yapıyor? |
| :--- | :--- | :--- |
| **HTML** | **Masa ve Tabaklar** | Not defterinin başlığını, formunu, input kutularını ve butonlarını koyar. |
| **CSS** | **Restoranın Dekorasyonu** | Renkleri, boşlukları, kutu kenarlıklarını ve kartların yan yana dizilmesini sağlar. |
| **JavaScript** | **Garson** | Müşterinin (kullanıcının) girdiği notu masadan alır, sayfayı hiç kapatmadan/yenilemeden mutfağa (PHP) taşır ve gelen cevabı masaya servis eder. |
| **PHP** | **Aşçı / Mutfak** | Garsonun getirdiği siparişi dinler. Notu `notes.json` kilerine yazar, oradan okur, günceller veya çöpe atar. Sonucu temiz bir paket (JSON) olarak garsona verir. |

---

## 🔄 CRUD Nedir? (4 Temel Operasyon)

Web dünyasındaki hemen her uygulama bu 4 işlemi yapar:

1. **[C] Create (Oluştur):**
   - **Kullanıcı:** Başlık ve içerik yazıp "Kaydet"e basar.
   - **JS:** `fetch('api.php', { method: 'POST', body: ... })` isteği atar.
   - **PHP:** Gelen veriyi alır, `notes.json` dizisinin en başına ekler.

2. **[R] Read (Oku / Listele):**
   - **Sayfa Açılınca:** JS otomatik olarak `fetch('api.php')` ile GET isteği atar.
   - **PHP:** `notes.json` dosyasındaki tüm notları JSON formatında gönderir.
   - **JS:** Gelen listeyi döngüyle (`.map()`) ekrana HTML kartları olarak çizer.

3. **[U] Update (Güncelle):**
   - **Kullanıcı:** Bir notun yanındaki "Düzenle" butonuna basar.
   - **JS:** O notun başlığını ve içeriğini form kutularına doldurur. Buton "Güncelle" olur.
   - **Kullanıcı:** Değiştirip basınca JS `PUT` isteği gönderir, PHP dosyayı günceller.

4. **[D] Delete (Sil):**
   - **Kullanıcı:** "Sil" butonuna basar.
   - **JS:** `fetch('api.php?id=...', { method: 'DELETE' })` isteği atar.
   - **PHP:** O ID'ye sahip notu listeden silip dosyayı kaydeder.

---

## 🚀 Projeyi Çalıştırma

Terminalinizi açın ve şu iki komutu yazın:

```powershell
cd C:\Users\aliha\.gemini\antigravity-ide\scratch\mini-not-defteri
php -S localhost:8000
```

Tarayıcınızı açın: 👉 `http://localhost:8000`

---

## 📂 Dosyalar (Toplam ~250 satır!)

- [index.html](file:///C:/Users/aliha/.gemini/antigravity-ide/scratch/mini-not-defteri/index.html) (~45 satır): Sade form ve not listesi iskeleti.
- [style.css](file:///C:/Users/aliha/.gemini/antigravity-ide/scratch/mini-not-defteri/style.css) (~120 satır): CSS Grid, Flexbox ve temiz kart tasarımı.
- [app.js](file:///C:/Users/aliha/.gemini/antigravity-ide/scratch/mini-not-defteri/app.js) (~90 satır): `fetch()` ile `GET`, `POST`, `PUT`, `DELETE` işlemleri.
- [api.php](file:///C:/Users/aliha/.gemini/antigravity-ide/scratch/mini-not-defteri/api.php) (~70 satır): JSON dosyasını okuyan/yazan sade PHP backend.
- [notes.json](file:///C:/Users/aliha/.gemini/antigravity-ide/scratch/mini-not-defteri/notes.json): Verilerin saklandığı dosya.
