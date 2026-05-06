const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const subdomains = {
  "MusicAxs": "musicaxs.pgaxis.dev",
  "axs": "axs.pgaxis.dev",
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;

  return date.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

async function fetchRepos() {
  const cached = sessionStorage.getItem("gh_repos");
  if (cached) return JSON.parse(cached);

  const res = await fetch("https://api.github.com/users/PGAxis/repos?sort=updated&per_page=100");
  const repos = await res.json();
  sessionStorage.setItem("gh_repos", JSON.stringify(repos));
  return repos;
}

function buildCard(repo, preview = false) {
  const subdomain = subdomains[repo.name];
  const cardUrl = subdomain ? `https://${subdomain}` : repo.html_url;
  const card = document.createElement("article");
  card.className = "project-card";
  card.style.cursor = "pointer";
  card.addEventListener("click", () => window.location.href = cardUrl);

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-name">${repo.name}</h3>
      <a href="${repo.html_url}" class="card-link accent-link" target="_blank" rel="noopener" onclick="event.stopPropagation()">GitHub →</a>
    </div>
    <p class="card-description">${repo.description || "No description provided."}</p>
    <div class="card-meta">
      <span class="card-meta-item">★ ${repo.stargazers_count}</span>
      ${repo.license ? `<span class="card-meta-item">${repo.license.spdx_id}</span>` : ""}
      <span class="card-meta-item">Updated ${formatDate(repo.pushed_at)}</span>
    </div>
  `;

  return card;
}

async function loadPreview() {
  const container = document.getElementById("projects-preview");
  if (!container) return;
  const repos = await fetchRepos();
  repos.slice(0, 3).forEach(repo => container.appendChild(buildCard(repo, true)));
}

async function loadProjects() {
  const container = document.getElementById("projects-list");
  if (!container) return;
  const repos = await fetchRepos();
  repos.forEach(repo => container.appendChild(buildCard(repo)));
}

loadPreview();
loadProjects();