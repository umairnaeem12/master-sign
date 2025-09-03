import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Reply, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Review {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  review: string;
  service: string;
  verified: boolean;
  helpful: number;
  adminReply?: {
    adminName: string;
    date: string;
    reply: string;
  };
}

export default function ClientReviews() {
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);

  const reviews: Review[] = [
    {
      id: "1",
      clientName: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      review: "Absolutely amazing work! Master Signs transformed our storefront with a stunning LED sign that perfectly captures our brand. The installation was professional and the quality is outstanding. Highly recommend!",
      service: "LED Digital Sign",
      verified: true,
      helpful: 12,
      adminReply: {
        adminName: "Master Signs Team",
        date: "2024-01-16",
        reply: "Thank you Sarah! We're thrilled that you love your new LED sign. Your satisfaction is our top priority. If you need any maintenance or have questions, don't hesitate to reach out!"
      }
    },
    {
      id: "2",
      clientName: "Mike Chen",
      rating: 5,
      date: "2024-01-10",
      review: "Professional service from start to finish. The team at Master Signs helped us design and install vehicle wraps for our entire fleet. The quality is exceptional and the turnaround time was impressive.",
      service: "Vehicle Wraps",
      verified: true,
      helpful: 8,
      adminReply: {
        adminName: "Master Signs Team",
        date: "2024-01-11",
        reply: "Mike, thank you for choosing us for your fleet project! We're glad we could meet your timeline and quality expectations. Your vehicles look fantastic on the road!"
      }
    },
    {
      id: "3",
      clientName: "Emily Rodriguez",
      rating: 5,
      date: "2024-01-08",
      review: "Outstanding customer service and beautiful work. They created custom banners for our event and exceeded all expectations. The attention to detail is remarkable.",
      service: "Custom Banners",
      verified: true,
      helpful: 15,
      adminReply: {
        adminName: "Master Signs Team",
        date: "2024-01-09",
        reply: "Emily, we're so happy your event banners turned out perfectly! It was a pleasure working with you. We hope your event was a huge success!"
      }
    },
    {
      id: "4",
      clientName: "David Thompson",
      rating: 4,
      date: "2024-01-05",
      review: "Great quality work on our laser engraved plaques. The precision and detail are impressive. Would definitely use their services again for future projects.",
      service: "Laser Engraving",
      verified: true,
      helpful: 6
    },
    {
      id: "5",
      clientName: "Lisa Wang",
      rating: 5,
      date: "2024-01-03",
      review: "Master Signs helped us with a complete rebranding project. From design consultation to installation, everything was handled professionally. The results speak for themselves!",
      service: "Complete Branding",
      verified: true,
      helpful: 20,
      adminReply: {
        adminName: "Master Signs Team",
        date: "2024-01-04",
        reply: "Lisa, thank you for trusting us with your rebranding project! We're proud to have been part of your business transformation. Your new look is absolutely stunning!"
      }
    },
    {
      id: "6",
      clientName: "Robert Martinez",
      rating: 5,
      date: "2023-12-28",
      review: "Excellent work on our architectural signs. The team was knowledgeable and helped us navigate all the permitting requirements. The final product is exactly what we envisioned.",
      service: "Architectural Signs",
      verified: true,
      helpful: 9,
      adminReply: {
        adminName: "Master Signs Team",
        date: "2023-12-29",
        reply: "Robert, we appreciate your kind words! Navigating permits can be complex, and we're glad we could make the process smooth for you. Your building signage looks fantastic!"
      }
    }
  ];

  const toggleReply = (reviewId: string) => {
    setExpandedReplies(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Client Reviews</h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            See what our clients say about their experience with Master Signs
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              variants={fadeInUp}
              className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {review.clientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{review.clientName}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:flex-shrink-0">
                  {review.verified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                    {review.service}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.review}</p>
              </div>

              {/* Review Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  {review.adminReply && (
                    <button 
                      onClick={() => toggleReply(review.id)}
                      className="flex items-center space-x-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>View Reply</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Reply */}
              {review.adminReply && expandedReplies.includes(review.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">MS</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-blue-900 text-sm sm:text-base">{review.adminReply.adminName}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(review.adminReply.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                      {review.adminReply.reply}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 