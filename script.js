// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const scrollTopBtn = document.getElementById('scroll-top');
const resumeBtn = document.getElementById('resume-btn');

// ===== NAVBAR TOGGLE =====
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll top button
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

// ===== SCROLL TO TOP =====
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== RESUME BUTTON =====
resumeBtn.addEventListener('click', () => {
  window.open('resume.pdf', '_blank');
});

// ===== ANIMATION ON SCROLL =====
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]');

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const elementHeight = el.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - elementHeight * 0.3) {
      const delay = el.getAttribute('data-delay') || 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay * 150);
    }
  });
};

// Run on load and on scroll
window.addEventListener('load', () => {
  animateOnScroll();
  fetchGitHubProfile();
  fetchGitHubProjects();
});

window.addEventListener('scroll', animateOnScroll);

// ===== GITHUB API INTEGRATION =====
const GITHUB_USERNAME = 'sulotandaisyjean-hub';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

// Fetch GitHub profile
async function fetchGitHubProfile() {
  const loadingEl = document.getElementById('stats-loading');
  const contentEl = document.getElementById('stats-content');

  try {
    const response = await fetch(GITHUB_API_URL);
    if (!response.ok) throw new Error('Failed to fetch profile');

    const user = await response.json();

    document.getElementById('profile-img').src = user.avatar_url || '';
    document.getElementById('profile-img').alt = user.name || GITHUB_USERNAME;
    document.getElementById('profile-name').textContent = user.name || GITHUB_USERNAME;
    document.getElementById('repo-count').textContent = user.public_repos || '0';
    document.getElementById('follower-count').textContent = user.followers || '0';
    document.getElementById('following-count').textContent = user.following || '0';
    document.getElementById('profile-bio').textContent = user.bio || 'Front-End Developer';

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    loadingEl.innerHTML = '<p style="color: var(--text-secondary);">Unable to load GitHub stats. Please try again later.</p>';
  }
}

// Fetch GitHub projects
async function fetchGitHubProjects() {
  const loadingEl = document.getElementById('projects-loading');
  const gridEl = document.getElementById('projects-grid');

  try {
    const response = await fetch(GITHUB_REPOS_URL);
    if (!response.ok) throw new Error('Failed to fetch repos');

    const repos = await response.json();
    gridEl.innerHTML = '';

    repos.forEach(repo => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.setAttribute('data-animate', 'fade-up');

      const primaryLanguage = repo.language ? repo.language : 'N/A';
      const isFork = repo.fork;
      const description = repo.description ? repo.description.substring(0, 120) + (repo.description.length > 120 ? '...' : '') : 'No description available.';

      projectCard.innerHTML = `
        <div class="project-img">
          <i class="fas fa-${getProjectIcon(repo.name)}"></i>
        </div>
        <div class="project-content">
          <h3>${repo.name.replace(/-/g, ' ')}</h3>
          <p class="project-description">${description}</p>
          <div class="project-links">
            ${repo.html_url ? `<a href="${repo.html_url}" target="_blank" aria-label="View on GitHub"><i class="fab fa-github"></i></a>` : ''}
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" aria-label="Live Demo"><i class="fas fa-globe"></i></a>` : ''}
          </div>
          <div class="project-tags">
            <span class="tag">${getLanguageColor(primaryLanguage)} ${primaryLanguage}</span>
            ${repo.stargazers_count > 0 ? `<span class="tag"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
            ${isFork ? '<span class="tag">Fork</span>' : ''}
          </div>
        </div>
      `;

      gridEl.appendChild(projectCard);
    });

    loadingEl.style.display = 'none';
    gridEl.style.display = 'grid';

    animateOnScroll();
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    loadingEl.innerHTML = '<p style="color: var(--text-secondary);">Unable to load projects. Please try again later.</p>';
  }
}

function getProjectIcon(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('portfolio') || nameLower.includes('resume') || nameLower.includes('personal')) return 'user';
  if (nameLower.includes('todo') || nameLower.includes('task')) return 'list.alt';
  if (nameLower.includes('calculator')) return 'calculator';
  if (nameLower.includes('weather')) return 'cloud-sun';
  if (nameLower.includes('blog') || nameLower.includes('website')) return 'globe';
  if (nameLower.includes('game')) return 'gamepad';
  if (nameLower.includes('app')) return 'mobile';
  return 'code';
}

const LANGUAGE_COLORS = {
  javascript: '#f0e040',
  typescript: '#3178c6',
  python: '#3572A5',
  java: '#b07219',
  html: '#e34c26',
  css: '#264de4',
  php: '#4f5d93',
  c: '#555',
  'c++': '#f34b7d',
  'go': '#00add8',
  rust: '#dea523',
  dart: '#00b5ad',
  default: '#6e6e6e'
};

function getLanguageColor(lang) {
  const key = (lang || 'default').toLowerCase();
  return LANGUAGE_COLORS[key] || LANGUAGE_COLORS['default'];
}

// ===== NAVIGATION ACTIVE LINK =====
const navLinksItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function setActiveNav() {
  let index = sections.length;

  while (--index && window.scrollY + 100 < sections[index].offsetTop) {}
  navLinksItems.forEach(link => link.classList.remove('active'));
  navLinksItems[index].classList.add('active');
}

setActiveNav();
window.addEventListener('scroll', setActiveNav);

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    alert(`Thank you, ${data.name}! Your message has been received. I'll respond to ${data.email} soon.`);
    contactForm.reset();
  });
}
