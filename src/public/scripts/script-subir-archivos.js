function handleFileSelect (event, canvasId, fileNameId) {
  const file = event.target.files[0]
  const fileName = file ? file.name : 'Ningún archivo seleccionado'
  document.getElementById(fileNameId).textContent = fileName

  if (file) {
    // eslint-disable-next-line no-undef
    const reader = new FileReader()
    reader.onload = function (e) {
      const pdfData = new Uint8Array(e.target.result)
      // eslint-disable-next-line no-undef
      const loadingTask = pdfjsLib.getDocument({ data: pdfData })
      loadingTask.promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
          const scale = 1.5
          const viewport = page.getViewport({ scale })

          const canvas = document.getElementById(canvasId)
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          const renderContext = {
            canvasContext: context,
            viewport
          }
          page.render(renderContext)
          canvas.parentElement.style.display = 'block'
        })
      })
    }
    reader.readAsArrayBuffer(file)
  } else {
    document.getElementById(canvasId).parentElement.style.display = 'none'
  }
}

document.getElementById('ine').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-ine', 'file-name-ine')
})
document.getElementById('curp').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-curp', 'file-name-curp')
})
document.getElementById('domicilio').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-domicilio', 'file-name-domicilio')
})
document.getElementById('solicitud').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-solicitud', 'file-name-solicitud')
})
document.getElementById('edoCuenta').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-edoCuenta', 'file-name-edoCuenta')
})
document.getElementById('ingresos').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-ingresos', 'file-name-ingresos')
})
document.getElementById('fiscal').addEventListener('change', function (event) {
  handleFileSelect(event, 'preview-fiscal', 'file-name-fiscal')
})
