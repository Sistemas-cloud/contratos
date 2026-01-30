"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";
import { TIPOS_CONTRATO, DIAS_SEMANA, ESTADOS_CIVILES, NACIONALIDADES } from "@/lib/constants";

export default function ContratoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tipoContrato, setTipoContrato] = useState<string>("");
  const [formData, setFormData] = useState({
    // Datos del trabajador
    nombre: "",
    puesto: "",
    nacionalidad: "Mexicana",
    edad: "",
    e_civil: "",
    rfc: "",
    domicilio: "",
    curp: "",
    funciones: "",
    // Horario
    dias: [] as string[],
    hora_entrada: "",
    hora_salida: "",
    // Beneficiarios
    bene1: "",
    paren1: "",
    porc1: "",
    bene2: "",
    paren2: "",
    porc2: "",
    // Testigos
    testigo1: "",
    testigo2: "",
    // Específicos por tipo
    fecha_contrato: "",
    fecha_termino: "",
    sueldo_mensual: "",
    fecha_leido: "",
    fecha_inicio: "",
    salario: "",
    fecha_inicio_esc: "",
    fecha_termino_esc: "",
    costo_hora: "",
  });

  const handleDiaChange = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter((d) => d !== dia)
        : [...prev.dias, dia],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validar porcentajes
    const porc1 = parseInt(formData.porc1) || 0;
    const porc2 = parseInt(formData.porc2) || 0;
    if (porc1 + porc2 !== 100) {
      toast.error("La suma de porcentajes debe ser 100%");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        dias: formData.dias.join(","),
        edad: parseInt(formData.edad),
        tipo: tipoContrato,
      };

      const response = await fetch("/api/contratos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        console.error("Error al crear contrato:", data);
        
        // Si es error 401, redirigir al login
        if (response.status === 401) {
          toast.error(data.error || "Sesión expirada. Por favor, inicia sesión nuevamente.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }
        
        throw new Error(data.error || "Error al crear contrato");
      }

      console.log("Contrato creado exitosamente:", data.data);
      toast.success("Contrato creado exitosamente");
      router.push("/contratos");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al crear contrato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={tipoContrato}
            onChange={(e) => setTipoContrato(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="determinado">Tiempo de Prueba</option>
            <option value="indeterminado">Contrato Indeterminado</option>
            <option value="hora">Tiempo Determinado por Hora</option>
          </select>
        </CardContent>
      </Card>

      {tipoContrato && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Datos del Trabajador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del trabajador *</Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Puesto *</Label>
                  <Input
                    value={formData.puesto}
                    onChange={(e) =>
                      setFormData({ ...formData, puesto: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Nacionalidad *</Label>
                  <select
                    value={formData.nacionalidad}
                    onChange={(e) =>
                      setFormData({ ...formData, nacionalidad: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    {NACIONALIDADES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Edad *</Label>
                  <Input
                    type="number"
                    min="18"
                    value={formData.edad}
                    onChange={(e) =>
                      setFormData({ ...formData, edad: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Estado Civil *</Label>
                  <select
                    value={formData.e_civil}
                    onChange={(e) =>
                      setFormData({ ...formData, e_civil: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="">Seleccione</option>
                    {ESTADOS_CIVILES.map((ec) => (
                      <option key={ec} value={ec}>
                        {ec}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>RFC *</Label>
                  <Input
                    value={formData.rfc}
                    onChange={(e) => {
                      // Convertir a mayúsculas, remover caracteres especiales y limitar a 13 caracteres
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9Ñ&]/g, '').slice(0, 13);
                      setFormData({ ...formData, rfc: value });
                    }}
                    placeholder="ABCD123456EF7"
                    maxLength={13}
                    pattern="[A-ZÑ&0-9]{12,13}"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.rfc.length}/13 caracteres (12 para persona moral, 13 para persona física)
                  </p>
                </div>
                <div>
                  <Label>Domicilio *</Label>
                  <Input
                    value={formData.domicilio}
                    onChange={(e) =>
                      setFormData({ ...formData, domicilio: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>CURP *</Label>
                  <Input
                    value={formData.curp}
                    onChange={(e) => {
                      // Convertir a mayúsculas, remover caracteres especiales y limitar a 18 caracteres
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
                      setFormData({ ...formData, curp: value });
                    }}
                    placeholder="ABCD123456HABCDEF01"
                    maxLength={18}
                    pattern="[A-Z0-9]{18}"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.curp.length}/18 caracteres (solo letras y números)
                  </p>
                </div>
              </div>
              <div>
                <Label>Funciones *</Label>
                <textarea
                  value={formData.funciones}
                  onChange={(e) =>
                    setFormData({ ...formData, funciones: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Campos específicos por tipo */}
          {tipoContrato === "determinado" && (
            <Card>
              <CardHeader>
                <CardTitle>Datos del Contrato Determinado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha de contrato *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_contrato}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_contrato: e.target.value,
                        })
                      }
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Fecha de término *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_termino}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_termino: e.target.value,
                        })
                      }
                      min={formData.fecha_contrato || undefined}
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Sueldo mensual *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.sueldo_mensual}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sueldo_mensual: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {tipoContrato === "indeterminado" && (
            <Card>
              <CardHeader>
                <CardTitle>Datos del Contrato Indeterminado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha de lectura *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_leido}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_leido: e.target.value,
                        })
                      }
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Fecha de inicio *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_inicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_inicio: e.target.value,
                        })
                      }
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Fecha de contrato *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_contrato}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_contrato: e.target.value,
                        })
                      }
                      min={formData.fecha_inicio || undefined}
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Salario mensual *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.salario}
                      onChange={(e) =>
                        setFormData({ ...formData, salario: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {tipoContrato === "hora" && (
            <Card>
              <CardHeader>
                <CardTitle>Datos del Contrato por Hora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha inicio ciclo escolar *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_inicio_esc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_inicio_esc: e.target.value,
                        })
                      }
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Fecha término ciclo escolar *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_termino_esc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_termino_esc: e.target.value,
                        })
                      }
                      min={formData.fecha_inicio_esc || undefined}
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Fecha de contrato *</Label>
                    <Input
                      type="date"
                      value={formData.fecha_contrato}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fecha_contrato: e.target.value,
                        })
                      }
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  <div>
                    <Label>Costo por hora *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.costo_hora}
                      onChange={(e) =>
                        setFormData({ ...formData, costo_hora: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Horario y Días de Trabajo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hora de entrada *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="time"
                      value={formData.hora_entrada}
                      onChange={(e) =>
                        setFormData({ ...formData, hora_entrada: e.target.value })
                      }
                      className="pl-10 cursor-pointer"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Hora de salida *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="time"
                      value={formData.hora_salida}
                      onChange={(e) =>
                        setFormData({ ...formData, hora_salida: e.target.value })
                      }
                      className="pl-10 cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Días de trabajo *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {DIAS_SEMANA.slice(0, 6).map((dia) => (
                    <label key={dia} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.dias.includes(dia)}
                        onChange={() => handleDiaChange(dia)}
                        className="rounded"
                      />
                      <span>{dia}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beneficiarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Nombre completo 1 *</Label>
                  <Input
                    value={formData.bene1}
                    onChange={(e) =>
                      setFormData({ ...formData, bene1: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Parentesco 1 *</Label>
                  <Input
                    value={formData.paren1}
                    onChange={(e) =>
                      setFormData({ ...formData, paren1: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Porcentaje 1 *</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.porc1}
                    onChange={(e) =>
                      setFormData({ ...formData, porc1: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Nombre completo 2</Label>
                  <Input
                    value={formData.bene2}
                    onChange={(e) =>
                      setFormData({ ...formData, bene2: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Parentesco 2</Label>
                  <Input
                    value={formData.paren2}
                    onChange={(e) =>
                      setFormData({ ...formData, paren2: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Porcentaje 2</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.porc2}
                    onChange={(e) =>
                      setFormData({ ...formData, porc2: e.target.value })
                    }
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Suma de porcentajes:{" "}
                {(parseInt(formData.porc1) || 0) +
                  (parseInt(formData.porc2) || 0)}
                % (debe ser 100%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testigos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Testigo 1 *</Label>
                  <Input
                    value={formData.testigo1}
                    onChange={(e) =>
                      setFormData({ ...formData, testigo1: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Testigo 2 *</Label>
                  <Input
                    value={formData.testigo2}
                    onChange={(e) =>
                      setFormData({ ...formData, testigo2: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Contrato"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
