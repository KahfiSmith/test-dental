/**
 * Dokter page — static first paint (Figma-ready) + optional silent refresh
 * Seed data in js/doctors-seed.js renders immediately; no "Memuat…" gate.
 */
const API =
  'https://api.central.klinikgiginadira.com/api/v1/publicappointment/multibranch/doctors';

const grid = document.getElementById('doctor-grid');
const statusEl = document.getElementById('doctor-status');
const searchEl = document.getElementById('doctor-search');
const branchEl = document.getElementById('doctor-branch');
const countEl = document.getElementById('doctor-count');
const modal = document.getElementById('doctor-modal');
const modalPanel = document.getElementById('doctor-modal-panel');

/** @type {Array<any>} */
let allDoctors = [];

function applyDoctors(rows) {
  allDoctors = normalizeList(rows || []);
  fillBranchFilter(allDoctors);
  if (statusEl) {
    statusEl.classList.add('hidden');
    statusEl.textContent = '';
  }
  render();
}

const AVATAR_TONES = [
  'from-leaf-400 to-leaf-700',
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-600',
  'from-rose-400 to-pink-600',
  'from-indigo-400 to-blue-700',
  'from-emerald-400 to-green-600',
];

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_ID = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

function initials(name = '') {
  const clean = name.replace(/,?\s*drg\.?/gi, '').replace(/\s+/g, ' ').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (!parts.length) return 'DR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function detectSpecialty(doc) {
  const blob = `${doc.doctor_name || ''} ${doc.title || ''} ${doc.description || ''}`;
  const rules = [
    [/Sp\.?\s*Ort|Sp\.?\s*Ortho|Orthodont/i, 'Spesialis Ortodonti'],
    [/Sp\.?\s*Pros/i, 'Spesialis Prostodonsia'],
    [/Sp\.?\s*Perio/i, 'Spesialis Periodonsia'],
    [/Sp\.?\s*KG|Konservasi/i, 'Spesialis Konservasi Gigi'],
    [/Sp\.?\s*KGA|Anak/i, 'Spesialis Kedokteran Gigi Anak'],
    [/Sp\.?\s*BM|Bedah/i, 'Spesialis Bedah Mulut'],
  ];
  for (const [re, label] of rules) {
    if (re.test(blob)) return label;
  }
  return 'Dokter Gigi Umum';
}

function formatShift(s) {
  const parts = [];
  if (s.shift1_start && s.shift1_end) parts.push(`${s.shift1_start} – ${s.shift1_end}`);
  if (s.shift2_start && s.shift2_end) parts.push(`${s.shift2_start} – ${s.shift2_end}`);
  return parts.join(' · ') || '—';
}

function normalizeSchedules(list = []) {
  return (list || [])
    .filter((s) => s && s.is_active !== false && (s.shift1_start || s.shift2_start))
    .map((s) => ({
      day: (s.day_of_week || '').toLowerCase(),
      label: DAY_ID[(s.day_of_week || '').toLowerCase()] || s.day_of_week || '—',
      time: formatShift(s),
      order: DAY_ORDER.indexOf((s.day_of_week || '').toLowerCase()),
    }))
    .sort((a, b) => (a.order < 0 ? 99 : a.order) - (b.order < 0 ? 99 : b.order));
}

/** Hanya hari yang ada jadwal, max 4 hari */
function scheduleRowsHtml(schedules = []) {
  const ready = [...(schedules || [])]
    .sort((a, b) => (a.order < 0 ? 99 : a.order ?? 99) - (b.order < 0 ? 99 : b.order ?? 99))
    .slice(0, 4);

  if (!ready.length) {
    return `<p class="flex h-full min-h-[9rem] items-center text-[14px] text-ink-400">Jadwal belum tersedia untuk cabang ini.</p>`;
  }

  return ready
    .map(
      (s) => `
    <div class="schedule-row flex items-center justify-between gap-4 border-b border-ink-50 last:border-0">
      <span class="text-[15px] font-semibold text-ink-600">${escapeHtml(s.label)}</span>
      <span class="text-[15px] font-bold text-leaf-600">${escapeHtml(s.time)}</span>
    </div>`
    )
    .join('');
}

function normalizeList(rows) {
  /** @type {Map<string, any>} */
  const map = new Map();
  for (const row of rows || []) {
    if (row?.is_active === false) continue;
    const key = row.doctor_id || row.id;
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, {
        key,
        contentId: row.id,
        doctorId: row.doctor_id,
        name: (row.doctor_name || row.name || 'Dokter').trim(),
        title: (row.title || '').trim(),
        description: (row.description || '').trim(),
        specialty: detectSpecialty(row),
        email: row.doctor_email || '',
        byBranch: {},
      });
    }
    const item = map.get(key);
    const branch = (row.branch_name || 'Cabang').trim();
    if (!item.byBranch[branch]) {
      item.byBranch[branch] = {
        branch,
        contentId: row.id,
        schedules: normalizeSchedules(row.schedules),
        description: (row.description || '').trim(),
      };
    } else {
      // merge schedules if empty
      if (!item.byBranch[branch].schedules.length) {
        item.byBranch[branch].schedules = normalizeSchedules(row.schedules);
      }
    }
    if ((row.description || '').length > (item.description || '').length) {
      item.description = row.description.trim();
    }
  }

  return Array.from(map.values())
    .map((d) => {
      const branches = Object.keys(d.byBranch).sort((a, b) => a.localeCompare(b, 'id'));
      return {
        ...d,
        branches,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'id'));
}

function fillBranchFilter(doctors) {
  const branches = new Set();
  doctors.forEach((d) => d.branches.forEach((b) => branches.add(b)));
  const sorted = Array.from(branches).sort((a, b) => a.localeCompare(b, 'id'));
  branchEl.innerHTML =
    '<option value="">Semua cabang</option>' +
    sorted.map((b) => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function filtered() {
  const q = (searchEl.value || '').trim().toLowerCase();
  const branch = branchEl.value;
  return allDoctors.filter((d) => {
    if (branch && !d.branches.includes(branch)) return false;
    if (!q) return true;
    const hay = `${d.name} ${d.specialty} ${d.title} ${d.branches.join(' ')} ${d.description}`.toLowerCase();
    return hay.includes(q);
  });
}

function getDisplayBranch(doc) {
  const selected = branchEl.value;
  if (selected && doc.byBranch[selected]) return selected;
  return doc.branches[0] || '';
}

function render() {
  const list = filtered();
  countEl.textContent = `${list.length} dokter`;
  if (!list.length) {
    grid.innerHTML = `
      <div class="col-span-full rounded-3xl border border-ink-100 bg-white p-10 text-center text-ink-500">
        Tidak ada dokter yang cocok dengan pencarian.
      </div>`;
    return;
  }

  grid.innerHTML = list
    .map((d, i) => {
      const tone = AVATAR_TONES[i % AVATAR_TONES.length];
      const branchChips = d.branches
        .slice(0, 3)
        .map(
          (b) =>
            `<span class="inline-flex rounded-full bg-soap-50 px-2.5 py-1 text-[13px] font-bold text-leaf-800 ring-1 ring-leaf-100">${escapeHtml(b)}</span>`
        )
        .join('');
      const more =
        d.branches.length > 3
          ? `<span class="inline-flex rounded-full bg-ink-900/5 px-2.5 py-1 text-[13px] font-bold text-ink-500">+${d.branches.length - 3}</span>`
          : '';
      const desc =
        d.description && !d.description.toLowerCase().includes('adalah dokter gigi profesional')
          ? d.description
          : `${d.specialty} di Klinik Gigi Nadira.`;

      return `
      <button type="button" data-doctor-key="${escapeHtml(d.key)}"
        class="doctor-card group flex flex-col overflow-hidden rounded-[1.35rem] border border-ink-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-leaf-200 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500/40">
        <div class="relative bg-gradient-to-br ${tone} px-5 pb-10 pt-5">
          <div class="flex items-start justify-between gap-3">
            <span class="rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">${escapeHtml(d.specialty)}</span>
            <span class="rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-bold text-white/90">Lihat jadwal</span>
          </div>
          <div class="absolute -bottom-8 left-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white font-accent text-lg font-extrabold text-ink-800 shadow-soft ring-4 ring-white">
            ${escapeHtml(initials(d.name))}
          </div>
        </div>
        <div class="flex flex-1 flex-col px-5 pb-5 pt-11">
          <h2 class="font-display text-xl font-bold tracking-tight text-ink-900">${escapeHtml(d.name)}</h2>
          <p class="mt-1 text-[14px] font-semibold text-leaf-700">${escapeHtml(d.specialty)}</p>
          <p class="mt-3 line-clamp-2 text-[14px] leading-relaxed text-ink-500">${escapeHtml(desc)}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">${branchChips}${more}</div>
        </div>
      </button>`;
    })
    .join('');

  grid.querySelectorAll('[data-doctor-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const doc = allDoctors.find((d) => d.key === btn.getAttribute('data-doctor-key'));
      if (doc) openModal(doc);
    });
  });
}

function openModal(doc) {
  if (!modal || !modalPanel) return;

  const preferred = getDisplayBranch(doc);
  const branchEntries = doc.branches.map((b) => doc.byBranch[b]).filter(Boolean);

  // Prefer selected filter branch, else first with schedules
  let active =
    (preferred && doc.byBranch[preferred]) ||
    branchEntries.find((b) => b.schedules?.length) ||
    branchEntries[0] ||
    { branch: '—', schedules: [], description: doc.description };

  const desc =
    active.description ||
    doc.description ||
    `${doc.name} adalah dokter gigi profesional.`;

  const scheduleHtml = scheduleRowsHtml(active.schedules || []);

  // Branch tabs if multi-branch
  const tabs =
    branchEntries.length > 1
      ? `<div class="mt-3 flex flex-wrap gap-2 shrink-0" id="modal-branch-tabs">
          ${branchEntries
            .map(
              (b) => `
            <button type="button" data-branch="${escapeHtml(b.branch)}"
              class="modal-branch-tab rounded-full px-3 py-1.5 text-[13px] font-bold transition ${
                b.branch === active.branch
                  ? 'bg-leaf-600 text-white'
                  : 'bg-soap-50 text-leaf-800 ring-1 ring-leaf-100 hover:bg-soap-100'
              }">${escapeHtml(b.branch)}</button>`
            )
            .join('')}
        </div>`
      : '';

  modalPanel.innerHTML = `
    <div class="doctor-modal-shell flex h-[min(90vh,500px)] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:h-[480px] sm:flex-row">
      <div class="relative flex h-40 shrink-0 items-center justify-center bg-gradient-to-br from-sky-100 via-soap-50 to-leaf-100 sm:h-auto sm:w-[40%]">
        <button type="button" id="modal-close-x" class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-500 shadow-sm ring-1 ring-ink-100 transition hover:bg-white hover:text-ink-800 sm:hidden" aria-label="Tutup">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="flex h-28 w-28 items-center justify-center rounded-[1.25rem] bg-white/70 shadow-sm ring-1 ring-white sm:h-44 sm:w-44">
          <iconify-icon icon="fluent-emoji-flat:tooth" width="100" height="100" class="sm:hidden"></iconify-icon>
          <iconify-icon icon="fluent-emoji-flat:tooth" width="120" height="120" class="hidden sm:block"></iconify-icon>
        </div>
      </div>
      <div class="relative flex min-h-0 min-w-0 flex-1 flex-col p-5 sm:p-7">
        <button type="button" id="modal-close" class="absolute right-4 top-4 hidden h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 sm:flex" aria-label="Tutup">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="shrink-0 pr-8">
          <p class="text-[14px] font-bold text-leaf-600">${escapeHtml(doc.name)}</p>
          <h2 class="mt-0.5 font-display text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">${escapeHtml(doc.name)}</h2>
          <p class="mt-1 text-[14px] font-semibold text-ink-400" data-modal-branch-label>(${escapeHtml(active.branch)})</p>
          <p class="doctor-modal-desc mt-3 text-[14.5px] leading-relaxed text-ink-600">${escapeHtml(desc)}</p>
          ${tabs}
        </div>

        <div class="mt-4 flex shrink-0 items-center justify-between gap-3">
          <h3 class="text-[16px] font-extrabold text-ink-900">Jadwal Praktek</h3>
          <span class="rounded-full bg-soap-100 px-3 py-1 text-[12px] font-bold text-leaf-800 ring-1 ring-leaf-100">Aktif</span>
        </div>
        <div class="doctor-schedule-box mt-2 min-h-0 flex-1 overflow-y-auto" id="modal-schedule-list">
          ${scheduleHtml}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  const close = () => closeModal();
  modalPanel.querySelector('#modal-close')?.addEventListener('click', close);
  modalPanel.querySelector('#modal-close-x')?.addEventListener('click', close);

  modalPanel.querySelectorAll('[data-branch]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const bName = tab.getAttribute('data-branch');
      const entry = doc.byBranch[bName];
      if (!entry) return;

      modalPanel.querySelectorAll('[data-branch]').forEach((t) => {
        const on = t.getAttribute('data-branch') === bName;
        t.className = `modal-branch-tab rounded-full px-3 py-1.5 text-[13px] font-bold transition ${
          on
            ? 'bg-leaf-600 text-white'
            : 'bg-soap-50 text-leaf-800 ring-1 ring-leaf-100 hover:bg-soap-100'
        }`;
      });

      const branchLine = modalPanel.querySelector('[data-modal-branch-label]');
      if (branchLine) branchLine.textContent = `(${bName})`;

      const list = modalPanel.querySelector('#modal-schedule-list');
      if (!list) return;
      list.innerHTML = scheduleRowsHtml(entry.schedules || []);
    });
  });
}

function closeModal() {
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

/** Silent background refresh — never blocks first paint or shows loading UI */
async function refreshInBackground() {
  try {
    const url = `${API}?page=1&limit=100&search=`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    applyDoctors(json.data || []);
  } catch (err) {
    // Keep seed data on screen; log only
    console.warn('Dokter silent refresh skipped:', err);
  }
}

searchEl?.addEventListener('input', () => render());
branchEl?.addEventListener('change', () => render());

modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// First paint: seed (or empty) immediately — no loading message
const seed =
  typeof DOCTORS_SEED !== 'undefined' && Array.isArray(DOCTORS_SEED) ? DOCTORS_SEED : [];
applyDoctors(seed);
refreshInBackground();
