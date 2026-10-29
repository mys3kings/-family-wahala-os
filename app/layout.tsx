import "./globals.css";

export const metadata = {
  title: "Family Wahala OS",
  description: "A professional family-support and budget tracker. Track income, expenses, family requests, budgets and savings goals.",
  applicationName: "Family Wahala OS",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "https://files.catbox.moe/eo6iau.jpg", type: "image/jpeg" }],
    apple: [{ url: "https://files.catbox.moe/eo6iau.jpg", type: "image/jpeg" }]
  },
  openGraph: {
    title: "Family Wahala OS",
    description: "Keep family requests, expenses and your budget organised in one place.",
    images: [{ url: "https://files.catbox.moe/vjw2xj.jpg", width: 1200, height: 630, alt: "Family Wahala OS" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Family Wahala OS",
    description: "Keep family requests, expenses and your budget organised in one place.",
    images: ["https://files.catbox.moe/vjw2xj.jpg"]
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Wahala OS" },
};

export const viewport = {
  themeColor: "#075c46",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF7] dark:bg-[#0B0F0E] transition-colors">{children}</body>
    </html>
  );
}
