# Scripts de Administración

## create-admin.js

Script para crear administradores en la base de datos.

### Uso

El script **requiere** variables de entorno para las credenciales:

```bash
# En desarrollo (con .env.local)
node scripts/create-admin.js

# O directamente con variables de entorno
ADMIN_EMAIL="tu@email.com" ADMIN_PASSWORD="tuPassword" ADMIN_NAME="Tu Nombre" node scripts/create-admin.js
```

### Variables de Entorno Requeridas

- `ADMIN_EMAIL`: Email del administrador (obligatorio)
- `ADMIN_PASSWORD`: Contraseña del administrador (obligatorio)
- `ADMIN_NAME`: Nombre del administrador (opcional, por defecto: "Administrador CD Onda")

### Seguridad

⚠️ **IMPORTANTE**: 
- Nunca incluyas credenciales reales en el código
- Usa siempre variables de entorno
- En producción, usa contraseñas fuertes y únicas
- Cambia las credenciales después del primer login

## init-production-db.js

Script para inicializar la base de datos en producción.

## optimize-images.js

Script para optimizar imágenes del proyecto.

