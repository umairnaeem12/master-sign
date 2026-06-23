import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarCheck,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useStaticSiteVisits } from "@/hooks/useStaticData";

const visitSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter the site address"),
  preferredDate: z.string().min(1, "Please choose a preferred date"),
  preferredTime: z.string().min(1, "Please choose a preferred time"),
  serviceType: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];

// Today's date (YYYY-MM-DD) for the date input's min attribute
const todayISO = () => new Date().toISOString().split("T")[0];

interface ScheduleSiteVisitProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const fieldWrap = "relative";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500";
const inputClass =
  "pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition";
const errorClass = "text-red-500 text-xs mt-1";

export default function ScheduleSiteVisit({
  children,
  className,
  variant = "default",
  size = "default",
}: ScheduleSiteVisitProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { createSiteVisit } = useStaticSiteVisits();

  const form = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      preferredDate: "",
      preferredTime: "",
      serviceType: "",
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: VisitFormData) => {
    try {
      setSubmitting(true);
      const { error } = await createSiteVisit({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        serviceType: data.serviceType || null,
        notes: data.notes || null,
      });

      if (error) throw new Error(error);

      toast({
        title: "Site Visit Requested!",
        description:
          "Thanks! We'll confirm your site visit appointment within 24 hours.",
      });

      reset();
      setOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to schedule your site visit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant={variant} size={size} data-testid="button-schedule-visit">
          {children ?? (
            <>
              <CalendarCheck className="mr-2 h-5 w-5" />
              Schedule a Site Visit
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden rounded-2xl max-h-[92vh] flex flex-col [&>button]:text-white [&>button]:opacity-80 [&>button:hover]:opacity-100">
        {/* Branded gradient header */}
        <DialogHeader className="space-y-0 text-left bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <CalendarCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Schedule a Site Visit
              </DialogTitle>
              <p className="text-sm text-blue-100 mt-1">
                Free, no-obligation on-site assessment of your project.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Form body */}
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sv-name" className="text-gray-700 font-medium text-sm">Full Name *</Label>
                <div className={`${fieldWrap} mt-1.5`}>
                  <User className={iconClass} />
                  <Input id="sv-name" placeholder="John Smith" className={inputClass} {...register("name")} data-testid="input-visit-name" />
                </div>
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="sv-email" className="text-gray-700 font-medium text-sm">Email Address *</Label>
                <div className={`${fieldWrap} mt-1.5`}>
                  <Mail className={iconClass} />
                  <Input id="sv-email" type="email" placeholder="john@company.com" className={inputClass} {...register("email")} data-testid="input-visit-email" />
                </div>
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="sv-phone" className="text-gray-700 font-medium text-sm">Phone Number *</Label>
              <div className={`${fieldWrap} mt-1.5`}>
                <Phone className={iconClass} />
                <Input id="sv-phone" type="tel" placeholder="(555) 123-4567" className={inputClass} {...register("phone")} data-testid="input-visit-phone" />
              </div>
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="sv-address" className="text-gray-700 font-medium text-sm">Site Address *</Label>
              <div className={`${fieldWrap} mt-1.5`}>
                <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-blue-500" />
                <Textarea id="sv-address" rows={2} placeholder="Street address, city, state, ZIP" className="pl-10 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500" {...register("address")} data-testid="input-visit-address" />
              </div>
              {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sv-date" className="text-gray-700 font-medium text-sm">Preferred Date *</Label>
                <div className={`${fieldWrap} mt-1.5`}>
                  <Calendar className={iconClass} />
                  <Input id="sv-date" type="date" min={todayISO()} className={`${inputClass} pr-3`} {...register("preferredDate")} data-testid="input-visit-date" />
                </div>
                {errors.preferredDate && <p className={errorClass}>{errors.preferredDate.message}</p>}
              </div>
              <div>
                <Label className="text-gray-700 font-medium text-sm">Preferred Time *</Label>
                <div className={`${fieldWrap} mt-1.5`}>
                  <Clock className={`${iconClass} z-10`} />
                  <Select value={watch("preferredTime")} onValueChange={(v) => setValue("preferredTime", v, { shouldValidate: true })}>
                    <SelectTrigger className={`${inputClass} [&>span]:text-left`} data-testid="select-visit-time">
                      <SelectValue placeholder="Select a time..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.preferredTime && <p className={errorClass}>{errors.preferredTime.message}</p>}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 font-medium text-sm">Service Type</Label>
              <div className={`${fieldWrap} mt-1.5`}>
                <Wrench className={`${iconClass} z-10`} />
                <Select value={watch("serviceType")} onValueChange={(v) => setValue("serviceType", v)}>
                  <SelectTrigger className={`${inputClass} [&>span]:text-left`} data-testid="select-visit-service">
                    <SelectValue placeholder="What's this visit for? (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="led-signs">LED Digital Signs</SelectItem>
                    <SelectItem value="vehicle-wraps">Vehicle Wraps</SelectItem>
                    <SelectItem value="laser-engraving">Laser Engraving</SelectItem>
                    <SelectItem value="banners">Custom Banners</SelectItem>
                    <SelectItem value="architectural">Architectural Signage</SelectItem>
                    <SelectItem value="other">Other / Multiple Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="sv-notes" className="text-gray-700 font-medium text-sm">Additional Notes</Label>
              <Textarea id="sv-notes" rows={3} placeholder="Anything we should know before the visit? (parking, gate codes, project details...)" className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 resize-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500" {...register("notes")} data-testid="input-visit-notes" />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl text-base shadow-lg shadow-blue-600/20 transition-all"
              data-testid="button-submit-visit"
            >
              <Send className="mr-2 h-4 w-4" />
              {submitting ? "Scheduling..." : "Request Site Visit"}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              We'll confirm your appointment within 24 hours.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
