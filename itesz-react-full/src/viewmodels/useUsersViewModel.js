import { useState, useEffect } from 'react'
const API = 'http://localhost:3002/api/users'
const API_DEPTOS = 'http://localhost:3002/api/deptos'

export function useUsersViewModel(data, setData){
  const [showUser, setShowUser] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({nombre:"", email:"", pass:"", rol:"Cliente", depto:"General"})

  // Cargar usuarios y deptos desde MySQL al iniciar
  useEffect(() => {
    fetch(API).then(r=>r.json()).then(usersDB=>{
      if(Array.isArray(usersDB)) setData(p=>({...p, users: usersDB}))
    }).catch(()=>{})
    fetch(API_DEPTOS).then(r=>r.json()).then(deptosDB=>{
      if(Array.isArray(deptosDB)) setData(p=>({...p, depts: deptosDB}))
    }).catch(()=>{})
  }, [])

  const openNewUser = () => {
    setEditingUser(null)
    setUserForm({nombre:"", email:"", pass:"", rol:"Cliente", depto: data.depts[0]||"General"})
    setShowUser(true)
  }

  const openEditUser = (u) => {
    setEditingUser(u)
    setUserForm({nombre:u.nombre, email:u.email, pass:u.pass, rol:u.rol, depto:u.depto})
    setShowUser(true)
  }

  const saveUser = async () => {
    if(!userForm.nombre.trim()) return alert("Nombre obligatorio")
    if(!userForm.email.includes("@")) return alert("Email no válido")
    if(!editingUser && userForm.pass.length < 3) return alert("Pass mínimo 3 caracteres")
    try {
      const method = editingUser ? 'PUT' : 'POST'
      const url = editingUser ? `${API}/${editingUser.id}` : API
      const res = await fetch(url, {method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(userForm)})
      const result = await res.json()
      if(!res.ok) return alert(result.message || "Error al guardar")
      if(editingUser){
        setData(p=>({...p, users: p.users.map(x=>x.id===editingUser.id?result:x)}))
      } else {
        setData(p=>({...p, users: [result, ...p.users]}))
      }
      setShowUser(false)
    } catch(e){ alert("No conecta con backend") }
  }

  const deleteUser = async (id) => {
    if(!confirm("¿Eliminar usuario?")) return
    try {
      await fetch(`${API}/${id}`, {method:'DELETE'})
      setData(p=>({...p, users: p.users.filter(x=>x.id!==id)}))
    } catch(e){ alert("Error al eliminar") }
  }

  // Deptos
  const addDepto = async (nombre) => {
    if(!nombre.trim()) return
    try {
      const res = await fetch(API_DEPTOS, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({nombre: nombre.trim()})})
      const lista = await res.json()
      if(!res.ok) return alert(lista.message || "Error")
      setData(p=>({...p, depts: lista}))
    } catch(e){ alert("Error al agregar depto") }
  }

  const deleteDepto = async (nombre) => {
    if(!confirm(`¿Eliminar depto ${nombre}?`)) return
    try {
      await fetch(`${API_DEPTOS}/${nombre}`, {method:'DELETE'})
      setData(p=>({...p, depts: p.depts.filter(d=>d!==nombre)}))
    } catch(e){ alert("Error al eliminar") }
  }

  return { showUser, setShowUser, editingUser, userForm, setUserForm, openNewUser, openEditUser, saveUser, deleteUser, addDepto, deleteDepto }
}