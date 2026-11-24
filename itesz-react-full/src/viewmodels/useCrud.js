import { useState } from 'react'

export function useCrud(initialData = [], validate) {
  const [items, setItems] = useState(initialData)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingId, setEditingId] = useState(null)

  const showMessage = (type, text) => {
    setMessage({ type, text })
    // Lo dejamos 4 segundos para que sí lo veas
    setTimeout(() => setMessage({ type: '', text: '' }), 4000)
  }

  const create = (data) => {
    const error = validate ? validate(data, items, null) : null
    if (error) {
      showMessage('error', error)
      return false
    }
    const newItem = { ...data, id: Date.now() }
    setItems(prev => [...prev, newItem])
    showMessage('success', 'Registro creado correctamente')
    return true
  }

  const update = (id, data) => {
    const error = validate ? validate(data, items, id) : null
    if (error) {
      showMessage('error', error)
      return false
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i))
    setEditingId(null)
    showMessage('success', 'Registro actualizado correctamente')
    return true
  }

  const remove = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro?')) return
    setItems(prev => prev.filter(i => i.id !== id))
    showMessage('success', 'Registro eliminado correctamente')
  }

  return { items, message, editingId, setEditingId, create, update, remove }
}