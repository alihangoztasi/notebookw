const noteForm = document.getElementById('noteForm');
const noteIdInput = document.getElementById('noteId');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const notesList = document.getElementById('notesList');
const noteCount = document.getElementById('noteCount');

async function notlariGetir() {
  try {
    const response = await fetch('api.php');
    const notlar = await response.json();

    noteCount.textContent = notlar.length;

    if (notlar.length === 0) {
      notesList.innerHTML = '<p style="color: #888;">Henüz eklenmiş bir not yok.</p>';
      return;
    }

    notesList.innerHTML = notlar.map(not => `
      <div class="note-item">
        <div>
          <h3>${not.title}</h3>
          <p>${not.content}</p>
        </div>
        <div class="note-actions">
          <button class="btn btn-secondary btn-sm" onclick="notuDuzenlemeModunaAl('${not.id}', '${escapeAttr(not.title)}', '${escapeAttr(not.content)}')">Düzenle</button>
          <button class="btn btn-danger btn-sm" onclick="notSil('${not.id}')">Sil</button>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Notlar getirilirken hata oluştu:', error);
  }
}

noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = noteIdInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  const veri = { title, content };

  if (id) {
    veri.id = id;
    await fetch('api.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veri)
    });
  } else {
    await fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veri)
    });
  }

  formuSifirla();
  notlariGetir();
});

async function notSil(id) {
  const onay = confirm('Bu notu silmek istediğinize emin misiniz?');
  if (!onay) return;

  await fetch(`api.php?id=${id}`, {
    method: 'DELETE'
  });

  notlariGetir();
}

function notuDuzenlemeModunaAl(id, title, content) {
  noteIdInput.value = id;
  titleInput.value = title;
  contentInput.value = content;

  formTitle.textContent = 'Notu Düzenle';
  submitBtn.textContent = 'Güncellemeyi Kaydet';
  cancelBtn.style.display = 'inline-block';

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

function escapeAttr(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', notlariGetir);