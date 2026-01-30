"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, PlusCircle, Clock, Calendar, Users } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    determinado: 0,
    indeterminado: 0,
    hora: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [res1, res2, res3] = await Promise.all([
        fetch("/api/contratos?tipo=determinado"),
        fetch("/api/contratos?tipo=indeterminado"),
        fetch("/api/contratos?tipo=hora"),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();
      const data3 = await res3.json();

      setStats({
        determinado: data1.data?.length || 0,
        indeterminado: data2.data?.length || 0,
        hora: data3.data?.length || 0,
        total: (data1.data?.length || 0) + (data2.data?.length || 0) + (data3.data?.length || 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Bienvenido al sistema de contratos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Contratos</CardTitle>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              {stats.total}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Contratos registrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 bg-gradient-to-br from-emerald-50 to-teal-50" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tiempo Determinado</CardTitle>
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              {stats.determinado}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Contratos de prueba
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 bg-gradient-to-br from-purple-50 to-pink-50" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Indeterminado</CardTitle>
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
              {stats.indeterminado}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Sin fecha de término
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 bg-gradient-to-br from-amber-50 to-orange-50" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Por Hora</CardTitle>
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
              {stats.hora}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Jornada reducida
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms" }}>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/contratos/nuevo"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group border border-transparent hover:border-blue-200 hover:shadow-md"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                <PlusCircle className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Crear Nuevo Contrato</span>
            </Link>
            <Link
              href="/contratos"
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group border border-transparent hover:border-emerald-200 hover:shadow-md"
            >
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-emerald-700 transition-colors">Ver Todos los Contratos</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
