import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  console.log("[LOGIN API] Iniciando proceso de login");
  try {
    // Verificar que el request tenga body
    if (!request.body) {
      console.error("[LOGIN API] Request sin body");
      return NextResponse.json(
        { error: "Solicitud inválida", errorType: "general" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log("[LOGIN API] Body recibido:", { username: body.username });
    
    const validated = loginSchema.parse(body);
    console.log("[LOGIN API] Datos validados");

    // Verificar que las variables de entorno estén configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log("[LOGIN API] Verificando variables de entorno:", {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: serviceRoleKey?.length || 0,
      nodeEnv: process.env.NODE_ENV
    });
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[LOGIN API] Missing Supabase environment variables:", {
        missingUrl: !supabaseUrl,
        missingServiceKey: !serviceRoleKey
      });
      return NextResponse.json(
        { 
          error: "Error de configuración del servidor. Variables de entorno faltantes.",
          errorType: "general",
          details: process.env.NODE_ENV === 'production' 
            ? "Contacta al administrador del sistema"
            : `Faltan: ${!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : ''}`
        },
        { status: 500 }
      );
    }

    // Usar Service Role Key para el login (bypass RLS)
    const supabase = createServiceClient();
    console.log("[LOGIN API] Cliente Supabase creado (Service Role)");

    // Buscar usuario en la tabla usuario/usuarios (no Supabase Auth)
    console.log("[LOGIN API] Buscando usuario:", validated.username);
    
    // Intentar primero con "usuario", si falla intentar con "usuarios"
    let { data: usuario, error } = await supabase
      .from("usuario")
      .select("usuario_id, usuario_username, usuario_password, usuario_nombre, nivel")
      .eq("usuario_username", validated.username)
      .single();
    
    // Si no se encuentra en "usuario", intentar con "usuarios"
    if (error && error.code === 'PGRST116') {
      console.log("[LOGIN API] No encontrado en 'usuario', intentando con 'usuarios'");
      const result: any = await supabase
        .from("usuarios")
        .select("id, usuario_username, usuario_password, usuario_nombre, nivel")
        .eq("usuario_username", validated.username)
        .single();
      
      if (result.data) {
        // Mapear estructura de "usuarios" a formato esperado
        // El ID puede ser UUID (string) o INTEGER (number)
        const userId = typeof result.data.id === 'string' 
          ? result.data.id 
          : String(result.data.id);
        
        usuario = {
          usuario_id: userId as any, // Convertir a formato esperado
          usuario_username: result.data.usuario_username,
          usuario_password: result.data.usuario_password,
          usuario_nombre: result.data.usuario_nombre,
          nivel: result.data.nivel
        } as any;
        error = null;
        console.log("[LOGIN API] Usuario encontrado en tabla 'usuarios'");
      } else {
        error = result.error;
      }
    }

    console.log("[LOGIN API] Resultado de búsqueda:", { 
      usuario: usuario ? "encontrado" : "no encontrado", 
      error: error ? { code: error.code, message: error.message, details: error.details } : null,
      usernameBuscado: validated.username
    });

    // Verificar si el usuario existe
    if (error) {
      console.error("[LOGIN API] Supabase error:", error);
      // Si hay error de Supabase o no se encontró el usuario
      if (error.code === 'PGRST116') {
        // Código específico de Supabase cuando no se encuentra un registro
        return NextResponse.json(
          { error: "Usuario no encontrado", errorType: "username" },
          { status: 401 }
        );
      }
      // Otro error de Supabase (conexión, permisos, etc.)
      return NextResponse.json(
        { error: "Error al conectar con la base de datos", errorType: "general" },
        { status: 500 }
      );
    }

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado", errorType: "username" },
        { status: 401 }
      );
    }

    // Verificar contraseña (en producción usar bcrypt)
    console.log("[LOGIN API] Verificando contraseña");
    if ((usuario as any).usuario_password !== validated.password) {
      console.log("[LOGIN API] Contraseña incorrecta");
      return NextResponse.json(
        { error: "Contraseña incorrecta", errorType: "password" },
        { status: 401 }
      );
    }

    console.log("[LOGIN API] Login exitoso, creando respuesta");
    // Crear sesión usando Supabase Auth (opcional) o cookies
    // Por ahora, guardamos en cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: (usuario as any).usuario_id,
        username: (usuario as any).usuario_username,
        nombre: (usuario as any).usuario_nombre,
        nivel: (usuario as any).nivel,
      },
    });

    // Guardar en cookie con configuración segura para producción
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7, // 7 días
      httpOnly: true, // Prevenir acceso desde JavaScript
      secure: isProduction, // Solo enviar sobre HTTPS en producción
      sameSite: 'lax' as const, // Protección CSRF
      path: '/',
    };
    
    response.cookies.set("user_id", (usuario as any).usuario_id.toString(), cookieOptions);
    response.cookies.set("user_nivel", (usuario as any).nivel?.toString() || "0", cookieOptions);

    console.log("[LOGIN API] Respuesta creada, retornando");
    return response;
  } catch (error: any) {
    console.error("[LOGIN API] Error capturado:", error);
    console.error("[LOGIN API] Stack:", error.stack);
    console.error("[LOGIN API] Error completo:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Mensaje de error más descriptivo para producción
    const errorMessage = process.env.NODE_ENV === 'production'
      ? "Error al iniciar sesión. Por favor, intenta nuevamente."
      : error.message || "Error al iniciar sesión";
    
    return NextResponse.json(
      { error: errorMessage, errorType: "general" },
      { status: 500 }
    );
  }
}
