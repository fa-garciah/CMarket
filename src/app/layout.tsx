import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CMarket",
  description: "Marketplace comunitario de CMarket",
  manifest: "/manifest.json",
  themeColor: "#231f39",
  icons: {
    icon: [
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/icon-152x152.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
