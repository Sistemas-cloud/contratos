import ContratoForm from "@/components/contratos/ContratoForm";
import { cookies } from "next/headers";

export default async function NuevoContratoPage() {
  const cookieStore = await cookies();
  const userNivelRaw = cookieStore.get("user_nivel")?.value;
  const userNivel = Number.parseInt(userNivelRaw || "1", 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Contrato</h1>
        <p className="text-gray-600 mt-2">Crea un nuevo contrato laboral</p>
      </div>
      <ContratoForm userNivel={Number.isNaN(userNivel) ? 1 : userNivel} />
    </div>
  );
}
