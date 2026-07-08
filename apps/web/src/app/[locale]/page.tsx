import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/webgl/SmoothScroll";
import { Background } from "@/components/webgl/Background";
import { ScrollBuddy } from "@/components/brand/ScrollBuddy";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Compare } from "@/components/sections/Compare";
import { Team } from "@/components/sections/Team";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Outcomes } from "@/components/sections/Outcomes";
import { Register } from "@/components/sections/Register";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SmoothScroll>
      {/* Fixed WebGL layer behind all content (with graceful fallback). */}
      <Background />

      <Nav />

      {/* Cursor-tracking companion that follows down the left side. */}
      <ScrollBuddy />

      <main className="relative z-10">
        <Hero />
        <Problem />
        <Compare />
        <Team />
        <HowItWorks />
        <Outcomes />
        <Register />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
