export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-4" />
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
