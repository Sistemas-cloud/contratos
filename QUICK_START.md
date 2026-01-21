# ⚡ Inicio Rápido

## 1. Crear archivo `.env.local`

Crea el archivo `.env.local` en la raíz del proyecto `nextjs-project/` con este contenido:

```env
# Supabase API (HTTP)
NEXT_PUBLIC_SUPABASE_URL=https://nmxrccrbnoenkahefrrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Supabase PostgreSQL (Direct Connection - Opcional)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.nmxrccrbnoenkahefrrw.supabase.co:5432/postgres

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Sistema de Contratos"
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=contratos
```

**Reemplaza los valores** con los de tu proyecto Supabase:
1. Ve a https://app.supabase.com/
2. Selecciona tu proyecto
3. Ve a **Settings > API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (Mantener secreta)

## 2. Iniciar el servidor

```powershell
cd nextjs-project
npm run dev
```

## 3. Abrir en el navegador

Abre: **http://localhost:3000**

## 4. Hacer Login

Usa las credenciales de tu tabla `usuario` existente.

---

## ⚠️ Si tienes errores

### Error: "Module not found"
```powershell
rm -rf node_modules
npm install
```

### Error: "Supabase connection"
- Verifica que `.env.local` tenga los valores correctos
- Verifica que tu proyecto Supabase esté activo

### Error: "Next.js requires Node.js 18+"
Actualiza Node.js a la versión 18 o superior desde https://nodejs.org/

---

**¡Listo para usar!** 🚀
