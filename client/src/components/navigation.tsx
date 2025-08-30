import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, User, Search, ShoppingCart, Menu, X, ChevronDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeInUp, magneticHover } from "@/lib/animations";
import { ProductCategory, PRODUCT_SUBCATEGORIES } from "@/types/products";
import { getImageUrl } from "@/lib/image-utils";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<ProductCategory | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Organize categories into rows
  const topRowCategories = [
    ProductCategory.EXPO_DISPLAY,
    ProductCategory.LASER_ENGRAVING,
    ProductCategory.DECALS_STICKERS,
    ProductCategory.BANNERS_FLAGS,
    ProductCategory.SIGNS,
    ProductCategory.PRIVACY_SECURITY,
    ProductCategory.MARKETING,
    ProductCategory.PROMO
  ];

  const bottomRowCategories = [
    ProductCategory.ELECTRIC_SIGNS,
    ProductCategory.VEHICLE_TRAILER,
    ProductCategory.INDOOR_SIGNS,
    ProductCategory.OUTDOOR_SIGNS,
    ProductCategory.ACCESSORIES
  ];

  const handleCategoryHover = (category: ProductCategory) => {
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  // Function to render dropdown content with multi-column layout
  const renderDropdownContent = (category: ProductCategory) => {
    const subCategories = PRODUCT_SUBCATEGORIES[category] || [];
    const hasManyOptions = subCategories.length > 10;
    
    if (hasManyOptions) {
      // Split into columns for better layout
      const midPoint = Math.ceil(subCategories.length / 2);
      const leftColumn = subCategories.slice(0, midPoint);
      const rightColumn = subCategories.slice(midPoint);
      
      return (
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {leftColumn.map((subCategory, subIndex) => (
                <a
                  key={subIndex}
                  href={`/products?category=${encodeURIComponent(category)}&sub=${encodeURIComponent(subCategory)}`}
                  className="text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors block"
                >
                  {subCategory}
                </a>
              ))}
            </div>
            <div className="space-y-2">
              {rightColumn.map((subCategory, subIndex) => (
                <a
                  key={subIndex}
                  href={`/products?category=${encodeURIComponent(category)}&sub=${encodeURIComponent(subCategory)}`}
                  className="text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors block"
                >
                  {subCategory}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All {category} →
            </a>
          </div>
        </div>
      );
    } else {
      // Single column for fewer options
      return (
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                      <div className="space-y-2">
              {subCategories.map((subCategory, subIndex) => (
                <a
                  key={subIndex}
                  href={`/products?category=${encodeURIComponent(category)}&sub=${encodeURIComponent(subCategory)}`}
                  className="text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors block"
                >
                  {subCategory}
                </a>
              ))}
            </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All {category} →
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Top Utility Bar */}
      <motion.div 
        className="bg-blue-600 text-white py-2 text-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span>🎉 Free Quote + Design Consultation - Limited Time!</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>(555) 123-SIGN</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>hello@mastersigns.com</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav 
        className="bg-white shadow-lg sticky top-0 z-[99999]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
                 <div className="max-w-7xl mx-auto px-4">
           <div className="flex justify-between items-center py-3">
             {/* Logo */}
             <motion.div 
               className="flex items-center cursor-pointer"
               {...fadeInUp}
               onClick={() => window.location.href = '/'}
             >
               <img 
                 src="/1.png" 
                 alt="Master Signs" 
                 className="w-72 h-16 rounded-lg object-contain"
                 onError={(e) => {
                   console.error('Logo failed to load:', e);
                   e.currentTarget.style.display = 'none';
                 }}
                 onLoad={() => console.log('Logo loaded successfully')}
               />
             </motion.div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input 
                  placeholder="Search for signs, services, or products..."
                  className="pl-10 pr-4 py-2 rounded-full border-2 border-gray-200 focus:border-blue-600"
                  data-testid="search-input"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/login'}
                className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                data-testid="button-customer-login"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/signup'}
                className="hidden md:flex border-blue-600 text-blue-600 hover:bg-blue-50 font-medium"
              >
                Sign Up
              </Button>
              
              <motion.div {...magneticHover}>
                <Button 
                  asChild
                  className="btn-primary bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
                  data-testid="button-start-designing"
                >
                  <a href="https://animated-cheesecake-a81f47.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <Palette className="mr-2 h-4 w-4" />
                    START DESIGNING
                  </a>
                </Button>
              </motion.div>
              
              <button 
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation - Two Rows */}
        <div className="bg-gray-50 border-t hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            {/* Top Row */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center space-x-8">
                {topRowCategories.map((category, index) => (
                <div 
                    key={index}
                  className="relative group"
                    onMouseEnter={() => handleCategoryHover(category)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <button
                      className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors flex items-center space-x-1 py-3 px-2 rounded hover:bg-gray-100"
                      data-testid={`nav-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span>{category}</span>
                      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  </button>
                  
                    {/* Dropdown Menu */}
                    {hoveredCategory === category && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-0 bg-white rounded-lg shadow-xl border border-gray-200 z-[999999] min-w-[320px] max-w-[600px]"
                        onMouseEnter={() => handleCategoryHover(category)}
                        onMouseLeave={handleCategoryLeave}
                        style={{ zIndex: 999999 }}
                      >
                        {/* Invisible hover area to prevent gap */}
                        <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                        
                        {renderDropdownContent(category)}
                      </motion.div>
                    )}
                  </div>
                ))}
                  </div>
                </div>
                
            {/* Bottom Row */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-8">
                {bottomRowCategories.map((category, index) => (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => handleCategoryHover(category)}
                    onMouseLeave={handleCategoryLeave}
                  >
                <button 
                      className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors flex items-center space-x-1 py-3 px-2 rounded hover:bg-gray-100"
                      data-testid={`nav-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                      <span>{category}</span>
                      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                </button>
                    
                    {/* Dropdown Menu */}
                    {hoveredCategory === category && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-0 bg-white rounded-lg shadow-xl border border-gray-200 z-[999999] min-w-[320px] max-w-[600px]"
                        onMouseEnter={() => handleCategoryHover(category)}
                        onMouseLeave={handleCategoryLeave}
                        style={{ zIndex: 999999 }}
                      >
                        {/* Invisible hover area to prevent gap */}
                        <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                        
                        {renderDropdownContent(category)}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600">Need help?</span>
                <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                  <Phone className="h-4 w-4" />
                  <span>(555) 123-SIGN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="lg:hidden bg-white border-t shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-6 space-y-4">
              <div className="relative mb-4">
                <Input 
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full border-2 border-gray-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {/* Mobile Categories */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 mb-2">Categories</h3>
                {[...topRowCategories, ...bottomRowCategories].map((category, index) => (
                  <div key={index} className="space-y-1">
              <button 
                      className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                      data-testid={`mobile-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                      {category}
              </button>
                    {/* Mobile Sub-categories */}
                    <div className="pl-4 space-y-1">
                      {PRODUCT_SUBCATEGORIES[category]?.slice(0, 3).map((subCategory, subIndex) => (
                        <a
                          key={subIndex}
                          href={`/products?category=${encodeURIComponent(category)}&sub=${encodeURIComponent(subCategory)}`}
                          className="block text-sm text-gray-500 hover:text-blue-600 py-1 transition-colors"
                        >
                          {subCategory}
                        </a>
                      ))}
                      {PRODUCT_SUBCATEGORIES[category]?.length > 3 && (
                        <a
                          href={`/products?category=${encodeURIComponent(category)}`}
                          className="block text-sm text-blue-600 hover:text-blue-700 py-1 font-medium"
                        >
                          View All →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  asChild
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  <a href="https://animated-cheesecake-a81f47.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <Palette className="mr-2 h-4 w-4" />
                    START DESIGNING
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
}


