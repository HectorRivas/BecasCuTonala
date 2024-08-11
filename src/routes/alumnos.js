import { Router } from 'express'
import * as queryAlumnos from '../controller/mysql-alumnos.js'

export const alumnosRouter = Router()

alumnosRouter.get('/login', (req, res) => {
  try {
    res.render('alumnos/login', { title: 'Login - Estudiante' })
  } catch (error) {
    console.log('Error:', error)
  }
})

alumnosRouter.get('/registrar-alumno', (req, res) => {
  try {
    res.render('alumnos/registrar-alumno', { title: 'Registrar alumno' })
  } catch (error) {
    console.log('Error:', error)
  }
})

// let nombre = req.body.nombre
// nombre = nombre
//   .trim() // Elimina espacios al principio y al final
//   .split(' ') // Divide la cadena en palabras
//   .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) // Capitaliza la primera letra de cada palabra
//   .join(' ') // Une las palabras en una sola cadena

// console.log(nombre) // "Hola Como Estas"

alumnosRouter.post('/iniciar-sesion-estudiante', (req, res) => {
  const codigo = req.body.codigo
  const password = req.body.password

  console.log('CODIGO', codigo)
  console.log('PASS', password)
  if ((codigo === '219911365' && password === 'hr0223377') || (codigo === '1234' && password === '1234')) {
    try {
      res.render('alumnos/formulario', { title: 'Becas - Formulario', codigo })
    } catch (error) {
      console.log('Error:', error)
    }
  } else {
    console.log('Código o contraseña no válidos')
    res.status(500).send('Código o contraseña no válidos')
  }
})

alumnosRouter.post('/enviar-formulario', (req, res) => {
  const codigo = req.body.codigo

  try {
    res.render('alumnos/subir-archivos', { title: 'Subir documentos', codigo })
  } catch (error) {
    console.log('Error', error)
    res.status(500).send('Error al enviar tus documentos')
  }
})

alumnosRouter.post('/subir-archivos', (req, res) => {
  try {
    res.status(300).send('Documentos enviados con exito!')
  } catch (error) {
    console.log('Error', error)
    res.status(500).send('Error al enviar tus documentos')
  }
})

alumnosRouter.post('/registrar', queryAlumnos.registrarAlumno)
