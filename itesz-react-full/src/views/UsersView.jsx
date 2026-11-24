import { useState } from 'react'
import { useCrud } from '../viewmodels/useCrud'
import { validateUser } from '../models/validation'

export default function UsersView() {
  const { items, message, editingId, setEditingId, create, update, remove } = useCrud([
    { id: 1, name: 'Chris Suarez', email: 'chris@itesz.edu.mx', role: 'Admin' }
  ], validateUser)

  const [form, setForm] = useState({ name: '', email: '', role: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = editingId ? update(editingId, form) : create(form)
    if (ok) { setForm({ name: '', email: '', role: '' }); setEditingId(null) }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Usuarios - CRUD</h2>
      {message.text && <div style={{ padding: 10, background: message.type === 'error' ? '#f8d7da' : '#d4edda', marginBottom: 10 }}>{message.text}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Nombre *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Correo *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="">Rol *</option>
          <option value="Admin">Admin</option>
          <option value="Soporte">Soporte</option>
          <option value="Usuario">Usuario</option>
        </select>
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', email: '', role: '' }) }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td><td>{i.email}</td><td>{i.role}</td>
              <td><button onClick={() => { setEditingId(i.id); setForm(i) }}>Editar</button> <button onClick={() => remove(i.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>Sin usuarios registrados.</p>}
    </div>
  )
}