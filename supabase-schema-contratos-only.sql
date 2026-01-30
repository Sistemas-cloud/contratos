-- =====================================================
-- ESQUEMA SOLO PARA TABLAS DE CONTRATOS
-- NO toca la tabla de usuarios existente
-- Seguro para ejecutar: usa IF NOT EXISTS
-- =====================================================

-- =====================================================
-- CREAR SOLO TABLAS DE CONTRATOS
-- =====================================================

-- Tabla de contratos determinados (Tiempo de Prueba)
CREATE TABLE IF NOT EXISTS contrato_determinado (
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
    created_by UUID REFERENCES usuario(id),
    updated_by UUID REFERENCES usuario(id)
);

-- Tabla de contratos indeterminados
CREATE TABLE IF NOT EXISTS contrato_indeterminado (
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
    created_by UUID REFERENCES usuario(id),
    updated_by UUID REFERENCES usuario(id)
);

-- Tabla de contratos por hora
CREATE TABLE IF NOT EXISTS contrato_hora (
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
    created_by UUID REFERENCES usuario(id),
    updated_by UUID REFERENCES usuario(id)
);

-- =====================================================
-- ÍNDICES (solo si no existen)
-- =====================================================

DO $$ 
BEGIN
    -- Índices para contrato_determinado
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_det_nombre') THEN
        CREATE INDEX idx_contrato_det_nombre ON contrato_determinado(nombre);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_det_nivel') THEN
        CREATE INDEX idx_contrato_det_nivel ON contrato_determinado(nivel);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_det_fecha_contrato') THEN
        CREATE INDEX idx_contrato_det_fecha_contrato ON contrato_determinado(fecha_contrato);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_det_created_by') THEN
        CREATE INDEX idx_contrato_det_created_by ON contrato_determinado(created_by);
    END IF;

    -- Índices para contrato_indeterminado
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_ind_nombre') THEN
        CREATE INDEX idx_contrato_ind_nombre ON contrato_indeterminado(nombre);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_ind_nivel') THEN
        CREATE INDEX idx_contrato_ind_nivel ON contrato_indeterminado(nivel);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_ind_fecha_contrato') THEN
        CREATE INDEX idx_contrato_ind_fecha_contrato ON contrato_indeterminado(fecha_contrato);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_ind_created_by') THEN
        CREATE INDEX idx_contrato_ind_created_by ON contrato_indeterminado(created_by);
    END IF;

    -- Índices para contrato_hora
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_hora_nombre') THEN
        CREATE INDEX idx_contrato_hora_nombre ON contrato_hora(nombre);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_hora_nivel') THEN
        CREATE INDEX idx_contrato_hora_nivel ON contrato_hora(nivel);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_hora_fecha_contrato') THEN
        CREATE INDEX idx_contrato_hora_fecha_contrato ON contrato_hora(fecha_contrato);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_contrato_hora_created_by') THEN
        CREATE INDEX idx_contrato_hora_created_by ON contrato_hora(created_by);
    END IF;
END $$;

-- =====================================================
-- TRIGGERS (solo si no existen)
-- =====================================================

-- Crear función si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_contrato_determinado_updated_at'
    ) THEN
        CREATE TRIGGER update_contrato_determinado_updated_at 
        BEFORE UPDATE ON contrato_determinado
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_contrato_indeterminado_updated_at'
    ) THEN
        CREATE TRIGGER update_contrato_indeterminado_updated_at 
        BEFORE UPDATE ON contrato_indeterminado
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_contrato_hora_updated_at'
    ) THEN
        CREATE TRIGGER update_contrato_hora_updated_at 
        BEFORE UPDATE ON contrato_hora
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en las tablas de contratos
ALTER TABLE contrato_determinado ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_indeterminado ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_hora ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay y recrearlas
DROP POLICY IF EXISTS "Usuarios pueden ver contratos de su nivel" ON contrato_determinado;
DROP POLICY IF EXISTS "Usuarios pueden crear contratos" ON contrato_determinado;
DROP POLICY IF EXISTS "Usuarios pueden actualizar contratos de su nivel" ON contrato_determinado;
DROP POLICY IF EXISTS "Usuarios pueden eliminar contratos de su nivel" ON contrato_determinado;

DROP POLICY IF EXISTS "Usuarios pueden ver contratos indeterminados de su nivel" ON contrato_indeterminado;
DROP POLICY IF EXISTS "Usuarios pueden crear contratos indeterminados" ON contrato_indeterminado;
DROP POLICY IF EXISTS "Usuarios pueden actualizar contratos indeterminados de su nivel" ON contrato_indeterminado;
DROP POLICY IF EXISTS "Usuarios pueden eliminar contratos indeterminados de su nivel" ON contrato_indeterminado;

DROP POLICY IF EXISTS "Usuarios pueden ver contratos por hora de su nivel" ON contrato_hora;
DROP POLICY IF EXISTS "Usuarios pueden crear contratos por hora" ON contrato_hora;
DROP POLICY IF EXISTS "Usuarios pueden actualizar contratos por hora de su nivel" ON contrato_hora;
DROP POLICY IF EXISTS "Usuarios pueden eliminar contratos por hora de su nivel" ON contrato_hora;

-- Políticas para contrato_determinado
CREATE POLICY "Usuarios pueden ver contratos de su nivel" ON contrato_determinado
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_determinado.nivel OR usuario.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden crear contratos" ON contrato_determinado
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM usuario WHERE usuario.id = auth.uid())
    );

CREATE POLICY "Usuarios pueden actualizar contratos de su nivel" ON contrato_determinado
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_determinado.nivel OR usuario.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden eliminar contratos de su nivel" ON contrato_determinado
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_determinado.nivel OR usuario.nivel = 2)
        )
    );

-- Políticas para contrato_indeterminado
CREATE POLICY "Usuarios pueden ver contratos indeterminados de su nivel" ON contrato_indeterminado
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_indeterminado.nivel OR usuario.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden crear contratos indeterminados" ON contrato_indeterminado
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM usuario WHERE usuario.id = auth.uid())
    );

CREATE POLICY "Usuarios pueden actualizar contratos indeterminados de su nivel" ON contrato_indeterminado
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_indeterminado.nivel OR usuario.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden eliminar contratos indeterminados de su nivel" ON contrato_indeterminado
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_indeterminado.nivel OR usuario.nivel = 2)
        )
    );

-- Políticas para contrato_hora
CREATE POLICY "Usuarios pueden ver contratos por hora de su nivel" ON contrato_hora
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_hora.nivel OR usuario.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden crear contratos por hora" ON contrato_hora
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM usuario WHERE usuario.id = auth.uid())
    );

CREATE POLICY "Usuarios pueden actualizar contratos por hora de su nivel" ON contrato_hora
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_hora.nivel OR usuario.nivel = 2)
        )
    );

CREATE POLICY "Usuarios pueden eliminar contratos por hora de su nivel" ON contrato_hora
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuario 
            WHERE usuario.id = auth.uid() 
            AND (usuario.nivel = contrato_hora.nivel OR usuario.nivel = 2)
        )
    );

-- =====================================================
-- VISTAS
-- =====================================================

CREATE OR REPLACE VIEW vista_contratos_determinado AS
SELECT 
    cd.*,
    u.usuario_nombre || ' ' || u.usuario_app || ' ' || u.usuario_apm AS creado_por
FROM contrato_determinado cd
LEFT JOIN usuario u ON cd.created_by = u.id;

CREATE OR REPLACE VIEW vista_contratos_indeterminado AS
SELECT 
    ci.*,
    u.usuario_nombre || ' ' || u.usuario_app || ' ' || u.usuario_apm AS creado_por
FROM contrato_indeterminado ci
LEFT JOIN usuario u ON ci.created_by = u.id;

CREATE OR REPLACE VIEW vista_contratos_hora AS
SELECT 
    ch.*,
    u.usuario_nombre || ' ' || u.usuario_app || ' ' || u.usuario_apm AS creado_por
FROM contrato_hora ch
LEFT JOIN usuario u ON ch.created_by = u.id;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE contrato_determinado IS 'Contratos de tiempo determinado (tiempo de prueba)';
COMMENT ON TABLE contrato_indeterminado IS 'Contratos de tiempo indeterminado';
COMMENT ON TABLE contrato_hora IS 'Contratos por hora (tiempo determinado con jornada reducida)';

COMMENT ON COLUMN contrato_determinado.dias IS 'Días de trabajo separados por comas (ej: Lunes,Martes,Miércoles)';
COMMENT ON COLUMN contrato_indeterminado.dias IS 'Días de trabajo separados por comas (ej: Lunes,Martes,Miércoles)';
COMMENT ON COLUMN contrato_hora.dias IS 'Días de trabajo separados por comas (ej: Lunes,Martes,Miércoles)';

-- =====================================================
-- FINALIZADO
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Tablas de contratos creadas/verificadas exitosamente!';
    RAISE NOTICE '✅ Tabla usuario existente: NO MODIFICADA';
    RAISE NOTICE '✅ Tablas creadas: contrato_determinado, contrato_indeterminado, contrato_hora';
    RAISE NOTICE '✅ Índices, triggers, RLS y vistas configurados';
    RAISE NOTICE '👍 Listo para usar!';
END $$;
