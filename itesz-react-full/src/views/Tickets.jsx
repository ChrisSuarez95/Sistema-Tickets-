import { useState } from 'react'

function formatearFecha(valor){
  if(!valor) return "-"
  const d = new Date(valor)
  if(isNaN(d.getTime())) return valor
  return d.toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

export default function Tickets({ vm, data, user }){
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [filtroDepto, setFiltroDepto] = useState("Todos")
  const [filtroAsignado, setFiltroAsignado] = useState("Todos")

  // FILTROS
  const filtrados = vm.tickets.filter(t => {
    const texto = (busqueda || "").toLowerCase()
    const coincideBusqueda = !texto || 
      (t.num || "").toLowerCase().includes(texto) ||
      (t.cliente || "").toLowerCase().includes(texto) ||
      (t.asunto || t.titulo || "").toLowerCase().includes(texto) ||
      (t.desc || t.descripcion || "").toLowerCase().includes(texto) ||
      (t.registradoPor || "").toLowerCase().includes(texto)

    const coincideEstado = filtroEstado === "Todos" || t.estado === filtroEstado
    const coincideDepto = filtroDepto === "Todos" || t.depto === filtroDepto
    const coincideAsignado = filtroAsignado === "Todos" || 
      (filtroAsignado === "Sin asignar" && !t.asignadoA) ||
      t.asignadoA === filtroAsignado

    return coincideBusqueda && coincideEstado && coincideDepto && coincideAsignado
  })

  const limpiarFiltros = () => {
    setBusqueda("")
    setFiltroEstado("Todos")
    setFiltroDepto("Todos")
    setFiltroAsignado("Todos")
  }

  // Contadores para que se vea pro
  const totalAbiertos = vm.tickets.filter(t => t.estado === "Abierto").length
  const totalProceso = vm.tickets.filter(t => t.estado === "En Proceso").length
  const totalTerminados = vm.tickets.filter(t => t.estado === "Terminado" || t.estado === "Cerrado").length

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h2 className="text-[18px] font-bold">Tickets ({filtrados.length} de {vm.tickets.length})</h2>
        <button 
          onClick={vm.openNew} 
          className="bg-[#3c8dbc] text-white px-4 py-2 rounded font-bold hover:bg-[#367fa9]"
        >
          + Nuevo Ticket
        </button>
      </div>

      {/* CONTADORES */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-100 rounded p-3 text-center cursor-pointer" onClick={() => setFiltroEstado("Abierto")}>
          <p className="text-[22px] font-bold text-blue-800">{totalAbiertos}</p>
          <p className="text-[11px] font-bold text-blue-600 uppercase">Abiertos</p>
        </div>
        <div className="bg-yellow-100 rounded p-3 text-center cursor-pointer" onClick={() => setFiltroEstado("En Proceso")}>
          <p className="text-[22px] font-bold text-yellow-800">{totalProceso}</p>
          <p className="text-[11px] font-bold text-yellow-600 uppercase">En Proceso</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center cursor-pointer" onClick={() => setFiltroEstado("Terminado")}>
          <p className="text-[22px] font-bold text-green-800">{totalTerminados}</p>
          <p className="text-[11px] font-bold text-green-600 uppercase">Terminados</p>
        </div>
      </div>

      {/* BUSCADOR + FILTROS */}
      <div className="bg-white rounded shadow p-3 mb-4 flex flex-wrap gap-2 items-center">
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar por num, cliente, asunto..."
          className="border rounded px-3 py-2 flex-1 min-w-[200px]"
        />
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="border rounded px-3 py-2">
          <option value="Todos">Todos los estados</option>
          <option>Abierto</option>
          <option>En Proceso</option>
          <option>Terminado</option>
          <option>Cerrado</option>
        </select>
        <select value={filtroDepto} onChange={e => setFiltroDepto(e.target.value)} className="border rounded px-3 py-2">
          <option value="Todos">Todos los deptos</option>
          {data.depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filtroAsignado} onChange={e => setFiltroAsignado(e.target.value)} className="border rounded px-3 py-2">
          <option value="Todos">Todos asignados</option>
          <option value="Sin asignar">Sin asignar</option>
          {data.users.filter(u => u.rol === "Tecnico" || u.rol === "Admin").map(u => (
            <option key={u.id} value={u.nombre}>{u.nombre}</option>
          ))}
        </select>
        <button onClick={limpiarFiltros} className="bg-gray-200 px-3 py-2 rounded font-bold text-[13px]">
          Limpiar
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-left">
            <thead>
              <tr className="bg-[#f4f4f4] border-b text-[12px] uppercase text-gray-600">
                <th className="p-3 whitespace-nowrap">Num</th>
                <th className="p-3 whitespace-nowrap">Fecha</th>
                <th className="p-3 whitespace-nowrap">Cliente</th>
                <th className="p-3 whitespace-nowrap">Asunto / Descripción</th>
                <th className="p-3 whitespace-nowrap">Depto</th>
                <th className="p-3 whitespace-nowrap">Estado</th>
                <th className="p-3 whitespace-nowrap">Registrado Por</th>
                <th className="p-3 whitespace-nowrap">Asignado Por</th>
                <th className="p-3 whitespace-nowrap">Asignado A</th>
                <th className="p-3 whitespace-nowrap">Finalizado Por</th>
                <th className="p-3 whitespace-nowrap">Fecha Fin</th>
                <th className="p-3 whitespace-nowrap">Imagen</th>
                <th className="p-3 whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="p-3 font-bold whitespace-nowrap">{t.num}</td>
                  <td className="p-3 whitespace-nowrap text-[12px]">{formatearFecha(t.fecha)}</td>
                  <td className="p-3 whitespace-nowrap">{t.cliente}</td>
                  <td className="p-3 min-w-[200px]">
                    <p className="font-bold">{t.asunto || t.titulo}</p>
                    <p className="text-[11px] text-gray-500">{t.desc || t.descripcion}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap">{t.depto}</td>
                  <td className="p-3 whitespace-nowrap">
                    <select 
                      value={t.estado} 
                      onChange={e => vm.changeEstado(t.id, e.target.value)}
                      className={`border rounded px-2 py-1 text-[12px] font-bold ${
                        t.estado === "Abierto" ? "bg-blue-100 text-blue-800" :
                        t.estado === "En Proceso" ? "bg-yellow-100 text-yellow-800" :
                        t.estado === "Terminado" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <option>Abierto</option>
                      <option>En Proceso</option>
                      <option>Terminado</option>
                      <option>Cerrado</option>
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">{t.registradoPor || t.cliente || "-"}</td>
                  <td className="p-3 whitespace-nowrap">{t.asignadoPor || "-"}</td>
                  <td className="p-3 whitespace-nowrap">
                    <select 
                      value={t.asignadoA || ""} 
                      onChange={e => vm.changeAsignado(t.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Sin asignar</option>
                      {data.users.filter(u => u.rol === "Tecnico" || u.rol === "Admin").map(u => (
                        <option key={u.id} value={u.nombre}>{u.nombre}</option>
                      ))}
                      {t.asignadoA && !data.users.some(u => u.nombre === t.asignadoA) && (
                        <option value={t.asignadoA}>{t.asignadoA}</option>
                      )}
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">{t.finalizadoPor || "-"}</td>
                  <td className="p-3 whitespace-nowrap text-[12px]">{formatearFecha(t.fechaFin)}</td>
                  <td className="p-3 whitespace-nowrap">
                    {t.imagen ? (
                      <a href={t.imagen} target="_blank" rel="noreferrer" className="text-blue-600 underline text-[12px]">Ver imagen</a>
                    ) : "-"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {user.rol === "Admin" && (
                      <button 
                        onClick={() => vm.deleteTicket(t.id)}
                        className="bg-[#dd4b39] text-white px-3 py-1 rounded text-[12px] font-bold hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="13" className="p-6 text-center text-gray-500">
                    No se encontró ningún ticket con esos filtros. Dale a Limpiar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-2">* Desliza hacia la derecha con el scroll de abajo para ver todos los campos 👉</p>
    </div>
  )
}