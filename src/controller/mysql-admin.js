import conexion from '../models/mysql-config.js'
import bcrypt from 'bcrypt'

const saltRounds = 8

const sql = conexion

// Metodos GET
export function login (req, res) {
  const { error } = req.query
  console.log(req.query)
  if (error) {
    return res.render('admin/login', {
      title: 'Login - Administrador',
      alerta: true,
      posicion: 'top-end',
      icono: 'error',
      mensaje: 'Código y/o contraseña incorrectos',
      boton: false,
      temporizador: 2000
    })
  } else {
    return res.render('admin/login', {
      title: 'Login - Administrador',
      alerta: false,
      posicion: '',
      icono: '',
      mensaje: '',
      boton: true,
      temporizador: 0
    })
  }
}

export function logout (req, res) {
  req.session.destroy(error => {
    if (error) {
      return res.redirect('/admin/iniciar-sesion-administrador')
    }
    res.redirect('/admin/login')
  })
}

export async function inicio (req, res) {
  const admin = req.session.admin
  if (!admin) {
    console.log('Sesion caducada')
    return res.redirect('/admin/login')
  }
  const select = 'SELECT *, date_format(fechaRegistro, "%d-%m-%Y") as fechaRegistro FROM datos_beca_alimentos'
  const [result] = await sql.query(select)
  if (result.length >= 1) {
    console.log('Datos encontrados:', result)
    return res.render('admin/inicio', { title: 'Inicio', admin, datos: result })
  }
  return res.render('admin/inicio', { title: 'Inicio', admin, datos: false })
}

// Metodos POST
export function registrarAdmin (req, res) {
  const codigo = req.body.codigo
  const pass = req.body.password
  const correo = req.body.correo
  bcrypt.hash(pass, saltRounds, (error, hash) => {
    if (error) {
      console.error('Error al registrar', error)
      res.status(500).send('Error al registrar el administrador')
    } else {
      const clave = hash

      sql.query('INSERT INTO administrador SET ?', { codigo, correo, clave }, (error, result) => {
        if (error) {
          console.error('Error al registrar usuario', error)
          res.status(500).send('Error al registrar administrador')
        } else {
          console.log('Administrador registrado con éxito!')
          res.redirect('/admin/login')
        }
      })
    }
  })
}

export async function iniciarSesion (req, res) {
  console.log('Request body:', req.body) // Verifica los datos que llegan

  try {
    const { codigo, password } = req.body

    const consulta = 'SELECT * FROM administrador WHERE codigo = ?'
    const [result] = await sql.query(consulta, [codigo])

    if (result.length === 0) {
      console.log('Código y/o contraseña incorrectos')
      return res.redirect('/admin/login?error=1')
    }

    const admin = result[0]
    const claveHash = admin.clave
    const coincide = await bcrypt.compare(password, claveHash)

    if (coincide) {
      req.session.admin = admin
      console.log('Login exitoso')
      if (!admin) {
        console.log('Sesion caducada')
        return res.redirect('/admin/login')
      }
      const select = 'SELECT *, date_format(fechaRegistro, "%d-%m-%Y") as fechaRegistro FROM datos_beca_alimentos'
      const [result] = await sql.query(select)
      if (result.length >= 1) {
        console.log('Datos encontrados:', result)
        return res.render('admin/inicio', { title: 'Inicio - Administrador', admin, datos: result })
      }
      return res.render('admin/inicio', { title: 'Inicio - Administrador', admin, datos: false })
    } else {
      console.log('Código y/o contraseña incorrectos')
      return res.redirect('/admin/login?error=1')
    }
  } catch (error) {
    console.error('Error en el login:', error.message)
    return res.redirect('/admin/login?error=1')
  }
}
