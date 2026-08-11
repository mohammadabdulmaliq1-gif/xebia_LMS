import "./globals.css";
import QueryProvider from "../context/QueryProvider";
import { ToastProvider } from "../context/ToastProvider";

import ClientLayoutWrapper from "../components/common/ClientLayoutWrapper";

export const metadata = {
  title: "Xebia Enterprise LMS Portal",
  description: "Enterprise learning management system portal built for Xebia Consultants and Tech Architects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-background text-foreground custom-scrollbar" suppressHydrationWarning={true}>
        <QueryProvider>
          <ToastProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
