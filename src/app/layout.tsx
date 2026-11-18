import StoreProvider from "@/store/Provider";
import { ReactNode } from "react";
import Header from "@/layouts/Header";
import ThemeProvider from "@/features/theme/ThemeProvider";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body
        className="flex flex-col m-0 min-h-screen font-IBM transition-colors duration-300 bg-(--bg-primary) text-(--text-main)"
        suppressHydrationWarning
      >
        <StoreProvider>
          <ThemeProvider>
            <Header />
            <main className="grow">{children}</main>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
