import { Router } from 'express'
import * as queryAlumnos from '../controller/mysql-alumnos.js'

export const alumnosRouter = Router()

alumnosRouter.get('/login', queryAlumnos.login)
alumnosRouter.get('/logout', queryAlumnos.logout)
alumnosRouter.get('/inicio', queryAlumnos.inicio)
alumnosRouter.get('/registrar-alumno', queryAlumnos.formRegistrarAlumno)
alumnosRouter.get('/formulario', queryAlumnos.llenarFormulario)
alumnosRouter.get('/verRegistro', queryAlumnos.verRegistro)
alumnosRouter.get('/descargarFormatoSolicitud', queryAlumnos.descargarFormatoSolicitud)
alumnosRouter.get('/descargarCovocatoriaAlimentos', queryAlumnos.descargarConvocatoriaAlimentos)

alumnosRouter.post('/registrar', queryAlumnos.registrarAlumno)
alumnosRouter.post('/iniciar-sesion-estudiante', queryAlumnos.iniciarSesion)
alumnosRouter.post('/enviar-formulario', queryAlumnos.enviarFormulario)
alumnosRouter.post('/subir-archivos', queryAlumnos.uploadFiles, queryAlumnos.mysqlUploadFiles)
alumnosRouter.post('/updateFile', queryAlumnos.updateFile, queryAlumnos.mysqlUpdateFiles)
