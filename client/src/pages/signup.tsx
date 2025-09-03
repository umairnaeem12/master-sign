import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, Star, Shield, Award, Users, Palette, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import logo from "@/assets/1.png";

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { signup } = useAuth();
  const [, setLocation] = useLocation();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        company: '' // Add company field if needed
      });

      if (result.success) {
        setIsSuccess(true);
        // Redirect to login with email auto-fill after 2 seconds
        setTimeout(() => {
          setLocation(`/login?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, color: "bg-gray-200", text: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;

    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    
    return {
      strength: Math.min(strength, 5),
      color: colors[Math.min(strength - 1, 4)],
      text: texts[Math.min(strength - 1, 4)]
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Welcome to Master Signs. Your account has been created successfully. Redirecting to login...</p>
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left Side - Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white p-12 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-md mx-auto flex flex-col justify-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-8">
                <motion.div 
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mr-4 overflow-hidden border border-white/30 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setLocation("/")}
                >
                  <img 
                    src={logo} 
                    alt="Master Signs Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Master Signs</h1>
                  <p className="text-blue-100 font-medium">Make Your Statement</p>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-6 text-white">Join Our Community</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Create your account and start designing amazing signage with our professional tools and expert support.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Secure & Reliable</h3>
                    <p className="text-blue-100">Your data is protected with enterprise-grade security</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Professional Quality</h3>
                    <p className="text-blue-100">Access to premium design tools and templates</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Expert Support</h3>
                    <p className="text-blue-100">Get help from our team of signage professionals</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <motion.div 
            className="w-full max-w-lg space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
                        {/* Mobile Header */}
            <motion.div variants={fadeInUp} className="text-center lg:hidden">
                              <div className="flex items-center justify-center mb-6">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setLocation("/")}
                  >
                    <img 
                      src={logo} 
                      alt="Master Signs Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Master Signs</h1>
                  <p className="text-indigo-600 text-sm font-medium">Make Your Statement</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Join Master Signs and start creating amazing signage</p>
            </motion.div>

            {/* Desktop Header */}
            <motion.div variants={fadeInUp} className="text-center hidden lg:block">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Join Master Signs and start creating amazing signage</p>
            </motion.div>

            {/* Form */}
            <motion.form 
              className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
              variants={fadeInUp}
              onSubmit={handleSubmit}
            >
               <div className="space-y-8">
                 {/* General Error */}
                 {errors.general && (
                   <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                     <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                     <p className="text-red-700 text-sm">{errors.general}</p>
                   </div>
                 )}
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                                      <div className="relative mt-2">
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 py-3 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="John"
                    />
                      <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                                      <div className="relative mt-2">
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`pl-10 py-3 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="Doe"
                    />
                      <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 py-3 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="john@example.com"
                    />
                    <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 py-3 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-10 pr-10 py-3 ${errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="Create a strong password"
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex space-x-1 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded transition-colors ${
                              level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Password strength: {passwordStrength.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 py-3 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="Confirm your password"
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 text-lg font-semibold"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setLocation('/login')}
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium transition-all duration-300 hover:scale-105"
                    >
                      Sign in here
                    </Button>
                  </p>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </p>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 