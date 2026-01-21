import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Eliminar cookies
  response.cookies.delete("user_id");
  response.cookies.delete("user_nivel");
  
  return response;
}
