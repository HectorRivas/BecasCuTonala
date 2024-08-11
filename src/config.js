const DB_PORT = process.env.DB_PORT || 3306
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || 'Hydrustyle'
const DB_DATABASE = process.env.DB_DATABASE || 'becas_cut'

export default {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER
}
