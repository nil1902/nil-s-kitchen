import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function PhoneInput({ 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder = "Enter mobile number"
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to India
  const [phoneNumber, setPhoneNumber] = useState("");

  React.useEffect(() => {
    // Parse existing value if provided
    if (value && !phoneNumber) {
      const country = countries.find(c => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.replace(country.dialCode, ""));
      }
    }
  }, [value, phoneNumber]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      const fullNumber = country.dialCode + phoneNumber;
      onChange(fullNumber);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, ""); // Only allow digits
    setPhoneNumber(number);
    const fullNumber = selectedCountry.dialCode + number;
    onChange(fullNumber);
  };

  const formatPhoneNumber = (number: string) => {
    // Format based on country
    if (selectedCountry.code === "IN" && number.length === 10) {
      return `${number.slice(0, 5)} ${number.slice(5)}`;
    }
    return number;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">
        Mobile Number {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-32">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span className="text-sm">{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-gray-500">{country.dialCode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="phone"
          type="tel"
          placeholder={placeholder}
          value={formatPhoneNumber(phoneNumber)}
          onChange={handlePhoneChange}
          className={`flex-1 ${error ? "border-red-500" : ""}`}
          required={required}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-gray-500">
        Full number: {selectedCountry.dialCode}{phoneNumber}
      </p>
    </div>
  );
}