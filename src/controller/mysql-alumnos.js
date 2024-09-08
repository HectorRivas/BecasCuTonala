/* eslint-disable camelcase */
import conexion from '../models/mysql-config.js'
import bcrypt from 'bcrypt'
import multer, { diskStorage as _diskStorage } from 'multer'
import { join, dirname } from 'path'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

// Constante usada en el hash de la contraseña
const saltRounds = 8
// Contiene la informaciond de la conexion a la base de datos
const sql = conexion
// Obtener URL y nombre para crear y guardar documentos
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Metodos GET
export function login (req, res) {
  const { error } = req.query
  console.log('Error:', error)
  if (error) {
    return res.render('alumnos/login', {
      title: 'Login - Estudiante',
      alerta: true,
      posicion: 'top-end',
      icono: 'error',
      mensaje: 'Código y/o contraseña incorrectos',
      boton: false,
      temporizador: 2000
    })
  } else {
    return res.render('alumnos/login', {
      title: 'Login - Estudiante',
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
      return res.redirect('/alumnos/iniciar-sesion-alumnos')
    }
    res.redirect('/alumnos/login')
  })
}

export async function inicio (req, res) {
  const alumno = req.session.alumno
  if (!alumno) {
    console.log('Sesion caducada')
    return res.redirect('/alumnos/login')
  }
  const select = 'SELECT *, date_format(fechaRegistro, "%d-%m-%Y") as fechaRegistro FROM datos_beca_alimentos WHERE codigo = ?'
  const [result] = await sql.query(select, alumno.codigo)
  if (result.length >= 1) {
    return res.render('alumnos/inicio', { title: 'Inicio', alumno, datos: result[0] })
  }
  return res.render('alumnos/inicio', { title: 'Inicio', alumno, datos: false })
}

export async function verRegistro (req, res) {
  const alumno = req.session.alumno
  if (!alumno) {
    console.log('Sesion caducada')
    return res.redirect('/alumnos/login')
  }
  const select = 'SELECT *, date_format(fechaRevision, "%d-%m-%Y") as fechaRevision, date_format(fechaLimite, "%d-%m-%Y") as fechaLimite FROM doc_beca_alimentos, datos_beca_alimentos WHERE datosregistrobeca_codigo = codigo AND codigo = ?'
  const [registro] = await sql.query(select, alumno.codigo)
  if (registro === 0) {
    return res.render('alumnos/inicio', { title: 'Inicio', alumno })
  } else {
    return res.render('alumnos/info-registro', { title: 'Registro - Beca', alumno, registros: registro, user: registro[0] })
  }
}

export function formRegistrarAlumno (req, res) {
  try {
    res.render('alumnos/registrar-alumno', { title: 'Registrar alumno' })
  } catch (error) {
    console.log('Error:', error)
  }
}

export function descargarFormatoSolicitud (req, res) {
  res.download('src/public/archivos/formato_solicitud_programa_de_apoyo_alimentario_2024-b_1.docx')
}

export function descargarConvocatoriaAlimentos (req, res) {
  res.download('src/public/archivos/convocatoria_programa_alimentos_2024-b_10_07_24_final_2_0.pdf')
}

// Metodos POST
export async function registrarAlumno (req, res) {
  const codigo = req.body.codigo
  const pass = req.body.password

  try {
    const hash = await bcrypt.hash(pass, saltRounds)
    const query = 'INSERT INTO usuarios SET ?'
    await sql.query(query, { codigo, clave: hash })
    console.log('Usuario registrado con éxito!')
    res.redirect('/alumnos/registrar-alumno')
  } catch (error) {
    console.error('Error al registrar usuario', error)
    res.status(500).send('Error al registrar el usuario')
  }
}

export async function iniciarSesion (req, res) {
  try {
    const { codigo, password } = req.body

    const consulta = 'SELECT * FROM usuarios WHERE codigo = ?'
    const [result] = await sql.query(consulta, [codigo])

    if (result.length === 0) {
      console.log('Código y/o contraseña incorrectos')
      return res.redirect('/alumnos/login?error=1')
    }

    const alumno = result[0]
    const claveHash = alumno.clave
    const coincide = await bcrypt.compare(password, claveHash)

    if (coincide) {
      req.session.alumno = alumno
      console.log('Login exitoso')
      const select = 'SELECT *, date_format(fechaRegistro, "%d-%m-%Y") as fechaRegistro FROM datos_beca_alimentos WHERE codigo = ?'
      const [result] = await sql.query(select, alumno.codigo)
      if (result.length >= 1) {
        return res.render('alumnos/inicio', { title: 'Inicio', alumno, datos: result[0] })
      }
      return res.render('alumnos/inicio', { title: 'Inicio', alumno, datos: false })
    } else {
      console.log('Código y/o contraseña incorrectos')
      return res.redirect('/alumnos/login?error=1')
    }
  } catch (error) {
    console.error('Error en el login:', error.message)
    return res.redirect('/alumnos/login?error=1')
  }
}

export async function llenarFormulario (req, res) {
  try {
    const alumno = req.session.alumno
    const ciclo = req.query.ciclo
    if (!alumno) {
      console.log('Sesion caducada')
      return res.redirect('/alumnos/login')
    }
    const select = 'SELECT * FROM datos_beca_alimentos WHERE codigo = ?'

    // Ejecutar la consulta SQL usando await
    const [result] = await sql.query(select, alumno.codigo)
    if (result.length === 0) {
      return res.render('alumnos/formulario', { title: 'Formulario - becas', alumno, ciclo })
    }
    console.log('Datos de solicitud enviados con éxito!')
    const selectDoc = 'SELECT * FROM doc_beca_alimentos WHERE datosregistrobeca_codigo = ?'
    const [resultDoc] = await sql.query(selectDoc, alumno.codigo)
    if (resultDoc.length === 0) {
      return res.render('alumnos/subir-archivos', { title: 'Subir archivos - Becas', alumno, ciclo })
    }
    return res.redirect('/alumnos/verRegistro')
  } catch (error) {
    console.error('Error en la solicitud:', error)
    return res.status(500).send('Erorr en la solicitud')
  }
}

export async function enviarFormulario (req, res) {
  console.log('Form data: ', req.body)

  try {
    const alumno = req.session.alumno
    if (!alumno) {
      console.log('Sesion caducada')
      return res.redirect('/alumnos/login')
    }

    const fechaHoy = new Date()
    const year = fechaHoy.getFullYear()
    const month = String(fechaHoy.getMonth() + 1).padStart(2, '0')
    const day = String(fechaHoy.getDate()).padStart(2, '0')
    const fechaRegistro = `${year}-${month}-${day}`

    let nombre = req.body.nombre
    const codigo = req.body.codigo
    let apePaterno = req.body.apePaterno
    let apeMaterno = req.body.apeMaterno
    const correo = req.body.correo
    const telPrincipal = req.body.telPrincipal
    const telSecundario = req.body.telSecundario
    const carrera = req.body.carrera
    const semestre = req.body.semestre
    const ciclo = req.body.ciclo

    // Capitaliza los nombres y apellidos
    nombre = nombre.trim()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')

    apePaterno = apePaterno.trim()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')

    apeMaterno = apeMaterno.trim()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')

    const insert = 'INSERT INTO datos_beca_alimentos SET ?'
    const data = { codigo, nombre, apePaterno, apeMaterno, correo, telPrincipal, telSecundario, carrera, semestre, ciclo, fechaRegistro }
    await sql.query(insert, data)
    return res.render('alumnos/subir-archivos', { title: 'Subir archivos - Becas', alumno, ciclo })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return res.status(500).send('Error al registrar usuario')
  }
}

const diskStorage = _diskStorage({
  destination: (req, file, cb) => {
    const nombre = req.body.codigo
    if (!nombre) {
      return cb(new Error('El código es obligatorio'), null)
    }
    const ruta = join(__dirname, `../Documentos/${nombre}`)
    mkdirSync(ruta, { recursive: true })
    console.log(nombre)
    cb(null, ruta)
  },
  filename: (req, file, cb) => {
    const nombreArchivo = req.body.codigo
    cb(null, `${nombreArchivo} - ${file.originalname}`)
  }
})

export const uploadFiles = multer({ storage: diskStorage }).fields([
  { name: 'ine', maxCount: 1 },
  { name: 'curp', maxCount: 1 },
  { name: 'domicilio', maxCount: 1 },
  { name: 'solicitud', maxCount: 1 },
  { name: 'edoCuenta', maxCount: 1 },
  { name: 'ingresos', maxCount: 1 },
  { name: 'fiscal', maxCount: 1 }
])

export async function mysqlUploadFiles (req, res) {
  const alumno = req.session.alumno
  if (!alumno) {
    console.log('Sesión caducada')
    return res.redirect('/alumnos/login')
  }

  const fecha = new Date()
  const fechaRegistro = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`
  // eslint-disable-next-line camelcase
  const datosregistrobeca_codigo = req.body.codigo
  const ciclo = req.body.ciclo
  console.log('Ciclo:', ciclo)
  const documentos = ['ine', 'curp', 'solicitud', 'domicilio', 'edoCuenta', 'ingresos', 'fiscal']
  const insertDoc = 'INSERT INTO doc_beca_alimentos SET ?'

  const insertarDocumento = async (docKey) => {
    const archivo = req.files[docKey] ? req.files[docKey][0] : null
    if (!archivo) {
      throw new Error(`Archivo ${docKey} no encontrado.`)
    }
    const nombreArchivo = archivo.filename
    const tipoArchivo = archivo.mimetype
    // eslint-disable-next-line camelcase
    const data = { datosregistrobeca_codigo, nombreArchivo, tipoArchivo, fechaRegistro, ciclo }

    try {
      await sql.query(insertDoc, data)
      console.log(`Documento ${nombreArchivo} cargado!`)
    } catch (error) {
      console.error(`Error al cargar documento ${docKey}:`, error.message)
      throw error
    }
  }

  try {
    await Promise.all(documentos.map(insertarDocumento))
    console.log('ARCHIVOS CARGADOS CORRECTAMENTE!!')
    return res.render('/alumnos/inicio')
  } catch (error) {
    console.error('Error al cargar documentos:', error.message)
    return res.status(500).render('alumnos/inicio', { title: 'Inicio', alumno })
  }
}

const diskStorageUpdate = _diskStorage({
  destination: (req, file, cb) => {
    const nombre = req.body.codigo
    const path = join(__dirname, `../Documentos/${nombre}`)
    mkdirSync(path, { recursive: true })
    console.log(nombre)
    cb(null, path)
  },
  filename: (req, file, cb) => {
    const nombreArchivo = req.body.codigo
    cb(null, `(Actualizado) ${nombreArchivo} - ${file.originalname}`)
  }
})

export const updateFile = multer({ storage: diskStorageUpdate }).single('nuevoDocumento')

export async function mysqlUpdateFiles (req, res) {
  const sqlUpdateDoc = 'UPDATE doc_beca_alimentos SET ? WHERE datosregistrobeca_codigo = ? AND idDocumentos = ?'
  const sqlUpdateDatos = 'UPDATE datos_beca_alimentos SET estatus = "PENDIENTE" where codigo = ?'
  const fecha = new Date()
  const dia = fecha.getDate()
  const mes = fecha.getMonth() + 1
  const anio = fecha.getFullYear()
  const fechaActualizacion = `${anio}-${mes}-${dia}`
  const idDocumentos = req.body.idDocumentos
  const datosregistrobeca_codigo = req.body.codigo
  const codigo = req.body.codigo
  const nombreArchivo = req.file.filename
  const tipoArchivo = req.file.mimetype
  const validarArchivo = 'ACTUALIZADO'
  const data = { nombreArchivo, tipoArchivo, validarArchivo, fechaActualizacion }

  try {
    await sql.query(sqlUpdateDoc, [data, datosregistrobeca_codigo, idDocumentos])
    console.log('Documento actualizado con éxito!')

    await sql.query(sqlUpdateDatos, [codigo])
    console.log('Estatus actualizado con éxito!')

    return res.redirect('/alumnos/verRegistro')
  } catch (error) {
    console.error('Error al actualizar:', error)
    return res.status(500).send('Error al actualizar')
  }
}
