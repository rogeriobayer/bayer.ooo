import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rogério Bayer",
  description: "Portfolio of Rogério Bayer, experienced Full-Stack Developer specialized in React, Vue.js and Node.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
