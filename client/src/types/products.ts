// Product Categories Enum
export enum ProductCategory {
  EXPO_DISPLAY = "EXPO_DISPLAY",
  LASER_ENGRAVING = "LASER_ENGRAVING",
  DECALS_STICKERS = "DECALS_STICKERS",
  BANNERS_FLAGS = "BANNERS_FLAGS",
  SIGNS = "SIGNS",
  PRIVACY_SECURITY = "PRIVACY_SECURITY",
  MARKETING = "MARKETING",
  PROMO = "PROMO",
  ELECTRIC_SIGNS = "ELECTRIC_SIGNS",
  VEHICLE_TRAILER = "VEHICLE_TRAILER",
  INDOOR_SIGNS = "INDOOR_SIGNS",
  OUTDOOR_SIGNS = "OUTDOOR_SIGNS",
  ACCESSORIES = "ACCESSORIES"
}

// Enhanced Product interfaces for dynamic pricing
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  thumbnail: string;
  images: ProductImage[];
  sizes: ProductSize[];
  shapes: ProductShape[];
  materials: string[];
  features: string[];
  specifications: ProductSpecification[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  questionCount: number;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // New dynamic pricing fields
  pricing: ProductPricing;
  sizeConstraints?: SizeConstraints;
  customizableOptions?: CustomizableOption[];
  quantityDiscounts?: QuantityDiscount[];
  shippingOptions?: ShippingOption[];
  turnaroundTime?: TurnaroundTime;
  personalizationOptions?: PersonalizationOptions;
  inventory?: InventoryInfo;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  thumbnail?: string;
}

export interface ProductSize {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: 'inches' | 'cm' | 'mm';
  price: number;
}

export interface ProductShape {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProductSpecification {
  id: string;
  name: string;
  type: 'text' | 'select' | 'number';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
}

export interface ProductPricing {
  basePrice: number;
  discountPercentage?: number;
  pricingModel: 'fixed' | 'per_sq_ft' | 'per_linear_ft' | 'per_letter' | 'custom';
  pricePerSqFt?: number;
  pricePerLinearFt?: number;
  pricePerLetter?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface SizeConstraints {
  allowCustomSize: boolean;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  defaultWidth: number;
  defaultHeight: number;
  unit: string;
  aspectRatio?: number;
}

export interface CustomizableOption {
  id: string;
  name: string;
  type: 'select' | 'radio' | 'checkbox';
  required: boolean;
  values: OptionValue[];
}

export interface OptionValue {
  value: string;
  label: string;
  priceImpact: number;
  description?: string;
}

export interface QuantityDiscount {
  minQuantity: number;
  maxQuantity?: number;
  discountPercentage?: number;
  discountAmount?: number;
  description?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedDays: number;
  zipCodeRequired: boolean;
  zipCodePricing?: ZipCodePricing;
  weightBasedPricing?: WeightBasedPricing;
  dimensionalWeightPricing?: DimensionalWeightPricing;
}

export interface ZipCodePricing {
  ranges: ZipCodeRange[];
}

export interface ZipCodeRange {
  start: string;
  end: string;
  additionalCost: number;
}

export interface WeightBasedPricing {
  baseWeight: number;
  weightIncrement: number;
  costPerIncrement: number;
}

export interface DimensionalWeightPricing {
  weightIncrement: number;
  costPerIncrement: number;
}

export interface TurnaroundTime {
  estimatedDays: number;
  rushAvailable: boolean;
  rushTurnaroundDays: number;
  rushFeePercentage: number;
  rushFeeMultiplier: number;
  orderCutoffTime: string;
  businessDaysOnly: boolean;
}

export interface PersonalizationOptions {
  artworkUpload: boolean;
  designNow: boolean;
  designHelp: boolean;
  maxFileSize: number;
  supportedFormats: string[];
  designServiceFee?: number;
}

export interface InventoryInfo {
  stockQuantity: number;
  inStock: boolean;
  lowStockThreshold: number;
  backorderAvailable: boolean;
  supplierLeadTime: number;
}

// Enhanced ProductDetail interface for the detail page
export interface ProductDetail extends Product {
  reviews: ProductReview[];
  relatedProducts: string[];
  frequentlyBoughtWith: string[];
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  helpful: number;
  verified: boolean;
}

// Category Data interfaces
export interface CategoryData {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  featuredSubCategories: string[]; // Add this field
  popular: boolean; // Add this field
  isActive: boolean;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
}

export interface SubCategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

// Sub-categories for each main category
export const PRODUCT_SUBCATEGORIES = {
  [ProductCategory.EXPO_DISPLAY]: [
    "Trade Show Displays",
    "Banner Stands",
    "Custom Table Covers",
    "Event Tent Signs",
    "Trade Show Support Materials"
  ],
  [ProductCategory.LASER_ENGRAVING]: [
    "Engraved Signs",
    "Laser Engraved Plaques and Awards",
    "Laser Engraved Metal",
    "Laser Engraved Wood",
    "Laser Engraved Plastic",
    "Custom Promotional Products"
  ],
  [ProductCategory.DECALS_STICKERS]: [
    "Custom Stickers",
    "Wall Decals",
    "Window Decals",
    "Floor Decals",
    "Vinyl Lettering",
    "Custom Vinyl Decals",
    "Die-Cut Stickers",
    "Vehicle Magnets",
    "Custom Magnets"
  ],
  [ProductCategory.BANNERS_FLAGS]: [
    "Vinyl Banners",
    "Flags",
    "Custom Flags",
    "Flag Poles and Accessories",
    "Pole Banners",
    "Event and Promotional Banners",
    "Banners for Sports Teams"
  ],
  [ProductCategory.SIGNS]: [
    "Channel Letters",
    "Monument Signs",
    "Directional Signs",
    "Neon Signs",
    "Illuminated Signs",
    "Dimensional Signs",
    "Building Signs",
    "Lobby Signs",
    "Door Signs",
    "A-Frame Signs",
    "Reflective Signs",
    "Safety Signs",
    "Wayfinding Signs",
    "ADA Compliant Signs",
    "Custom Signs",
    "Floor Graphics",
    "Wall Graphics",
    "Pylon Signs",
    "Yard Signs",
    "Real Estate Signs",
    "Hanging Signs",
    "Temporary and Event Signage"
  ],
  [ProductCategory.PRIVACY_SECURITY]: [
    "Window Privacy Films",
    "Security Window Films",
    "Decorative Window Films",
    "Solar Control Films"
  ],
  [ProductCategory.MARKETING]: [
    "Branding for Businesses",
    "Signage for Multi-Location Programs",
    "Sign Design and Consultation",
    "Digital Printing",
    "Marketing Signage",
    "Custom Vinyl Decals",
    "Point-of-Purchase Displays",
    "Printed Wall Graphics",
    "Business Cards",
    "Metal Business Cards"
  ],
  [ProductCategory.PROMO]: [
    "Custom Promotional Products",
    "Custom Trophies, Awards, and Plaques",
    "Bumper Stickers",
    "Custom Magnets",
    "Promotional Items",
    "Custom Apparel",
    "Event Giveaways"
  ],
  [ProductCategory.ELECTRIC_SIGNS]: [
    "LED Signs",
    "Neon Signs",
    "Digital Displays",
    "Backlit Signs",
    "Channel Letter Signs",
    "Electronic Message Centers",
    "Video Walls",
    "Interactive Displays"
  ],
  [ProductCategory.VEHICLE_TRAILER]: [
    "Vehicle Wraps",
    "Vehicle Graphics",
    "Trailer Graphics",
    "Fleet Graphics",
    "Vehicle Magnets",
    "Window Tinting",
    "Custom Vehicle Lettering",
    "Commercial Vehicle Branding"
  ],
  [ProductCategory.INDOOR_SIGNS]: [
    "Wall Signs",
    "Lobby Signs",
    "Directional Signs",
    "Office Signs",
    "Retail Signs",
    "Restaurant Signs",
    "Healthcare Signs",
    "Educational Signs",
    "Floor Graphics",
    "Ceiling Signs"
  ],
  [ProductCategory.OUTDOOR_SIGNS]: [
    "Monument Signs",
    "Pylon Signs",
    "Yard Signs",
    "Real Estate Signs",
    "Building Signs",
    "Directional Signs",
    "Safety Signs",
    "Traffic Signs",
    "Outdoor Banners",
    "Flag Poles and Flags"
  ],
  [ProductCategory.ACCESSORIES]: [
    "Mounting Hardware",
    "Display Stands",
    "Flag Poles",
    "Sign Posts",
    "Brackets and Mounts",
    "Lighting Accessories",
    "Installation Tools",
    "Maintenance Supplies"
  ]
};

// Navigation Category Interface
export interface NavigationCategory {
  id: ProductCategory;
  name: string;
  subCategories: string[];
  featured?: boolean;
}

// Product Filter Interface
export interface ProductFilter {
  category?: ProductCategory;
  subCategory?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  popular?: boolean;
  featured?: boolean;
  search?: string;
}

// Cart and Order interfaces
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size?: {
    width: number;
    height: number;
    unit: string;
  };
  options?: Array<{
    optionId: string;
    value: string;
  }>;
  artworkFileUrl?: string;
  designMode?: string;
  calculatedPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  rushRequested: boolean;
  specialInstructions?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedDeliveryDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
} 