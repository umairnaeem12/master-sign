import { motion } from "framer-motion";
import { ArrowRight, Play, Star, CheckCircle, Zap, Car, Settings, Palette, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, magneticHover } from "@/lib/animations";
import { getImageUrl } from "@/lib/image-utils";
import { ExternalNavigationButton } from "@/components/ExternalNavigationButton";

export default function HeroSection() {
  const scrollToQuote = () => {
    const element = document.getElementById('quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 min-h-screen flex items-center pt-32">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(${getImageUrl("Banners/MAIN - Banner.jpg")})`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-600 bg-opacity-90"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-white"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Promotional Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-yellow-400 text-black rounded-full px-4 py-2 mb-6"
              variants={fadeInUp}
            >
              <Star className="h-4 w-4 text-black fill-current" />
              <span className="text-sm font-bold">🔥 LIMITED TIME OFFER</span>
            </motion.div>

            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              You have a <span className="text-yellow-400">vision</span>,<br />
              we're here to help!
            </motion.h1>

            <motion.p 
              className="text-xl text-blue-100 mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              Your business deserves to be seen. At Master Signs, we provide custom sign and visual 
              solutions that handle all your business needs - from content development to graphic design 
              and project management.
            </motion.p>

            {/* Promotional Offer */}
            <motion.div 
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white border-opacity-20"
              variants={fadeInUp}
            >
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="h-6 w-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Special Promotion</h3>
              </div>
              <p className="text-blue-100 mb-3">
                <span className="text-yellow-400 font-bold">50% OFF</span> on all custom signs this month!
              </p>
              <p className="text-sm text-blue-200">
                Plus, get a <span className="font-bold">FREE design consultation</span> worth $200
              </p>
            </motion.div>

            {/* Key Benefits */}
            <motion.div className="space-y-3 mb-8" variants={staggerContainer}>
              {[
                "Faith-driven, family-owned excellence",
                "15+ years of proven expertise",
                "Complete design to installation service",
                "Local community focus with professional results"
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3"
                  variants={fadeInUp}
                >
                  <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-blue-100">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              variants={staggerContainer}
            >
              <motion.div variants={magneticHover}>
                <Button 
                  onClick={scrollToQuote}
                  size="lg"
                  className="btn-primary bg-yellow-400 text-black hover:bg-yellow-300 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                  data-testid="button-hero-quote"
                >
                  Get Your Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div variants={magneticHover}>
                <ExternalNavigationButton 
                  url="https://animated-cheesecake-a81f47.netlify.app/"
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg"
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Start Designing
                </ExternalNavigationButton>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={getImageUrl("Fabricated Signs/20231114_212838.jpg")}
                alt="Showcase of our signage work"
                className="w-full h-auto"
              />
              
              {/* Floating Stats Card */}
              <motion.div 
                className="absolute left-3 bottom-3 md:left-6 md:bottom-6 z-20 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Clients pill */}
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 shadow-sm">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-blue-500/40 flex items-center justify-center text-white">
                      <Users className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm md:text-base font-bold text-white">500+</div>
                      <div className="text-[10px] md:text-xs text-white/80">Happy Clients</div>
                    </div>
                  </div>

                  {/* Rating pill */}
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 shadow-sm ml-1">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-yellow-400/40 flex items-center justify-center text-yellow-200">
                      <Star className="w-4 h-4" fill="currentColor" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm md:text-base font-bold text-white">4.9</div>
                      <div className="text-[10px] md:text-xs text-white/80">Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-16 bg-white/10 backdrop-blur-xl border border-white/15 rounded-lg p-6 md:p-8 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-white text-xl md:text-2xl font-bold mb-1">Complete Signage Solutions</h3>
            <p className="text-blue-100 text-sm md:text-base">From concept to installation, we deliver results</p>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Zap, label: "LED Digital Signs", desc: "Eye-catching displays" },
              { icon: Car, label: "Vehicle Wraps", desc: "Mobile advertising" },
              { icon: Settings, label: "Laser Engraving", desc: "Precision crafting" },
              { icon: Palette, label: "Custom Design", desc: "Creative solutions" }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="text-center group cursor-pointer bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg p-4 md:p-5 transition-all duration-300 shadow-sm hover:shadow-md"
                variants={fadeInUp}
                whileHover={{ translateY: -2 }}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-white/25 to-white/10 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <service.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div className="text-white font-semibold text-sm md:text-base">{service.label}</div>
                <div className="text-blue-200 text-xs md:text-sm mt-0.5">{service.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
