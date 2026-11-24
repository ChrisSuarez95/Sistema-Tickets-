import { useState } from 'react'
import { useCrud } from '../viewmodels/useCrud'
import { validateDepartment } from '../models/validation'

export default function DepartmentsView() {
  const { items, message, editingId, setEditingId, create, update, remove } = useCrud([
    { id: 1, name: 'Sistemas', description: 'Soporte técnico' },
    { id: 2, name: 'Escolares', description: 'Control escolar' }
  ], validateDepartment)

  const [form, setForm] = useState({ name: '', description: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = editingId ? update(editingId, form) : create(form)
    if (ok) { setForm({ name: '', description: '' }); setEditingId(null) }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Departamentos - CRUD</h2>
      {message.text && <div style={{ padding: 10, background: message.type === 'error' ? '#f8d7da' : '#d4edda', marginBottom: 10 }}>{message.text}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Nombre del departamento *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }) }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td><td>{i.description}</td>
              <td><button onClick={() => { setEditingId(i.id); setForm(i) }}>Editar</button> <button onClick={() => remove(i.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>Sin departamentos.</p>}
    </div>
  )
}