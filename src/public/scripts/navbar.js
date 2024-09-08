document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown')
  console.log(dropdowns)

  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.dropbtn')
    console.log(button)
    const content = dropdown.querySelector('.dropdown-content')
    console.log(content)

    button.addEventListener('click', (event) => {
      event.stopPropagation()

      // Cierra otros dropdowns
      dropdowns.forEach(otherDropdown => {
        const otherContent = otherDropdown.querySelector('.dropdown-content')
        if (otherContent !== content) {
          otherContent.style.maxHeight = '0'
        }
      })

      // Ajuste dinámico de la altura máxima
      if (content.style.maxHeight === '0px' || !content.style.maxHeight) {
        content.style.maxHeight = content.scrollHeight + 'px' // Expande el contenido
      } else {
        content.style.maxHeight = '0' // Contrae el contenido
      }
    })
  })

  document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
      const content = dropdown.querySelector('.dropdown-content')
      content.style.maxHeight = '0' // Cierra todos los dropdowns al hacer clic fuera
    })
  })

  const menuButton = document.getElementById('mobile-button')
  const mobileMenu = document.getElementById('mobile-menu')

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation()
    if (mobileMenu.style.maxHeight === '0px' || mobileMenu.style.maxHeight === '') {
      mobileMenu.style.maxHeight = '600px' // Ajusta la altura según sea necesario
    } else {
      mobileMenu.style.maxHeight = '0px'
    }
  })

  const btnDropSecundary = document.getElementById('btn-drop-secundary')
  const dropSecundary = document.getElementById('dropdown-content-secundary')

  btnDropSecundary.addEventListener('click', (event) => {
    event.stopPropagation()
    if (dropSecundary.style.maxHeight === '0px' || dropSecundary.style.maxHeight === '') {
      dropSecundary.style.maxHeight = '200px' // Ajusta la altura según sea necesario
      dropSecundary.removeAttribute('hidden')
    } else {
      dropSecundary.style.maxHeight = '0px'
      dropSecundary.setAttribute('hidden', true)
    }
  })
})
