# Análisis y Plan de Migración del Sistema de Contratos

## 📋 Análisis del Sistema Actual (PHP)

### Funcionalidades Identificadas

#### 1. **Sistema de Autenticación**
- Login con usuario y contraseña
- Sesiones PHP
- Sistema de permisos por niveles (nivel 1: usuario, nivel 2: admin)

#### 2. **Gestión de Contratos (3 tipos)**

##### A) Contrato Determinado (Tiempo de Prueba)
- Duración: 90 días
- Campos específicos:
  - Fecha de contrato y fecha de término
  - Sueldo mensual
  - Horario y días de trabajo

##### B) Contrato Indeterminado
- Sin fecha de término
- Campos específicos:
  - Fecha de lectura, inicio y contrato
  - Salario mensual de percepciones
  - Horario y días de trabajo

##### C) Contrato por Hora (Tiempo Determinado con Jornada Reducida)
- Basado en ciclo escolar
- Campos específicos:
  - Fecha inicio y término de ciclo escolar
  - Costo por hora
  - Horario reducido

##### Campos Comunes en Todos los Contratos:
- **Datos del Trabajador:**
  - Nombre, puesto, nacionalidad, edad, estado civil
  - RFC, CURP, domicilio
  - Funciones (lista separada por guiones)
  
- **Beneficiarios:**
  - 2 beneficiarios con nombre, parentesco y porcentaje
  - Validación: suma de porcentajes debe ser 100%
  
- **Testigos:**
  - 2 testigos (solo nombres)
  
- **Metadata:**
  - Nivel de usuario
  - Nombre de quien actualiza
  - Fecha de registro y última actualización

#### 3. **Operaciones CRUD**
- ✅ Crear contratos
- ✅ Leer/Mostrar contratos (con filtros por nivel)
- ✅ Editar contratos
- ✅ Eliminar contratos

#### 4. **Generación de PDFs**
- Usa librería FPDF
- Genera PDFs con plantillas de contratos legales
- Funciones auxiliares:
  - `numeroATexto()`: Convierte números a texto
  - `numeroATextoPesos()`: Formatea cantidades en pesos
  - `fechaATexto()`: Convierte fechas a formato legal
- PDFs se guardan en carpeta `/pdf/` en el servidor

#### 5. **Sistema de Permisos**
- Usuarios normales (nivel 1): Solo ven sus propios contratos
- Administradores (nivel 2): Ven todos los contratos
- Filtro especial: Excluye contratos de "Laura" para usuarios normales

---

## 🎯 Tecnologías de la Nueva Implementación

### Stack Tecnológico

1. **Frontend:**
   - Next.js 14+ (App Router)
   - React 18+
   - TypeScript
   - Tailwind CSS
   - Shadcn/ui (componentes UI)

2. **Backend:**
   - Next.js API Routes (Edge Functions)
   - Supabase (PostgreSQL)
   - Supabase Auth
   - Supabase Storage (para PDFs generados)

3. **Generación de Documentos:**
   - **PDFs:** `jspdf` con `jspdf-autotable` o `@react-pdf/renderer`
   - **Word:** `docx` (para generación de archivos .docx)

4. **Despliegue:**
   - Vercel (hosting)
   - Supabase (base de datos y storage)

---

## 🔄 Cambios Arquitectónicos Importantes

### 1. **Almacenamiento de PDFs/DOCX**

**Antes (PHP):**
- PDFs se guardaban en carpeta `/pdf/` del servidor
- Persistían entre requests

**Ahora (Next.js/Vercel):**
⚠️ **IMPORTANTE:** Vercel usa sistema de archivos efímero
- Los archivos generados NO persisten entre deployments
- Solución: **Supabase Storage**
  - Los PDFs/DOCX se generan on-demand
  - Se suben a Supabase Storage
  - Se retorna una URL firmada temporal o pública
  - Opción alternativa: Generar y enviar directamente al navegador

**Estrategia Recomendada:**
```typescript
// Generar PDF/DOCX → Subir a Supabase Storage → Retornar URL
POST /api/contratos/[id]/generar-pdf
→ Genera PDF con datos del contrato
→ Sube a supabase.storage.from('contratos').upload()
→ Retorna { url: 'https://...' }

// O generar on-the-fly y descargar directamente
GET /api/contratos/[id]/pdf
→ Genera PDF
→ Retorna como blob/stream para descarga inmediata
```

### 2. **Autenticación**

**Antes:**
- Sesiones PHP nativas
- Contraseñas en texto plano (⚠️ inseguro)

**Ahora:**
- **Supabase Auth**
- JWT tokens
- Contraseñas hasheadas automáticamente
- Row Level Security (RLS) en base de datos

### 3. **Base de Datos**

**Antes:**
- MySQL
- Queries directas con mysqli

**Ahora:**
- PostgreSQL (Supabase)
- Supabase Client (ORM-like)
- Row Level Security (RLS)
- Triggers automáticos para `updated_at`

### 4. **Validaciones**

**Antes:**
- JavaScript del lado del cliente
- Validaciones básicas en PHP

**Ahora:**
- **Cliente:** React Hook Form + Zod
- **Servidor:** Zod schemas en API routes
- Validación consistente en ambos lados

---

## 📁 Estructura del Proyecto Next.js

```
contratos-nextjs/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard principal)
│   │   ├── contratos/
│   │   │   ├── page.tsx (lista de contratos)
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx (crear contrato)
│   │   │   └── [id]/
│   │   │       ├── page.tsx (ver contrato)
│   │   │       └── editar/
│   │   │           └── page.tsx (editar contrato)
│   │   └── perfil/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── contratos/
│   │       ├── route.ts (GET, POST)
│   │       ├── [id]/
│   │       │   ├── route.ts (GET, PUT, DELETE)
│   │       │   ├── pdf/
│   │       │   │   └── route.ts (generar PDF)
│   │       │   └── docx/
│   │       │       └── route.ts (generar DOCX)
│   │       └── tipos/
│   │           └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── contratos/
│   │   ├── ContratoForm.tsx
│   │   ├── ContratosList.tsx
│   │   ├── ContratoCard.tsx
│   │   └── ContratoFilters.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── ProtectedRoute.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── utils/
│   │   ├── formatters.ts (numeroATexto, fechaATexto, etc.)
│   │   ├── validators.ts
│   │   └── pdf-generator.ts
│   ├── types/
│   │   ├── contrato.ts
│   │   └── usuario.ts
│   └── constants.ts
├── hooks/
│   ├── useContratos.ts
│   ├── useAuth.ts
│   └── usePDF.ts
├── public/
│   └── assets/
├── supabase-schema.sql
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔧 Configuración Inicial

### 1. Variables de Entorno (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Instalación de Dependencias

```bash
# Crear proyecto Next.js
npx create-next-app@latest contratos-nextjs --typescript --tailwind --app

# Dependencias principales
npm install @supabase/supabase-js @supabase/ssr
npm install @supabase/auth-helpers-nextjs

# UI
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-label
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Formularios y validaciones
npm install react-hook-form @hookform/resolvers zod
npm install date-fns

# Generación de documentos
npm install jspdf jspdf-autotable
npm install docx
npm install @react-pdf/renderer  # Alternativa para PDFs

# Utilidades
npm install sonner  # Toast notifications
npm install @tanstack/react-table  # Tablas avanzadas
```

---

## 🚀 Pasos de Implementación

### Fase 1: Setup Inicial ✅
1. ✅ Crear proyecto Next.js
2. ✅ Configurar Supabase
3. ✅ Ejecutar schema SQL en Supabase
4. ✅ Configurar variables de entorno
5. ✅ Instalar dependencias

### Fase 2: Autenticación
1. Configurar Supabase Auth
2. Crear página de login
3. Implementar middleware de autenticación
4. Crear hooks de autenticación (`useAuth`)

### Fase 3: UI Base
1. Configurar Tailwind CSS
2. Instalar y configurar Shadcn/ui
3. Crear layout principal
4. Crear componentes de navegación

### Fase 4: CRUD de Contratos
1. Crear tipos TypeScript para contratos
2. Implementar API routes
3. Crear formularios de contratos
4. Implementar lista y filtros
5. Implementar edición y eliminación

### Fase 5: Generación de Documentos
1. Migrar funciones de conversión de números/fechas
2. Implementar generación de PDFs
3. Implementar generación de DOCX
4. Configurar Supabase Storage
5. Implementar descarga de documentos

### Fase 6: Testing y Optimización
1. Testing de funcionalidades
2. Optimización de rendimiento
3. Manejo de errores
4. Logging

### Fase 7: Deployment
1. Configurar Vercel
2. Configurar variables de entorno en producción
3. Deploy
4. Testing en producción

---

## ⚠️ Consideraciones Importantes para Vercel

### 1. **Límites de Serverless Functions**
- Timeout: 10s (Hobby), 60s (Pro), 300s (Enterprise)
- Memory: 1024 MB (Hobby), 3008 MB (Pro)
- Payload: 4.5 MB

**Implicaciones:**
- PDFs grandes pueden exceder timeout
- Solución: Generar PDFs simples, subir a Storage rápidamente

### 2. **Edge vs Node.js Runtime**
- Edge: Más rápido, pero limitaciones (no todas las librerías)
- Node.js: Más compatible, pero más lento

**Recomendación:**
- API Routes de lectura: Edge Runtime
- Generación de PDFs: Node.js Runtime

### 3. **Caché y Revalidación**
```typescript
// Cachear datos que no cambian frecuentemente
export const revalidate = 3600; // 1 hora

// ISR para listas de contratos
export const revalidate = 60; // 1 minuto
```

### 4. **Optimización de Imágenes**
- Usar `next/image` para logos y assets
- Lazy loading automático

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [docx](https://docx.js.org/)

### Tutoriales Relacionados
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [PDF Generation in Next.js](https://blog.logrocket.com/creating-pdfs-next-js/)

---

## 🔐 Seguridad

### Mejoras vs Sistema Anterior

1. **Contraseñas:**
   - ❌ Antes: Texto plano
   - ✅ Ahora: Bcrypt hashing automático (Supabase)

2. **SQL Injection:**
   - ❌ Antes: Vulnerable (concatenación de strings)
   - ✅ Ahora: Queries parametrizadas (Supabase)

3. **XSS:**
   - ⚠️ Antes: Sin sanitización
   - ✅ Ahora: React escapa automáticamente

4. **CSRF:**
   - ❌ Antes: Sin protección
   - ✅ Ahora: Next.js incluye protección

5. **Row Level Security:**
   - ❌ Antes: Solo en PHP
   - ✅ Ahora: A nivel de base de datos (RLS)

---

## 📝 Notas de Migración de Datos

Si tienes datos existentes en MySQL:

```sql
-- Exportar datos de MySQL
mysqldump -u usuario -p winston_general > backup.sql

-- Script de migración (Python/Node.js)
-- 1. Leer datos de MySQL
-- 2. Transformar estructura
-- 3. Insertar en Supabase vía API

-- Campos a transformar:
-- id (INT AUTO_INCREMENT) → id (UUID)
-- nivel (vincular con usuarios)
```

---

## 🎨 Mejoras de UX/UI

1. **Diseño Moderno:**
   - Interfaz limpia con Tailwind CSS
   - Componentes reutilizables de Shadcn
   - Dark mode opcional

2. **Interacciones:**
   - Loading states
   - Optimistic updates
   - Toast notifications
   - Confirmaciones para eliminaciones

3. **Responsive:**
   - Mobile-first design
   - Tablas responsivas
   - Formularios adaptables

4. **Accesibilidad:**
   - ARIA labels
   - Navegación por teclado
   - Contraste adecuado

---

## 📊 Comparación de Rendimiento Estimado

| Métrica | PHP (Actual) | Next.js (Nuevo) |
|---------|-------------|----------------|
| Time to First Byte | ~200-500ms | ~50-150ms (Edge) |
| Carga inicial | ~1-2s | ~500ms-1s (SSR) |
| PDFs | Generación local | Supabase Storage |
| Escalabilidad | Limitada | Alta (Serverless) |
| SEO | Limitado | Excelente (SSR) |

---

## ✅ Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos poblada (schema ejecutado)
- [ ] RLS policies probadas
- [ ] Autenticación funcionando
- [ ] CRUD de contratos completo
- [ ] Generación de PDFs probada
- [ ] Generación de DOCX probada
- [ ] Supabase Storage configurado
- [ ] Testing en diferentes navegadores
- [ ] Testing móvil
- [ ] Manejo de errores implementado
- [ ] Logging configurado
- [ ] Documentación actualizada
- [ ] Backup de datos actuales

---

¿Listo para empezar la migración? 🚀
