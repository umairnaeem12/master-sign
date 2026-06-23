export interface StaticTestimonial {
  id: string;
  name: string;
  company: string;
  rating: string;
  content: string;
  avatar: string | null;
  featured: string;
}

export const STATIC_TESTIMONIALS: StaticTestimonial[] = [
  {
    id: "testimonial-1",
    name: "Sarah Mitchell",
    company: "Mitchell Construction",
    rating: "5",
    content: "Master Signs transformed our fleet with stunning vehicle wraps that have generated countless leads. Their attention to detail and professional service exceeded our expectations.",
    avatar: "SM",
    featured: "true"
  },
  {
    id: "testimonial-2",
    name: "David Rodriguez",
    company: "Casa Bella Restaurant",
    rating: "5",
    content: "The LED sign Master Signs created for our restaurant has been a game-changer. Customer traffic increased significantly, and the quality is exceptional.",
    avatar: "DR",
    featured: "true"
  },
  {
    id: "testimonial-3",
    name: "Lisa Kim",
    company: "Pinnacle Awards",
    rating: "5",
    content: "From design to installation, Master Signs delivered excellence. Their laser engraved awards are beautiful, and their team is incredibly professional.",
    avatar: "LK",
    featured: "true"
  },
  {
    id: "testimonial-4",
    name: "Michael Johnson",
    company: "Johnson Pharmacy",
    rating: "5",
    content: "Master Signs helped us rebrand our entire storefront with beautiful architectural signage. Their professionalism and attention to detail really show in their work.",
    avatar: "MJ",
    featured: "true"
  },
  {
    id: "testimonial-5",
    name: "Amanda Chen",
    company: "Grand Opening Events",
    rating: "5",
    content: "Outstanding service and quality! Our custom banners were exactly what we envisioned, and the team went above and beyond to meet our tight deadline.",
    avatar: "AC",
    featured: "true"
  },
  {
    id: "testimonial-6",
    name: "Robert Thompson",
    company: "Wellness Medical Center",
    rating: "5",
    content: "Master Signs created a comprehensive wayfinding system for our medical complex. Their professionalism and commitment to excellence is unmatched in the industry.",
    avatar: "RT",
    featured: "true"
  }
];

export const getFeaturedTestimonials = (): StaticTestimonial[] => {
  return STATIC_TESTIMONIALS.filter(t => t.featured === "true");
};

export const getAllTestimonials = (): StaticTestimonial[] => {
  return STATIC_TESTIMONIALS;
};
