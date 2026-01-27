import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Usar Service Role Key para bypass RLS
    const supabase = createServiceClient();
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    const userNivel = cookieStore.get("user_nivel")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Por favor, inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    // Verificar que exista la cookie de nivel, si no existe, solicitar login
    if (!userNivel) {
      return NextResponse.json(
        { error: "Sesión expirada. Por favor, inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    // Obtener el nivel del usuario
    const nivelUsuario = parseInt(userNivel);

    const { tipo, ...data } = body;

    // Preparar datos comunes
    const commonData = {
      nombre: data.nombre,
      puesto: data.puesto,
      nacionalidad: data.nacionalidad,
      edad: data.edad,
      e_civil: data.e_civil,
      rfc: data.rfc,
      domicilio: data.domicilio,
      curp: data.curp,
      funciones: data.funciones,
      dias: data.dias,
      hora_entrada: data.hora_entrada,
      hora_salida: data.hora_salida,
      bene1: data.bene1,
      paren1: data.paren1,
      porc1: parseInt(data.porc1),
      bene2: data.bene2 || null,
      paren2: data.paren2 || null,
      porc2: data.porc2 ? parseInt(data.porc2) : null,
      testigo1: data.testigo1,
      testigo2: data.testigo2,
      nivel: nivelUsuario, // Guardar el nivel del usuario que crea el contrato
      created_by: parseInt(userId),
    };

    let result: any;
    if (tipo === "determinado") {
      const insertData = {
        ...commonData,
        fecha_contrato: data.fecha_contrato,
        fecha_termino: data.fecha_termino,
        sueldo_mensual: parseFloat(data.sueldo_mensual),
      };
      result = await (supabase
        .from("contrato_determinado")
        .insert(insertData as never) as any);
    } else if (tipo === "indeterminado") {
      const insertData = {
        ...commonData,
        fecha_leido: data.fecha_leido,
        fecha_inicio: data.fecha_inicio,
        fecha_contrato: data.fecha_contrato,
        salario: parseFloat(data.salario),
      };
      result = await (supabase
        .from("contrato_indeterminado")
        .insert(insertData as never) as any);
    } else if (tipo === "hora") {
      const insertData = {
        ...commonData,
        fecha_inicio_esc: data.fecha_inicio_esc,
        fecha_termino_esc: data.fecha_termino_esc,
        fecha_contrato: data.fecha_contrato,
        costo_hora: parseFloat(data.costo_hora),
      };
      result = await (supabase
        .from("contrato_hora")
        .insert(insertData as never) as any);
    } else {
      return NextResponse.json(
        { error: "Tipo de contrato inválido" },
        { status: 400 }
      );
    }

    if (result.error) {
      console.error("Supabase error:", result.error);
      throw result.error;
    }

    console.log("Contrato creado exitosamente:", result.data);

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Contrato creado exitosamente",
    });
  } catch (error: any) {
    console.error("Error creating contrato:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { 
        error: error.message || "Error al crear contrato",
        details: error.details || null,
        code: error.code || null,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Usar Service Role Key para bypass RLS
    const supabase = createServiceClient();
    const cookieStore = cookies();
    const userId = cookieStore.get("user_id")?.value;
    const userNivel = cookieStore.get("user_nivel")?.value;

    // Verificar autenticación
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Por favor, inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    // Verificar que exista la cookie de nivel, si no existe, solicitar login
    if (!userNivel) {
      return NextResponse.json(
        { error: "Sesión expirada. Por favor, inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    // Obtener el nivel del usuario
    const nivelUsuario = parseInt(userNivel);

    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get("tipo") || "todos";

    let contratos: any[] = [];

    // Construir el filtro según el nivel del usuario
    // Nivel 2 (admin): ve todos los contratos
    // Nivel 1: solo ve contratos de nivel 1
    // Nivel 3: solo ve contratos de nivel 3
    let nivelFilter: number | null = null;
    if (nivelUsuario !== 2) {
      nivelFilter = nivelUsuario;
    }

    console.log("[GET CONTRATOS] Usuario ID:", userId, "Nivel:", nivelUsuario, "Filtro nivel:", nivelFilter, "Tipo:", tipo);

    if (tipo === "todos" || tipo === "determinado") {
      let query = supabase
        .from("contrato_determinado")
        .select("*");
      
      // Aplicar filtro de nivel si no es admin
      if (nivelFilter !== null) {
        query = query.eq("nivel", nivelFilter);
        console.log("[GET CONTRATOS] Aplicando filtro de nivel", nivelFilter, "a determinados");
      } else {
        console.log("[GET CONTRATOS] Admin - sin filtro de nivel para determinados");
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("[GET CONTRATOS] Error en determinados:", error);
        throw error;
      }
      if (data) {
        console.log("[GET CONTRATOS] Determinados encontrados:", data.length, "Niveles:", data.map((c: any) => c.nivel));
        contratos.push(...data.map((c: any) => ({ ...c, tipo: "determinado", id: String(c.id) })));
      }
    }

    if (tipo === "todos" || tipo === "indeterminado") {
      let query = supabase
        .from("contrato_indeterminado")
        .select("*");
      
      // Aplicar filtro de nivel si no es admin
      if (nivelFilter !== null) {
        query = query.eq("nivel", nivelFilter);
        console.log("[GET CONTRATOS] Aplicando filtro de nivel", nivelFilter, "a indeterminados");
      } else {
        console.log("[GET CONTRATOS] Admin - sin filtro de nivel para indeterminados");
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("[GET CONTRATOS] Error en indeterminados:", error);
        throw error;
      }
      if (data) {
        console.log("[GET CONTRATOS] Indeterminados encontrados:", data.length, "Niveles:", data.map((c: any) => c.nivel));
        contratos.push(...data.map((c: any) => ({ ...c, tipo: "indeterminado", id: String(c.id) })));
      }
    }

    if (tipo === "todos" || tipo === "hora") {
      let query = supabase
        .from("contrato_hora")
        .select("*");
      
      // Aplicar filtro de nivel si no es admin
      if (nivelFilter !== null) {
        query = query.eq("nivel", nivelFilter);
        console.log("[GET CONTRATOS] Aplicando filtro de nivel", nivelFilter, "a por hora");
      } else {
        console.log("[GET CONTRATOS] Admin - sin filtro de nivel para por hora");
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("[GET CONTRATOS] Error en por hora:", error);
        throw error;
      }
      if (data) {
        console.log("[GET CONTRATOS] Por hora encontrados:", data.length, "Niveles:", data.map((c: any) => c.nivel));
        contratos.push(...data.map((c: any) => ({ ...c, tipo: "hora", id: String(c.id) })));
      }
    }

    console.log("[GET CONTRATOS] Total contratos retornados:", contratos.length);
    return NextResponse.json({ data: contratos });
  } catch (error: any) {
    console.error("Error fetching contratos:", error);
    return NextResponse.json(
      { error: error.message || "Error al obtener contratos" },
      { status: 500 }
    );
  }
}
