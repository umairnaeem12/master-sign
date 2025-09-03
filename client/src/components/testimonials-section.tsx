import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Enhanced testimonials data with more engaging content
  const testimonials = [
    {
      id: "1",
      name: "Sarah Mitchell",
      company: "Mitchell & Co. Law",
      content: "Master Signs transformed our office building with stunning LED signage. The quality and professionalism exceeded our expectations. Our clients now easily find us, and the modern look has boosted our credibility significantly!",
      rating: 5,
      avatar: "SM",
      service: "LED Digital Signs",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "2", 
      name: "Michael Chen",
      company: "Chen's Restaurant",
      content: "Outstanding work on our vehicle wraps! The team was professional, creative, and delivered exactly what we envisioned. Our fleet looks amazing and we've received countless compliments from customers!",
      rating: 5,
      avatar: "MC",
      service: "Vehicle Wraps",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      company: "Rodriguez Real Estate",
      content: "The laser engraving work on our office plaques is absolutely perfect. Attention to detail and craftsmanship is outstanding. Our clients are impressed with the professional quality!",
      rating: 5,
      avatar: "ER",
      service: "Laser Engraving",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "4",
      name: "David Thompson",
      company: "Thompson Auto Parts",
      content: "Professional service from start to finish. Our storefront signs look incredible and have significantly increased our visibility. Great team that truly understands our business needs!",
      rating: 5,
      avatar: "DT",
      service: "Storefront Signs",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "5",
      name: "Lisa Wang",
      company: "Wang Design Studio",
      content: "Master Signs helped us create a cohesive brand identity with beautiful signage throughout our studio. The quality and creativity are unmatched! Our brand now looks professional and polished.",
      rating: 5,
      avatar: "LW",
      service: "Brand Identity",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "6",
      name: "Robert Martinez",
      company: "Martinez Construction",
      content: "Reliable, professional, and exceptional quality. Our construction site safety signs are clear, durable, and perfectly executed. Safety compliance has never been easier!",
      rating: 5,
      avatar: "RM",
      service: "Safety Signs",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const trustStats = [
    { value: "4.9/5", label: "Average Rating" },
    { value: "150+", label: "5-Star Reviews" },
    { value: "98%", label: "Repeat Clients" }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-yellow-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full px-6 py-3 mb-6 shadow-lg"
            variants={fadeInUp}
          >
            <MessageSquare className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">Client Reviews</span>
          </motion.div>
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            variants={fadeInUp}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Don't just take our word for it. Hear from the businesses we've helped transform their visibility and brand presence.
          </motion.p>
        </motion.div>

        {/* Enhanced Horizontal Testimonials Slider */}
        <div className="relative">
          {/* Left Arrow - Positioned on the left side */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 w-14 h-14 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-6 w-6 text-blue-600" />
          </Button>

          {/* Right Arrow - Positioned on the right side */}
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 w-14 h-14 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-6 w-6 text-blue-600" />
          </Button>

          {/* Slider Container with proper margins for hover elevation */}
          <div 
            ref={sliderRef}
            className="relative overflow-hidden rounded-3xl mx-20 my-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full flex justify-center"
              >
                {/* Single Testimonial Card - Fully Visible and Centered */}
                <div className="w-full max-w-4xl">
                  <Card className="rounded-3xl p-8 lg:p-10 border-2 border-gray-200 bg-white transition-all duration-300 h-full">
                    <CardContent className="p-0">
                      {/* Rating and Service Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 fill-current drop-shadow-sm" />
                          ))}
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                          {testimonials[currentIndex].service}
                        </span>
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8 italic text-center font-medium">
                        "{testimonials[currentIndex].content}"
                      </blockquote>

                      {/* Client Info */}
                      <div className="flex items-center justify-center space-x-4">
                        <Avatar className="w-16 h-16 border-4 border-blue-100 shadow-lg">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">
                            {testimonials[currentIndex].avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].name}</div>
                          <div className="text-gray-600 text-base">{testimonials[currentIndex].company}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators - Positioned below the slider */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'bg-blue-600 w-10 shadow-lg'
                    : 'bg-blue-200 hover:bg-blue-300 hover:scale-125'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div 
          className="flex justify-center items-center space-x-12 mt-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {trustStats.map((stat, index) => (
            <motion.div key={index} className="text-center" variants={fadeInUp}>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Create Your Own Sign?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who have designed their perfect signage with our professional tools.
            </p>
            <a 
              href="https://animated-cheesecake-a81f47.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>🎨</span>
              <span>Start Designing Your Own Template</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
