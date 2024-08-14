import { Router } from 'express'
import * as queryAlumnos from '../controller/mysql-alumnos.js'

export const alumnosRouter = Router()

alumnosRouter.get('/login', queryAlumnos.login)
alumnosRouter.get('/logout', queryAlumnos.logout)
alumnosRouter.get('/registrar-alumno', queryAlumnos.formRegistrarAlumno)
alumnosRouter.get('/formulario', queryAlumnos.llenarFormulario)
alumnosRouter.get('/verRegistro', queryAlumnos.verRegistro)

alumnosRouter.post('/registrar', queryAlumnos.registrarAlumno)
alumnosRouter.post('/iniciar-sesion-estudiante', queryAlumnos.iniciarSesion)
alumnosRouter.post('/enviar-formulario', queryAlumnos.enviarFormulario)
alumnosRouter.post('/subir-archivos', queryAlumnos.uploadArchivos, queryAlumnos.mysqlUploadArchivos)
