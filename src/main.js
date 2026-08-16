import './style.css'

const USERNAME = 'MasterX185'
const app = document.querySelector('#app')

// Grundgerüst mit neuen Sektionen aufbauen
app.innerHTML = `
  <div id="profile-container"></div>
  
  <div class="content-section glass-panel" style="animation-delay: 0.2s; opacity: 0; animation: fadeInUp 0.8s forwards;">
    <h2>💻 Tech Stack & Skills</h2>
    <div class="skills-grid">
      <span class="skill-tag">JavaScript</span>
      <span class="skill-tag">HTML5 & CSS3</span>
      <span class="skill-tag">Vite</span>
      <span class="skill-tag">Git & GitHub</span>
      <span class="skill-tag">Linux / Raspberry Pi</span>
    </div>
  </div>

  <div class="content-section glass-panel" style="animation-delay: 0.4s; opacity: 0; animation: fadeInUp 0.8s forwards;">
    <h2>📫 Kontakt & Links</h2>
    <div class="links-grid">
      <a href="https://github.com/${USERNAME}" target="_blank" class="glass-btn">GitHub Profil</a>
      <a href="#" class="glass-btn">E-Mail schreiben</a>
    </div>
  </div>

  <h2 style="text-align: center; margin-top: 4rem; color: #fff;">Meine Projekte</h2>
  <div id="loading" style="text-align:center; color: #4facfe;">Lade Repositories...</div>
  <div id="repo-grid" class="grid"></div>
`

async function buildPortfolio() {
    try {
        const [profileRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${USERNAME}`),
            fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`)
        ])

        if (!profileRes.ok || !reposRes.ok) throw new Error('API-Fehler')

        const profile = await profileRes.json()
        const repos = await reposRes.json()

        document.querySelector('#loading').style.display = 'none'

        // Profil rendern
        document.querySelector('#profile-container').innerHTML = `
      <div class="profile-header">
        <a href="${profile.html_url}" target="_blank">
          <img src="${profile.avatar_url}" alt="Avatar" class="avatar" />
        </a>
        <h1 class="title-gradient">${profile.name || profile.login}</h1>
        <p class="bio">${profile.bio || 'Willkommen in meinem digitalen Workspace. Ich entwickle Software und scripte auf meinem Raspberry Pi.'}</p>
        <div class="stats">
          <span>👥 ${profile.followers} Follower</span>
          <span>📦 ${profile.public_repos} Repositories</span>
        </div>
      </div>
    `

        // Repositories rendern
        const grid = document.querySelector('#repo-grid')
        const ownRepos = repos.filter(repo => !repo.fork)

        ownRepos.forEach((repo, index) => {
            const card = document.createElement('div')
            card.className = 'card glass-panel'
            card.style.animationDelay = `${0.6 + (index * 0.1)}s` // Staggered Animation

            card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'Keine Beschreibung verfügbar.'}</p>
        <div class="meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          ${repo.language ? `<span class="lang">${repo.language}</span>` : ''}
        </div>
      `
            grid.appendChild(card)
        })

    } catch (error) {
        document.querySelector('#loading').innerHTML = `<h3 style="color: #ff4757;">Fehler beim Laden der API.</h3>`
    }
}

buildPortfolio()