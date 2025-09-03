import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductsSection from "@/components/products-section";
import ServicesSection from "@/components/services-section";
import PortfolioSection from "@/components/portfolio-section";
import AboutSection from "@/components/about-section";
import QuoteForm from "@/components/quote-form";
import TestimonialsSection from "@/components/testimonials-section";
import ClientReviews from "@/components/client-reviews";
import FAQsSection from "@/components/faqs-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Set page title and meta description
    document.title = "Master Signs - Professional Signage Solutions | Vehicle Wraps, LED Signs, Laser Engraving";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Faith-driven, family-owned signage company offering professional vehicle wraps, LED boards, laser engraving, and custom signs. Local, innovative, and trustworthy.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Faith-driven, family-owned signage company offering professional vehicle wraps, LED boards, laser engraving, and custom signs. Local, innovative, and trustworthy.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <TestimonialsSection />
      <ProductsSection />
      <ServicesSection />
      <PortfolioSection />
      <AboutSection />
      <QuoteForm />
      <ClientReviews />
      <FAQsSection />
      <Footer />
    </div>
  );
}
