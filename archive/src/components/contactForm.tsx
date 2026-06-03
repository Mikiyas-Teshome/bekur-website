"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { getServices } from "@/data/static-content";

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

type FormData = z.infer<typeof contactFormSchema>;

interface Service {
  id: number;
  title: string;
  slug: string;
}

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    service: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const services: Service[] = getServices();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    // Auto-generate subject from service when service is selected
    if (name === "service" && value) {
      const selectedService = services.find((s) => s.slug === value);
      const autoSubject = selectedService 
        ? `Inquiry about ${selectedService.title}`
        : "";
      setForm({ ...form, [name]: value, subject: autoSubject });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Mutation for sending the form
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post("/api/contact", formData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Your message has been sent successfully!");
      setForm({ name: "", email: "", service: "", subject: "", message: "" });
      setErrors({});
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error.response?.data?.details) {
        // Handle validation errors
        const validationErrors: Partial<Record<keyof FormData, string>> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error.response.data.details.forEach((detail: any) => {
          validationErrors[detail.field as keyof FormData] = detail.message;
        });
        setErrors(validationErrors);
        toast.error("Please fix the errors in the form");
      } else {
        toast.error("Couldn't send your message. Please try again!");
        console.error("Error sending message:", error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    try {
      const validatedData = contactFormSchema.parse(form);
      mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Partial<Record<keyof FormData, string>> = {};
        error.issues.forEach((err) => {
          validationErrors[err.path[0] as keyof FormData] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 space-y-8">
      <div className="space-y-6">
        {/* Full Name and Email - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className={`w-full h-12 px-4 py-3 bg-transparent  border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:border-b text-lg ${
                errors.name
                  ? "border-red-500"
                  : "border-primary/15 dark:border-border focus:border-primary"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className={`w-full h-12 px-4 py-3 bg-transparent border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:border-b text-lg ${
                errors.email
                  ? "border-red-500"
                  : "border-primary/15 dark:border-border focus:border-primary"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Select Service */}
        <div className="relative">
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className={`w-full h-12 px-4 py-3 bg-transparent dark:bg-secondary border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 text-lg ${
              errors.service
                ? "border-red-500"
                : "border-primary/15 dark:border-border focus:border-primary"
            }`}
          >
            <option value="" disabled>
              Select Service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
          {errors.service && (
            <p className="text-red-500 text-sm mt-1">{errors.service}</p>
          )}
        </div>

        {/* Message */}
        <div className="pt-2">
          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows={6}
            className={`w-full px-4 py-3 bg-transparent border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 resize-none text-lg ${
              errors.message
                ? "border-red-500"
                : "border-primary/10 dark:border-border focus:border-primary"
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground dark:text-foreground shadow-md h-12 hover:bg-primary/90 rounded-lg text-lg font-medium cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Submit"}
      </Button>
    </form>
  );
};

export default ContactForm;
