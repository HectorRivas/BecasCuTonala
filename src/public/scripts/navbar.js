document.addEventListener('DOMContentLoaded', () => {
  // Seleccionamos todos los dropdowns
  const dropdowns = document.querySelectorAll('.dropdown')

  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.dropbtn')
    const content = dropdown.querySelector('.dropdown-content')

    button.addEventListener('click', (event) => {
      // Evitar que el click se propague y cierre el dropdown inmediatamente
      event.stopPropagation()

      // Cerrar todos los demás dropdowns
      document.querySelectorAll('.dropdown-content').forEach(openDropdown => {
        if (openDropdown !== content) {
          openDropdown.classList.remove('show')
        }
      })

      // Alternar el dropdown actual
      content.classList.toggle('show')
    })
  })

  // Cerrar el dropdown si se hace clic fuera de él
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.classList.remove('show')
    })
  })
})
