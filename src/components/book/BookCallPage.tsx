"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  MessageSquare,
  Video,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format, addDays, isToday, isTomorrow, isSunday, isBefore, startOfDay } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";
import "react-day-picker/style.css";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  company: z.string().max(100, "Company name is too long").optional(),
  message: z.string().optional(),
  timezone: z.string().min(1, "Select timezone"),
  preferredDate: z
    .date()
    .refine((date) => startOfDay(date) >= startOfDay(new Date()), "Future date required")
    .refine((date) => !isSunday(date), "Sundays are not available"),
  preferredTime: z.string().min(1, "Select time"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

function getNextBookableDate(from: Date) {
  let candidate = startOfDay(from);
  const today = startOfDay(new Date());

  while (isBefore(candidate, today) || isSunday(candidate)) {
    candidate = addDays(candidate, 1);
  }

  return candidate;
}

function isDateUnavailable(date: Date) {
  const day = startOfDay(date);
  const today = startOfDay(new Date());
  return isBefore(day, today) || isSunday(day);
}

const calendarPickerClass =
  "w-full min-w-0 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4 [&_.rdp-root]:mx-auto [&_.rdp-root]:w-full [&_.rdp-months]:w-full [&_.rdp-months]:max-w-full [&_.rdp-month]:w-full [&_.rdp-month_grid]:w-full [&_.rdp-month_grid]:table-fixed [&_.rdp-root]:[--rdp-day-height:2.25rem] [&_.rdp-root]:[--rdp-day-width:2.25rem] [&_.rdp-root]:[--rdp-day_button-height:2rem] [&_.rdp-root]:[--rdp-day_button-width:2rem] [&_.rdp-day_button]:mx-auto [&_.rdp-day_button]:rounded-lg [&_.rdp-day_button]:text-sm [&_.rdp-day_button]:font-medium [&_.rdp-day_button:disabled]:cursor-not-allowed [&_.rdp-day_button:disabled]:opacity-35 [&_.rdp-selected_.rdp-day_button]:border-primary [&_.rdp-selected_.rdp-day_button]:bg-primary [&_.rdp-selected_.rdp-day_button]:text-primary-foreground [&_.rdp-today:not(.rdp-outside)_.rdp-day_button]:border-primary/30 [&_.rdp-today:not(.rdp-outside)_.rdp-day_button]:bg-primary/10 [&_.rdp-today:not(.rdp-outside)_.rdp-day_button]:font-bold [&_.rdp-month_caption]:mb-2 [&_.rdp-month_caption]:text-base [&_.rdp-month_caption]:font-bold [&_.rdp-weekday]:px-0 [&_.rdp-weekday]:text-[11px] [&_.rdp-weekday]:font-semibold [&_.rdp-weekday]:text-muted-foreground [&_.rdp-button_previous]:rounded-lg [&_.rdp-button_previous]:border [&_.rdp-button_previous]:border-border/70 [&_.rdp-button_next]:rounded-lg [&_.rdp-button_next]:border [&_.rdp-button_next]:border-border/70";

const TIMEZONES = [
  { value: "Europe/London", label: "🇬🇧 London (GMT/BST)" },
  { value: "Europe/Dublin", label: "🇮🇪 Dublin (GMT/IST)" },
  { value: "Europe/Lisbon", label: "🇵🇹 Lisbon (WET/WEST)" },
  { value: "Atlantic/Reykjavik", label: "🇮🇸 Reykjavik (GMT)" },
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
  { value: "Europe/Bucharest", label: "🇷🇴 Bucharest (EET/EEST)" },
  { value: "Europe/Athens", label: "🇬🇷 Athens (EET/EEST)" },
  { value: "Europe/Helsinki", label: "🇫🇮 Helsinki (EET/EEST)" },
  { value: "Europe/Istanbul", label: "🇹🇷 Istanbul (EET/EEST)" },
  { value: "America/New_York", label: "🇺🇸 New York (ET)" },
  { value: "America/Chicago", label: "🇺🇸 Chicago (CT)" },
  { value: "America/Denver", label: "🇺🇸 Denver (MT)" },
  { value: "America/Los_Angeles", label: "🇺🇸 Los Angeles (PT)" },
  { value: "America/Toronto", label: "🇨🇦 Toronto (ET)" },
  { value: "Asia/Dubai", label: "🇦🇪 Dubai (GST)" },
  { value: "Asia/Singapore", label: "🇸🇬 Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "🇯🇵 Tokyo (JST)" },
  { value: "Australia/Sydney", label: "🇦🇺 Sydney (AEDT)" },
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const fieldClass =
  "h-12 rounded-xl border-border/70 bg-muted/30 text-[15px] shadow-none focus-visible:ring-primary/25 md:h-[52px]";

const cardClass =
  "rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_8px_32px_-16px_rgba(33,74,156,0.12)] dark:bg-card/95 md:rounded-[32px] md:p-8";

const EXPECT_STEPS = [
  {
    icon: Video,
    title: "30-minute discovery",
    description: "Walk through your workflow and where automation fits.",
  },
  {
    icon: MessageSquare,
    title: "Scope & sprint quote",
    description: "Leave with a clear path and fixed pricing before any build.",
  },
  {
    icon: Calendar,
    title: "Calendar invite sent",
    description: "Google, Outlook, Apple Calendar, or ICS — your choice.",
  },
];

export default function BookCallPage() {
  const reducedMotion = useReducedMotion();
  const initialBookableDate = getNextBookableDate(addDays(new Date(), 1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialBookableDate);
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [timezoneSearch, setTimezoneSearch] = useState("");
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  const filteredTimezones = TIMEZONES.filter((tz) =>
    tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      timezone: "America/New_York",
      preferredDate: initialBookableDate,
      preferredTime: "10:00",
    },
    mode: "onChange",
  });

  const watchTime = watch("preferredTime");

  const handleTimezoneSelect = (value: string) => {
    setSelectedTimezone(value);
    setValue("timezone", value, { shouldValidate: true, shouldDirty: true });
    setTimezoneSearch("");
    setShowTimezoneDropdown(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || isDateUnavailable(date)) return;

    const normalized = startOfDay(date);
    setSelectedDate(normalized);
    setValue("preferredDate", normalized, { shouldValidate: true, shouldDirty: true });
  };

  const handleInvalidSubmit = () => {
    void trigger();
    toast.error("Please complete all required fields in Your details.");
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
        const nextDate = getNextBookableDate(addDays(new Date(), 1));
        setSelectedDate(nextDate);
        setValue("preferredDate", nextDate);
        setStep("form");
      }, 3000);
    } catch {
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
    <main className="relative min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e9edf5] via-[#eef2f8] to-[#f2f5fa] dark:bg-none dark:bg-[#000104]"
        aria-hidden="true"
      >
        <div className="hero-dots hero-dots-full absolute inset-0" />
        <div className="hero-glow absolute inset-0" />
      </div>

      <section
        className="relative z-10 w-full overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pb-12 md:pt-36"
        aria-label="Book a call"
      >
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden"
            animate={reducedMotion ? undefined : "visible"}
            variants={headerContainer}
            className="flex flex-col items-center text-center"
          >
            <motion.span
              variants={fadeUp}
              className="mb-6 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
            >
              Book a call
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mb-5 text-balance text-[2.1rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-[3.25rem]"
            >
              Schedule your{" "}
              <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
                calendar call
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              Let&apos;s map your workflow, scope the automation, and decide go / no-go before
              production code.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 w-full px-4 pb-20 md:px-8 md:pb-28 lg:pb-32">
        <div className="mx-auto max-w-6xl">
          {step === "confirmation" ? (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className={cn(cardClass, "mx-auto max-w-xl text-center")}
            >
              <motion.div
                initial={reducedMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="mb-6 flex justify-center"
              >
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </motion.div>
              <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                Call scheduled
              </h2>
              <p className="mb-2 text-base text-muted-foreground md:text-lg">
                Check your email for calendar options
              </p>
              <p className="text-sm text-muted-foreground">
                We&apos;ll send Google Calendar, Outlook, and ICS download options
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px] lg:gap-10 xl:grid-cols-[1fr_360px]">
              <motion.form
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)}
                className="space-y-6"
              >
                <div className={cardClass}>
                  <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Your details
                  </p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full name" error={errors.fullName?.message}>
                      <Input
                        {...register("fullName")}
                        placeholder="John Smith"
                        className={cn(fieldClass, errors.fullName && "border-destructive")}
                      />
                    </Field>
                    <Field label="Work email" error={errors.email?.message}>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="john@company.com"
                        className={cn(fieldClass, errors.email && "border-destructive")}
                      />
                    </Field>
                    <Field label="Phone" error={errors.phone?.message}>
                      <Input
                        {...register("phone")}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className={cn(fieldClass, errors.phone && "border-destructive")}
                      />
                    </Field>
                    <Field label="Company (optional)" error={errors.company?.message}>
                      <Input
                        {...register("company")}
                        placeholder="Acme Law Firm"
                        className={cn(fieldClass, errors.company && "border-destructive")}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Project details (optional)" error={errors.message?.message}>
                        <Textarea
                          {...register("message")}
                          placeholder="What workflow would you like to automate?"
                          rows={3}
                          className="min-h-[120px] resize-none rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-[15px] shadow-none focus-visible:ring-primary/25"
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    When works best?
                  </p>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="space-y-5">
                      <Field label="Timezone" icon={Globe}>
                        <DropdownMenu
                          open={showTimezoneDropdown}
                          onOpenChange={setShowTimezoneDropdown}
                        >
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                fieldClass,
                                "flex w-full items-center justify-between px-4 text-left",
                              )}
                            >
                              <span className="truncate">
                                {TIMEZONES.find((tz) => tz.value === selectedTimezone)?.label}
                              </span>
                              <svg
                                className="ml-2 h-4 w-4 shrink-0 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-64">
                            <div className="sticky top-0 z-10 border-b border-border/30 bg-popover p-3">
                              <input
                                type="text"
                                placeholder="Search timezone..."
                                autoFocus
                                value={timezoneSearch}
                                onChange={(e) => setTimezoneSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                              />
                            </div>
                            {filteredTimezones.length > 0 ? (
                              filteredTimezones.map((tz) => (
                                <DropdownMenuItem
                                  key={tz.value}
                                  onClick={() => handleTimezoneSelect(tz.value)}
                                  className={cn(
                                    "cursor-pointer",
                                    selectedTimezone === tz.value &&
                                      "bg-primary/10 font-semibold text-primary",
                                  )}
                                >
                                  {tz.label}
                                </DropdownMenuItem>
                              ))
                            ) : (
                              <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                                No timezones found
                              </div>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Field>

                      <Field label="Select date">
                        <div className={calendarPickerClass}>
                          <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={isDateUnavailable}
                            showOutsideDays={false}
                          />
                        </div>
                      </Field>
                    </div>

                    <Field label="Select time" icon={Clock} error={errors.preferredTime?.message}>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setValue("preferredTime", time, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }
                            className={cn(
                              "rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                              watchTime === time
                                ? "bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_rgba(33,74,156,0.45)]"
                                : "border border-border/70 bg-muted/30 text-foreground hover:border-primary/40 hover:bg-primary/5",
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>

                  {selectedDate && watchTime && (
                    <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Your scheduled call
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {getDateLabel(selectedDate)} · {format(selectedDate, "MMM d, yyyy")} at{" "}
                        {watchTime}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {TIMEZONES.find((tz) => tz.value === selectedTimezone)?.label}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_-4px_rgba(33,74,156,0.45)] transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Scheduling…
                      </>
                    ) : (
                      <>
                        Schedule call
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    You&apos;ll receive calendar invites for Google, Outlook, Apple Calendar, or ICS
                  </p>
                </div>
              </motion.form>

              <motion.aside
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease }}
                className="lg:sticky lg:top-28"
              >
                <div className={cardClass}>
                  <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    What to expect
                  </p>
                  <ul className="space-y-5">
                    {EXPECT_STEPS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.title} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
                            <Icon className="h-4 w-4" strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0">
                            <p className="text-base font-semibold leading-snug text-foreground">
                              {item.title}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />}
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
