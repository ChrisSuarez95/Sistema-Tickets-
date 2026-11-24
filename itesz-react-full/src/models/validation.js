export const validateTicket = (d, items, editingId) => {
  if (!d.title || !d.title.trim()) return 'El título es obligatorio'
  if (d.title.trim().length < 5) return 'El título debe tener mínimo 5 caracteres'
  if (!d.department) return 'Selecciona un departamento'
  if (!d.priority) return 'Selecciona una prioridad'
  return null
}

export const validateUser = (d, items, editingId) => {
  if (!d.name?.trim()) return 'El nombre es obligatorio'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '')) return 'Correo electrónico inválido'
  if (items.some(u => u.email === d.email && u.id !== editingId)) return 'Ese correo ya está registrado'
  if (!d.role) return 'Selecciona un rol'
  return null
}

export const validateDepartment = (d, items, editingId) => {
  if (!d.name?.trim()) return 'El nombre del departamento es obligatorio'
  if (items.some(x => x.name.toLowerCase() === d.name.toLowerCase() && x.id !== editingId)) return 'Ese departamento ya existe'
  return null
}