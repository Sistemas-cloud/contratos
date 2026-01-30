-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA SISTEMA DE CONTRATOS
-- Sistema de generación de contratos laborales
-- Base de datos: Supabase (PostgreSQL)
-- VERSION: Con DROP TABLE IF EXISTS (Segura para re-ejecutar)
-- =====================================================

-- =====================================================
-- ELIMINAR TABLAS EXISTENTES (EN ORDEN CORRECTO)
-- =====================================================

-- Primero eliminar políticas RLS si existen
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON usuarios CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON usuarios CASCADE;

DROP POLICY IF EXISTS "Usuarios pueden ver contratos de su nivel" ON contrato_determinado CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden crear contratos" ON contrato_determinado CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden actualizar contratos de su nivel" ON contrato_determinado CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden eliminar contratos de su nivel" ON contrato_determinado CASCADE;

DROP POLICY IF EXISTS "Usuarios pueden ver contratos indeterminados de su nivel" ON contrato_indeterminado CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden crear contratos indeterminados" ON contrato_indeterminado CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden actualizar contratos indeterminados de su nivel" ON contrato_indeterminado CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden eliminar contratos indeterminados de su nivel" ON contrato_indeterminado CASCADE;

DROP POLICY IF EXISTS "Usuarios pueden ver contratos por hora de su nivel" ON contrato_hora CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden crear contratos por hora" ON contrato_hora CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden actualizar contratos por hora de su nivel" ON contrato_hora CASCADE;
DROP POLICY IF EXISTS "Usuarios pueden eliminar contratos por hora de su nivel" ON contrato_hora CASCADE;

-- Eliminar vistas
DROP VIEW IF EXISTS vista_contratos_determinado CASCADE;
DROP VIEW IF EXISTS vista_contratos_indeterminado CASCADE;
DROP VIEW IF EXISTS vista_contratos_hora CASCADE;

-- Eliminar triggers
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
DROP TRIGGER IF EXISTS update_contrato_determinado_updated_at ON contrato_determinado;
DROP TRIGGER IF EXISTS update_contrato_indeterminado_updated_at ON contrato_indeterminado;
DROP TRIGGER IF EXISTS update_contrato_hora_updated_at ON contrato_hora;

-- Eliminar función de trigger
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Eliminar tablas (en orden correcto - primero las que tienen FK)
DROP TABLE IF EXISTS contrato_hora CASCADE;
DROP TABLE IF EXISTS contrato_indeterminado CASCADE;
DROP TABLE IF EXISTS contrato_determinado CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =====================================================
-- CREAR TABLAS
-- =====================================================

-- Tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_username VARCHAR(100) UNIQUE NOT NULL,
    usuario_password VARCHAR(255) NOT NULL,
    usuario_nombre VARCHAR(100) NOT NULL,
    usuario_app VARCHAR(100),
    usuario_apm VARCHAR(100),
    nivel INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contratos determinados (Tiempo de Prueba)
CREATE TABLE contrato_determinado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    puesto VARCHAR(200) NOT NULL,
    nacionalidad VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 18),
    e_civil VARCHAR(50) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    domicilio TEXT NOT NULL,
    curp VARCHAR(18) NOT NULL,
    fecha_contrato DATE NOT NULL,
    fecha_termino DATE NOT NULL,
    sueldo_mensual DECIMAL(10, 2) NOT NULL,
    dias TEXT NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    funciones TEXT NOT NULL,
    bene1 VARCHAR(255),
    paren1 VARCHAR(100),
    porc1 INTEGER CHECK (porc1 >= 0 AND porc1 <= 100),
    bene2 VARCHAR(255),
    paren2 VARCHAR(100),
    porc2 INTEGER CHECK (porc2 >= 0 AND porc2 <= 100),
    testigo1 VARCHAR(255),
    testigo2 VARCHAR(255),
    nivel INTEGER NOT NULL DEFAULT 1,
    nombre_act VARCHAR(255),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    ultima_act DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- Tabla de contratos indeterminados
CREATE TABLE contrato_indeterminado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    puesto VARCHAR(200) NOT NULL,
    nacionalidad VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 18),
    e_civil VARCHAR(50) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    domicilio TEXT NOT NULL,
    curp VARCHAR(18) NOT NULL,
    fecha_leido DATE NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_contrato DATE NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    dias TEXT NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    funciones TEXT NOT NULL,
    bene1 VARCHAR(255),
    paren1 VARCHAR(100),
    porc1 INTEGER CHECK (porc1 >= 0 AND porc1 <= 100),
    bene2 VARCHAR(255),
    paren2 VARCHAR(100),
    porc2 INTEGER CHECK (porc2 >= 0 AND porc2 <= 100),
    testigo1 VARCHAR(255),
    testigo2 VARCHAR(255),
    nivel INTEGER NOT NULL DEFAULT 1,
    nombre_act VARCHAR(255),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    ultima_act DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- Tabla de contratos por hora
CREATE TABLE contrato_hora (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    puesto VARCHAR(200) NOT NULL,
    nacionalidad VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 18),
    e_civil VARCHAR(50) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    domicilio TEXT NOT NULL,
    curp VARCHAR(18) NOT NULL,
    fecha_inicio_esc DATE NOT NULL,
    fecha_termino_esc DATE NOT NULL,
    fecha_contrato DATE NOT NULL,
    dias TEXT NOT NULL,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    costo_hora DECIMAL(10, 2) NOT NULL,
    funciones TEXT NOT NULL,
    bene1 VARCHAR(255),
    paren1 VARCHAR(100),
    porc1 INTEGER CHECK (porc1 >= 0 AND porc1 <= 100),
    bene2 VARCHAR(255),
    paren2 VARCHAR(100),
    porc2 INTEGER CHECK (porc2 >= 0 AND porc2 <= 100),
    testigo1 VARCHAR(255),
    testigo2 VARCHAR(255),
    nivel INTEGER NOT NULL DEFAULT 1,
    nombre_act VARCHAR(255),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    ultima_act DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES usuarios(id),
    updated_by UUID REFERENCES usuarios(id)
);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX idx_usuarios_username ON usuarios(usuario_username);
CREATE INDEX idx_usuarios_nivel ON usuarios(nivel);

CREATE INDEX idx_contrato_det_nombre ON contrato_determinado(nombre);
CREATE INDEX idx_contrato_det_nivel ON contrato_determinado(nivel);
CREATE INDEX idx_contrato_det_fecha_contrato ON contrato_determinado(fecha_contrato);
CREATE INDEX idx_contrato_det_created_by ON contrato_determinado(created_by);

CREATE INDEX idx_contrato_ind_nombre ON contrato_indeterminado(nombre);
CREATE INDEX idx_contrato_ind_nivel ON contrato_indeterminado(nivel);
CREATE INDEX idx_contrato_ind_fecha_contrato ON contrato_indeterminado(fecha_contrato);
CREATE INDEX idx_contrato_ind_created_by ON contrato_indeterminado(created_by);

CREATE INDEX idx_contrato_hora_nombre ON contrato_hora(nombre);
CREATE INDEX idx_contrato_hora_nivel ON contrato_hora(nivel);
CREATE INDEX idx_contrato_hora_fecha_contrato ON contrato_hora(fecha_contrato);
CREATE INDEX idx_contrato_hora_created_by ON contrato_hora(created_by);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contrato_determinado_updated_at BEFORE UPDATE ON contrato_determinado
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contrato_indeterminado_updated_at BEFORE UPDATE ON contrato_indeterminado
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contrato_hora_updated_at BEFORE UPDATE ON contrato_hora
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_determinado ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_indeterminado ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_hora ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propio perfil" ON usuarios
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON usuarios
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para contratos determinados
CREATE POLICY "Usuarios pueden ver contratos de su nivel" ON contrato_determinado
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_determinado.nivel OR usuarios.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden crear contratos" ON contrato_determinado
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid())
    );

CREATE POLICY "Usuarios pueden actualizar contratos de su nivel" ON contrato_determinado
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_determinado.nivel OR usuarios.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden eliminar contratos de su nivel" ON contrato_determinado
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_determinado.nivel OR usuarios.nivel = 2)
        )
    );

-- Políticas para contratos indeterminados
CREATE POLICY "Usuarios pueden ver contratos indeterminados de su nivel" ON contrato_indeterminado
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_indeterminado.nivel OR usuarios.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden crear contratos indeterminados" ON contrato_indeterminado
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid())
    );

CREATE POLICY "Usuarios pueden actualizar contratos indeterminados de su nivel" ON contrato_indeterminado
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_indeterminado.nivel OR usuarios.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden eliminar contratos indeterminados de su nivel" ON contrato_indeterminado
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_indeterminado.nivel OR usuarios.nivel = 2)
        )
    );

-- Políticas para contratos por hora
CREATE POLICY "Usuarios pueden ver contratos por hora de su nivel" ON contrato_hora
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_hora.nivel OR usuarios.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden crear contratos por hora" ON contrato_hora
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM usuarios WHERE usuarios.id = auth.uid())
    );

CREATE POLICY "Usuarios pueden actualizar contratos por hora de su nivel" ON contrato_hora
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_hora.nivel OR usuarios.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden eliminar contratos por hora de su nivel" ON contrato_hora
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND (usuarios.nivel = contrato_hora.nivel OR usuarios.nivel = 2)
        )
    );

-- =====================================================
-- DATOS INICIALES
-- =====================================================

INSERT INTO usuarios (usuario_username, usuario_password, usuario_nombre, usuario_app, usuario_apm, nivel)
VALUES 
    ('admin', 'admin123', 'Administrador', 'Sistema', '', 2),
    ('user1', 'user123', 'Usuario', 'Demo', '', 1)
ON CONFLICT (usuario_username) DO NOTHING;

-- =====================================================
-- VISTAS
-- =====================================================

CREATE OR REPLACE VIEW vista_contratos_determinado AS
SELECT 
    cd.*,
    u.usuario_nombre || ' ' || u.usuario_app || ' ' || u.usuario_apm AS creado_por
FROM contrato_determinado cd
LEFT JOIN usuarios u ON cd.created_by = u.id;

CREATE OR REPLACE VIEW vista_contratos_indeterminado AS
SELECT 
    ci.*,
    u.usuario_nombre || ' ' || u.usuario_app || ' ' || u.usuario_apm AS creado_por
FROM contrato_indeterminado ci
LEFT JOIN usuarios u ON ci.created_by = u.id;

CREATE OR REPLACE VIEW vista_contratos_hora AS
SELECT 
    ch.*,
    u.usuario_nombre || ' ' || u.usuario_app || ' ' || u.usuario_apm AS creado_por
FROM contrato_hora ch
LEFT JOIN usuarios u ON ch.created_by = u.id;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE contrato_determinado IS 'Contratos de tiempo determinado (tiempo de prueba)';
COMMENT ON TABLE contrato_indeterminado IS 'Contratos de tiempo indeterminado';
COMMENT ON TABLE contrato_hora IS 'Contratos por hora (tiempo determinado con jornada reducida)';

COMMENT ON COLUMN usuarios.nivel IS '1 = Usuario normal, 2 = Administrador';
COMMENT ON COLUMN contrato_determinado.dias IS 'Días de trabajo separados por comas (ej: Lunes,Martes,Miércoles)';
COMMENT ON COLUMN contrato_indeterminado.dias IS 'Días de trabajo separados por comas (ej: Lunes,Martes,Miércoles)';
COMMENT ON COLUMN contrato_hora.dias IS 'Días de trabajo separados por comas (ej: Lunes,Martes,Miércoles)';

-- =====================================================
-- FINALIZADO
-- =====================================================

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Schema creado exitosamente!';
    RAISE NOTICE '✅ Tablas: usuarios, contrato_determinado, contrato_indeterminado, contrato_hora';
    RAISE NOTICE '✅ Usuarios de prueba creados: admin/admin123, user1/user123';
    RAISE NOTICE '⚠️  IMPORTANTE: Cambia las contraseñas en producción!';
END $$;
