export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-3" />
        <p className="text-gray-600 text-sm">Cargando...</p>
      </div>
    </div>
  );
}
