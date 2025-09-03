import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Quote, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStaticQuoteRequests } from "@/hooks/useStaticData";
import { fadeInUp, staggerContainer, magneticHover } from "@/lib/animations";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function QuoteForm() {

  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { createQuoteRequest } = useStaticQuoteRequests();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "",
      timeline: "",
      budget: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);
      
      // Create quote request
      const quoteData = {
        ...data,
        service_type: data.serviceType, // Map serviceType to service_type
        files: [],
        status: 'pending'
      };

      const { error } = await createQuoteRequest(quoteData);
      
      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Quote Request Submitted!",
        description: "We'll respond within 24 hours with your personalized quote.",
      });
      
      form.reset();

      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
      console.error("Quote submission error:", error);
    } finally {
      setUploading(false);
    }
  };



  return (
    <section id="quote" className="py-12 sm:py-16 lg:py-24 bg-[var(--master-black)] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div 
            className="inline-flex items-center space-x-2 bg-[var(--master-blue)] bg-opacity-20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6"
            variants={fadeInUp}
          >
            <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <span className="text-white font-semibold text-sm sm:text-base">Free Quote</span>
          </motion.div>
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6"
            variants={fadeInUp}
          >
            Ready to Transform Your Vision?
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2"
            variants={fadeInUp}
          >
            Get a personalized quote for your signage project. Our team will work with you to bring your vision to life.
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card className="glassmorphism-dark rounded-3xl p-4 sm:p-6 lg:p-8">
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-sm sm:text-base">Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="John Smith"
                              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-sm sm:text-base">Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              type="email"
                              placeholder="john@company.com"
                              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-sm sm:text-base">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              value={field.value ?? ""}
                              type="tel"
                              placeholder="(555) 123-4567"
                              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-sm sm:text-base">Company Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Your Company"
                              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                              data-testid="input-company"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Details */}
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold text-sm sm:text-base">Service Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger 
                              className="bg-white bg-opacity-10 border-white border-opacity-20 text-white focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                              data-testid="select-service-type"
                            >
                              <SelectValue placeholder="Select a service..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="led-signs">LED Digital Signs</SelectItem>
                            <SelectItem value="vehicle-wraps">Vehicle Wraps</SelectItem>
                            <SelectItem value="laser-engraving">Laser Engraving</SelectItem>
                            <SelectItem value="banners">Custom Banners</SelectItem>
                            <SelectItem value="architectural">Architectural Signage</SelectItem>
                            <SelectItem value="other">Other / Multiple Services</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-sm sm:text-base">Project Timeline</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                            <FormControl>
                              <SelectTrigger 
                                className="bg-white bg-opacity-10 border-white border-opacity-20 text-white focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                                data-testid="select-timeline"
                              >
                                <SelectValue placeholder="Select timeline..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                              <SelectItem value="1month">1 month</SelectItem>
                              <SelectItem value="2-3months">2-3 months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-sm sm:text-base">Budget Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
                            <FormControl>
                              <SelectTrigger 
                                className="bg-white bg-opacity-10 border-white border-opacity-20 text-white focus:ring-2 focus:ring-[var(--master-blue)] text-sm sm:text-base"
                                data-testid="select-budget"
                              >
                                <SelectValue placeholder="Select budget..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-1k">Under $1,000</SelectItem>
                              <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                              <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                              <SelectItem value="over-25k">Over $25,000</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold text-sm sm:text-base">Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            value={field.value ?? ""}
                            rows={4}
                            placeholder="Tell us about your project requirements, size, location, and any specific needs..."
                            className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--master-blue)] resize-none text-sm sm:text-base"
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs sm:text-sm" />
                      </FormItem>
                    )}
                  />



                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <motion.div {...magneticHover}>
                      <Button 
                        type="submit"
                        disabled={uploading}
                        className="ripple bg-[var(--master-blue)] text-white px-4 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl w-full sm:w-auto"
                        data-testid="button-submit-quote"
                      >
                        <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {uploading ? "Sending..." : "Send My Quote Request"}
                      </Button>
                    </motion.div>
                    <p className="text-gray-400 text-xs sm:text-sm mt-4 px-2">We'll respond within 24 hours with your personalized quote</p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
