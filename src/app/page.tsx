import HeroSection from "@/components/home/HeroSection";
import ManifestoText from "@/components/home/ManifestoText";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="px-4 sm:px-6 pb-12">
        <div className="content-panel max-w-4xl mx-auto">
          <ManifestoText />
        </div>
      </div>
    </>
  );
}
