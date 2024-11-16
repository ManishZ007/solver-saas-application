import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import ProductShowcase from "@/components/home/ProductShowcase";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";

const Page = async () => {
  return (
    <>
      <Hero />
      <Features />
      <ProductShowcase />
      <FAQ />
      <Footer />
    </>
  );
};

export default Page;
