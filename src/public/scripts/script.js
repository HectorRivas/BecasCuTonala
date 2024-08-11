// Cambiar y mantener el tema (dark o light)
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body
  // eslint-disable-next-line no-undef
  const savedTheme = localStorage.getItem('theme') || 'light' // Tema por defecto es 'light'
  const themeToggle = document.getElementById('toggle-theme')

  body.setAttribute('data-theme', savedTheme)

  themeToggle.textContent = savedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
  themeToggle.checked = savedTheme === 'light'

  themeToggle.addEventListener('click', function () {
    const currentTheme = body.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    body.setAttribute('data-theme', newTheme)
    this.textContent = newTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    this.checked = newTheme === 'light'
    // eslint-disable-next-line no-undef
    localStorage.setItem('theme', newTheme)
  })
})
