import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/nav";


export const metadata: Metadata = {
  title: "Finboard Assignment",
  description: "Finboard Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className='px-4 py-4'>
          {children}
        </main>
      </body>
    </html>
  );
}
