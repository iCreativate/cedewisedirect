import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import Roles from "@/components/marketing/Roles";
import Workflow from "@/components/marketing/Workflow";
import CTA from "@/components/marketing/CTA";
import Footer from "@/components/marketing/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Roles />
      <Workflow />
      <CTA />
      <Footer />
    </main>
  );
}

