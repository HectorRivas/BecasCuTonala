import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { adminRouter } from './routes/admin.js'
import { alumnosRouter } from './routes/alumnos.js'
import session from 'express-session'

const app = express()

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configura EJS como el motor de plantillas
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware para analizar cuerpos de solicitudes en formato urlencoded
app.use(express.urlencoded({ extended: true }))

// Middleware para analizar cuerpos de solicitudes en formato JSON
app.use(express.json())

app.use(session({
  secret: 'Bl&U~r<aC:.#h(YvaOjjQ]S496£:<{`H4wa)^eDv4F<Kfh,/|i',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
})

// Monta el router
app.get('/', (req, res) => {
  res.render('inicio')
})
app.use('/admin', adminRouter)
app.use('/alumnos', alumnosRouter)

// Configura la ruta estática (opcional, si necesitas servir archivos estáticos)
app.use(express.static(path.join(__dirname, 'public')))

// Maneja el error 404
app.use((req, res, next) => {
  res.status(404).send('Error 404. Página no encontrada')
})

const PORT = process.env.PORT ?? 8000

app.listen(PORT, () => {
  console.log(`Conexion establecida en http://localhost:${PORT}`)
})
