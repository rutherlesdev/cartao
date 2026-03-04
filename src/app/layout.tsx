import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-app-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-app-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cartao da Gestante",
  description: "Prontuario digital para acompanhamento pre-natal",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cartao Gestante",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d5c75",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${jakarta.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
