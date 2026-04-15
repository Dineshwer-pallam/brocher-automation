import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat, Bebas_Neue, Cormorant_Garamond, Work_Sans, Outfit, DM_Sans, Lora, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], display: 'swap', variable: '--font-playfair' });
const montserrat = Montserrat({ subsets: ["latin"], display: 'swap', variable: '--font-montserrat' });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], display: 'swap', variable: '--font-bebas-neue' });
const cormorant = Cormorant_Garamond({ weight: ["400", "600", "700"], subsets: ["latin"], display: 'swap', variable: '--font-cormorant' });
const workSans = Work_Sans({ subsets: ["latin"], display: 'swap', variable: '--font-work-sans' });
const outfit = Outfit({ subsets: ["latin"], display: 'swap', variable: '--font-outfit' });
const dmSans = DM_Sans({ subsets: ["latin"], display: 'swap', variable: '--font-dm-sans' });
const lora = Lora({ subsets: ["latin"], display: 'swap', variable: '--font-lora' });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], display: 'swap', variable: '--font-poppins' });

export const metadata: Metadata = {
  title: "Property Brochure Builder",
  description: "Create stunning property brochures in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${bebasNeue.variable} ${cormorant.variable} ${workSans.variable} ${outfit.variable} ${dmSans.variable} ${lora.variable} ${poppins.variable} ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
