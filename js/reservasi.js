/**
 * Reservasi form — static doctors from seed + prefill dari halaman Dokter
 * Query: ?dokter=Nama&cabang=Tusam
 */

/** Nama cabang di data dokter → value select form */
const BRANCH_VALUE_BY_LABEL = {
  tusam: 'tusam',
  'tusam timur': 'tusam',
  sukun: 'sukun',
  'sukun raya': 'sukun',
  'tirto agung': 'tirto',
  tirto: 'tirto',
  kelud: 'kelud',
  'kelud raya': 'kelud',
  fatmawati: 'fatmawati',
  'mt haryono': 'haryono',
  'mt. haryono': 'haryono',
  haryono: 'haryono',
  ngaliyan: 'ngaliyan',
  tlogosari: 'tlogosari',
  joyo: 'joyo',
  puri: 'puri',
  'pati — pratomo': 'pati-pratomo',
  'pati pratomo': 'pati-pratomo',
  'pati — diponegoro': 'pati-diponegoro',
  'pati diponegoro': 'pati-diponegoro',
};

/** Value form → label cabang di seed (untuk cocokkan dokter) */
const BRANCH_LABELS_BY_VALUE = {
  tusam: ['Tusam', 'Tusam Timur'],
  sukun: ['Sukun', 'Sukun Raya'],
  tirto: ['Tirto Agung', 'Tirto'],
  kelud: ['Kelud', 'Kelud Raya'],
  fatmawati: ['Fatmawati'],
  haryono: ['MT Haryono', 'MT. Haryono'],
  ngaliyan: ['Ngaliyan'],
  tlogosari: ['Tlogosari'],
  joyo: ['Joyo'],
  puri: ['Puri'],
  'pati-pratomo': ['Pati — Pratomo', 'Pati Pratomo', 'Pratomo'],
  'pati-diponegoro': ['Pati — Diponegoro', 'Pati Diponegoro', 'Diponegoro'],
};

const seedDoctors =
  typeof DOCTORS_SEED !== 'undefined' && Array.isArray(DOCTORS_SEED) ? DOCTORS_SEED : [];

/** value cabang → daftar nama dokter */
function buildDoctorsByBranch() {
  /** @type {Record<string, string[]>} */
  const map = {};
  for (const value of Object.keys(BRANCH_LABELS_BY_VALUE)) map[value] = [];

  for (const doc of seedDoctors) {
    const name = (doc.name || '').trim();
    if (!name) continue;
    for (const branch of doc.branches || []) {
      const key = BRANCH_VALUE_BY_LABEL[String(branch).toLowerCase().trim()];
      if (!key) continue;
      if (!map[key].includes(name)) map[key].push(name);
    }
  }

  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => a.localeCompare(b, 'id'));
  }
  return map;
}

const doctorsByBranch = buildDoctorsByBranch();

const cabangEl = document.getElementById('cabang');
const tanggalEl = document.getElementById('tanggal');
const dokterEl = document.getElementById('dokter');
const dokterHint = document.getElementById('dokter-hint');
const form = document.getElementById('reservation-form');
const formMessage = document.getElementById('form-message');
const prefillBanner = document.getElementById('prefill-banner');

function todayISO() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

if (tanggalEl) {
  tanggalEl.min = todayISO();
}

function resolveBranchValue(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  // already a form value?
  if (BRANCH_LABELS_BY_VALUE[s]) return s;
  return BRANCH_VALUE_BY_LABEL[s.toLowerCase()] || '';
}

function refreshDoctors(selectedDoctorName) {
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

  if (selectedDoctorName) {
    const match = list.find(
      (n) => n.toLowerCase() === selectedDoctorName.toLowerCase()
    ) || list.find((n) => n.toLowerCase().includes(selectedDoctorName.toLowerCase())
      || selectedDoctorName.toLowerCase().includes(n.toLowerCase()));
    if (match) {
      dokterEl.value = match;
      dokterHint.textContent = `Dokter dipilih: ${match}`;
    }
  }
}

function applyPrefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const dokterParam = (params.get('dokter') || '').trim();
  const cabangParam = (params.get('cabang') || '').trim();
  if (!dokterParam && !cabangParam) return;

  const branchValue = resolveBranchValue(cabangParam);

  // Tanggal default hari ini supaya dropdown dokter bisa aktif
  if (tanggalEl && !tanggalEl.value) {
    tanggalEl.value = todayISO();
  }

  if (cabangEl && branchValue) {
    cabangEl.value = branchValue;
  }

  refreshDoctors(dokterParam);

  // Jika cabang belum ketemu tapi dokter ada — cari cabang dari seed
  if (dokterParam && (!cabangEl?.value || !dokterEl?.value)) {
    const found = seedDoctors.find(
      (d) =>
        String(d.name || '').toLowerCase() === dokterParam.toLowerCase() ||
        String(d.name || '').toLowerCase().includes(dokterParam.toLowerCase())
    );
    if (found) {
      const firstBranch = (found.branches || [])[0];
      const bv = resolveBranchValue(firstBranch);
      if (cabangEl && bv) cabangEl.value = bv;
      refreshDoctors(found.name || dokterParam);
    }
  }

  if (prefillBanner && (dokterParam || cabangParam)) {
    const parts = [];
    if (dokterEl?.value || dokterParam) parts.push(dokterEl?.value || dokterParam);
    if (cabangEl?.value) {
      const label =
        cabangEl.options[cabangEl.selectedIndex]?.textContent || cabangParam;
      parts.push(label);
    }
    prefillBanner.textContent = `Dari halaman Dokter: ${parts.join(' · ')}. Lengkapi data diri lalu konfirmasi.`;
    prefillBanner.classList.remove('hidden');
  }

  // Scroll form ke view
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (cabangEl) cabangEl.addEventListener('change', () => refreshDoctors());
if (tanggalEl) tanggalEl.addEventListener('change', () => refreshDoctors(dokterEl?.value));

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
    prefillBanner?.classList.add('hidden');
    // bersihkan query di address bar
    if (window.history?.replaceState) {
      window.history.replaceState({}, '', 'reservasi.html');
    }
  });
}

// Prefill dari ?dokter=&cabang=
applyPrefillFromQuery();
