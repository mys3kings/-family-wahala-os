import "./globals.css";
export const metadata = { title: "Family Wahala OS", description: "Black Tax Budget Tracker" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF7] dark:bg-[#0B0F0E] transition-colors">{children}</body>
    </html>
  );
}
