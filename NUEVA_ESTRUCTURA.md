# 🔄 Nueva Estructura del Sitio Web

## 📐 Arquitectura Actualizada

La web del CD Onda ahora sigue una estructura similar a sitios profesionales como [totperfira.es](https://totperfira.es/), con una separación clara entre información general y servicios específicos.

## 🗺️ Mapa del Sitio

```
CD Onda
│
├── 🏠 INICIO (/)
│   ├── Información General del Club
│   ├── Historia y Valores
│   ├── Instalaciones
│   ├── Equipos y Categorías
│   └── CTA: Campus de Navidad
│
├── ⛄ CAMPUS DE NAVIDAD (/campus-navidad)
│   ├── Información del Campus 2025
│   ├── Fechas y Horarios
│   ├── Qué Incluye
│   ├── Localización
│   └── CTA: Inscripción
│
├── 📝 INSCRIPCIÓN (/campus-navidad/inscripcion)
│   ├── Formulario Completo
│   ├── Generación de PDF
│   └── Confirmación
│
└── 👨‍💼 ADMIN (/admin)
    ├── Login
    └── Dashboard
```

## 🎯 Beneficios de la Nueva Estructura

### 1. **Mejor Experiencia de Usuario**
- Separación clara entre información general y servicios específicos
- Navegación intuitiva con header fijo
- Rutas lógicas y organizadas

### 2. **SEO Mejorado**
- URLs semánticas: `/campus-navidad` en lugar de `/inscripcion`
- Estructura jerárquica clara
- Contenido específico por página

### 3. **Escalabilidad**
Ahora es fácil agregar más servicios:
- `/campus-verano` - Campus de verano
- `/escuela-futbol` - Información de la escuela permanente
- `/torneos` - Torneos organizados por el club

### 4. **Coherencia Visual**
- Header consistente en todas las páginas
- Navegación unificada
- Identidad de marca reforzada

## 📄 Descripción de Páginas

### 🏠 Página Principal (/)
**Objetivo**: Presentar el club y su trayectoria

**Contenido**:
- Hero section con el logo y eslogan del club
- Historia: Timeline desde 1944 hasta hoy
- Valores: Excelencia, Trabajo en Equipo, Pasión, Compromiso
- Instalaciones: Campo principal, campos auxiliares, vestuarios, zona social
- Equipos: Todas las categorías desde prebenjamín hasta sénior
- Call-to-Action destacado al Campus de Navidad

**Público objetivo**: Nuevos visitantes, padres buscando club para sus hijos, aficionados

---

### ⛄ Campus de Navidad (/campus-navidad)
**Objetivo**: Vender el campus y generar inscripciones

**Contenido**:
- Hero específico del campus con fechas destacadas
- Qué aprenderán los niños
- Actividades incluidas
- Horarios y logística
- Galería de fotos de ediciones anteriores (simulada)
- Llamadas a acción para inscripción

**Público objetivo**: Padres interesados en inscribir a sus hijos

---

### 📝 Inscripción (/campus-navidad/inscripcion)
**Objetivo**: Capturar inscripciones

**Contenido**:
- Formulario completo con validación
- Generación automática de PDF
- Confirmación visual del envío
- Información de contacto para dudas

**Conversión**: Inscripción → PDF → Base de datos

---

### 👨‍💼 Admin (/admin/dashboard)
**Sin cambios** - Mantiene toda la funcionalidad actual

## 🎨 Componentes Nuevos

### Header (`components/layout/Header.tsx`)
- Navegación fija en la parte superior
- Responsive con menú hamburguesa en móvil
- Enlaces a todas las secciones principales
- CTA destacado "Inscríbete"

### Secciones del Club
1. **ClubHeroSection** - Hero principal con identidad del club
2. **ClubHistorySection** - Timeline histórica y valores
3. **ClubFacilitiesSection** - Instalaciones y ubicación
4. **ClubTeamsSection** - Categorías y estadísticas
5. **CampusCallToAction** - Promoción del campus

## 🔄 Cambios Técnicos

### Rutas Modificadas
```diff
- /                     → Antes: Info Campus | Ahora: Info Club
- /inscripcion          → Movida a /campus-navidad/inscripcion
+ /campus-navidad       → Nueva: Info específica del campus
```

### Estructura de Directorios
```
app/
├── page.tsx                    [MODIFICADO] Landing del club
├── campus-navidad/
│   ├── page.tsx               [NUEVO] Info del campus
│   └── inscripcion/
│       └── page.tsx           [MOVIDO] Formulario
└── admin/                     [SIN CAMBIOS]

components/
├── layout/
│   └── Header.tsx             [NUEVO] Navegación global
├── club/                      [NUEVO]
│   ├── ClubHeroSection.tsx
│   ├── ClubHistorySection.tsx
│   ├── ClubFacilitiesSection.tsx
│   ├── ClubTeamsSection.tsx
│   └── CampusCallToAction.tsx
└── landing/                   [Reutilizado para campus]
```

## 📱 Navegación

### Desktop
```
[CD ONDA] Inicio | El Club | Instalaciones | Campus de Navidad | [Inscríbete]
```

### Mobile
```
[CD ONDA]  [≡]
    ↓
  [Menu]
  - Inicio
  - El Club
  - Instalaciones
  - Campus de Navidad
  - [Inscríbete]
```

## 🎯 Flujo del Usuario

### Nuevo Usuario
```
Landing (/) 
  → Conoce el club
  → Ve CTA del Campus
  → /campus-navidad
  → Se convence
  → /campus-navidad/inscripcion
  → Inscribe
```

### Usuario que ya conoce el campus
```
Landing (/)
  → Header: "Inscríbete"
  → /campus-navidad/inscripcion
  → Inscribe directamente
```

### Administrador
```
/admin/login
  → Dashboard
  → Gestiona inscripciones
```

## 🚀 Próximos Pasos Sugeridos

1. **Imágenes reales**: Sustituir placeholders por fotos del club
2. **Testimonios**: Agregar opiniones de padres y jugadores
3. **Galería**: Fotos de campus anteriores
4. **Blog**: Noticias y novedades del club
5. **Campus de verano**: Replicar estructura para otros campus

## ✅ Checklist de Migración

- [x] Crear header global con navegación
- [x] Reestructurar landing como página del club
- [x] Crear página específica del Campus de Navidad
- [x] Mover formulario de inscripción
- [x] Actualizar todos los enlaces internos
- [x] Actualizar documentación (README, SETUP)
- [x] Mantener compatibilidad con panel admin
- [x] Preservar API routes sin cambios

---

**La nueva estructura está lista y funcionando.** El servidor debe reiniciarse automáticamente con los cambios. Si no, ejecuta `npm run dev` nuevamente.

