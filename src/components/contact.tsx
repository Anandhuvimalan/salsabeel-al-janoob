"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* Vertical Curtain Reveal */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2
        }}
        style={{ originY: 0 }}
        className="fixed inset-0 bg-gray-900 z-50"
      />

      <main className="container mx-auto px-6 lg:px-8 space-y-12 py-20 lg:py-28">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isMounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-3xl mx-auto space-y-4 text-center"
        >
          <p className="text-sm uppercase tracking-wider text-gray-400">Get in Touch</p>
          <h1 className="text-3xl font-light text-white sm:text-4xl">
            Contact Salsabeel Al Janoob ImpExp
          </h1>
          <p className="text-lg text-gray-400">
            We usually respond within 30 minutes during business hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-16 max-w-6xl mx-auto">
          {/* Animated Form Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="glass-panel p-8 rounded-2xl space-y-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Form fields remain the same as original */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full h-12 px-4 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-500 form-input-focus"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                    Company Name
                  </label>
                  <input
                    {...register("company")}
                    placeholder="Your company name"
                    className="w-full h-12 px-4 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-500 form-input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Tell us about your requirements..."
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-500 form-input-focus"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-500 form-input-focus"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Phone Number <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 px-4 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-500 form-input-focus"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full md:w-auto px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </motion.div>

          {/* Animated Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="space-y-8 lg:pt-8"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-gray-400 text-sm font-medium">Email</h3>
                <a 
                  href="mailto:info@salsabeelaljanoobimpexp.com" 
                  className="block text-white hover:text-gray-300 transition-colors duration-300"
                >
                  info@salsabeelaljanoobimpexp.com
                </a>
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-400 text-sm font-medium">Phone</h3>
                <div className="space-y-2">
                  <a 
                    href="tel:+96891718606" 
                    className="block text-white hover:text-gray-300 transition-colors duration-300"
                  >
                    Oman: +968 9171 8606
                  </a>
                  <a 
                    href="tel:+919349474746" 
                    className="block text-white hover:text-gray-300 transition-colors duration-300"
                  >
                    India: +91 93494 74746
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-400 text-sm font-medium">Business Hours</h3>
                <p className="text-white">Monday - Friday: 9:30 - 19:00</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}