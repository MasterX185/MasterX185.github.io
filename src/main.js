import './style.css'

const USERNAME = 'MasterX185'
const app = document.querySelector('#app')

// Lade-Ansicht aufbauen
app.innerHTML = `
  <div id="profile-container"></div>
  <div id="loading" style="text-align:center; margin-top:4rem; color: #8a2be2;">
    <h2>Initialisiere Verbindungen... 🚀</h2>
  </div>
  <div id="repo-grid" class="grid"></div>
`

async function buildPortfolio() {
    try {
        // Profil-Daten und Repositories gleichzeitig von der API abfragen
        const [profileRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${USERNAME}`),
            fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`)
        ])

        if (!profileRes.ok || !reposRes.ok) {
            throw new Error('Fehler beim Abrufen der GitHub-API. Eventuell Rate-Limit erreicht.')
        }

        const profile = await profileRes.json()
        const repos = await reposRes.json()

        // Lade-Text ausblenden
        document.querySelector('#loading').style.display = 'none'

        // 1. Profil-Kopfzeile rendern
        document.querySelector('#profile-container').innerHTML = `
      <div class="profile-header">
        <a href="${profile.html_url}" target="_blank">
          <img src="${profile.avatar_url}" alt="Avatar von ${USERNAME}" class="avatar" />
        </a>
        <h1 class="title-gradient">${profile.name || profile.login}</h1>
        <p class="bio">${profile.bio || 'Willkommen auf meinem GitHub-Portfolio. Hier baue ich Dinge mit Code.'}</p>
        <div style="display:flex; justify-content:center; gap: 2rem; color: #777; font-size: 0.9rem;">
          <span>👥 ${profile.followers} Follower</span>
          <span>📦 ${profile.public_repos} öffentliche Repos</span>
        </div>
      </div>
    `

        // 2. Repositories rendern
        const grid = document.querySelector('#repo-grid')

        // Wir filtern Forks raus (optional, mach das weg, wenn du Forks sehen willst)
        const ownRepos = repos.filter(repo => !repo.fork)

        ownRepos.forEach((repo, index) => {
            const card = document.createElement('div')
            card.className = 'card'

            // Der Stagger-Effekt: Jede Karte lädt 0.1 Sekunden später als die vorherige
            card.style.animationDelay = `${index * 0.1}s`

            card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
        <p>${repo.description || '<i>Keine Beschreibung hinterlegt.</i>'}</p>
        <div class="meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          ${repo.language ? `<span class="lang">${repo.language}</span>` : ''}
        </div>
      `
            grid.appendChild(card)
        })

    } catch (error) {
        document.querySelector('#loading').innerHTML = `
      <h2 style="color: #ff4757;">Systemfehler</h2>
      <p>${error.message}</p>
    `
    }
}

// Startschuss
buildPortfolio()