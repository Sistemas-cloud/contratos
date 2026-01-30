import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

// Fuente del sistema para evitar que next/font bloquee el arranque (Google Fonts puede colgar en algunos entornos)
const fontClass = "font-sans antialiased";

export const metadata: Metadata = {
  title: "Sistema de Contratos",
  description: "Sistema de generación y gestión de contratos laborales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={fontClass}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
