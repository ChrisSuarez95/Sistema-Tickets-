import { useState } from 'react'
import { useCrud } from '../viewmodels/useCrud'
import { validateTicket } from '../models/validation'

export default function CrudDemo() {
  const { items, message, editingId, setEditingId, create, update, remove } = useCrud([], validateTicket)
  const [form, setForm] = useState({ title: '', department: '', priority: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = editingId ? update(editingId, form) : create(form)
    if (ok) setForm({ title: '', department: '', priority: '' })
  }

  return (
    <div>
      {message.text && (
        <div style={{ background: message.type === 'error' ? '#f8d7da' : '#d4edda', padding: 10 }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input placeholder="Título del ticket" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
          <option value="">Departamento</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Escolares">Escolares</option>
        </select>
        <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
          <option value="">Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Baja">Baja</option>
        </select>
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <table>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.department}</td>
              <td>
                <button onClick={() => { setEditingId(item.id); setForm(item) }}>Editar</button>
                <button onClick={() => remove(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>Sin registros. Crea el primero.</p>}
    </div>
  )
}