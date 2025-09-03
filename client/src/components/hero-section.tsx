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
    <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
      {/* Enhanced Background with Multiple Gradients */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
        
        {/* Secondary gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 via-transparent to-purple-600/20"></div>
        
        {/* Animated gradient particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: `url(${getImageUrl("Banners/MAIN - Banner.jpg")})`
          }}
        />
        
        {/* Enhanced overlay with better opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-blue-700/90 to-blue-800/95"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-white"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Enhanced Promotional Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full px-6 py-3 mb-8 shadow-lg border border-yellow-300/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="h-5 w-5 text-black fill-current animate-pulse" />
              <span className="text-sm font-bold tracking-wide">🔥 LIMITED TIME OFFER</span>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-8 leading-tight"
              variants={fadeInUp}
            >
              You have a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">vision</span>,<br />
              we're here to help!
            </motion.h1>

            <motion.p 
              className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Your business deserves to be seen. At Master Signs, we provide custom sign and visual 
              solutions that handle all your business needs - from content development to graphic design 
              and project management.
            </motion.p>

            {/* Enhanced Promotional Offer */}
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-10 border border-white/20 shadow-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-7 w-7 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">Special Promotion</h3>
              </div>
              <p className="text-blue-100 mb-3 text-lg">
                <span className="text-yellow-400 font-bold text-xl">50% OFF</span> on all custom signs this month!
              </p>
              <p className="text-blue-200 text-base">
                Plus, get a <span className="font-bold">FREE design consultation</span> worth $200
              </p>
            </motion.div>

            {/* Enhanced Key Benefits */}
            <motion.div className="space-y-4 mb-10" variants={staggerContainer}>
              {[
                "Faith-driven, family-owned excellence",
                "15+ years of proven expertise",
                "Complete design to installation service",
                "Local community focus with professional results"
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-4 group"
                  variants={fadeInUp}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-blue-100 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
              variants={staggerContainer}
            >
              <motion.div variants={magneticHover}>
                <Button 
                  onClick={scrollToQuote}
                  size="lg"
                  className="btn-primary bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 font-bold px-10 py-5 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-yellow-400/25 border-2 border-yellow-300/50"
                  data-testid="button-hero-quote"
                >
                  Get Your Quote
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div variants={magneticHover}>
                <ExternalNavigationButton 
                  url="https://animated-cheesecake-a81f47.netlify.app/"
                  variant="outline"
                  size="lg"
                  className="border-3 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-10 py-5 rounded-2xl text-xl transition-all duration-300 shadow-xl hover:shadow-white/25 backdrop-blur-sm bg-white/10 hover:bg-white"
                >
                  <Palette className="mr-3 h-6 w-6" />
                  Start Designing
                </ExternalNavigationButton>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Right Content - Hero Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Enhanced image container with gradient border */}
              <div className="p-2 bg-gradient-to-br from-yellow-400/50 via-transparent to-blue-400/50 rounded-3xl">
                <img 
                  src={getImageUrl("Fabricated Signs/20231114_212838.jpg")}
                  alt="Showcase of our signage work"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              
              {/* Enhanced Floating Stats Card */}
              <motion.div 
                className="absolute left-4 bottom-4 md:left-8 md:bottom-8 z-20 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Enhanced Clients pill */}
                  <div className="flex items-center gap-3 bg-white/15 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg border border-white/20">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Users className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-base md:text-lg font-bold text-white">500+</div>
                      <div className="text-xs md:text-sm text-white/80">Happy Clients</div>
                    </div>
                  </div>

                  {/* Enhanced Rating pill */}
                  <div className="flex items-center gap-3 bg-white/15 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg border border-white/20 ml-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-black shadow-lg">
                      <Star className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-base md:text-lg font-bold text-white">4.9</div>
                      <div className="text-xs md:text-sm text-white/80">Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Services Section */}
        <motion.div 
          className="mt-20 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Complete Signage Solutions</h3>
            <p className="text-blue-100 text-base md:text-lg">From concept to installation, we deliver results</p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Zap, label: "LED Digital Signs", desc: "Eye-catching displays" },
              { icon: Car, label: "Vehicle Wraps", desc: "Mobile advertising" },
              { icon: Settings, label: "Laser Engraving", desc: "Precision crafting" },
              { icon: Palette, label: "Custom Design", desc: "Creative solutions" }
            ].map((service, index) => (
              <motion.div 
                key={index}
                className="text-center group cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-white/20"
                variants={fadeInUp}
                whileHover={{ translateY: -12, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-white/30 transition-all duration-500">
                  <service.icon className="h-8 w-8 md:h-9 md:w-9 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-white font-semibold text-base md:text-lg mb-1">{service.label}</div>
                <div className="text-blue-200 text-sm md:text-base">{service.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Section Divider Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 md:h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="currentColor"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19.3,79.78-31.16,119.65-39.7C377.43,2.89,414.16,1,450.67,1,489.18,1,527.66,2.89,566.25,6.33c39.07,3.33,77.36,9.25,114.23,15.81,32.19,5.92,64.84,15.2,97.7,23.11,28.35,8.11,58.16,12.69,89.67,13.08,36.3.47,70.9-1.42,105.34-6.25C1001.63,29.22,1066.34,12.18,1130,0V0Z" 
            opacity=".5" 
            fill="currentColor"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
