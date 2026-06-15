"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100, "Company name is too long").optional(),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

type FormData = z.infer<typeof contactFormSchema>;

const fieldClass =
  "h-12 rounded-xl border-border/70 bg-muted/30 text-[15px] shadow-none focus-visible:ring-primary/25 md:h-[52px]";

export default function MarketingContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isPending, setIsPending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const validated = contactFormSchema.parse(form);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const validationErrors: Partial<Record<keyof FormData, string>> = {};
          for (const detail of data.details as { field: string; message: string }[]) {
            validationErrors[detail.field as keyof FormData] = detail.message;
          }
          setErrors(validationErrors);
          toast.error("Please fix the errors in the form");
        } else {
          toast.error(data.error || "Could not send your message");
        }
        return;
      }

      toast.success(data.message || "Thank you — we'll be in touch soon.");
      setForm({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Partial<Record<keyof FormData, string>> = {};
        for (const issue of error.issues) {
          validationErrors[issue.path[0] as keyof FormData] = issue.message;
        }
        setErrors(validationErrors);
        toast.error("Please fix the errors in the form");
      } else {
        toast.error("Could not send your message. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name}>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={cn(fieldClass, errors.name && "border-destructive")}
          />
        </Field>
        <Field label="Work email" required error={errors.email}>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@firm.com"
            className={cn(fieldClass, errors.email && "border-destructive")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Company name" error={errors.company}>
          <Input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Your firm"
            className={cn(fieldClass, errors.company && "border-destructive")}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <Input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+251 9XX XXX XXXX"
            className={fieldClass}
          />
        </Field>
      </div>

      <Field label="Subject" required error={errors.subject}>
        <Input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Project or workflow inquiry"
          className={cn(fieldClass, errors.subject && "border-destructive")}
        />
      </Field>

      <Field label="Message" required error={errors.message}>
        <Textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="What workflow or outcome are you trying to improve?"
          rows={5}
          className={cn(
            "min-h-[140px] resize-none rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-[15px] shadow-none focus-visible:ring-primary/25",
            errors.message && "border-destructive",
          )}
        />
      </Field>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center cursor-pointer justify-center rounded-[12px] bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_-4px_rgba(33,74,156,0.45)] transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
