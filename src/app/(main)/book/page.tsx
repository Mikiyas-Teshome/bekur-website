"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Phone, Building2, ArrowRight, Clock, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import "react-day-picker/style.css";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  company: z.string().min(2, "Company name required"),
  message: z.string().optional(),
  timezone: z.string().min(1, "Select timezone"),
  preferredDate: z.date().refine((date) => date >= new Date(), "Future date required"),
  preferredTime: z.string().min(1, "Select time"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const TIMEZONES = [
  // UK & Ireland
  { value: "Europe/London", label: "🇬🇧 London (GMT/BST)" },
  { value: "Europe/Dublin", label: "🇮🇪 Dublin (GMT/IST)" },

  // Western Europe (WET/WEST)
  { value: "Europe/Lisbon", label: "🇵🇹 Lisbon (WET/WEST)" },
  { value: "Atlantic/Reykjavik", label: "🇮🇸 Reykjavik (GMT)" },

  // Central Europe (CET/CEST)
  { value: "Europe/Madrid", label: "🇪🇸 Madrid (CET/CEST)" },
  { value: "Europe/Paris", label: "🇫🇷 Paris (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "🇳🇱 Amsterdam (CET/CEST)" },
  { value: "Europe/Brussels", label: "🇧🇪 Brussels (CET/CEST)" },
  { value: "Europe/Berlin", label: "🇩🇪 Berlin (CET/CEST)" },
  { value: "Europe/Vienna", label: "🇦🇹 Vienna (CET/CEST)" },
  { value: "Europe/Zurich", label: "🇨🇭 Zurich (CET/CEST)" },
  { value: "Europe/Rome", label: "🇮🇹 Rome (CET/CEST)" },
  { value: "Europe/Copenhagen", label: "🇩🇰 Copenhagen (CET/CEST)" },
  { value: "Europe/Stockholm", label: "🇸🇪 Stockholm (CET/CEST)" },
  { value: "Europe/Oslo", label: "🇳🇴 Oslo (CET/CEST)" },
  { value: "Europe/Warsaw", label: "🇵🇱 Warsaw (CET/CEST)" },
  { value: "Europe/Prague", label: "🇨🇿 Prague (CET/CEST)" },
  { value: "Europe/Budapest", label: "🇭🇺 Budapest (CET/CEST)" },

  // Eastern Europe (EET/EEST)
  { value: "Europe/Bucharest", label: "🇷🇴 Bucharest (EET/EEST)" },
  { value: "Europe/Athens", label: "🇬🇷 Athens (EET/EEST)" },
  { value: "Europe/Helsinki", label: "🇫🇮 Helsinki (EET/EEST)" },
  { value: "Europe/Istanbul", label: "🇹🇷 Istanbul (EET/EEST)" },

  // North America
  { value: "America/New_York", label: "🇺🇸 New York (ET)" },
  { value: "America/Chicago", label: "🇺🇸 Chicago (CT)" },
  { value: "America/Denver", label: "🇺🇸 Denver (MT)" },
  { value: "America/Los_Angeles", label: "🇺🇸 Los Angeles (PT)" },
  { value: "America/Toronto", label: "🇨🇦 Toronto (ET)" },

  // Other
  { value: "Asia/Dubai", label: "🇦🇪 Dubai (GST)" },
  { value: "Asia/Singapore", label: "🇸🇬 Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "🇯🇵 Tokyo (JST)" },
  { value: "Australia/Sydney", label: "🇦🇺 Sydney (AEDT)" },
];

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function BookCallPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [timezoneSearch, setTimezoneSearch] = useState("");
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  const filteredTimezones = TIMEZONES.filter((tz) =>
    tz.label.toLowerCase().includes(timezoneSearch.toLowerCase())
  );

  const handleTimezoneSelect = (value: string) => {
    setSelectedTimezone(value);
    setValue("timezone", value);
    setTimezoneSearch("");
    setShowTimezoneDropdown(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      timezone: "America/New_York",
      preferredDate: addDays(new Date(), 1),
      preferredTime: "10:00",
    },
    mode: "onChange",
  });

  const watchTime = watch("preferredTime");
  const watchCompany = watch("company");
  const watchName = watch("fullName");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setValue("preferredDate", date);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to book");

      setStep("confirmation");
      setTimeout(() => {
        reset();
        setSelectedDate(addDays(new Date(), 1));
        setStep("form");
      }, 3000);
    } catch (error) {
      toast.error("Failed to book call");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Schedule Your Sprint
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's discuss how we automate your workflows
          </p>
        </div>

        {/* Confirmation Screen */}
        {step === "confirmation" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-primary/20 p-8 sm:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 text-foreground">Call Scheduled! ✓</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Check your email for calendar options
            </p>
            <p className="text-sm text-muted-foreground">
              We'll send you Google Calendar, Outlook, and ICS download options
            </p>
          </motion.div>
        )}

        {/* Booking Form */}
        {step === "form" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-card rounded-2xl border border-primary/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Company
                  </label>
                  <input
                    {...register("company")}
                    placeholder="Acme Law Firm"
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Project Details (optional)
                  </label>
                  <textarea
                    {...register("message")}
                    placeholder="What workflow would you like to automate?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="bg-card rounded-2xl border border-primary/10 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">When Works Best?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timezone & Calendar */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Timezone
                    </label>
                    <DropdownMenu open={showTimezoneDropdown} onOpenChange={setShowTimezoneDropdown}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground text-left focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all flex items-center justify-between hover:border-primary/50"
                        >
                          <span>{TIMEZONES.find((tz) => tz.value === selectedTimezone)?.label}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <div className="p-3 border-b border-border/30 sticky top-0 bg-popover z-10">
                          <input
                            type="text"
                            placeholder="Search timezone..."
                            autoFocus
                            value={timezoneSearch}
                            onChange={(e) => setTimezoneSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-3 py-2 text-sm rounded border border-border/50 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        {filteredTimezones.length > 0 ? (
                          filteredTimezones.map((tz) => (
                            <DropdownMenuItem
                              key={tz.value}
                              onClick={() => handleTimezoneSelect(tz.value)}
                              className={`cursor-pointer ${
                                selectedTimezone === tz.value
                                  ? "bg-primary/20 text-primary font-semibold"
                                  : ""
                              }`}
                            >
                              {tz.label}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-muted-foreground text-sm text-center">
                            No timezones found
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Select Date
                    </label>
                    <div className="bg-background border border-border/50 rounded-xl p-5 pr-10 overflow-hidden [&_.rdp]:!p-4 [&_.rdp]:!pr-8 [&_.rdp-months]:!gap-0 [&_.rdp-month]:!gap-0 [&_.rdp-thead]:!gap-0 [&_.rdp-row]:!gap-0 [&_.rdp-cell]:!p-1 [&_.rdp-cell]:text-center [&_.rdp-button]:h-9 [&_.rdp-button]:w-9 [&_.rdp-button]:text-sm [&_.rdp-button]:font-medium [&_.rdp-button]:rounded-lg [&_.rdp-button]:border [&_.rdp-button]:border-transparent [&_.rdp-button]:p-0 [&_.rdp-button_selected]:bg-primary [&_.rdp-button_selected]:text-primary-foreground [&_.rdp-button_selected]:shadow-md [&_.rdp-button_selected]:border-primary [&_.rdp-button_today]:font-bold [&_.rdp-button_today]:text-primary [&_.rdp-button_today]:bg-primary/10 [&_.rdp-button_today]:border-primary/30 [&_.rdp-button]:hover:bg-primary/10 [&_.rdp-button]:hover:border-primary/30 [&_.rdp-button_disabled]:opacity-40 [&_.rdp-head_cell]:text-[11px] [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-muted-foreground [&_.rdp-head_cell]:py-2 [&_.rdp-caption]:text-base [&_.rdp-caption]:font-bold [&_.rdp-caption]:mb-3 [&_.rdp-caption]:px-2 [&_.rdp-nav]:gap-2 [&_.rdp-nav_button]:h-7 [&_.rdp-nav_button]:w-7 [&_.rdp-nav_button]:rounded-lg [&_.rdp-nav_button]:border [&_.rdp-nav_button]:border-border/50 [&_.rdp-nav_button]:hover:bg-primary/10 [&_.rdp-nav_button]:transition-colors [&_.rdp-nav_button]:text-sm">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        showOutsideDays={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setValue("preferredTime", time)}
                        className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                          watchTime === time
                            ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                            : "border border-border/50 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.preferredTime && (
                    <p className="text-red-500 text-xs mt-2">{errors.preferredTime.message}</p>
                  )}
                </div>
              </div>

              {/* Confirmation Summary */}
              {selectedDate && watchTime && (
                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your scheduled call:</p>
                  <p className="text-lg font-semibold text-foreground">
                    {getDateLabel(selectedDate)} • {format(selectedDate, "MMM d, yyyy")} at {watchTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {TIMEZONES.find((tz) => tz.value === selectedTimezone)?.label}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-primary text-primary-foreground font-bold py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg group"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                  Scheduling...
                </>
              ) : (
                <>
                  Schedule Call
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              You'll receive calendar invites via email for Google, Outlook, Apple Calendar, or download as ICS
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
