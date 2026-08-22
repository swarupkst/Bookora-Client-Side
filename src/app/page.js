import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import TopLibrarians from "@/components/home/TopLibrarians";
import CategorySection from "@/components/home/CategorySection";
import HomeStats from "@/components/home/HomeStats";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <main>
        <Hero />

        <HomeStats />

        <FeaturedBooks />

        <TopLibrarians />

        <CategorySection />
      </main>

      <Footer />
    </div>
  );
}