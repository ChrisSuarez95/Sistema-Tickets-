import { useState } from 'react'
export function useAppViewModel(){
  const [view, setView] = useState("Dashboard")
  const [data, setData] = useState({
    tickets: [],
    users: [
      {id:1, nombre:"chris", email:"prueba123@gmail.com", password:"chris123", rol:"Admin", depto:"TI"},
      {id:2, nombre:"Juan Pérez", email:"juan@test.com", password:"123456", rol:"Tecnico", depto:"Soporte"},
      {id:3, nombre:"María López", email:"maria@test.com", password:"maria123", rol:"Cliente", depto:"General"},
    ],
    depts: ["Soporte","TI","Ventas","RH","General"],
  })
  return { data, setData, view, setView }
}