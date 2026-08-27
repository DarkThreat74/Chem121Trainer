import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineSync from "@/components/OfflineSync";
import { SettingsProvider } from "@/components/SettingsProvider";

export const metadata: Metadata = {
  title: "Chem 121 Trainer",
  description: "Master introductory chemistry through spaced repetition practice.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chem 121",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before React hydrates to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem('chem121-settings')||'{}');if(s.theme==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}}catch(e){}`
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text" suppressHydrationWarning>
        <SettingsProvider>
          <NavBar />
          {children}
          <ServiceWorkerRegister />
          <PWAInstallPrompt />
          <OfflineSync />
        </SettingsProvider>
      </body>
    </html>
  );
}
