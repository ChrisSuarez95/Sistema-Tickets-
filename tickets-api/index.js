const express = require('express')
const cors = require('cors')
const pool = require('./db')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// ===== LOGIN =====
app.post('/api/login', async (req, res) => {
  try {
    const { email, pass } = req.body
    console.log("Intento login:", email, pass)
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim()])
    if(rows.length === 0) return res.status(401).json({message: "Incorrecto - usuario no existe"})
    const user = rows[0]
    if(String(user.pass).trim() !== String(pass).trim()) return res.status(401).json({message: "Incorrecto - contraseña incorrecta"})
    const { pass: _, ...userSinPass } = user
    res.json(userSinPass)
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})

// ===== TICKETS =====
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tickets ORDER BY id DESC')
    res.json(rows)
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.post('/api/tickets', async (req, res) => {
  try {
    const b = req.body
    const asunto = b.asunto || b.titulo || ""
    const desc = b.desc || b.descripcion || ""
    const cliente = b.cliente || "Sin nombre"
    const depto = b.depto || "Soporte"
    const estado = b.estado || "Abierto"
    const asignadoA = b.asignadoA || ""
    const fecha = b.fecha || new Date().toLocaleString('es-MX')
    const registradoPor = b.registradoPor || cliente
    const imagen = b.imagen || b.foto || ""
    if(!asunto) return res.status(400).json({message: "El título es obligatorio"})
    if(asunto.length < 5) return res.status(400).json({message: "El asunto debe tener mínimo 5 caracteres"})
    const [rows] = await pool.query('SELECT num FROM tickets ORDER BY id DESC LIMIT 1')
    let nextNum = 1
    if(rows.length > 0){ nextNum = (parseInt(rows[0].num.replace('#','')) || 0) + 1 }
    const num = '#' + String(nextNum).padStart(4, '0')
    const [result] = await pool.query('INSERT INTO tickets (num, fecha, asunto, `desc`, cliente, depto, estado, asignadoA, registradoPor, imagen) VALUES (?,?,?,?,?,?,?,?,?,?)', [num, fecha, asunto, desc, cliente, depto, estado, asignadoA, registradoPor, imagen])
    const [nuevo] = await pool.query('SELECT * FROM tickets WHERE id = ?', [result.insertId])
    res.status(201).json(nuevo[0])
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const b = req.body
    const imagen = b.imagen || b.foto || ""
    await pool.query('UPDATE tickets SET fecha=?, asunto=?, `desc`=?, cliente=?, depto=?, estado=?, asignadoA=?, asignadoPor=?, finalizadoPor=?, fechaFin=?, registradoPor=?, imagen=? WHERE id=?', [b.fecha||"", b.asunto||b.titulo||"", b.desc||b.descripcion||"", b.cliente||"", b.depto||"Soporte", b.estado||"Abierto", b.asignadoA||"", b.asignadoPor||"", b.finalizadoPor||"", b.fechaFin||"", b.registradoPor||"", imagen, req.params.id])
    const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.delete('/api/tickets/:id', async (req, res) => {
  try { await pool.query('DELETE FROM tickets WHERE id = ?', [req.params.id]); res.json({ok:true}) }
  catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})

// ===== USUARIOS =====
app.get('/api/users', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC'); res.json(rows) }
  catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.post('/api/users', async (req, res) => {
  try {
    const { nombre, email, pass, rol, depto } = req.body
    if(!nombre || !email || !pass) return res.status(400).json({message: "Nombre, email y pass obligatorios"})
    const [result] = await pool.query('INSERT INTO users (nombre, email, pass, rol, depto) VALUES (?,?,?,?,?)', [nombre, email, pass, rol||"Cliente", depto||"General"])
    const [nuevo] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId])
    res.status(201).json(nuevo[0])
  } catch(e){ if(e.code==='ER_DUP_ENTRY') return res.status(400).json({message: "Ese email ya está registrado"}); res.status(500).json({message: 'Error: ' + e.message}) }
})
app.put('/api/users/:id', async (req, res) => {
  try {
    const { nombre, email, pass, rol, depto } = req.body
    await pool.query('UPDATE users SET nombre=?, email=?, pass=?, rol=?, depto=? WHERE id=?', [nombre, email, pass, rol, depto, req.params.id])
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.delete('/api/users/:id', async (req, res) => {
  try { await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]); res.json({ok:true}) }
  catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})

// ===== DEPTOS =====
app.get('/api/deptos', async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM deptos ORDER BY nombre'); res.json(rows.map(r=>r.nombre)) }
  catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.post('/api/deptos', async (req, res) => {
  try {
    const { nombre } = req.body
    await pool.query('INSERT INTO deptos (nombre) VALUES (?)', [nombre])
    const [rows] = await pool.query('SELECT * FROM deptos ORDER BY nombre')
    res.status(201).json(rows.map(r=>r.nombre))
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
// ===== ACTUALIZAR DEPTO - SOLO ADMIN LO USA DESDE EL FRONTEND =====
app.put('/api/deptos/:nombre', async (req, res) => {
  try {
    const nombreViejo = req.params.nombre
    const { nombre } = req.body
    if(!nombre || !nombre.trim()) return res.status(400).json({message: "Escribe el nuevo nombre del departamento"})
    // Revisa que no exista otro depto con ese nombre
    const [existe] = await pool.query('SELECT * FROM deptos WHERE nombre = ?', [nombre.trim()])
    if(existe.length > 0 && nombre.trim() !== nombreViejo) return res.status(400).json({message: "Ya existe un departamento con ese nombre"})
    // Actualiza el depto
    const [result] = await pool.query('UPDATE deptos SET nombre = ? WHERE nombre = ?', [nombre.trim(), nombreViejo])
    if(result.affectedRows === 0) return res.status(404).json({message: "Departamento no encontrado"})
    // Actualiza también los tickets y usuarios que tenían el nombre viejo para que no queden huérfanos
    await pool.query('UPDATE tickets SET depto = ? WHERE depto = ?', [nombre.trim(), nombreViejo]).catch(()=>{})
    await pool.query('UPDATE users SET depto = ? WHERE depto = ?', [nombre.trim(), nombreViejo]).catch(()=>{})
    const [rows] = await pool.query('SELECT * FROM deptos ORDER BY nombre')
    res.json(rows.map(r=>r.nombre))
  } catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})
app.delete('/api/deptos/:nombre', async (req, res) => {
  try { await pool.query('DELETE FROM deptos WHERE nombre = ?', [req.params.nombre]); res.json({ok:true}) }
  catch(e){ res.status(500).json({message: 'Error: ' + e.message}) }
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`))