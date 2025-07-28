import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth";
import { CartProvider } from "@/context/cart";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KisanTech - Agricultural E-commerce Platform",
  description: "Modern agricultural platform for farmers and buyers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster 
                position="bottom-right" 
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid var(--border)',
                  },
                  success: {
                    style: {
                      background: '#10b981',
                      color: '#fff',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#10b981',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#ef4444',
                    },
                  },
                  loading: {
                    style: {
                      background: '#3b82f6',
                      color: '#fff',
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}