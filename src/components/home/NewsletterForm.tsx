import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface NewsletterFormProps {
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ className }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await fetch("https://formsubmit.co/ajax/snresturent@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: `New newsletter subscription: ${email} has subscribed to Bengal Bay newsletter.`,
        }),
      });
      setIsSubmitted(true);
      setError("");
      setEmail("");
    } catch (err) {
      console.error("Failed to submit newsletter form", err);
      setError("Failed to subscribe. Please try again later.");
    }
  };

  return (
    <div className={className}>
      {isSubmitted ? (
        <Alert className="bg-green-50 text-green-800 border-green-200 mb-4">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <AlertDescription>
            Thank you for subscribing to our newsletter!
          </AlertDescription>
        </Alert>
      ) : error ? (
        <Alert className="bg-red-50 text-red-800 border-red-200 mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white"
        />
        <Button
          type="submit"
          variant="default"
          className="bg-amber-500 hover:bg-amber-600"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterForm;
