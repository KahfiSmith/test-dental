// Sample doctors per branch — ganti dengan data API nanti
const doctorsByBranch = {
  tusam: [
    'drg. Shella Indri Novianty, Sp. Ort',
    'drg. Andi Pratama',
    'drg. Maya Sari'
  ],
  sukun: [
    'drg. Rina Wulandari',
    'drg. Budi Santoso'
  ],
  tirto: [
    'drg. Farah Aulia',
    'drg. Dimas Wijaya',
    'drg. Shella Indri Novianty, Sp. Ort'
  ],
  kelud: [
    'drg. Hendra Kusuma',
    'drg. Lestari Putri'
  ],
  fatmawati: [
    'drg. Novi Anggraini',
    'drg. Reza Mahendra'
  ],
  haryono: [
    'drg. Siti Aminah',
    'drg. Yoga Prasetyo'
  ],
  ngaliyan: [
    'drg. Putri Melati',
    'drg. Andi Pratama'
  ],
  tlogosari: [
    'drg. Budi Santoso',
    'drg. Rina Wulandari'
  ],
  'pati-pratomo': [
    'drg. Eka Safitri',
    'drg. Fajar Nugroho'
  ],
  'pati-diponegoro': [
    'drg. Intan Permata',
    'drg. Hendra Kusuma'
  ]
};

const cabangEl = document.getElementById('cabang');
const tanggalEl = document.getElementById('tanggal');
const dokterEl = document.getElementById('dokter');
const dokterHint = document.getElementById('dokter-hint');
const form = document.getElementById('reservation-form');
const formMessage = document.getElementById('form-message');

if (tanggalEl) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  tanggalEl.min = `${yyyy}-${mm}-${dd}`;
}

function refreshDoctors() {
  if (!cabangEl || !tanggalEl || !dokterEl || !dokterHint) return;

  const branch = cabangEl.value;
  const date = tanggalEl.value;
  dokterEl.innerHTML = '<option value="" disabled selected>Pilih dokter</option>';

  if (!branch || !date) {
    dokterEl.disabled = true;
    dokterHint.textContent =
      'Pilih cabang klinik dan tanggal kedatangan terlebih dahulu untuk menampilkan daftar dokter.';
    return;
  }

  const list = doctorsByBranch[branch] || [];
  if (!list.length) {
    dokterEl.disabled = true;
    dokterHint.textContent = 'Belum ada dokter tersedia untuk cabang ini. Silakan pilih cabang lain.';
    return;
  }

  list.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    dokterEl.appendChild(opt);
  });
  dokterEl.disabled = false;
  dokterHint.textContent = 'Pilih dokter yang tersedia di cabang dan tanggal tersebut.';
}

if (cabangEl) cabangEl.addEventListener('change', refreshDoctors);
if (tanggalEl) tanggalEl.addEventListener('change', refreshDoctors);

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.classList.remove('hidden', 'text-rose-600', 'text-leaf-700');

    if (!form.checkValidity()) {
      form.reportValidity();
      formMessage.classList.add('text-rose-600');
      formMessage.textContent = 'Lengkapi field wajib bertanda * terlebih dahulu.';
      formMessage.classList.remove('hidden');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Reservasi submitted:', data);

    formMessage.classList.add('text-leaf-700');
    formMessage.textContent =
      'Reservasi berhasil dikirim. Tim kami akan menghubungi Anda untuk konfirmasi.';
    formMessage.classList.remove('hidden');
    form.reset();
    dokterEl.disabled = true;
    dokterEl.innerHTML = '<option value="" disabled selected>Pilih dokter</option>';
    dokterHint.textContent =
      'Pilih cabang klinik dan tanggal kedatangan terlebih dahulu untuk menampilkan daftar dokter.';
  });
}
