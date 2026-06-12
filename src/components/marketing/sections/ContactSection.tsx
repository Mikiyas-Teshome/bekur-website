"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

const LINKEDIN_URL = "https://www.linkedin.com/company/bekur-technologies";
const CONTACT_EMAIL = "miki@bekurtechnologies.com";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-mk-border bg-mk-surface-2 px-4 py-3 text-sm text-mk-text-1 placeholder:text-mk-text-3 outline-none transition-colors focus:border-mk-accent-a25 focus-visible:ring-2 focus-visible:ring-mk-accent-a25";

export default function ContactSection() {
  const [state, setState] = useState<FormState>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // honeypot: bots fill it, humans never see it
    if (formData.get("company_website")) {
      setState("success");
      form.reset();
      return;
    }

    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  };

  return (
    <SectionShell id="contact">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <SectionHeading
            kicker="Contact"
            title={
              <>
                Tell us where the{" "}
                <span className="text-mk-text-2">hours are leaking.</span>
              </>
            }
            subtitle="We reply within one business day."
            className="mb-8"
          />
          <motion.div variants={fadeUp} className="space-y-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block w-fit text-[15px] text-mk-text-1 transition-colors hover:text-mk-accent"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-1.5 text-[15px] text-mk-text-1 transition-colors hover:text-mk-accent"
            >
              LinkedIn
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-mk-border bg-mk-surface-1 p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm text-mk-text-2">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm text-mk-text-2">
                Work email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@yourfirm.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm text-mk-text-2">
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              required
              maxLength={200}
              className={inputClass}
              placeholder="What workflow is eating partner hours?"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm text-mk-text-2">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={1000}
              rows={5}
              className={inputClass}
              placeholder="Tell us how the work flows today — tools, handoffs, where it stalls."
            />
          </div>

          <div aria-hidden className="absolute -left-[9999px]">
            <label htmlFor="company_website">Leave this field empty</label>
            <input
              id="company_website"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={state === "submitting"}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-mk-accent px-6 text-sm font-semibold text-mk-bg transition-[filter] hover:brightness-110 disabled:opacity-60 sm:w-auto"
          >
            {state === "submitting" && (
              <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" />
            )}
            {state === "submitting" ? "Sending…" : "Send message"}
          </button>

          <div aria-live="polite">
            {state === "success" && (
              <p className="text-sm text-mk-positive">
                Got it — we&apos;ll reply within one business day.
              </p>
            )}
            {state === "error" && (
              <p className="text-sm text-mk-warn">
                Something went wrong. Email us directly at {CONTACT_EMAIL}.
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </SectionShell>
  );
}
