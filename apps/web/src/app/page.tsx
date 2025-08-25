import Blog from "@/components/sections/blog";
import CTA from "@/components/sections/cta";
import FAQ from "@/components/sections/faq";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Logos from "@/components/sections/logos";
import Problem from "@/components/sections/problem";
import dynamic from "next/dynamic";

// Dynamically import client components
const Header = dynamic(() => import("@/components/sections/header"));
const Hero = dynamic(() => import("@/components/sections/hero"));
const Solution = dynamic(() => import("@/components/sections/solution"));
const HowItWorks = dynamic(() => import("@/components/sections/how-it-works"));
const TestimonialsCarousel = dynamic(
  () => import("@/components/sections/testimonials-carousel"),
);
const Testimonials = dynamic(
  () => import("@/components/sections/testimonials"),
);
const Pricing = dynamic(() => import("@/components/sections/pricing"));

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Logos />
      <Problem />
      <Solution />
      <HowItWorks />
      <TestimonialsCarousel />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Blog />
      <CTA />
      <Footer />
    </main>
  );
}
