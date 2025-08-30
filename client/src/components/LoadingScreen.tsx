import { motion } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-white z-[999999] flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Revolving loader container */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          {/* Revolving loader around the logo */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              {/* Outer ring */}
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              
              {/* Animated segments */}
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner ring */}
              <div className="absolute inset-4 border-2 border-blue-300 rounded-full"></div>
            </div>
          </motion.div>
          
          {/* Logo in center */}
          <motion.img
            src="/Untitled design.png"
            alt="Master Signs"
            className="w-32 h-32 object-contain z-10 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
        
        {/* Loading text */}
        <motion.p
          className="text-gray-600 font-medium text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Loading Master Signs...
        </motion.p>
      </div>
    </motion.div>
  );
}
