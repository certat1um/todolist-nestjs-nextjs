import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/src/components/providers/ReduxProvider";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={geist.className}>
        <ReduxProvider>
          {children}
          <Toaster position="bottom-center" />
        </ReduxProvider>
      </body>
    </html>
  );
}
