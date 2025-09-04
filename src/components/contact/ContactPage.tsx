import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Check if form is valid whenever inputs change
  React.useEffect(() => {
    setIsFormValid(!!name && !!email && !!subject && !!message);
  }, [name, email, subject, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        setIsSubmitting(true);
        setError("");

        // Send form data to formsubmit.co service
        const response = await fetch(
          "https://formsubmit.co/ajax/snresturent@gmail.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              subject,
              message,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to submit form. Please try again later.");
        }

        setIsSubmitted(true);
      } catch (err) {
        console.error("Form submission error:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80)`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            We'd love to hear from you. Reach out with any questions, feedback,
            or to make a reservation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Reservation Inquiry"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message here..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!isFormValid || isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                    <p className="text-gray-600">
                      Shantipur, Landmark Station Rd
                      <br />
                      PIN: 741404, Dist Nadia
                      <br />
                      West Bengal, India
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Shantipur+Station+Rd+741404+West+Bengal+India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-800 text-sm inline-flex items-center mt-1"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone</h3>
                    <p className="text-gray-600">
                      Reservations: (555) 123-4567
                      <br />
                      General Inquiries: (555) 765-4321
                      <br />
                      Catering: (555) 987-6543
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">
                      Reservations: reservations@nilskitchen.com
                      <br />
                      General Inquiries: info@nilskitchen.com
                      <br />
                      Catering: catering@nilskitchen.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Hours</h3>
                    <div className="text-gray-600">
                      <p>
                        <span className="font-medium">Monday - Friday:</span>{" "}
                        11:00 AM - 10:00 PM
                      </p>
                      <p>
                        <span className="font-medium">Saturday - Sunday:</span>{" "}
                        10:00 AM - 11:00 PM
                      </p>
                      <p className="mt-2 text-sm">
                        Kitchen closes 30 minutes before closing time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Find Us
          </h2>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border border-amber-100 shadow-sm">
            <iframe
              title="Bengal Bay Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.073282751765!2d88.4867!3d23.2571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f92b2e2e2e2e2e%3A0x123456789abcdef!2sShantipur%2C%20West%20Bengal%20741404%2C%20India!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isSubmitted} onOpenChange={setIsSubmitted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message Sent!</DialogTitle>
            <DialogDescription>
              Thank you for reaching out to us.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-3">
              <p className="font-medium">
                Thank you, {name}! We've received your message.
              </p>
              <p className="text-sm text-gray-500">
                We'll get back to you as soon as possible at {email}. If your
                matter is urgent, please call us at (555) 123-4567.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                // Reset form
                setName("");
                setEmail("");
                setSubject("");
                setMessage("");
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactPage;
