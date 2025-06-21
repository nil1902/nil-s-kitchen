import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  FileSpreadsheet,
  MessageSquare,
  CreditCard,
  Star,
  Calendar,
  ShoppingCart,
  Download,
  Mail,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormLink {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const GoogleFormsIntegration = () => {
  const [isExporting, setIsExporting] = useState(false);

  const googleSheetUrl =
    "https://docs.google.com/spreadsheets/d/1rY4jh2WzlArfJiu12IGC6QPwxhgXG2vCySpBxYilyS0/edit#gid=0";

  const formLinks: FormLink[] = [
    {
      id: "orders",
      name: "Orders Form",
      url: "https://forms.gle/r7xK7h35xyQWt4BM8", // Create this form following the setup instructions
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "bg-red-100 text-red-800",
      description:
        "Customer order submissions with automatic total calculation",
    },
    {
      id: "messages",
      name: "Messages / Inquiries",
      url: "https://forms.gle/qvD4PLm6NsVzQZX46",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-yellow-100 text-yellow-800",
      description: "Customer inquiries and general messages",
    },
    {
      id: "billing",
      name: "Billing Form",
      url: "https://forms.gle/em3hNLxCVErrYGTs9",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      description: "Payment processing and billing information",
    },
    {
      id: "feedback",
      name: "Feedback Form",
      url: "https://forms.gle/DZPw4ijRjP2q4r7f9",
      icon: <Star className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      description: "Customer feedback and ratings",
    },
    {
      id: "reservations",
      name: "Reservation Form",
      url: "https://forms.gle/q17KRhppiY1U6g859",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800",
      description: "Table reservation requests",
    },
  ];

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      // This would trigger the Google Apps Script export function
      // For now, we'll open the Google Sheet directly
      window.open(googleSheetUrl, "_blank");

      // In a real implementation, you would call your Google Apps Script web app
      // const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL/export');
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'restaurant-data.xlsx';
      // a.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailReport = async () => {
    try {
      // This would trigger the Google Apps Script email function
      alert(
        "Email report functionality will be implemented via Google Apps Script",
      );

      // In a real implementation:
      // await fetch('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL/email-report', { method: 'POST' });
    } catch (error) {
      console.error("Email report failed:", error);
    }
  };

  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurant Data Management
          </h1>
          <p className="text-gray-600">
            Manage your restaurant data through Google Forms and Google Sheets
            integration
          </p>
        </div>

        {/* Google Sheet Access */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
              Restaurant Data Tracker - Google Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">
                  Central database storing all restaurant data across multiple
                  tabs
                </p>
                <p className="text-sm text-gray-500">
                  Tabs: Orders, Billing, Feedback, Messages, Reservations
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(googleSheetUrl, "_blank")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Sheet
                </Button>
                <Button
                  onClick={handleExportToExcel}
                  variant="outline"
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export Excel"}
                </Button>
                <Button onClick={handleEmailReport} variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {formLinks.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {form.icon}
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                  </div>
                  <Badge className={form.color}>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{form.description}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(form.url, "_blank")}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                    size="sm"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Form
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(form.url);
                      alert("Form URL copied to clipboard!");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Copy URL
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>Note:</strong> The Orders form needs to be created and
                linked to your Google Sheet. Follow the instructions below to
                complete the setup.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  1. Create Orders Google Form
                </h3>
                <p className="text-gray-600 mb-2">
                  Create a new Google Form with the following fields:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                  <li>Customer Name (Short answer)</li>
                  <li>Items Ordered (Long answer)</li>
                  <li>Quantity (Number)</li>
                  <li>Price per Item (Number)</li>
                  <li>
                    Payment Method (Multiple choice: Cash, Card, UPI, Online)
                  </li>
                  <li>Comments / Notes (Long answer, optional)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  2. Link Forms to Google Sheet
                </h3>
                <p className="text-gray-600 mb-2">
                  For each form, go to Responses → Link to Sheets → Select
                  existing spreadsheet → Choose "Restaurant Data Tracker"
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  3. Set up Google Apps Script
                </h3>
                <p className="text-gray-600 mb-2">
                  Copy the provided Google Apps Script code to automate
                  calculations and formatting.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  4. Configure Form Access
                </h3>
                <p className="text-gray-600 mb-2">
                  Set form permissions to "Restricted" or add password
                  validation via Apps Script.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Embed Code Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Embed Forms in Website</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You can embed these forms directly in your website using iframe or
              redirect users to the form URLs.
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
              <code className="text-sm">
                {`<iframe src="FORM_URL" width="640" height="800" frameborder="0"></iframe>`}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleFormsIntegration;
