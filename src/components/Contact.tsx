
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";
import { Phone, MapPin, Mail, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Define form schema with validation rules
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mailtoOpened, setMailtoOpened] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    setMailtoOpened(false);

    try {
      // Create mailto link with form data
      const subject = `Contact from ${data.name}`;
      const body = `Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMessage:%0D%0A${data.message}`;
      const mailtoLink = `mailto:ravikumarjalapatii@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      
      // Open email client in a new window to ensure it opens
      const mailWindow = window.open(mailtoLink, '_blank');
      
      // If popup is blocked or mailto protocol isn't handled, provide fallback
      if (!mailWindow) {
        // Fallback to direct location change
        window.location.href = mailtoLink;
      }
      
      setMailtoOpened(true);
      
      // Show success message
      toast.success("Email client opened. Please complete sending the email.");
      console.log("Email client should be opened now");
      
      // Reset form after delay
      setTimeout(() => {
        if (mailtoOpened) {
          form.reset();
        }
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error opening email client:", error);
      toast.error("Could not open email client. Please try again or copy the message manually.");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 opacity-0 bg-black text-white"
    >
      <div className="section-container">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Contact <span className="text-red-500">Me</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              If you have any questions or would like to collaborate, please don't hesitate to contact me
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-4 text-yellow-400">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Phone
                  </h3>
                  <p className="font-medium text-white">+91-6300594097</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-4 text-yellow-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Location
                  </h3>
                  <p className="font-medium text-white">Bangalore, Karnataka, India</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mr-4 text-yellow-400">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Email
                  </h3>
                  <p className="font-medium text-white">ravikumarjalapatii@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Enter your full name here"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          placeholder="Enter your email address here"
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter your message here"
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6 rounded-lg font-medium transition-colors"
                >
                  <Send className="mr-2" size={18} />
                  {isSubmitting ? 'Opening Email Client...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
