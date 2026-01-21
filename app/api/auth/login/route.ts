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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Error de configuración del servidor", errorType: "general" },
        { status: 500 }
      );
    }

    // Usar Service Role Key para el login (bypass RLS)
    const supabase = createServiceClient();
    console.log("[LOGIN API] Cliente Supabase creado (Service Role)");

    // Buscar usuario en la tabla usuario (no Supabase Auth)
    console.log("[LOGIN API] Buscando usuario:", validated.username);
    const { data: usuario, error } = await supabase
      .from("usuario")
      .select("usuario_id, usuario_username, usuario_password, usuario_nombre, nivel")
      .eq("usuario_username", validated.username)
      .single();

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

    // Guardar en cookie (en producción usar httpOnly, secure, sameSite)
    response.cookies.set("user_id", (usuario as any).usuario_id.toString(), {
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });
    response.cookies.set("user_nivel", (usuario as any).nivel?.toString() || "0", {
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("[LOGIN API] Respuesta creada, retornando");
    return response;
  } catch (error: any) {
    console.error("[LOGIN API] Error capturado:", error);
    return NextResponse.json(
      { error: error.message || "Error al iniciar sesión", errorType: "general" },
      { status: 500 }
    );
  }
}
