import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Calculator } from "lucide-react";

interface OrderFormData {
  customerName: string;
  itemsOrdered: string;
  quantity: number;
  pricePerItem: number;
  paymentMethod: string;
  comments: string;
}

const OrdersFormEmbed = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    itemsOrdered: "",
    quantity: 1,
    pricePerItem: 0,
    paymentMethod: "",
    comments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Calculate total price
  const totalPrice = formData.quantity * formData.pricePerItem;

  const handleInputChange = (
    field: keyof OrderFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // In a real implementation, this would submit to Google Forms
      // For now, we'll simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form
      setFormData({
        customerName: "",
        itemsOrdered: "",
        quantity: 1,
        pricePerItem: 0,
        paymentMethod: "",
        comments: "",
      });

      setSubmitMessage(
        "Order submitted successfully! Total: ₹" + totalPrice.toFixed(2),
      );
    } catch (error) {
      setSubmitMessage("Error submitting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGoogleForm = () => {
    // Replace with actual Google Form URL once created
    window.open("https://forms.gle/ORDERS_FORM_TO_BE_CREATED", "_blank");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-amber-600" />
            Order Form
          </CardTitle>
          <p className="text-gray-600">
            Submit your order details. Total price will be calculated
            automatically.
          </p>
        </CardHeader>
        <CardContent>
          {submitMessage && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{submitMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="Enter customer name"
                required
              />
            </div>

            {/* Items Ordered */}
            <div className="space-y-2">
              <Label htmlFor="itemsOrdered">Items Ordered *</Label>
              <Textarea
                id="itemsOrdered"
                value={formData.itemsOrdered}
                onChange={(e) =>
                  handleInputChange("itemsOrdered", e.target.value)
                }
                placeholder="List all items ordered (e.g., Butter Chicken, Garlic Naan, Mango Lassi)"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", parseInt(e.target.value) || 1)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerItem">Price per Item (₹) *</Label>
                <Input
                  id="pricePerItem"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricePerItem}
                  onChange={(e) =>
                    handleInputChange(
                      "pricePerItem",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  required
                />
              </div>
            </div>

            {/* Total Price Display */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-amber-800">Total Price:</span>
                <span className="text-xl font-bold text-amber-900">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                {formData.quantity} × ₹{formData.pricePerItem.toFixed(2)} = ₹
                {totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments">Comments / Notes (Optional)</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                placeholder="Any special instructions or notes"
                className="min-h-[80px]"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={
                  isSubmitting ||
                  !formData.customerName ||
                  !formData.itemsOrdered ||
                  !formData.paymentMethod
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openGoogleForm}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open Google Form
              </Button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fill in all required fields marked with *</li>
              <li>• Total price is calculated automatically</li>
              <li>
                • Data will be saved to the Restaurant Data Tracker Google Sheet
              </li>
              <li>
                • You can also use the Google Form directly by clicking "Open
                Google Form"
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersFormEmbed;
