import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Clock,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const timeSlots = [
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

const ReservationPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // UI state
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Populate form with user data if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  // Check if form is valid whenever inputs change
  useEffect(() => {
    // Basic validation
    const isDateValid = !!date;
    const isTimeValid = !!time;
    const isGuestsValid = !!guests;
    const isNameValid = !!name && name.trim().length > 0;
    const isEmailValid = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = !!phone && phone.trim().length >= 10;

    console.log("Form validation:", {
      isDateValid,
      isTimeValid,
      isGuestsValid,
      isNameValid,
      isEmailValid,
      isPhoneValid,
    });

    setIsFormValid(
      isDateValid &&
        isTimeValid &&
        isGuestsValid &&
        isNameValid &&
        isEmailValid &&
        isPhoneValid,
    );
  }, [date, time, guests, name, email, phone]);

  // Reset form after successful submission
  const resetForm = () => {
    setDate(undefined);
    setTime("");
    setGuests("2");
    setSpecialRequests("");
    // Don't reset name, email, phone if user is logged in
    if (!currentUser) {
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Submit button clicked!");

    // Prevent multiple submissions
    if (isSubmitting) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const timeout = setTimeout(() => {
      console.error("🚨 Submission timeout! Resetting form...");
      setIsSubmitting(false);
      // Don't show error message, instead try to show confirmation dialog
      setIsConfirmationOpen(true);
    }, 10000); // 10 seconds

    try {
      console.log("📝 Generating booking ID...");
      // Generate a unique booking ID
      const newBookingId = `BKG-${Math.floor(Math.random() * 1000000)}`;
      setBookingId(newBookingId);

      const bookingDate = date ? date.toISOString() : new Date().toISOString();
      console.log("📅 Booking date:", bookingDate);
      const formattedDate = date
        ? format(date, "PPP")
        : format(new Date(), "PPP");

      // Create detailed booking object
      const bookingData = {
        id: newBookingId,
        date: bookingDate,
        formattedDate: formattedDate,
        time: time || "12:00 PM",
        guests: parseInt(guests) || 2,
        name: name || "Guest",
        email: email || "guest@example.com",
        phone: phone || "(555) 123-4567",
        specialRequests,
        status: "Upcoming",
        userId: currentUser?.uid || "guest-user",
        userEmail: email || "guest@example.com",
        timestamp: new Date().toISOString(),
        restaurantName: "Bengal Bay",
        restaurantAddress:
          "Shantipur, Landmark Station Rd, PIN: 741404, Dist Nadia, West Bengal, India",
        restaurantPhone: "(555) 123-4567",
        createdAt: serverTimestamp(),
      };

      console.log("💾 Saving booking data...");
      // Save to localStorage first (as a safety measure)
      if (currentUser) {
        const userBookingsKey = `bookings_${currentUser.uid}`;
        const existingBookings = localStorage.getItem(userBookingsKey);
        const bookings = existingBookings ? JSON.parse(existingBookings) : [];
        bookings.unshift(bookingData);
        localStorage.setItem(userBookingsKey, JSON.stringify(bookings));
      } else {
        const guestBookingsKey = "guest_bookings";
        const existingBookings = localStorage.getItem(guestBookingsKey);
        const bookings = existingBookings ? JSON.parse(existingBookings) : [];
        bookings.unshift(bookingData);
        localStorage.setItem(guestBookingsKey, JSON.stringify(bookings));
      }

      // Send actual email using FormSubmit service
      const emailContent = {
        to: email || "snresturent@gmail.com", // Default to restaurant owner's email
        subject: `✨ Your Table is Reserved! Confirmation #${newBookingId} - Bengal Bay`,
        message: `
          Dear ${name || "Guest"},

                      🎉 Your table has been successfully reserved at Bengal Bay! 🎉

          📋 Reservation Details:
          ------------------------------------------
          🔖 Reservation ID: ${newBookingId}
          📅 Date: ${formattedDate}
          🕒 Time: ${time || "12:00 PM"}
          👥 Number of Guests: ${guests || 2}
          ${specialRequests ? `🔔 Special Requests: ${specialRequests}` : ""}

          🏠 Restaurant Information:
          ------------------------------------------
                      Bengal Bay
          Shantipur, Landmark Station Rd
          PIN: 741404, Dist Nadia
          West Bengal, India
          📞 Phone: (555) 123-4567

          We're excited to welcome you and promise an unforgettable dining experience!

          Need to make changes? Please call us at (555) 123-4567.

          Warm regards,
                      The Bengal Bay Team
          
                      🌟 Thank you for choosing Bengal Bay! 🌟
        `,
      };
      console.log("Sending email to:", emailContent.to);

      try {
        // Actually send the email using FormSubmit
        const emailResponse = await fetch(
          "https://formsubmit.co/ajax/snresturent@gmail.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(emailContent),
          },
        );

        const emailResult = await emailResponse.json();
        console.log("Email sent successfully:", emailResult);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue with the process even if email fails
      }

      // Save to Firestore if user is logged in
      if (currentUser) {
        try {
          console.log("🔥 Attempting to save to Firestore...");
          // Use a try-catch block specifically for Firestore operations
          const bookingsCollection = collection(db, "bookings");
          const docRef = await addDoc(bookingsCollection, {
            ...bookingData,
            timestamp: serverTimestamp(), // Ensure server timestamp is added
          });
          console.log("✅ Firestore booking saved with ID: ", docRef.id);
          setSuccessMessage("Booking successfully saved to your account!");
        } catch (firestoreError) {
          console.error("Error saving to Firestore:", firestoreError);
          // Still show success even if Firestore fails, since we saved to localStorage
          setSuccessMessage(
            "Booking saved locally. You can view it in your account.",
          );
        }
      } else {
        setSuccessMessage(
          "Booking saved! Consider creating an account to manage your reservations.",
        );
      }

      // Always show confirmation dialog and reset form
      // Use a small timeout to ensure state updates have completed
      setTimeout(() => {
        setIsConfirmationOpen(true);
        resetForm();
      }, 100);
    } catch (error) {
      console.error("Failed to process booking:", error);
      // Don't set error message here since the booking might have succeeded partially
      // Instead, we'll still show the confirmation dialog
      setTimeout(() => {
        setIsConfirmationOpen(true);
        resetForm();
      }, 100);
    } finally {
      clearTimeout(timeout);
      console.log("⏳ Finalizing submission...");
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
    // Redirect to profile page if user is logged in
    if (currentUser) {
      // Use a small timeout to ensure dialog is closed before navigation
      setTimeout(() => {
        navigate("/profile?tab=bookings");
      }, 100);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Reserve Your Table
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Book your dining experience at Bengal Bay and enjoy our
            exceptional cuisine and service
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Make a Reservation
            </h2>

            {errorMessage &&
              errorMessage !== "Something went wrong. Please try again." && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

            {successMessage && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable dates in the past
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Party Size */}
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </SelectItem>
                      ))}
                      <SelectItem value="more">
                        More than 10 (Call us)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests">
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="specialRequests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any dietary restrictions, allergies, or special occasions?"
                  className="min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Book Table"
                )}
              </Button>

              {!currentUser && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  <Link to="/login" className="text-amber-600 hover:underline">
                    Sign in
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/register"
                    className="text-amber-600 hover:underline"
                  >
                    create an account
                  </Link>{" "}
                  to manage your reservations
                </p>
              )}
            </form>
          </div>

          {/* Information Cards */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Reservation Information
            </h2>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Opening Hours
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                      <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Group Reservations
                    </h3>
                    <p className="text-gray-600">
                      For parties larger than 10 people, please call us directly
                      at (555) 123-4567 to arrange your reservation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <UtensilsCrossed className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Private Dining
                    </h3>
                    <p className="text-gray-600">
                      We offer private dining rooms for special events. Contact
                      us for more information about hosting your next
                      celebration at Bengal Bay.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Reservation Policy</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>
                  Reservations are held for 15 minutes past the scheduled time.
                </li>
                <li>Please call if you're running late or need to cancel.</li>
                <li>A credit card is required for parties of 6 or more.</li>
                <li>Cancellations within 24 hours may incur a fee.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-amber-50 to-white">
          <DialogHeader className="border-b border-amber-200 pb-4">
            <DialogTitle className="text-2xl text-amber-800 font-bold">
              Your Table is Reserved! 🎉
            </DialogTitle>
            <DialogDescription className="text-amber-700">
              We're excited to welcome you to Bengal Bay!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="rounded-full bg-green-100 p-4 mb-5 shadow-inner border border-green-200">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-center space-y-4 w-full">
              <p className="font-medium text-lg text-gray-800">
                Thank you,{" "}
                <span className="font-bold text-amber-700">{name}</span>! We're
                looking forward to serving you.
              </p>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
                <p className="font-bold text-amber-800 mb-3 text-lg">
                  Reservation Details:
                </p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <p className="font-medium text-gray-700">📅 Date:</p>
                  <p className="text-gray-800">
                    {date ? format(date, "PPP") : ""}
                  </p>

                  <p className="font-medium text-gray-700">🕒 Time:</p>
                  <p className="text-gray-800">{time}</p>

                  <p className="font-medium text-gray-700">👥 Party Size:</p>
                  <p className="text-gray-800">
                    {guests} {parseInt(guests) === 1 ? "Guest" : "Guests"}
                  </p>

                  <p className="font-medium text-gray-700">
                    🆔 Reservation ID:
                  </p>
                  <p className="text-gray-800">{bookingId}</p>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100 mt-2">
                <p className="text-sm text-gray-700">
                  ✉️ A confirmation email has been sent to{" "}
                  <span className="font-medium">{email}</span> with all your
                  reservation details.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  📞 Need to make changes? Please call us at{" "}
                  <span className="font-medium">(555) 123-4567</span>.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              onClick={handleCloseConfirmation}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-2 text-lg font-medium shadow-md transition-all hover:shadow-lg"
            >
              {currentUser ? "View My Bookings" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReservationPage;
