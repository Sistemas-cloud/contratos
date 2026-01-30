# 📋 Notas sobre la Tabla de Usuarios Existente

## ⚠️ Importante: Compatibilidad con el Sistema

Tu tabla de usuarios **existente** debe cumplir con ciertos requisitos para que el nuevo sistema funcione correctamente.

## 🔍 Verificar Tu Tabla Actual

Ejecuta esta query en Supabase para ver la estructura de tu tabla:

```sql
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
```

## ✅ Columnas Requeridas

Tu tabla `usuarios` **DEBE tener** estas columnas:

| Columna | Tipo | Requerido | Uso |
|---------|------|-----------|-----|
| `id` | UUID | ✅ Sí | Foreign Key en tablas de contratos |
| `nivel` | INTEGER | ✅ Sí | Sistema de permisos (1=usuario, 2=admin) |
| `usuario_nombre` | VARCHAR | ✅ Sí | Para vistas (nombre completo) |
| `usuario_app` | VARCHAR | ⚠️ Opcional | Apellido Paterno (para vistas) |
| `usuario_apm` | VARCHAR | ⚠️ Opcional | Apellido Materno (para vistas) |

## 🔧 Si Falta Alguna Columna

### Agregar columna `nivel` (si no existe):

```sql
-- Agregar columna nivel si no existe
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS nivel INTEGER DEFAULT 1;

-- Actualizar usuarios existentes a nivel 2 (admin) si son administradores
-- AJUSTA EL WHERE según tu lógica de negocio
UPDATE usuarios 
SET nivel = 2 
WHERE usuario_username IN ('admin', 'administrador');
```

### Agregar columna `usuario_app` (si no existe):

```sql
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS usuario_app VARCHAR(100) DEFAULT '';
```

### Agregar columna `usuario_apm` (si no existe):

```sql
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS usuario_apm VARCHAR(100) DEFAULT '';
```

### Cambiar ID a UUID (si es INT o BIGINT):

⚠️ **CUIDADO:** Esto es más complejo y puede afectar datos existentes.

```sql
-- OPCIÓN 1: Si la tabla está vacía o es nueva
ALTER TABLE usuarios 
ALTER COLUMN id TYPE UUID USING gen_random_uuid();

-- OPCIÓN 2: Si tienes datos, necesitarás un script de migración
-- NO EJECUTAR sin backup
```

## 🎯 Escenarios Comunes

### Escenario 1: Tabla Compatible ✅

Tu tabla ya tiene:
- `id` UUID
- `nivel` INTEGER
- Nombres básicos

**Acción:** Ejecutar `supabase-schema-contratos-only.sql` directamente.

### Escenario 2: Falta Columna `nivel` ⚠️

Tu tabla tiene id UUID pero no tiene `nivel`.

**Acción:**
1. Agregar columna `nivel`
2. Actualizar usuarios existentes con nivel apropiado
3. Ejecutar `supabase-schema-contratos-only.sql`

### Escenario 3: ID es INTEGER en lugar de UUID ⚠️⚠️

Tu tabla usa `id INTEGER` o `BIGINT`.

**Problemas:**
- Las tablas de contratos esperan UUID
- Necesitarás modificar el schema

**Solución A: Migrar a UUID** (Recomendado para nuevo sistema)

```sql
-- Backup primero!
-- Crear tabla temporal con UUID
CREATE TABLE usuarios_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- ... resto de columnas ...
);

-- Copiar datos con nuevo UUID
INSERT INTO usuarios_new (usuario_username, usuario_password, ...)
SELECT usuario_username, usuario_password, ...
FROM usuarios;

-- Renombrar tablas
ALTER TABLE usuarios RENAME TO usuarios_old;
ALTER TABLE usuarios_new RENAME TO usuarios;
```

**Solución B: Modificar schema de contratos** (Más rápido pero menos ideal)

Modificar `supabase-schema-contratos-only.sql`:

```sql
-- Cambiar todas las líneas:
created_by UUID REFERENCES usuarios(id)

-- Por:
created_by INTEGER REFERENCES usuarios(id)
-- o
created_by BIGINT REFERENCES usuarios(id)
```

### Escenario 4: Tabla Completamente Diferente 🔴

Tu tabla de usuarios tiene estructura muy diferente.

**Opciones:**
1. **Adaptar el schema** a tu estructura existente
2. **Crear vista de compatibilidad**
3. **Migrar a nueva estructura** (más trabajo pero más limpio)

## 🔐 Autenticación

### Si usas tu propia autenticación PHP:

El sistema Next.js necesitará:
1. Integrar con Supabase Auth (recomendado)
2. O mantener tu sistema actual y agregar sync

### Para integrar con Supabase Auth:

```sql
-- Agregar columnas necesarias para Supabase Auth
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

## 📝 Checklist de Compatibilidad

Antes de ejecutar el schema de contratos, verifica:

- [ ] Tabla `usuarios` existe
- [ ] Columna `id` existe (preferentemente UUID)
- [ ] Columna `nivel` existe (INTEGER)
- [ ] Columnas de nombre existen (para vistas)
- [ ] Tienes backup de la tabla actual
- [ ] Has verificado la estructura con la query de arriba

## 🆘 Si Tienes Problemas

### Error: "column usuarios.id does not exist"

Tu tabla no se llama `usuarios` o no tiene columna `id`.

**Solución:** Renombrar tu tabla o modificar el schema.

```sql
-- Si tu tabla se llama "users" por ejemplo
ALTER TABLE users RENAME TO usuarios;
```

### Error: "foreign key constraint"

El tipo de dato de `id` no coincide.

**Solución:** Verificar tipo de dato y ajustar según escenario 3.

### Error: "column nivel does not exist"

Falta la columna `nivel`.

**Solución:** Ejecutar ALTER TABLE para agregarla (ver arriba).

## 💡 Recomendación

**Lo más seguro:**

1. Hacer backup de tu base de datos actual
2. Verificar estructura de tabla `usuarios`
3. Agregar columnas faltantes si es necesario
4. Ejecutar `supabase-schema-contratos-only.sql`
5. Verificar que todo funciona
6. Probar crear un contrato de prueba

---

¿Necesitas ayuda con alguno de estos escenarios? ¡Avísame! 🚀
