import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  LogOut,
  Heart,
  Star,
  Settings,
  Bell,
  Search,
  ShoppingCart,
  Palette,
  Plus,
  Eye,
  Edit,
  Home,
  FileText,
  BarChart3,
  MessageSquare,
  Calendar,
  CreditCard,
  Download,
  Share2,
  MoreHorizontal,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { getImageUrl } from "@/lib/image-utils";
import logo from "@/assets/1.png";

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    company: user?.company || ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample favorite products (3 random products)
  const favoriteProducts = [
    {
      id: "1",
      name: "LED Digital Sign",
      category: "Electric Signs",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      rating: 4.8,
      price: "$299.99"
    },
    {
      id: "2",
      name: "Vehicle Wrap Design",
      category: "Vehicle Graphics",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop",
      rating: 4.9,
      price: "$199.99"
    },
    {
      id: "3",
      name: "Custom Banner",
      category: "Banners & Flags",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      rating: 4.7,
      price: "$89.99"
    }
  ];

  // Sample cart products
  const cartProducts = [
    {
      id: "4",
      name: "Neon Sign Board",
      category: "Neon Signs",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
      price: "$450.00",
      quantity: 2,
      total: "$900.00"
    },
    {
      id: "5",
      name: "Acrylic Business Sign",
      category: "Business Signs",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      price: "$180.00",
      quantity: 1,
      total: "$180.00"
    },
    {
      id: "6",
      name: "Vinyl Decal Set",
      category: "Decals & Stickers",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      price: "$75.00",
      quantity: 3,
      total: "$225.00"
    }
  ];

  // Sample custom designs
  const customDesigns = [
    {
      id: "1",
      name: "Restaurant Logo Design",
      category: "Logo Design",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
      lastModified: "2 days ago",
      status: "In Progress"
    },
    {
      id: "2",
      name: "Event Banner Template",
      category: "Banner Design",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      lastModified: "1 week ago",
      status: "Completed"
    },
    {
      id: "3",
      name: "Vehicle Wrap Concept",
      category: "Vehicle Graphics",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop",
      lastModified: "3 days ago",
      status: "Draft"
    }
  ];

  const handleEdit = () => {
    setEditData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      company: user?.company || ""
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      company: user?.company || ""
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone,
        company: editData.company
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      // Here you would typically upload to Firebase Storage
      // For now, we'll just show a placeholder
      console.log("Image upload:", file);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      // Use direct navigation to avoid routing conflicts
      window.location.href = '/';
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleNavigateToEditor = () => {
    // Navigate to the external design editor
    window.open('https://animated-cheesecake-a81f47.netlify.app/', '_blank');
  };

  // Remove the problematic redirect logic that causes routing conflicts
  if (!user) {
    return null;
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'cart', label: 'Shopping Cart', icon: ShoppingCart },
    { id: 'designs', label: 'My Designs', icon: Palette },
    { id: 'orders', label: 'Orders', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <motion.div 
        className="w-80 bg-white/90 backdrop-blur-xl border-r border-blue-200/50 shadow-2xl flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-200/50">
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.location.href = '/'}
          >
            <img 
              src={logo} 
              alt="Master Signs" 
              className="h-10 w-auto object-contain"
            />
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">Master Signs</h1>
              <p className="text-xs text-gray-600">Dashboard</p>
            </div>
          </motion.div>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-blue-200/50">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-20 h-20 border-4 border-blue-100 shadow-xl">
                <AvatarImage src={user.profileImage} alt={user.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{user.fullName}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-3 flex space-x-2">
              <Button
                onClick={handleEdit}
                size="sm"
                variant="outline"
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                onClick={handleSignOut}
                size="sm"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-blue-200/50">
          <Button
            onClick={handleNavigateToEditor}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Create New Design
          </Button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-lg sticky top-0 z-50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center py-6 px-8">
            <div className="flex items-center space-x-6">
              <h2 className="text-3xl font-bold text-gray-900 capitalize">
                {activeSection === 'overview' ? 'Dashboard Overview' : 
                 activeSection === 'favorites' ? 'Favorite Products' :
                 activeSection === 'cart' ? 'Shopping Cart' :
                 activeSection === 'designs' ? 'My Designs' :
                 activeSection === 'orders' ? 'Order History' : 'Dashboard'}
              </h2>
              <div className="h-8 w-px bg-gradient-to-b from-blue-200 to-purple-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="text-lg text-gray-700 font-medium">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">{user.firstName}</span>! 
                  <Sparkles className="inline-block w-5 h-5 ml-2 text-yellow-500 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Orders', value: '24', icon: FileText, color: 'from-blue-500 to-blue-600' },
                    { label: 'Favorite Items', value: '12', icon: Heart, color: 'from-red-500 to-pink-500' },
                    { label: 'Active Designs', value: '8', icon: Palette, color: 'from-purple-500 to-indigo-500' },
                    { label: 'Cart Items', value: '5', icon: ShoppingCart, color: 'from-green-500 to-emerald-500' }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <p className="text-blue-100">Your latest actions and updates</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { action: 'Created new design', time: '2 hours ago', type: 'design' },
                        { action: 'Added item to favorites', time: '4 hours ago', type: 'favorite' },
                        { action: 'Completed order #1234', time: '1 day ago', type: 'order' },
                        { action: 'Updated profile', time: '2 days ago', type: 'profile' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-blue-50/50 rounded-xl">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Favorites Section */}
            {activeSection === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <Heart className="w-6 h-6 mr-3" />
                      Your Favorite Products
                    </h3>
                    <p className="text-red-100">Discover and explore your saved favorites</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {favoriteProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                          whileHover={{ y: -8 }}
                        >
                          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-blue-200">
                            <div className="relative">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded-full inline-block">
                                {product.category}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-blue-600">{product.price}</span>
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cart Section */}
            {activeSection === 'cart' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Shopping Cart
                      <div className="ml-auto bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {cartProducts.length} items
                      </div>
                    </h3>
                    <p className="text-green-100">Review and manage your cart items</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {cartProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                          whileHover={{ y: -8 }}
                        >
                          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-green-200">
                            <div className="relative">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                                Qty: {product.quantity}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded-full inline-block">
                                {product.category}
                              </p>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Price:</span>
                                  <span className="font-semibold">{product.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-bold text-green-600 text-lg">{product.total}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  Checkout
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Designs Section */}
            {activeSection === 'designs' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <Palette className="w-6 h-6 mr-3" />
                          Custom Designs
                        </h3>
                        <p className="text-purple-100">Your creative projects and designs</p>
                      </div>
                      <Button
                        onClick={handleNavigateToEditor}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Create New
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {customDesigns.map((design, index) => (
                        <motion.div
                          key={design.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                          whileHover={{ y: -8 }}
                        >
                          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-purple-200">
                            <div className="relative">
                              <img
                                src={design.image}
                                alt={design.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                                  design.status === 'Completed' ? 'bg-green-500' :
                                  design.status === 'In Progress' ? 'bg-yellow-500' :
                                  'bg-gray-500'
                                }`}>
                                  {design.status}
                                </span>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="p-5">
                              <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {design.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3 bg-gray-50 px-2 py-1 rounded-full inline-block">
                                {design.category}
                              </p>
                              <div className="text-sm text-gray-500 mb-4">
                                Last modified: {design.lastModified}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Section */}
            {activeSection === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-8 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Order History Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Track your orders and view order history. This feature is under development!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
