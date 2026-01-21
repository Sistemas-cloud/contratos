import ContratoForm from "@/components/contratos/ContratoForm";

export default function NuevoContratoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Contrato</h1>
        <p className="text-gray-600 mt-2">Crea un nuevo contrato laboral</p>
      </div>
      <ContratoForm />
    </div>
  );
}
