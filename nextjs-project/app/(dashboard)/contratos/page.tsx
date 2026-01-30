import ContratosList from "@/components/contratos/ContratosList";

export default function ContratosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Contratos
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Gestiona todos tus contratos laborales</p>
        </div>
      </div>
      <ContratosList />
    </div>
  );
}
