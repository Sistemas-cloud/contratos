# 📝 Sistema de Generación de Contratos Laborales

Sistema moderno para la generación y gestión de contratos laborales construido con Next.js, React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- ✅ **Autenticación segura** con Supabase Auth
- ✅ **Tres tipos de contratos:** Determinado, Indeterminado y Por Hora
- ✅ **CRUD completo** de contratos
- ✅ **Generación de PDFs** on-demand
- ✅ **Generación de DOCX** (Word) on-demand
- ✅ **Sistema de permisos** por niveles de usuario
- ✅ **Row Level Security (RLS)** en base de datos
- ✅ **Responsive design** con Tailwind CSS
- ✅ **Validaciones robustas** con Zod
- ✅ **Almacenamiento en la nube** con Supabase Storage

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Estilos:** Tailwind CSS, Shadcn/ui
- **Backend:** Next.js API Routes, Supabase
- **Base de Datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth
- **Storage:** Supabase Storage
- **Validaciones:** Zod, React Hook Form
- **Generación de Documentos:** jsPDF, docx
- **Deployment:** Vercel

## 📋 Requisitos Previos

- Node.js 18.17 o superior
- npm 9.0 o superior
- Cuenta de Supabase (gratuita)
- Cuenta de Vercel (gratuita) para deployment

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sistema-contratos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto se inicialice

#### b) Ejecutar el schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido del archivo `supabase-schema.sql`
4. Ejecuta la query

#### c) Configurar Storage

1. Ve a **Storage** en Supabase
2. Crea un nuevo bucket llamado `contratos`
3. Configura las políticas de acceso:
   - Permitir lectura a usuarios autenticados
   - Permitir escritura a usuarios autenticados

```sql
-- Política para lectura
CREATE POLICY "Usuarios autenticados pueden leer contratos"
ON storage.objects FOR SELECT
USING (bucket_id = 'contratos' AND auth.role() = 'authenticated');

-- Política para escritura
CREATE POLICY "Usuarios autenticados pueden subir contratos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'contratos' AND auth.role() = 'authenticated');
```

### 4. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. En tu proyecto de Supabase, ve a **Settings > API**
3. Copia las siguientes variables:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (Mantener secreta)

Tu archivo `.env.local` debería verse así:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Sistema de Contratos"
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=contratos
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 👤 Usuarios de Prueba

El schema SQL incluye dos usuarios de prueba:

**Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

**Usuario Normal:**
- Usuario: `user1`
- Contraseña: `user123`

⚠️ **IMPORTANTE:** Cambia estas contraseñas en producción.

## 📁 Estructura del Proyecto

```
sistema-contratos/
├── app/                      # App Router de Next.js
│   ├── (auth)/              # Rutas de autenticación
│   │   └── login/
│   ├── (dashboard)/         # Rutas protegidas
│   │   ├── contratos/
│   │   └── perfil/
│   └── api/                 # API Routes
│       ├── auth/
│       └── contratos/
├── components/              # Componentes React
│   ├── ui/                 # Componentes Shadcn
│   ├── contratos/
│   ├── layout/
│   └── auth/
├── lib/                    # Utilidades y configuración
│   ├── supabase/          # Cliente Supabase
│   ├── utils/             # Funciones auxiliares
│   ├── types/             # Tipos TypeScript
│   └── constants.ts
├── hooks/                 # Custom Hooks
├── public/               # Archivos estáticos
├── supabase-schema.sql   # Schema de base de datos
├── .env.example         # Variables de entorno de ejemplo
└── README.md
```

## 🔒 Seguridad

### Autenticación

- Contraseñas hasheadas con bcrypt (Supabase)
- JWT tokens para sesiones
- HttpOnly cookies para tokens
- CSRF protection incluida en Next.js

### Base de Datos

- Row Level Security (RLS) habilitado
- Políticas de acceso por nivel de usuario
- Queries parametrizadas (prevención SQL injection)
- Validación en cliente y servidor

### Buenas Prácticas

✅ Variables de entorno para credenciales
✅ Service Role Key solo en servidor
✅ Validación con Zod en ambos lados
✅ Sanitización de inputs
✅ Headers de seguridad configurados

## 📝 Uso

### Crear un Contrato

1. Login con tus credenciales
2. Ir a **Contratos > Nuevo Contrato**
3. Seleccionar tipo de contrato
4. Llenar formulario
5. Validar que suma de porcentajes de beneficiarios sea 100%
6. Guardar

### Generar PDF

1. Ir a lista de contratos
2. Click en **Ver Contrato**
3. Click en **Generar PDF**
4. El PDF se generará y subirá a Supabase Storage
5. Se descargará automáticamente

### Generar DOCX

1. Ir a lista de contratos
2. Click en **Ver Contrato**
3. Click en **Generar Word**
4. El documento se generará y descargará

### Editar Contrato

1. Ir a lista de contratos
2. Click en **Editar**
3. Modificar campos
4. Guardar
5. El PDF/DOCX anterior se invalidará

### Eliminar Contrato

1. Ir a lista de contratos
2. Click en **Eliminar**
3. Confirmar acción
4. El contrato y sus documentos se eliminarán

## 🚀 Deployment en Vercel

### 1. Preparar para producción

```bash
npm run build
npm run start  # Probar build localmente
```

### 2. Conectar con Vercel

```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configurar variables de entorno

En el dashboard de Vercel:

1. Ve a **Settings > Environment Variables**
2. Agrega las mismas variables que `.env.local`
3. Asegúrate de marcar `SUPABASE_SERVICE_ROLE_KEY` como secreta

### 4. Deploy

```bash
vercel --prod
```

### Configuraciones importantes en Vercel

**Función de Deploy:**
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Node.js Version: 18.x

**Variables de Entorno:**
- Todas las variables de `.env.local`
- `NODE_ENV=production`

## 📊 Diferencias vs Sistema Anterior (PHP)

| Característica | PHP (Anterior) | Next.js (Nuevo) |
|----------------|---------------|-----------------|
| Frontend | HTML + Bootstrap | React + Tailwind |
| Backend | PHP nativo | Next.js API Routes |
| Base de Datos | MySQL | PostgreSQL (Supabase) |
| Auth | Sesiones PHP | Supabase Auth + JWT |
| PDFs | FPDF (guardados localmente) | jsPDF (Supabase Storage) |
| Seguridad | Básica | RLS + JWT + Validaciones |
| Escalabilidad | Servidor único | Serverless (Vercel) |
| Deployment | cPanel/FTP | CI/CD automático |

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📚 Documentación Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)

## 🐛 Solución de Problemas

### Error: "Failed to fetch"

- Verifica que Supabase URL y keys sean correctas
- Revisa que el proyecto de Supabase esté activo
- Verifica conexión a internet

### Error: "Invalid JWT"

- Las sesiones expiran después de 1 hora
- Cierra sesión y vuelve a iniciar

### PDFs no se generan

- Verifica que el bucket `contratos` exista en Storage
- Revisa las políticas de Storage
- Verifica logs en Vercel

### Datos no se guardan

- Verifica que RLS policies estén correctas
- Revisa console del navegador
- Verifica validaciones de Zod

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👨‍💻 Soporte

Para soporte, contacta a: [tu-email@ejemplo.com]

---

**Desarrollado con ❤️ usando Next.js y Supabase**
