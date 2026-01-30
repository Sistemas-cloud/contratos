import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id");

  // Si no hay sesión y está intentando acceder a rutas protegidas
  if (!userId && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay sesión y está en login, redirigir a dashboard
  if (userId && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/contratos/:path*"],
  // Excluir rutas de API del middleware
  // Las rutas de API no deben ser interceptadas por el middleware
};
