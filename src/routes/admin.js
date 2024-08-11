import { Router } from 'express'
import * as queryAdmin from '../controller/mysql-admin.js'

export const adminRouter = Router()

// Peticiones GET
adminRouter.get('/login', (req, res) => {
  try {
    res.render('admin/login', { title: 'Login - administrador' })
  } catch (error) {
    console.log('Error:', error)
  }
})

adminRouter.get('/registrar-admin', (req, res) => {
  try {
    res.render('admin/registrar-admin', { title: 'Registrar administrador' })
  } catch (error) {
    console.log('Error:', error)
  }
})

// Peticiones POST
adminRouter.post('/registrar', queryAdmin.registrarAdmin)
adminRouter.post('/iniciar-sesion-administrador', queryAdmin.iniciarSesion)
