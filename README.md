# 🎫 Sistema de Tickets

Sistema web para reportar problemas y dar seguimiento a solicitudes de mantenimiento.
El usuario crea un ticket y el administrador lo atiende hasta asignarlo a un técnico y el lo cierre.

---

## 🚀 Tecnologías

- **Frontend:** React - carpeta `itesz-react-full`
- **Backend:** Node.js + Express - carpeta `API de tickets`
- **Base de datos:** MySQL - base `tickets_db`
- **Contenedores:** Docker + Docker Compose
- **CI:** GitHub Actions

---

## 📁 Estructura del Proyecto
Sistema-Tickets-/
├── itesz-react-full/      # Frontend en React
├── API de tickets/        # Backend en Node + Express
├── docker-compose.yml     # Levanta Frontend + Backend + MySQL
└── .github/workflows/     # CI con GitHub Actions


---

## ⚙️ Cómo correrlo con Docker (Recomendado)

Solo necesitas Docker instalado. Con un comando levantas todo:

```bash
docker compose up --build

Esto levanta:
1. Frontend en http://localhost:5173
2. Backend en http://localhost:3001
3. MySQL con la base tickets_db
Para apagarlo:

docker compose down

💻 Cómo correrlo sin Docker1.
1. Base de datos
Abre MySQL Workbench y crea la base:
CREATE DATABASE tickets_db;

2. Backend - Terminal 1
cd "API de tickets"
npm install
npm start

3. Frontend - Terminal 2
cd itesz-react-full
npm install
npm run dev

Abre en el navegador el link que te dé, normalmente http://localhost:5173
🗃️ Base de Datos tickets_db
usuarios - Usuarios y administradores
departamentos - Departamentos de la escuela / empresa
solicitudes - Tickets creados por los usuarios
ordenes - Seguimiento y atención de los tickets
Ejemplo:
SELECT * FROM tickets;

🔄 Flujo del Sistema
Usuario se loguea
Usuario crea un ticket con departamento, prioridad y descripción
El ticket se guarda en MySQL
Administrador ve el ticket y lo asigna a un tecnico
El técnico cambia el status a proceso, cerrado o no se realizo y descripción 
Usuario ve el estado actualizado

✅ CI - GitHub Actions
Cada vez que se hace push a la rama maestro, se dispara automáticamente el CI.
El CI corre en Ubuntu con Node 20, instala dependencias y corre las pruebas.
Si sale en palomita verde ✅, todo pasó correctamente.

👨‍💻 Autor Christian E. Suarez Z.
Proyecto - Sistema de Tickets
ITESZ
