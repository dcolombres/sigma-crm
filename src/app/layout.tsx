import type { Metadata } from "next";
import { Roboto, Encode_Sans } from "next/font/google";
import "ar-poncho/dist/css/poncho.min.css";
import "./globals.css";

import MainLayout from "@/components/MainLayout";
import BreadcrumbsWrapper from "@/components/BreadcrumbsWrapper";

const roboto = Roboto({ subsets: ["latin"], weight: ['400', '500', '700'], variable: '--font-roboto' });
const encode_sans = Encode_Sans({ subsets: ["latin"], weight: ['400', '500', '600', '700'], variable: '--font-encode-sans' });

export const metadata: Metadata = {
  title: "SIGMA CRM",
  description: "Gestión de Proyectos, Staff y Clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        
      </head>
      <body className={`${roboto.variable} ${encode_sans.variable} font-sans antialiased bg-background`}>
        <MainLayout>
            <BreadcrumbsWrapper />
            {children}
          </MainLayout>
      </body>
    </html>
  );
}
