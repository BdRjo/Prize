import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "جائزة الحسين بن عبدالله الثاني للعمل التطوعي",
  description: "جائزة وطنية لتكريم وتشجيع العاملين في مجال العمل التطوعي والأهلي في المملكة الأردنية الهاشمية",
  keywords: ["جائزة الحسين", "عمل تطوعي", "أردن", "تطوع", "جائزة"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
