import conexion from '../models/mysql-config.js'
import bcrypt from 'bcrypt'

const saltRounds = 8

const sql = conexion

export function registrarAlumno (req, res) {
  const codigo = req.body.codigo
  const pass = req.body.password
  bcrypt.hash(pass, saltRounds, (error, hash) => {
    if (error) {
      console.error('Error al registrar', error)
      res.status(500).send('Error al registrar el usuario')
    } else {
      const clave = hash

      sql.query('INSERT INTO usuarios SET ?', { codigo, clave }, (error, result) => { // Asegurarse que la función query es accesible así
        if (error) {
          console.error('Error al registrar usuario', error)
          res.status(500).send('Error al registrar usuario')
        } else {
          console.log('Usuario registrado con éxito!')
          res.redirect('/alumnos/registrar-alumno')
        }
      })
    }
  })
}
