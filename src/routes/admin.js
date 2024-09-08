import { Router } from 'express'
import * as queryAdmin from '../controller/mysql-admin.js'

export const adminRouter = Router()

// Peticiones GET
adminRouter.get('/registrar-admin', (req, res) => {
  try {
    res.render('admin/registrar-admin', { title: 'Registrar administrador' })
  } catch (error) {
    console.log('Error:', error)
  }
})

adminRouter.get('/login', queryAdmin.login)

adminRouter.get('/logout', queryAdmin.logout)

adminRouter.get('/inicio', queryAdmin.inicio)

// Peticiones POST
adminRouter.post('/registrar', queryAdmin.registrarAdmin)
adminRouter.post('/iniciar-sesion-administrador', queryAdmin.iniciarSesion)
