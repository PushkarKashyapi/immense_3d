import Navbar from "@/components/navbar";
import HeroSection from "@/components/herosection";
import Features from "@/components/features";
import Books from "@/components/book";
import Info from "@/components/info";
import MapSection from "@/components/map";
import Location from "@/components/location";
import Proof from "@/components/proof";
import FormSection from "@/components/form";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smooth-scroll";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <SmoothScroll />
      <Navbar />
      <HeroSection />
      <Features />
      <Books />
      < Info />
      < MapSection />
      < Location />
      < Proof />
      <FormSection />
      <Footer />
    </main>

  );
}