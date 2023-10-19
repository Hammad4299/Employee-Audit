// import { QueryClientProviderNext } from "@/app/components/QueryClient";
import { QueryClientProviderNext } from "@/app/components/QueryClient";
import ThemeRegistry from "@/app/components/ThemeRegistry/ThemeRegistry";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Audit",
  description: "Employee Audit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <QueryClientProviderNext>{children}</QueryClientProviderNext>
        </ThemeRegistry>
      </body>
    </html>
  );
}
