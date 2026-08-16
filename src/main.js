import './style.css'

const USERNAME = 'MasterX185'
const app = document.querySelector('#app')

app.innerHTML = `
  <div class="container">
    <h1>Meine GitHub Repositories</h1>
    <div id="loading">Lade Repositories...</div>
    <div id="repo-grid" class="grid"></div>
  </div>
`

async function fetchRepos() {
    const loadingEl = document.querySelector('#loading')
    const gridEl = document.querySelector('#repo-grid')

    try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated`)

        if (!response.ok) {
            throw new Error(`Fehler beim Laden: ${response.status}`)
        }

        const repos = await response.json()
        loadingEl.style.display = 'none'

        repos.forEach(repo => {
            const card = document.createElement('div')
            card.className = 'card'

            card.innerHTML = `
        <h2><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h2>
        <p>${repo.description || 'Keine Beschreibung vorhanden.'}</p>
        <div class="meta">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          ${repo.language ? `<span class="lang">${repo.language}</span>` : ''}
        </div>
      `
            gridEl.appendChild(card)
        })
    } catch (error) {
        loadingEl.textContent = `Fehler: ${error.message}`
        loadingEl.style.color = '#ff6b6b'
    }
}

fetchRepos()