/* ====================================================
   NinjaPhy – Main JavaScript
   ==================================================== */

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initAOS();
  initCounters();
  initRessources();
  initAgenda();
  initDate();
  initBackToTop();
  initHamburger();
  initFooterYear();
  injectAccessModal();
});

// ===== CONTRÔLE D'ACCÈS AUX DOCUMENTS =====
// Appelée par chaque bouton de document (Cours, Activité, TP, Exos)
// url : lien vers le document (PDF, page HTML…), '#' si pas encore disponible
function openDoc(url) {
  const user = sessionStorage.getItem('np-user');
  if (user) {
    // Élève connecté → accès autorisé
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener');
    } else {
      showAccessModal('soon');
    }
  } else {
    // Non connecté → afficher la modale de connexion
    showAccessModal('login');
  }
}

function injectAccessModal() {
  if (document.getElementById('npAccessModal')) return;
  const modal = document.createElement('div');
  modal.id = 'npAccessModal';
  modal.style.cssText = [
    'display:none', 'position:fixed', 'inset:0', 'z-index:9999',
    'background:rgba(0,0,0,0.55)', 'backdrop-filter:blur(4px)',
    'justify-content:center', 'align-items:center', 'padding:1rem'
  ].join(';');
  modal.innerHTML = `
    <div style="background:var(--bg-card);border-radius:20px;padding:2rem;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);text-align:center;position:relative">
      <button onclick="closeAccessModal()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--text-muted)"><i class="fas fa-times"></i></button>

      <!-- Vue : connexion requise -->
      <div id="npModalLogin">
        <div style="font-size:3rem;margin-bottom:0.75rem">🔒</div>
        <h3 style="font-weight:900;margin-bottom:0.5rem">Accès réservé</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6;margin-bottom:1.5rem">
          Ce document est réservé aux élèves connectés.<br>
          Identifie-toi avec le code fourni par ton professeur.
        </p>
        <a href="espace-eleve.html" class="btn btn-primary btn-full" style="display:block;text-decoration:none;margin-bottom:0.75rem">
          <i class="fas fa-sign-in-alt"></i> Se connecter
        </a>
        <button onclick="closeAccessModal()" style="width:100%;padding:0.6rem;border:1.5px solid var(--border);border-radius:10px;background:none;color:var(--text-muted);cursor:pointer;font-family:var(--font);font-weight:700">
          Retour
        </button>
      </div>

      <!-- Vue : document bientôt disponible -->
      <div id="npModalSoon" style="display:none">
        <div style="font-size:3rem;margin-bottom:0.75rem">🚧</div>
        <h3 style="font-weight:900;margin-bottom:0.5rem">Bientôt disponible</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6;margin-bottom:1.5rem">
          Ce document sera mis en ligne prochainement par votre professeur.
        </p>
        <button onclick="closeAccessModal()" class="btn btn-primary btn-full" style="border:none;cursor:pointer;font-family:var(--font)">
          OK
        </button>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAccessModal(); });
  document.body.appendChild(modal);
}

function showAccessModal(view) {
  const modal = document.getElementById('npAccessModal');
  if (!modal) return;
  document.getElementById('npModalLogin').style.display = view === 'login' ? 'block' : 'none';
  document.getElementById('npModalSoon').style.display  = view === 'soon'  ? 'block' : 'none';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Adapter le lien "Se connecter" selon la profondeur de page
  const link = modal.querySelector('a[href="espace-eleve.html"]');
  if (link) {
    const depth = (window.location.pathname.match(/\//g) || []).length;
    link.href = depth >= 2 ? 'espace-eleve.html' : 'pages/espace-eleve.html';
  }
}

function closeAccessModal() {
  const modal = document.getElementById('npAccessModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ===== THEME (Dark/Light) =====
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('ninjaphy-theme') || 'light';
  applyTheme(saved);
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ninjaphy-theme', theme);
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ===== HAMBURGER =====
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

// ===== AOS INIT =====
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-quad' });
  }
}

// ===== COUNTERS =====
function initCounters() {
  const targets = {
    counterCours: 42,
    counterTP: 18,
    counterExo: 95,
    counterEleves: 120,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, targets[el.id]);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  Object.keys(targets).forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}
function animateCounter(el, target) {
  let start = 0;
  const duration = 1500;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// ===== RESSOURCES DATA =====
const ressourcesData = [
  {
    type: 'cours', icon: 'fas fa-book', classe: '2de', tag: 'tag-2de', tagLabel: '2de',
    title: 'Constitution de la matière', desc: 'Atomes, molécules, ions – structure et représentation.',
    date: '10 juin 2025', url: '#'
  },
  {
    type: 'tp', icon: 'fas fa-flask', classe: '2de', tag: 'tag-2de', tagLabel: '2de',
    title: 'TP – Dissolution et solutions', desc: 'Préparer des solutions à concentration donnée.',
    date: '8 juin 2025', url: '#'
  },
  {
    type: 'exercice', icon: 'fas fa-pencil-alt', classe: '1es', tag: 'tag-1es', tagLabel: '1re ES',
    title: 'Exercices – Énergie solaire', desc: 'Calculs de flux et bilan énergétique du Soleil.',
    date: '5 juin 2025', url: '#'
  },
  {
    type: 'video', icon: 'fas fa-play', classe: 'tes', tag: 'tag-tes', tagLabel: 'Tle ES',
    title: 'Vidéo – L\'IA expliquée simplement', desc: 'Comprendre les réseaux de neurones en 10 minutes.',
    date: '3 juin 2025', url: '#'
  },
  {
    type: 'cours', icon: 'fas fa-book', classe: '1sti2d', tag: 'tag-1sti2d', tagLabel: '1re STI2D',
    title: 'Ondes et signaux périodiques', desc: 'Grandeurs caractéristiques, fréquence, longueur d\'onde.',
    date: '1 juin 2025', url: '#'
  },
  {
    type: 'exercice', icon: 'fas fa-pencil-alt', classe: '2de', tag: 'tag-2de', tagLabel: '2de',
    title: 'Exercices – Mécanique / Vecteur vitesse', desc: 'Mouvements rectiligne uniforme et uniformément varié.',
    date: '28 mai 2025', url: '#'
  },
];

function initRessources() {
  const grid = document.getElementById('ressourcesGrid');
  if (!grid) return;
  renderRessources('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRessources(btn.dataset.filter);
    });
  });
}

function renderRessources(filter) {
  const grid = document.getElementById('ressourcesGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? ressourcesData : ressourcesData.filter(r => r.type === filter);
  const typeIcons = { cours: 'fas fa-book', tp: 'fas fa-flask', exercice: 'fas fa-pencil-alt', video: 'fas fa-play' };
  const typeLabels = { cours: 'Cours', tp: 'TP', exercice: 'Exercice', video: 'Vidéo' };

  grid.innerHTML = filtered.map(r => `
    <div class="ressource-card" data-aos="fade-up">
      <div class="ressource-header">
        <div class="type-icon type-${r.type}">
          <i class="${typeIcons[r.type]}"></i>
        </div>
        <div class="ressource-meta">
          <h4>${r.title}</h4>
          <div class="ressource-badges">
            <span class="tag ${r.tag}">${r.tagLabel}</span>
            <span class="tag" style="background:#475569">${typeLabels[r.type]}</span>
          </div>
        </div>
      </div>
      <p class="ressource-desc">${r.desc}</p>
      <div class="ressource-footer">
        <span class="ressource-date"><i class="far fa-calendar"></i> ${r.date}</span>
        <a href="${r.url}" class="btn-ressource">
          Accéder <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join('');

  if (typeof AOS !== 'undefined') AOS.refresh();
}

// ===== AGENDA DATA =====
const agendaData = [
  { classe: '2de', texte: 'Contrôle – Chimie des solutions', date: '20 juin', color: '#3b82f6' },
  { classe: '1re ES', texte: 'DS – Énergie et développement durable', date: '21 juin', color: '#10b981' },
  { classe: 'Tle ES', texte: 'TP noté – Systèmes complexes', date: '23 juin', color: '#8b5cf6' },
  { classe: '1re STI2D', texte: 'Rendu de rapport TP ondes', date: '25 juin', color: '#f59e0b' },
];

const orientationsData = [
  { classe: '2de', texte: 'Voir chapitre 5 – Exercices p. 42-44', date: 'Aujourd\'hui' },
  { classe: '1re ES', texte: 'Regarder la vidéo sur le bilan radiatif', date: 'Hier' },
  { classe: 'Tle ES', texte: 'Lire le cours sur les réseaux de neurones', date: '12 juin' },
  { classe: '1re STI2D', texte: 'Compléter le TP sur les ondes sonores', date: '10 juin' },
];

function initAgenda() {
  const agendaList = document.getElementById('agendaList');
  const orientationsList = document.getElementById('orientationsList');

  if (agendaList) {
    agendaList.innerHTML = agendaData.map(item => `
      <div class="agenda-item">
        <div class="agenda-dot" style="background:${item.color}"></div>
        <div class="agenda-info">
          <strong>${item.texte}</strong>
          <span>${item.classe}</span>
        </div>
        <span class="agenda-date">${item.date}</span>
      </div>
    `).join('');
  }

  if (orientationsList) {
    orientationsList.innerHTML = orientationsData.map(item => `
      <div class="agenda-item">
        <div class="agenda-dot" style="background:var(--primary)"></div>
        <div class="agenda-info">
          <strong>${item.texte}</strong>
          <span>${item.classe}</span>
        </div>
        <span class="agenda-date">${item.date}</span>
      </div>
    `).join('');
  }
}

// ===== DATE ANNONCE =====
function initDate() {
  const el = document.getElementById('annonceDate');
  if (el) {
    el.textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== FOOTER YEAR =====
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ===== QUIZ =====
function checkAnswer(btn, isCorrect) {
  const opts = btn.closest('.quiz-options').querySelectorAll('.quiz-opt');
  opts.forEach(o => o.disabled = true);
  const feedback = document.getElementById('quizFeedback');

  if (isCorrect) {
    btn.classList.add('correct');
    if (feedback) { feedback.textContent = '✅ Bravo ! C\'est la bonne réponse !'; feedback.style.color = '#10b981'; }
  } else {
    btn.classList.add('wrong');
    opts.forEach(o => { if (o.onclick.toString().includes('true')) o.classList.add('correct'); });
    if (feedback) { feedback.textContent = '❌ Pas tout à fait… La bonne réponse est H₂O.'; feedback.style.color = '#ef4444'; }
  }
}

// ===== SMOOTH SCROLL (anchor links) =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
