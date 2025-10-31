# 🎉 Commit Inicial - Campus CD Onda

## 📋 Resumen del Proyecto

Aplicación web completa para el Campus de Navidad 2025 del Club Deportivo Onda con sistema de inscripciones y panel administrativo.

## ✨ Características Implementadas

### 🏠 Landing Principal (/)
- Hero section con presentación del club (fundado en 1944)
- Historia del club con timeline de evolución
- Sección de trayectoria con contadores animados (75+ años, 5000+ jugadores, 50+ campeonatos)
- Instalaciones del club con descripción detallada
- Equipos completos (12 categorías):
  - Chupetines (3-4 años)
  - Querubines (4-5 años)
  - Prebenjamín, Benjamín, Alevín, Infantil
  - Cadete, Juvenil
  - Amateur, Veteranos
  - EDI (equipo inclusivo)
  - Primer Equipo
- Contador de estadísticas después de equipos (22 equipos, 380 jugadores, 30 entrenadores)
- Sección de contacto con toda la información
- Footer completo

### ⛄ Campus de Navidad (/campus-navidad)
- Hero específico del campus con fechas destacadas
- ¿Qué incluye? (entrenamiento, camiseta, seguro, diploma, fotos)
- Información práctica (fechas, horarios, edades, lugar, precio)
- Horario diario detallado (9:00-14:00h)
- Call to action final con beneficios destacados

### 📝 Inscripción (/campus-navidad/inscripcion)
- Formulario completo con validación:
  - Datos del jugador (nombre, apellidos, fecha nacimiento, DNI)
  - Datos del tutor (nombre, teléfonos, email)
  - Información adicional (hermanos, alergias, observaciones)
- Generación automática de PDF con diseño profesional
- Descarga inmediata del PDF
- Confirmación visual

### 👨‍💼 Panel de Administración (/admin)
- Login protegido con NextAuth.js
- Dashboard con KPIs en tiempo real:
  - Total de inscripciones
  - Inscripciones pagadas
  - Inscripciones pendientes
- Gestión completa de inscripciones:
  - Ver detalles completos
  - Descargar PDF individual
  - Marcar como pagada/pendiente
  - Eliminar inscripciones
- Sistema de CRUD para administradores

### 🎨 Banner de Sponsors
- Carrusel automático infinito
- Posición fija debajo del navbar
- Visible en todas las páginas
- Diseño discreto y profesional
- Animación suave y continua

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **React 18** con TypeScript
- **TailwindCSS** para estilos
- **shadcn/ui** componentes UI
- **Framer Motion** para animaciones
- **Lucide React** para iconos

### Backend & Database
- **API Routes** de Next.js
- **Prisma ORM** con PostgreSQL
- **Neon** (base de datos en la nube)
- **NextAuth.js** para autenticación

### Generación de PDFs
- **pdf-lib** para crear PDFs personalizados
- Diseño profesional con logo del club
- Todos los datos de inscripción incluidos

## 📁 Estructura del Proyecto

```
web_cdonda/
├── app/
│   ├── page.tsx                    # Landing principal
│   ├── layout.tsx                  # Layout global con banner
│   ├── globals.css                 # Estilos globales
│   ├── api/                        # API Routes
│   │   ├── auth/                   # NextAuth endpoints
│   │   ├── admin/                  # CRUD administradores
│   │   └── inscripciones/          # CRUD inscripciones + PDF
│   ├── campus-navidad/
│   │   ├── page.tsx                # Info del campus
│   │   └── inscripcion/
│   │       └── page.tsx            # Formulario
│   └── admin/
│       ├── login/page.tsx          # Login
│       └── dashboard/page.tsx      # Dashboard
├── components/
│   ├── ui/                         # Componentes base shadcn
│   ├── layout/                     # Header, Banner
│   ├── club/                       # Componentes del club
│   ├── campus/                     # Componentes del campus
│   ├── inscripcion/                # Formulario
│   ├── admin/                      # Dashboard admin
│   └── landing/                    # Landing sections
├── lib/
│   ├── prisma.ts                   # Cliente Prisma
│   ├── auth.ts                     # Config NextAuth
│   ├── utils.ts                    # Utilidades
│   └── pdfGenerator.ts             # Generador de PDFs
├── prisma/
│   ├── schema.prisma               # Esquema DB
│   └── seed.ts                     # Seed admin inicial
├── types.ts                        # Types globales
└── middleware.ts                   # Protección rutas admin
```

## 🗄️ Base de Datos

### Modelos Prisma

**Inscripcion:**
- Datos del jugador (nombre, apellidos, fecha nacimiento, DNI)
- Datos del tutor (nombre, teléfonos, email)
- Información adicional (hermanos, alergias, observaciones)
- Estado de pago (pagada/pendiente)
- Timestamps (createdAt, updatedAt)

**Admin:**
- Email (único)
- Nombre
- Password (hasheado con bcrypt)
- Timestamps

### Conexión
- PostgreSQL en Neon (nube)
- SSL habilitado
- Connection pooling

## 🔐 Seguridad

- ✅ Autenticación con NextAuth.js (JWT)
- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ Middleware protegiendo rutas admin
- ✅ Variables de entorno para secretos
- ✅ SSL en conexión a base de datos
- ✅ Validación de formularios

## 🎨 Diseño

### Paleta de Colores
- **Primario:** Rojo (#dc2626)
- **Secundario:** Blanco
- **Fondo:** Gris oscuro/claro según sección
- **Acentos:** Gradientes rojos

### Características UI
- Diseño responsive (móvil, tablet, desktop)
- Animaciones suaves con Framer Motion
- Contadores animados en estadísticas
- Cards con hover effects
- Badges para estados
- Modals/Dialogs para detalles

## 📊 Funcionalidades Destacadas

### Contadores Animados
- Se animan al entrar en viewport
- Conteo rápido desde 0 hasta valor final
- Implementados con requestAnimationFrame

### Generación de PDF
- Diseño profesional con logo del club
- Header con colores corporativos
- Todos los datos de inscripción
- Fecha de emisión
- ID único de inscripción
- Footer con información del campus

### Banner de Sponsors
- Scroll automático infinito
- Sin cortes ni saltos
- Fijo debajo del navbar
- Gradientes de fade en extremos
- Hover effects

## 🚀 Para Empezar

### Instalación
```bash
npm install
npm run db:push
npm run seed
npm run dev
```

### Acceso Admin
- URL: http://localhost:3000/admin/login
- Email: admin@cdonda.com
- Password: admin123

## 📝 Documentación Incluida

- `README.md` - Documentación completa del proyecto
- `SETUP.md` - Guía de instalación paso a paso
- `ESTRUCTURA_FINAL.md` - Arquitectura detallada
- `NUEVA_ESTRUCTURA.md` - Decisiones de diseño

## 🔄 Próximas Mejoras (Fase 2)

- [ ] Integración de pagos online (Stripe/Redsys)
- [ ] Sistema de envío de emails automáticos
- [ ] Notificaciones push
- [ ] Campus de verano
- [ ] Panel de estadísticas avanzado
- [ ] Sistema de check-in diario
- [ ] Galería de fotos
- [ ] Testimonios de padres/jugadores

## 📦 Dependencias Principales

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "prisma": "^5.9.0",
  "@prisma/client": "^5.9.0",
  "next-auth": "^4.24.5",
  "pdf-lib": "^1.17.1",
  "framer-motion": "^11.0.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.3.3"
}
```

## ✅ Estado del Proyecto

- ✅ Todas las funcionalidades implementadas
- ✅ Base de datos PostgreSQL configurada
- ✅ Sistema de autenticación funcionando
- ✅ Generación de PDFs operativa
- ✅ Responsive en todos los dispositivos
- ✅ Sin errores en consola
- ✅ Listo para producción

---

**Desarrollado para:** Club Deportivo Onda  
**Proyecto:** Campus de Navidad 2025  
**Versión:** 1.0.0  
**Fecha:** Octubre 2025

