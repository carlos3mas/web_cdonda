# Campus CD Onda - Fase 1

Aplicación web moderna y escalable para el Campus de Navidad 2025 del CD Onda.

## Características

### Landing Page
- Historia e identidad del club
- Localización y fotos de los campos
- Sección con equipaciones y galería
- Botones CTA para inscribirse al Campus 2025
- Diseño moderno, deportivo y responsive

### Formulario de Inscripción
- Campos completos para datos del jugador y tutor
- Generación automática de PDF idéntico al modelo 2024 (actualizado a 2025)
- Descarga inmediata del PDF
- Guardado en base de datos

### Panel de Administración
- Login protegido con NextAuth.js
- Listado completo de inscripciones
- KPIs: total inscripciones, pagadas y pendientes
- Acciones: ver detalles, descargar PDF, marcar pagada/no pagada, eliminar
- CRUD de administradores

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Estilos:** TailwindCSS, shadcn/ui
- **Animaciones:** Framer Motion
- **Backend:** API Routes de Next.js
- **Autenticación:** NextAuth.js
- **Base de Datos:** Prisma con SQLite (dev) / PostgreSQL (prod)
- **PDF:** pdf-lib

## Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env y configurar:
# - DATABASE_URL
# - NEXTAUTH_SECRET (generar con: openssl rand -base64 32)
# - NEXTAUTH_URL
```

3. **Inicializar la base de datos:**
```bash
npx prisma generate
npx prisma db push
```

4. **Crear un administrador inicial:**

Puedes usar el script de seed o hacerlo manualmente a través de la API:

```bash
# Opción 1: Seed automático (próximamente)
# npm run seed

# Opción 2: Manualmente después de iniciar el servidor
# POST a /api/admin con:
# { "email": "admin@cdonda.com", "nombre": "Admin", "password": "tuPassword" }
```

5. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Rutas Principales

- `/` - Landing page del club (Inicio + El Club + Instalaciones + Contacto)
- `/campus-navidad` - Página específica del Campus de Navidad 2025
- `/campus-navidad/inscripcion` - Formulario de inscripción
- `/admin/login` - Login del panel de administración
- `/admin/dashboard` - Dashboard administrativo

## Navegación

El navbar contiene solo:
- **Inicio** - Lleva a la landing principal
- **Campus de Navidad** - Lleva a la página del campus

## API Endpoints

### Inscripciones
- `GET /api/inscripciones` - Listar todas las inscripciones
- `POST /api/inscripciones` - Crear nueva inscripción
- `GET /api/inscripciones/[id]` - Obtener inscripción específica
- `PATCH /api/inscripciones/[id]` - Actualizar inscripción
- `DELETE /api/inscripciones/[id]` - Eliminar inscripción
- `GET /api/inscripciones/[id]/pdf` - Descargar PDF de inscripción
- `GET /api/inscripciones/stats` - Obtener estadísticas

### Administradores
- `GET /api/admin` - Listar administradores
- `POST /api/admin` - Crear nuevo administrador

## Estructura del Proyecto

```
.
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── admin/             # Panel de administración
│   ├── inscripcion/       # Formulario de inscripción
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Landing page
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── landing/          # Componentes de landing
│   ├── inscripcion/      # Componentes de inscripción
│   └── admin/            # Componentes de admin
├── lib/                  # Utilidades y configuración
│   ├── prisma.ts         # Cliente de Prisma
│   ├── auth.ts           # Configuración de NextAuth
│   ├── utils.ts          # Utilidades generales
│   └── pdfGenerator.ts   # Generador de PDFs
├── prisma/               # Esquema de base de datos
│   └── schema.prisma
└── types.ts              # Tipos TypeScript globales
```

## Desarrollo

### Base de Datos

Para visualizar la base de datos durante el desarrollo:
```bash
npx prisma studio
```

### Build de Producción

```bash
npm run build
npm start
```

## Extensibilidad Futura

El código está preparado para futuras fases:
- Integración de pagos online (Stripe/Redsys)
- Módulos de campus de verano
- Sistema de notificaciones automáticas por email
- Dashboard de estadísticas avanzadas
- Sistema de check-in diario

## Diseño

- **Colores principales:** Rojo (#dc2626), Blanco, Gris oscuro
- **Tipografía:** Inter (Google Fonts)
- **Estilo:** Moderno, deportivo, profesional

## Autor

Desarrollado para el Club Deportivo Onda - Campus de Navidad 2025

## Licencia

Privado - Todos los derechos reservados

