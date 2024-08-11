import mysql from 'mysql2/promise'
import config from '../config.js'

async function crearConexion () {
  try {
    const conexion = await mysql.createConnection({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_DATABASE
    })

    console.log('Conectado a la base de datos')
    return conexion
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err)
    throw err
  }
}

const conexion = await crearConexion()

export default conexion
