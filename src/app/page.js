


import Hero from "@/components/home/Hero";
import FeaturedBooksDynamic from "@/components/home/FeaturedBooksDynamic";
import TopLibrarians from "@/components/home/TopLibrarians";
import CategorySection from "@/components/home/CategorySection";
import HomeStats from "@/components/home/HomeStats";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      

      <main>
        <Hero />

        <HomeStats />

        
        <FeaturedBooksDynamic />

        <TopLibrarians />

        <CategorySection />
      </main>

      
    </div>
  );
}