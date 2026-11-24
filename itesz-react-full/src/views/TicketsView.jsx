import { useState } from 'react'
import { useCrud } from '../viewmodels/useCrud'
import { validateTicket } from '../models/validation'

export default function TicketsView() {
  const { items, message, editingId, setEditingId, create, update, remove } = useCrud([
    { id: 1, title: 'Falla en laboratorio 3', department: 'Sistemas', priority: 'Alta', status: 'Abierto' }
  ], validateTicket)

  const [form, setForm] = useState({ title: '', department: '', priority: 'Media', status: 'Abierto' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = editingId ? update(editingId, form) : create(form)
    if (ok) { setForm({ title: '', department: '', priority: 'Media', status: 'Abierto' }); setEditingId(null) }
  }

  const handleEdit = (item) => { setEditingId(item.id); setForm(item) }

  return (
    <div style={{ padding: 20 }}>
      <h2>Tickets - CRUD</h2>
      {message.text && (
        <div style={{
          padding: 12,
          background: message.type === 'error' ? '#f8d7da' : '#d4edda',
          color: message.type === 'error' ? '#721c24' : '#155724',
          border: message.type === 'error' ? '2px solid red' : '2px solid green',
          fontWeight: 'bold',
          marginBottom: 12,
          borderRadius: 5
        }}>
          {message.type === 'error' ? '❌ ' : '✅ '}{message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Título del ticket *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
          <option value="">Departamento *</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Escolares">Escolares</option>
          <option value="Finanzas">Finanzas</option>
        </select>
        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', department: '', priority: 'Media', status: 'Abierto' }) }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead><tr><th>Título</th><th>Depto</th><th>Prioridad</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.title}</td><td>{i.department}</td><td>{i.priority}</td>
              <td><button onClick={() => handleEdit(i)}>Editar</button> <button onClick={() => remove(i.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>Sin registros. Crea el primero.</p>}
      <p>Total: {items.length} tickets</p>
    </div>
  )
}