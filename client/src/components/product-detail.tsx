import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Heart,
  Share2,
  MessageCircle,
  Truck,
  Shield,
  Palette,
  Settings,
  Plus,
  Minus,
  Clock,
  Upload,
  Zap,
  Brush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ProductDetail as ProductDetailType, ProductSpecification } from "@/types/products";

interface ProductDetailProps {
  product: ProductDetailType;
}

interface DynamicPricing {
  basePrice: number;
  sizePrice: number;
  optionsPrice: number;
  quantityDiscount: number;
  rushFee: number;
  subtotal: number;
  total: number;
  breakdown: {
    base: number;
    size: number;
    options: number;
    quantityDiscount: number;
    rushFee: number;
    subtotal: number;
    total: number;
  };
}

interface ShippingInfo {
  cost: number;
  estimatedDays: number;
  method: string;
  description: string;
}

interface TurnaroundInfo {
  standardDays: number;
  rushDays: number;
  rushAvailable: boolean;
  rushFeePercentage: number;
  estimatedDeliveryDate: string;
  rushDeliveryDate?: string;
}

export default function ProductDetailComponent({ product }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [expandedSpecs, setExpandedSpecs] = useState<string[]>([]);
  const [specValues, setSpecValues] = useState<Record<string, string>>({});
  
  // New state for dynamic features
  const [customSize, setCustomSize] = useState({
    width: product.sizeConstraints?.defaultWidth || 12,
    height: product.sizeConstraints?.defaultHeight || 12,
    unit: 'inch'
  });
  const [letterCount, setLetterCount] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Array<{optionId: string, value: string}>>([]);
  const [rushRequested, setRushRequested] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  
  // Dynamic pricing and info
  const [dynamicPricing, setDynamicPricing] = useState<DynamicPricing | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [turnaroundInfo, setTurnaroundInfo] = useState<TurnaroundInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  // Calculate dynamic pricing whenever relevant values change
  useEffect(() => {
    if (product.id) {
      calculateStaticPricing();
    }
  }, [quantity, customSize, selectedOptions, rushRequested, product.id]);

  // Calculate shipping when zip code or shipping method changes
  useEffect(() => {
    if (zipCode && shippingMethod && product.id) {
      calculateStaticShipping();
    }
  }, [zipCode, shippingMethod, product.id]);

  // Calculate turnaround time when rush option changes
  useEffect(() => {
    if (product.id) {
      calculateStaticTurnaround();
    }
  }, [rushRequested, product.id]);

  const calculateStaticPricing = () => {
    console.log('💰 Using static pricing calculation (no API calls)');
    setLoading(true);
    
    try {
      // Static pricing calculation
      const basePrice = product.pricing?.basePrice || 99.99;
      const area = customSize.width * customSize.height;
      const sizeMultiplier = area / 144; // Convert to square feet
      
      // Size price adjustment
      const sizePrice = basePrice * sizeMultiplier * 0.1;
      
      // Options price
      const optionsPrice = selectedOptions.reduce((total, option) => {
        return total + (parseFloat(option.value) || 0);
      }, 0);
      
      // Quantity discount (10% off for 5+ items, 15% off for 10+ items)
      let quantityDiscount = 0;
      if (quantity >= 10) {
        quantityDiscount = basePrice * quantity * 0.15;
      } else if (quantity >= 5) {
        quantityDiscount = basePrice * quantity * 0.10;
      }
      
      // Rush fee (25% for rush orders)
      const rushFee = rushRequested ? basePrice * quantity * 0.25 : 0;
      
      // Calculate totals
      const subtotal = (basePrice + sizePrice + optionsPrice) * quantity;
      const total = subtotal - quantityDiscount + rushFee;
      
      const pricing: DynamicPricing = {
        basePrice,
        sizePrice,
        optionsPrice,
        quantityDiscount,
        rushFee,
        subtotal,
        total,
        breakdown: {
          base: basePrice * quantity,
          size: sizePrice * quantity,
          options: optionsPrice * quantity,
          quantityDiscount,
          rushFee,
          subtotal,
          total
        }
      };
      
      setDynamicPricing(pricing);
    } catch (error) {
      console.error('Static price calculation failed:', error);
      setDynamicPricing(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateStaticShipping = () => {
    console.log('🚚 Using static shipping calculation (no API calls)');
    try {
      // Static shipping calculation
      let cost = 0;
      let estimatedDays = 5;
      let description = 'Standard Ground Shipping';
      
      if (shippingMethod === 'express') {
        cost = 25.99;
        estimatedDays = 2;
        description = 'Express Shipping (2-3 business days)';
      } else if (shippingMethod === 'overnight') {
        cost = 45.99;
        estimatedDays = 1;
        description = 'Overnight Shipping (Next business day)';
      } else {
        // Standard shipping
        cost = 12.99;
        estimatedDays = 5;
        description = 'Standard Ground Shipping (5-7 business days)';
      }
      
      // Add distance-based adjustment for zip code
      if (zipCode) {
        const zipNum = parseInt(zipCode.substring(0, 3));
        if (zipNum > 500) {
          cost += 5; // Additional cost for distant locations
        }
      }
      
      const shipping: ShippingInfo = {
        cost,
        estimatedDays,
        method: shippingMethod,
        description
      };
      
      setShippingInfo(shipping);
    } catch (error) {
      console.error('Static shipping calculation failed:', error);
    }
  };

  const calculateStaticTurnaround = () => {
    console.log('⏰ Using static turnaround calculation (no API calls)');
    try {
      // Static turnaround calculation
      const today = new Date();
      const standardDays = 7;
      const rushDays = 3;
      const rushAvailable = true;
      const rushFeePercentage = 25;
      
      // Calculate delivery dates
      const standardDelivery = new Date(today);
      standardDelivery.setDate(today.getDate() + standardDays);
      
      const rushDelivery = new Date(today);
      rushDelivery.setDate(today.getDate() + rushDays);
      
      const turnaround: TurnaroundInfo = {
        standardDays,
        rushDays,
        rushAvailable,
        rushFeePercentage,
        estimatedDeliveryDate: standardDelivery.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        rushDeliveryDate: rushDelivery.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      setTurnaroundInfo(turnaround);
    } catch (error) {
      console.error('Static turnaround calculation failed:', error);
    }
  };

  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleSpecExpansion = (specId: string) => {
    setExpandedSpecs(prev => 
      prev.includes(specId) 
        ? prev.filter(id => id !== specId)
        : [...prev, specId]
    );
  };

  const handleSpecChange = (specId: string, value: string) => {
    setSpecValues(prev => ({
      ...prev,
      [specId]: value
    }));
  };

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions(prev => {
      const existing = prev.find(opt => opt.optionId === optionId);
      if (existing) {
        return prev.map(opt => opt.optionId === optionId ? { ...opt, value } : opt);
      } else {
        return [...prev, { optionId, value }];
      }
    });
  };

  const handleArtworkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArtworkFile(file);
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    setCustomSize(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  // Get current price (using static calculations)
  const getCurrentPrice = () => {
    if (dynamicPricing) {
      return {
        original: dynamicPricing.basePrice,
        discounted: dynamicPricing.basePrice,
        final: dynamicPricing.total,
        breakdown: dynamicPricing.breakdown
      };
    }
    
    // Fallback to static pricing
    const basePrice = product.pricing?.basePrice || 99.99;
    const discount = product.pricing?.discountPercentage || 0;
    const discountedPrice = basePrice * (1 - discount / 100);
    return {
      original: basePrice,
      discounted: discountedPrice,
      final: discountedPrice * quantity,
      breakdown: null
    };
  };

  const price = getCurrentPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div 
          className="mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Home</a>
            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                         <a href={`/products/${(product.category || 'Unknown').toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600">
               {product.category || 'Unknown Category'}
             </a>
            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Left Side - Image Gallery */}
          <motion.div variants={fadeInUp}>
            {/* Main Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg mb-6">
              <img 
                key={selectedImageIndex}
                src={product.images?.[selectedImageIndex]?.url || ''}
                alt={product.images?.[selectedImageIndex]?.alt || product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  // If image fails to load, try the next image
                  const nextIndex = (selectedImageIndex + 1) % (product.images?.length || 1);
                  if (nextIndex !== selectedImageIndex && product.images?.[nextIndex]?.url) {
                    setSelectedImageIndex(nextIndex);
                  }
                }}
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white text-gray-700"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/80 hover:bg-white text-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

                         {/* Image Thumbnails */}
             <div className="flex space-x-4 overflow-x-auto pb-4">
               {(product.images || []).map((image, index) => (
                <button
                  key={image.id || `image-${index}`}
                  onClick={() => handleImageChange(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex 
                      ? 'border-blue-600 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Product Description */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md mt-8"
              variants={fadeInUp}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                             <div className="prose prose-sm text-gray-600">
                 <p className="leading-relaxed">{product.longDescription || product.description || 'No description available.'}</p>
               </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Details */}
          <motion.div variants={fadeInUp}>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {/* Product Title & Rating */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

                             {/* Key Features */}
               <div className="mb-4">
                 <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                   {(product.features || []).slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Size Selection */}
              {product.sizeConstraints?.allowCustomSize && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={customSize.width}
                          onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                          min={product.sizeConstraints?.minWidth || 1}
                          max={product.sizeConstraints?.maxWidth || 100}
                          className="flex-1"
                        />
                        <span className="text-gray-500">{customSize.unit}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={customSize.height}
                          onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                          min={product.sizeConstraints?.minHeight || 1}
                          max={product.sizeConstraints?.maxHeight || 100}
                          className="flex-1"
                        />
                        <span className="text-gray-500">{customSize.unit}</span>
                      </div>
                    </div>
                  </div>
                  {product.pricing.pricingModel === 'per_letter' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Letters</label>
                      <Input
                        type="number"
                        value={letterCount}
                        onChange={(e) => setLetterCount(Number(e.target.value))}
                        min="1"
                        max="100"
                        placeholder="Enter letter count"
                      />
                    </div>
                  )}
                </div>
              )}

               {/* Customizable Options */}
               {product.customizableOptions && product.customizableOptions.length > 0 ? (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Options</h3>
                  <div className="space-y-3">
                    {product.customizableOptions.map((option) => (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {option.name}
                        </label>
                        <select
                          value={selectedOptions.find(opt => opt.optionId === option.id)?.value || ''}
                          onChange={(e) => handleOptionChange(option.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select {option.name}</option>
                          {option.values.map((value) => (
                            <option key={value.value} value={value.value}>
                              {value.label} {value.priceImpact ? `(+$${value.priceImpact})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
               ) : null}

              {/* Specifications */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="space-y-3">
                  {(product.specifications || []).map((spec) => (
                    <div key={spec.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSpecExpansion(spec.id)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{spec.name}</span>
                        {expandedSpecs.includes(spec.id) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedSpecs.includes(spec.id) && (
                        <div className="px-4 pb-4">
                          {spec.type === 'select' ? (
                            <select
                              value={specValues[spec.id] || spec.options?.[0] || ''}
                              onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {spec.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : spec.type === 'number' ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={specValues[spec.id] || ''}
                                onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                                placeholder={spec.name}
                                min={spec.min}
                                max={spec.max}
                                step={spec.step}
                                className="flex-1"
                              />
                              {spec.unit && <span className="text-gray-500">{spec.unit}</span>}
                            </div>
                          ) : (
                            <Input
                              type="text"
                              value={specValues[spec.id] || ''}
                              onChange={(e) => handleSpecChange(spec.id, e.target.value)}
                              placeholder={spec.name}
                              className="w-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>



               {/* Rush Order Option */}
               {product.turnaroundTime?.rushAvailable ? (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="rushOrder"
                      checked={rushRequested}
                      onChange={(e) => setRushRequested(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rushOrder" className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Rush Order</span>
                      <span className="text-sm text-gray-600">
                        (+{product.turnaroundTime.rushFeePercentage || 50}% fee)
                      </span>
                    </label>
                  </div>
                  {turnaroundInfo && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Standard: {turnaroundInfo.standardDays} days | 
                          Rush: {turnaroundInfo.rushDays} days
                        </span>
                      </div>
                    </div>
                  )}
                </div>
               ) : null}

              {/* Shipping Information */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping & Delivery</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <Input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="Enter zip code for shipping estimate"
                      maxLength={10}
                    />
                  </div>
                  {product.shippingOptions && product.shippingOptions.length > 0 ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                      <select
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select shipping method</option>
                        {product.shippingOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} - ${option.basePrice} ({option.estimatedDays} days)
                          </option>
                        ))}
                      </select>
                    </div>
                   ) : null}
                  {shippingInfo && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{shippingInfo.method}</span>
                        <span className="text-blue-600 font-semibold">${shippingInfo.cost}</span>
                      </div>
                      <p className="text-xs text-gray-600">{shippingInfo.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-blue-600 mt-1">Buy More, Save More!</p>
              </div>

              {/* Dynamic Pricing Display */}
              <div className="mb-4">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    ${price.final.toFixed(2)}
                  </span>
                  {price.breakdown && price.breakdown.quantityDiscount > 0 && (
                    <span className="text-sm text-green-600 font-medium">
                      Save ${price.breakdown.quantityDiscount.toFixed(2)}!
                    </span>
                  )}
                </div>
                
                {price.breakdown && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>${price.breakdown.base.toFixed(2)}</span>
                    </div>
                    {price.breakdown.size > 0 && (
                      <div className="flex justify-between">
                        <span>Size Adjustment:</span>
                        <span>${price.breakdown.size.toFixed(2)}</span>
                      </div>
                    )}
                    {price.breakdown.options > 0 && (
                      <div className="flex justify-between">
                        <span>Options:</span>
                        <span>${price.breakdown.options.toFixed(2)}</span>
                      </div>
                    )}
                    {price.breakdown.rushFee > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Rush Fee:</span>
                        <span>${price.breakdown.rushFee.toFixed(2)}</span>
                      </div>
                    )}
                    {price.breakdown.quantityDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Quantity Discount:</span>
                        <span>-${price.breakdown.quantityDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-1 flex justify-between font-medium">
                      <span>Total:</span>
                      <span>${price.final.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                {loading && (
                  <p className="text-sm text-blue-600 mt-2">Calculating price...</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  asChild
                >
                  <a href="/enhanced-editor">
                    <Palette className="h-5 w-5 mr-2" />
                    Get Started
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3"
                  asChild
                >
                  <a href="/enhanced-editor">
                    <Brush className="h-5 w-5 mr-2" />
                    Start Your Own Design
                  </a>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Warranty Included</span>
                  </div>
                </div>
              </div>

              {/* Ready to Ship Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Ready to Ship</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-gray-400 mr-2" />
                    <span>Estimated delivery: {product.turnaroundTime?.estimatedDays || 7} business days</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 text-gray-400 mr-2" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 text-gray-400 mr-2" />
                    <span>30-day satisfaction guarantee</span>
                  </div>
                </div>
              </div>

              {/* Need Assistance Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Need Assistance?</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Design Help</span>
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                      <a href="/contact" className="text-blue-600 hover:text-blue-700">
                        Get Help
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Technical Support</span>
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                      <a href="/contact" className="text-blue-600 hover:text-blue-700">
                        Contact Us
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Status</span>
                    <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                      <a href="/orders" className="text-blue-600 hover:text-blue-700">
                        Track Order
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 