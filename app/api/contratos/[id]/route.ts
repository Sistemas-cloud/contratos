import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
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

    const { tipo, ...data } = body;
    const contratoId = Array.isArray(params.id) ? params.id[0] : params.id;

    // Preparar datos comunes
    const commonData = {
      nombre: data.nombre,
      puesto: data.puesto,
      nacionalidad: data.nacionalidad,
      edad: parseInt(data.edad),
      e_civil: data.e_civil,
      rfc: data.rfc,
      domicilio: data.domicilio,
      curp: data.curp,
      funciones: data.funciones,
      dias: Array.isArray(data.dias) ? data.dias.join(", ") : data.dias,
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
    };

    let result: any;

    if (tipo === "determinado") {
      const updateData = {
        ...commonData,
        fecha_contrato: data.fecha_contrato,
        fecha_termino: data.fecha_termino,
        sueldo_mensual: parseFloat(data.sueldo_mensual),
      };
      result = await (supabase
        .from("contrato_determinado")
        .update(updateData as never) as any)
        .eq("id", contratoId);
    } else if (tipo === "indeterminado") {
      const updateData = {
        ...commonData,
        fecha_leido: data.fecha_leido,
        fecha_inicio: data.fecha_inicio,
        fecha_contrato: data.fecha_contrato,
        salario: parseFloat(data.salario),
      };
      result = await (supabase
        .from("contrato_indeterminado")
        .update(updateData as never) as any)
        .eq("id", contratoId);
    } else if (tipo === "hora") {
      const updateData = {
        ...commonData,
        fecha_inicio_esc: data.fecha_inicio_esc,
        fecha_termino_esc: data.fecha_termino_esc,
        fecha_contrato: data.fecha_contrato,
        costo_hora: parseFloat(data.costo_hora),
      };
      result = await (supabase
        .from("contrato_hora")
        .update(updateData as never) as any)
        .eq("id", contratoId);
    } else {
      return NextResponse.json(
        { error: "Tipo de contrato inválido" },
        { status: 400 }
      );
    }

    if (result.error) {
      console.error("Error updating contrato:", result.error);
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Contrato actualizado exitosamente",
    });
  } catch (error: any) {
    console.error("Error updating contrato:", error);
    return NextResponse.json(
      {
        error: error.message || "Error al actualizar contrato",
        details: error.details || null,
        code: error.code || null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get("tipo");

    if (!tipo) {
      return NextResponse.json(
        { error: "Tipo de contrato requerido" },
        { status: 400 }
      );
    }

    let tableName: string;
    if (tipo === "determinado") {
      tableName = "contrato_determinado";
    } else if (tipo === "indeterminado") {
      tableName = "contrato_indeterminado";
    } else if (tipo === "hora") {
      tableName = "contrato_hora";
    } else {
      return NextResponse.json(
        { error: "Tipo de contrato inválido" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting contrato:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar contrato" },
      { status: 500 }
    );
  }
}
