import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Eliminar cookies con las mismas opciones que se usaron al crearlas
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    maxAge: 0, // Eliminar inmediatamente
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
  };
  
  response.cookies.set("user_id", "", cookieOptions);
  response.cookies.set("user_nivel", "", cookieOptions);
  
  return response;
}
