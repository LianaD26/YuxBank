# YuxBank API - Guía de Configuración

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

### 2. Configuración de la Base de Datos (Supabase)

Para conectar tu API con Supabase:

1. **Accede a tu proyecto en Supabase**: https://supabase.com/dashboard
2. **Ve a Settings → Database**
3. **Copia la información de conexión** y actualiza tu archivo `.env`:

   ```env
   DB_HOST=db.xxxxxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_contraseña_de_supabase
   DB_DATABASE=postgres
   ```

4. **Configura el puerto del servidor** (opcional):
   ```env
   PORT=3000
   ```

### 3. JWT Secret

Genera un JWT secret seguro ejecutando:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y pégalo en tu archivo `.env`:

```env
JWT_SECRET=el_token_generado_aqui
```

### 4. Instalación de Dependencias

```bash
npm install
```

### 5. Ejecutar la Aplicación

**Modo desarrollo:**
```bash
npm run start:dev
```

**Modo producción:**
```bash
npm run build
npm run start:prod
```

## ⚠️ Importante

- **NUNCA** subas el archivo `.env` al repositorio (ya está en `.gitignore`)
- **SIEMPRE** mantén las credenciales seguras
- **ACTUALIZA** `.env.example` si agregas nuevas variables de entorno (sin poner valores reales)

## 🔐 Seguridad

- Las credenciales de la base de datos se obtienen de variables de entorno
- El archivo `.env` está excluido del control de versiones
- Usa contraseñas fuertes para la base de datos
- Cambia el JWT_SECRET en producción

## 📝 Notas Adicionales

- La conexión con Supabase requiere SSL (ya configurado)
- TypeORM sincronizará automáticamente las tablas con tus entidades
- El logging de queries está habilitado en desarrollo para debugging
