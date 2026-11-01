"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { trackMarketingEvent } from "@/lib/marketing-analytics";
import {
  Mail,
  LifeBuoy,
  Phone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Send,
  HeartHandshake,
} from "lucide-react";

export default function ContactAndSupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general_question");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in your name, email address, and message.");
      return;
    }
    setErrorMsg(null);
    setSubmitted(true);
    trackMarketingEvent("contact_form_submitted", { topic });
  };

  return (
    <MarketingShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-16 space-y-14">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E8F1EB] border border-[#CFE2D6] text-[#1F4742] text-[13.5px] font-medium">
            <Mail className="w-4 h-4 text-[#285B55]" />
            <span>Contact &amp; Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#263330] tracking-tight">
            We’re here to help with product questions, privacy requests, and feedback.
          </h1>
          <p className="text-[18px] text-[#52625E] leading-relaxed">
            Send a note to the InnerOS team below—or connect immediately with free, confidential 24/7 crisis support if you need urgent human care.
          </p>
        </div>

        {/* Immediate Crisis Support Callout (Always Visible Above Contact Form) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#F7E7E2] border border-[#EED2C9] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 text-[#263330]">
              <HeartHandshake className="w-5 h-5 text-[#A4384B]" />
              <h2 className="text-xl font-serif font-medium">
                Need Urgent Emotional or Crisis Support Right Now?
              </h2>
            </div>
            <Badge variant="peach" size="sm">
              Free &amp; Confidential 24/7
            </Badge>
          </div>
          <p className="text-[15px] text-[#52625E] leading-relaxed">
            Our contact form is for product and account questions and is not monitored 24/7 for emergencies. If you or someone you know is in distress, please connect with a trained human counselor immediately:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="font-semibold text-[15px] text-[#263330] block">
                US &amp; Canada: 988
              </span>
              <p className="text-[13.5px] text-[#52625E]">
                Call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline)
              </p>
              <a
                href="tel:988"
                className="inline-flex items-center space-x-1.5 text-[13.5px] font-semibold text-[#A4384B] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call 988</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="font-semibold text-[15px] text-[#263330] block">
                United Kingdom: 116 123 / 111
              </span>
              <p className="text-[13.5px] text-[#52625E]">
                Call Samaritans at <strong>116 123</strong> or NHS at <strong>111</strong>
              </p>
              <a
                href="tel:116123"
                className="inline-flex items-center space-x-1.5 text-[13.5px] font-semibold text-[#285B55] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call 116 123</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E6E0D6] space-y-2">
              <span className="font-semibold text-[15px] text-[#263330] block">
                EU &amp; Bulgaria: 112 / 0800 88 001
              </span>
              <p className="text-[13.5px] text-[#52625E]">
                Call <strong>112</strong> (EU) or <strong>0800 88 001</strong> (Bulgaria)
              </p>
              <Link
                href="/safety"
                className="inline-flex items-center space-x-1.5 text-[13.5px] font-semibold text-[#285B55] hover:underline"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>All Global Helplines</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form & Direct Support Channels */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-[36px] bg-white border border-[#E6E0D6] shadow-sm">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F1EB] border border-[#CFE2D6] flex items-center justify-center text-[#285B55] mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-serif font-medium text-[#263330]">
                  Thank you for reaching out, {name}.
                </h2>
                <p className="text-[15.5px] text-[#52625E] max-w-md mx-auto leading-relaxed">
                  Your message regarding <strong>{topic.replace(/_/g, " ")}</strong> has been recorded. For immediate self-service privacy or memory controls, you can also visit your Privacy Settings directly.
                </p>
                <div className="pt-3 flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                  >
                    Send Another Message
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm">
                      Go to Companion App
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h2 className="text-2xl font-serif font-medium text-[#263330]">
                  Send a Message to Our Team
                </h2>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-4 rounded-2xl bg-[#FDF2F2] border border-[#F5D0D0] text-[14px] text-[#A4384B]"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-[14px] font-medium text-[#263330] block"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elena Vance"
                      className="w-full rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] px-4 py-3 text-[15.5px] text-[#263330] focus:outline-none focus:border-[#285B55]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-[14px] font-medium text-[#263330] block"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@example.com"
                      className="w-full rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] px-4 py-3 text-[15.5px] text-[#263330] focus:outline-none focus:border-[#285B55]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-topic"
                    className="text-[14px] font-medium text-[#263330] block"
                  >
                    How can we help?
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] px-4 py-3 text-[15.5px] text-[#263330] focus:outline-none focus:border-[#285B55]"
                  >
                    <option value="general_question">General Product Question</option>
                    <option value="privacy_and_data">Privacy &amp; Data Export / Deletion</option>
                    <option value="language_feedback">Multilingual &amp; Voice Feedback</option>
                    <option value="accessibility">Accessibility Support</option>
                    <option value="partnership_inquiry">Clinical or Research Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-[14px] font-medium text-[#263330] block"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your question or feedback..."
                    className="w-full rounded-2xl bg-[#FAF8F4] border border-[#D5CFC2] p-4 text-[15.5px] text-[#263330] focus:outline-none focus:border-[#285B55]"
                  />
                </div>

                <p className="text-[13px] text-[#52625E]">
                  Please avoid sharing sensitive medical records in this support form.
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Right Self-Service & Direct Links Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-7 rounded-3xl bg-white border border-[#E6E0D6] shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-[#285B55] font-semibold text-[15px]">
                <ShieldCheck className="w-5 h-5" />
                <span>Instant Self-Service Data Controls</span>
              </div>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                You don’t have to wait on a support ticket to manage your data. You can export your archive or delete your memories immediately inside the app.
              </p>
              <div className="pt-1">
                <Link
                  href="/settings/privacy"
                  className="text-[14px] font-semibold text-[#285B55] hover:underline"
                >
                  Open Privacy &amp; Data Controls &rarr;
                </Link>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[#EDE8F5] border border-[#DDD4EC] space-y-3">
              <h3 className="text-xl font-serif font-medium text-[#263330]">
                Common Questions
              </h3>
              <p className="text-[14.5px] text-[#52625E] leading-relaxed">
                Looking for quick answers on how Voice Companion, Things I Remember, or Quiet Hours work?
              </p>
              <div className="pt-1">
                <Link
                  href="/faq"
                  className="text-[14px] font-semibold text-[#285B55] hover:underline"
                >
                  Browse the FAQ &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
