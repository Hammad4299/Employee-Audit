import ThemeRegistry from "@/app/components/ThemeRegistry/ThemeRegistry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Audit",
  description: "Employee Audit",
};
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
