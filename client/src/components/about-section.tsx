import { motion } from "framer-motion";
import { Users, Handshake, Brain, Users2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from "@/lib/animations";
import { ExternalNavigationButton } from "@/components/ExternalNavigationButton";

export default function AboutSection() {
  const values = [
    {
      icon: Handshake,
      title: "Integrity First",
      description: "Our faith-driven values guide every interaction, ensuring honesty, reliability, and exceptional service in everything we do."
    },
    {
      icon: Brain,
      title: "Innovation & Tradition",
      description: "We blend time-tested craftsmanship with the latest technology to create signs that stand the test of time."
    },
    {
      icon: Users2,
      title: "Community Focus",
      description: "As locals serving locals, we understand the unique needs of our community and take pride in contributing to its growth."
    }
  ];

  const stats = [
    { value: "500+", label: "Happy Clients" },
    { value: "15+", label: "Years Experience" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-16 items-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Content */}
          <motion.div variants={slideInLeft}>
            <div className="inline-flex items-center space-x-2 bg-[var(--master-blue)] bg-opacity-10 rounded-full px-6 py-3 mb-6">
                                              <Users className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Our Story</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--master-black)] mb-6">
              Faith-Driven Excellence in Every Sign
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              For over 15 years, Master Signs has been a family-owned cornerstone of our community, 
              combining traditional craftsmanship with cutting-edge technology to deliver signage solutions 
              that truly make a difference.
            </p>
            
            {/* Values */}
            <div className="space-y-6 mb-8">
              {values.map((value, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-4"
                  variants={fadeInUp}
                >
                  <div className="w-12 h-12 bg-[var(--master-blue)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--master-black)] mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div key={index} className="text-center" variants={fadeInUp}>
                  <div className="text-3xl font-bold text-[var(--master-blue)] mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Start Designing Button */}
            <motion.div className="mt-8" variants={fadeInUp}>
              <ExternalNavigationButton 
                url="https://animated-cheesecake-a81f47.netlify.app/"
                className="inline-flex items-center space-x-2 bg-[var(--master-blue)] text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                <span>🎨</span>
                <span>Start Designing Your Sign</span>
              </ExternalNavigationButton>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div className="relative" variants={slideInRight}>
            <img 
              src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional business consultation meeting"
              className="rounded-3xl shadow-2xl w-full"
            />
            
            {/* Floating Card */}
            <motion.div
              className="absolute -bottom-8 -left-8 glassmorphism rounded-2xl p-6 max-w-xs"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[var(--master-blue)] rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--master-black)]">Certified Professionals</div>
                      <div className="text-sm text-gray-600">Licensed & Insured</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
