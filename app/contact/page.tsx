"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#d946ef] bg-[#FAF5FF] px-3 py-1.5 rounded-md mb-4">
            Contact
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
            Get in Touch with NewtGroup
          </h1>
          <p className="text-lg text-[#475569] max-w-xl mx-auto">
            Have a question about a tool? Want to submit your product for review? 
            Or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1000px] mx-auto">
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="bg-[#FAF5FF] border border-[#d946ef]/30 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#d946ef]/10 flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-[#d946ef]" />
                  </div>
                  <p className="text-[#0F172A] font-semibold text-lg mb-1">Message Sent!</p>
                  <p className="text-[#64748B] text-sm">
                    Thanks for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-[#475569] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#d946ef] focus:outline-none transition-colors"
                        placeholder="Jordan Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#475569] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#d946ef] focus:outline-none transition-colors"
                        placeholder="jordan@studio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] focus:border-[#d946ef] focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="tool-submission">Submit a Tool for Review</option>
                      <option value="bug">Report a Bug</option>
                      <option value="suggestion">Feature Suggestion</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#d946ef] focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#d946ef] hover:bg-[#c026d3] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d946ef]" />
                Email Us
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-[#64748B]">
                  <strong className="text-[#0F172A]">General:</strong>
                  <br />
                  <a href="mailto:hello@newtgroup.space" className="text-[#d946ef] hover:underline">
                    hello@newtgroup.space
                  </a>
                </p>
                <p className="text-sm text-[#64748B]">
                  <strong className="text-[#0F172A]">Tool Submissions:</strong>
                  <br />
                  <a href="mailto:tools@vidiopics.com" className="text-[#d946ef] hover:underline">
                    tools@vidiopics.com
                  </a>
                </p>
                <p className="text-sm text-[#64748B]">
                  <strong className="text-[#0F172A]">Press:</strong>
                  <br />
                  <a href="mailto:press@newtgroup.space" className="text-[#d946ef] hover:underline">
                    press@newtgroup.space
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d946ef]" />
                Studio
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                NewtGroup Studio #48
                <br />
                123 Westminster Street, Suite 48
                <br />
                Providence, RI 02903
                <br />
                United States
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d946ef]" />
                Response Time
              </h3>
              <p className="text-sm text-[#64748B]">
                We typically respond within <strong className="text-[#0F172A]">24 hours</strong> during
                business days (EST).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
