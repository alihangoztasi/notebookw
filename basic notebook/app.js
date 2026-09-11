/**
 * ============================================================================
 * JAVASCRIPT MANTIĞI (app.js)
 * ============================================================================
 * JavaScript burada "Garson" rolündedir:
 * 1. Kullanıcı butona bastığında formdaki veriyi alır.
 * 2. `fetch()` fonksiyonu ile PHP'ye (mutfağa) iletir.
 * 3. PHP'den gelen cevaba göre sayfayı yenilemeden ekranı günceller.
 */

// 1. HTML'deki Elemanları Seçiyoruz
const noteForm = document.getElementById('noteForm');
const noteIdInput = document.getElementById('noteId');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const notesList = document.getElementById('notesList');
const noteCount = document.getElementById('noteCount');

// ============================================================================
// [R] - READ (NOTLARI GETİR VE EKRANA ÇİZ)
// ============================================================================
async function notlariGetir() {
  try {
    // 1. PHP'ye GET isteği atıyoruz
    const response = await fetch('api.php');
    const notlar = await response.json();

    // Not sayısını güncelle
    noteCount.textContent = notlar.length;

    // Eğer hiç not yoksa bilgilendirme metni göster
    if (notlar.length === 0) {
      notesList.innerHTML = '<p style="color: #888;">Henüz eklenmiş bir not yok.</p>';
      return;
    }

    // 2. Notları ekrana HTML olarak yazıyoruz
    notesList.innerHTML = notlar.map(not => `
      <div class="note-item">
        <div>
          <h3>${not.title}</h3>
          <p>${not.content}</p>
        </div>
        <div class="note-actions">
          <!-- Düzenle ve Sil butonları -->
          <button class="btn btn-secondary btn-sm" onclick="notuDuzenlemeModunaAl('${not.id}', '${escapeAttr(not.title)}', '${escapeAttr(not.content)}')">Düzenle</button>
          <button class="btn btn-danger btn-sm" onclick="notSil('${not.id}')">Sil</button>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Notlar getirilirken hata oluştu:', error);
  }
}

// ============================================================================
// [C] CREATE & [U] UPDATE (NOT KAYDET VEYA GÜNCELLE)
// ============================================================================
noteForm.addEventListener('submit', async (e) => {
  // e.preventDefault(): Form gönderildiğinde sayfanın YENİLENMESİNİ ENGELLER!
  e.preventDefault();

  const id = noteIdInput.value; // Eğer varsa güncelleme modundayız
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // Gönderilecek veri paketi
  const veri = { title, content };

  if (id) {
    // ID varsa: [U] GÜNCELLEME (PUT isteği)
    veri.id = id;
    await fetch('api.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veri) // Nesneyi metne çevirip gönderiyoruz
    });
  } else {
    // ID yoksa: [C] YENİ EKLEME (POST isteği)
    await fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veri)
    });
  }

  // Formu eski haline getir ve listeyi tazele
  formuSifirla();
  notlariGetir();
});

// ============================================================================
// [D] - DELETE (NOTU SİL)
// ============================================================================
async function notSil(id) {
  const onay = confirm('Bu notu silmek istediğinize emin misiniz?');
  if (!onay) return;

  // PHP'ye DELETE isteği atıyoruz (?id=123 şeklinde)
  await fetch(`api.php?id=${id}`, {
    method: 'DELETE'
  });

  // Ekrandaki listeyi güncelle
  notlariGetir();
}

// ============================================================================
// DÜZENLEME MODU VE FORMU SIFIRLAMA
// ============================================================================
function notuDuzenlemeModunaAl(id, title, content) {
  // Seçilen notun bilgilerini forma doldur
  noteIdInput.value = id;
  titleInput.value = title;
  contentInput.value = content;

  // Başlığı ve butonu "Güncelle" olarak değiştir
  formTitle.textContent = 'Notu Düzenle';
  submitBtn.textContent = 'Güncellemeyi Kaydet';
  cancelBtn.style.display = 'inline-block'; // Vazgeç butonunu göster

  // Sayfayı forma doğru kaydır ve başlık kutusuna odaklan
  titleInput.focus();
}

function formuSifirla() {
  noteForm.reset();
  noteIdInput.value = '';
  formTitle.textContent = 'Yeni Not Ekle';
  submitBtn.textContent = 'Notu Kaydet';
  cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', formuSifirla);

// Tırnak işaretlerinin HTML butonlarında kırılmasını önleyen yardımcı fonksiyon
function escapeAttr(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Sayfa ilk yüklendiğinde notları getir
document.addEventListener('DOMContentLoaded', notlariGetir);
