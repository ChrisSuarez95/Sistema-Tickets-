import { useState, useEffect } from 'react'
import { canAssign, canClose, canDeleteTicket, visibleTickets } from '../models/ticketModel'

const API = 'http://localhost:3002/api/tickets'

function fechaSistema() {
  return new Date().toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

export function useTicketsViewModel(data, setData, user){
  const [showTicket, setShowTicket] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    cliente: "",
    asunto: "",
    titulo: "",
    desc: "",
    descripcion: "",
    depto: "Soporte",
    estado: "Abierto",
    asignadoA: "",
    imagen: ""
  })

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(ticketsDB => {
        setData(p => ({...p, tickets: ticketsDB}))
      })
      .catch(err => console.log('Error cargando tickets:', err))
  }, [])

  const tickets = user ? visibleTickets(data.tickets, user) : []

  const openNew = () => {
    setTicketForm({
      cliente: user.nombre,
      asunto: "",
      titulo: "",
      desc: "",
      descripcion: "",
      depto: data.depts[0],
      estado: "Abierto",
      asignadoA: "",
      imagen: ""
    })
    setShowTicket(true)
  }

  const saveTicket = async () => {
    const tituloFinal = (ticketForm.asunto || ticketForm.titulo || "").trim()
    const descFinal = (ticketForm.desc || ticketForm.descripcion || "").trim()

    if(!tituloFinal) return alert("El título es obligatorio")
    if(tituloFinal.length < 5) return alert("El asunto debe tener mínimo 5 caracteres")

    const fecha = fechaSistema()

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          ...ticketForm,
          asunto: tituloFinal,
          titulo: tituloFinal,
          desc: descFinal,
          descripcion: descFinal,
          cliente: ticketForm.cliente || user.nombre,
          registradoPor: user.nombre,
          fecha: fecha,
          depto: ticketForm.depto || data.depts[0],
          estado: "Abierto",
          _user: user
        })
      })
      const nuevo = await res.json()
      if(!res.ok) return alert(nuevo.message || "Error al crear ticket")
      
      setData(p=>({...p, tickets:[nuevo, ...p.tickets]}))
      setShowTicket(false)
    } catch(e){ 
      console.log(e)
      alert('No conecta con backend. ¿Está corriendo node index.js?') 
    }
  }

  const changeAsignado = async (id, nuevo) => {
    if(!canAssign(user)) return alert("Solo Admin/Técnico puede asignar")
    const ticket = data.tickets.find(t=>t.id===id)
    if(!ticket) return
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({...ticket, asignadoA:nuevo, asignadoPor:user.nombre})
      })
      const actualizado = await res.json()
      setData(p=>({...p, tickets:p.tickets.map(t=>t.id===id?actualizado:t)}))
    } catch(e){ alert('Error al asignar') }
  }

  const changeEstado = async (id, nuevoEstado) => {
    if(!canClose(user)) return alert("Solo Admin/Técnico puede cerrar")
    const ticket = data.tickets.find(t=>t.id===id)
    if(!ticket) return
    let finalizadoPor = ""
    let fechaFin = ""
    if(nuevoEstado==="Terminado" || nuevoEstado==="Cerrado"){
      finalizadoPor = user.nombre
      fechaFin = fechaSistema()
    }
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({...ticket, estado:nuevoEstado, finalizadoPor, fechaFin})
      })
      const actualizado = await res.json()
      setData(p=>({...p, tickets:p.tickets.map(t=>t.id===id?actualizado:t)}))
    } catch(e){ alert('Error al cambiar estado') }
  }

  const deleteTicket = async (id) => {
    if(!canDeleteTicket(user)) return alert("Solo Admin puede eliminar")
    if(!confirm("¿Eliminar ticket?")) return
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      setData(p=>({...p, tickets:p.tickets.filter(t=>t.id!==id)}))
    } catch(e){ alert('Error al eliminar') }
  }

  return { tickets, showTicket, setShowTicket, ticketForm, setTicketForm, openNew, saveTicket, changeAsignado, changeEstado, deleteTicket }
}