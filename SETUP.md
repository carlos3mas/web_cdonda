# Guía de Configuración Rápida

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias y generará el cliente de Prisma automáticamente.

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar desde el template
copy .env.example .env
```

Edita el archivo `.env` con estos valores:

```env
# Base de datos (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# NextAuth - Genera una clave secreta:
# En PowerShell: [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
# En Linux/Mac: openssl rand -base64 32
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Inicializar Base de Datos

```bash
# Crear las tablas en la base de datos
npm run db:push

# Crear un administrador por defecto
npm run seed
```

El seed creará un admin con estas credenciales:
- **Email:** admin@cdonda.com
- **Password:** admin123

⚠️ **Importante:** Cambia estas credenciales después del primer login en producción.

### 4. Iniciar el Servidor

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📂 Rutas Disponibles

### Usuario
- **http://localhost:3000/** - Landing del club (Inicio + Club + Instalaciones + Contacto)
- **http://localhost:3000/campus-navidad** - Página del Campus de Navidad 2025
- **http://localhost:3000/campus-navidad/inscripcion** - Formulario de inscripción

### Navegación
El header contiene:
- **Inicio** → Landing principal
- **Campus de Navidad** → Página del campus
- **Inscríbete** (botón destacado) → Formulario directo

### Administrador
- **http://localhost:3000/admin/login** - Login del panel admin
- **http://localhost:3000/admin/dashboard** - Dashboard (requiere login)

## 🔐 Primer Acceso al Panel Admin

1. Ve a: http://localhost:3000/admin/login
2. Usa las credenciales:
   - Email: `admin@cdonda.com`
   - Password: `admin123`
3. Accederás al dashboard con:
   - KPIs de inscripciones
   - Tabla de gestión
   - Opciones para descargar PDFs, marcar como pagada, eliminar

## 📊 Visualizar la Base de Datos

Para explorar la base de datos en tiempo real:

```bash
npm run db:studio
```

Esto abrirá Prisma Studio en: **http://localhost:5555**

## 🧪 Probar la Aplicación

### Flujo de Usuario:
1. Abre http://localhost:3000 (información general del club)
2. Navega a "Campus de Navidad" o haz clic en "Inscríbete"
3. Explora la información del campus
4. Ve a "Inscripción" y completa el formulario
5. Al enviar, se descargará automáticamente el PDF
6. La inscripción se guardará en la base de datos

### Flujo de Admin:
1. Ve a http://localhost:3000/admin/login
2. Inicia sesión con las credenciales del seed
3. Visualiza las inscripciones en el dashboard
4. Prueba las acciones:
   - Ver detalles (ícono ojo)
   - Descargar PDF (ícono descarga)
   - Marcar como pagada/pendiente (badge de estado)
   - Eliminar (ícono papelera)

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Base de datos
npm run db:push      # Sincronizar esquema con la BD
npm run db:studio    # Abrir Prisma Studio
npm run seed         # Ejecutar seed (crear admin)

# Otros
npm run lint         # Ejecutar linter
```

## 🎨 Personalización

### Colores del Club
Los colores principales están definidos en `app/globals.css`:
- Rojo primario: `#dc2626`
- Fondo oscuro: Configurado en las variables CSS

### Datos de Contacto
Edita los datos en:
- `components/landing/LocationSection.tsx` - Información de contacto
- `components/landing/Footer.tsx` - Footer con redes sociales

### Campos del Formulario
Para agregar o modificar campos de inscripción:
1. Actualiza `prisma/schema.prisma`
2. Ejecuta `npm run db:push`
3. Modifica `types.ts` con los nuevos campos
4. Actualiza `components/inscripcion/InscripcionForm.tsx`
5. Actualiza `lib/pdfGenerator.ts` para incluir los campos en el PDF

## 📝 Crear Más Administradores

### Opción 1: Desde el código (recomendado para desarrollo)
Edita `prisma/seed.ts` y agrega más admins, luego ejecuta:
```bash
npm run seed
```

### Opción 2: Via API (manual)
Haz un POST a `http://localhost:3000/api/admin` con:
```json
{
  "email": "nuevo@cdonda.com",
  "nombre": "Nombre Admin",
  "password": "contraseña"
}
```

## 🚀 Despliegue a Producción

### Vercel (Recomendado)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Despliega:
```bash
vercel
```

3. Configura las variables de entorno en el dashboard de Vercel:
   - `DATABASE_URL` - Conexión a PostgreSQL (usar Vercel Postgres o similar)
   - `NEXTAUTH_SECRET` - Clave secreta generada
   - `NEXTAUTH_URL` - Tu dominio de producción

4. Para PostgreSQL en producción, cambia el provider en `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // cambiar de sqlite a postgresql
  url      = env("DATABASE_URL")
}
```

## 📞 Soporte

Si encuentras problemas:
1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Asegúrate de que el archivo `.env` existe y está configurado
3. Verifica que la base de datos esté inicializada: `npm run db:push`
4. Revisa los logs en la consola para errores específicos

---

¡Listo! Tu aplicación Campus CD Onda está configurada y funcionando. 🎉

