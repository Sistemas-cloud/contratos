# 🔧 Variables de Entorno para Vercel

## ✅ Variables REQUERIDAS

Configura estas variables en **Vercel Dashboard > Settings > Environment Variables**:

### 1. Supabase - Base de Datos
```env
NEXT_PUBLIC_SUPABASE_URL=https://nmxrccrbnoenkahefrrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHJjY3Jibm9lbmthaGVmcnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTE4NDgsImV4cCI6MjA2OTcyNzg0OH0.tJayeMzZjrxqP1nmw1ZbAOPHDEku8nA2EYmlZH9ps38
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHJjY3Jibm9lbmthaGVmcnJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1MTg0OCwiZXhwIjoyMDY5NzI3ODQ4fQ._SIR3rmq7TWukuym30cCP4BAKGe-dhnillDV0Bz6Hf0
```

⚠️ **IMPORTANTE**: 
- Marca `SUPABASE_SERVICE_ROLE_KEY` como **Secret** (no visible en logs)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` puede ser pública

### 2. App Configuration
```env
NEXT_PUBLIC_APP_URL=https://contratos-chi.vercel.app
NEXT_PUBLIC_APP_NAME=Sistema de Contratos
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=contratos
```

### 3. Node Environment (Opcional - Vercel lo configura automáticamente)
```env
NODE_ENV=production
```

## 📋 Pasos para Configurar en Vercel

1. **Ve a tu proyecto en Vercel**: https://vercel.com/dashboard
2. **Selecciona tu proyecto**: `contratos` o el nombre que le hayas dado
3. **Ve a Settings > Environment Variables**
4. **Agrega cada variable una por una**:
   - Click en "Add New"
   - Ingresa el **Name** (ej: `NEXT_PUBLIC_SUPABASE_URL`)
   - Ingresa el **Value** (el valor correspondiente)
   - Para `SUPABASE_SERVICE_ROLE_KEY`, marca la casilla **"Encrypt"** o **"Secret"**
   - Selecciona los ambientes: ✅ Production, ✅ Preview, ✅ Development
   - Click en "Save"

5. **Después de agregar todas las variables**:
   - Ve a **Deployments**
   - Click en los 3 puntos (...) del último deployment
   - Selecciona **"Redeploy"**
   - O simplemente haz un nuevo push a GitHub para que Vercel despliegue automáticamente

## 🔍 Verificar que Funcionó

Después del redeploy, intenta hacer login nuevamente. Si sigue fallando:

1. Ve a **Deployments > [último deployment] > Functions**
2. Click en `/api/auth/login`
3. Revisa los logs para ver qué variable específica falta

## ⚠️ Problemas Comunes

### Error: "Missing Supabase environment variables"
- **Causa**: Las variables no están configuradas o tienen nombres incorrectos
- **Solución**: Verifica que los nombres sean EXACTAMENTE iguales (case-sensitive)

### Error después de agregar variables
- **Causa**: No se hizo redeploy después de agregar variables
- **Solución**: Haz un redeploy manual o push nuevo a GitHub

### Variables no se aplican
- **Causa**: Variables agregadas solo para un ambiente
- **Solución**: Asegúrate de seleccionar Production, Preview y Development

## 📝 Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada y marcada como Secret
- [ ] `NEXT_PUBLIC_APP_URL` configurada con la URL de Vercel
- [ ] `NEXT_PUBLIC_APP_NAME` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` configurada
- [ ] Todas las variables seleccionadas para Production, Preview y Development
- [ ] Redeploy realizado después de agregar variables
