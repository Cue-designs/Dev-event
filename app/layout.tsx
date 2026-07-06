import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Event",
  description: "The Hub  for every dev event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        schibstedGrotesk.variable,
        martianMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-screen ">
        <div style={{ zIndex: -1, position: "absolute", inset: 0, top: 0 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#01e645"
            raysSpeed={1}
            lightSpread={2}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={true}
            fadeDistance={0.5}
            saturation={1}
          />
        </div>
        <Navbar />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen"></div>
        <main>{children}</main>
      </body>
    </html>
  );
}
