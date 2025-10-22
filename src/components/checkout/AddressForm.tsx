import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AddressFormProps {
  onSave: (address: AddressData) => void;
  onCancel: () => void;
  initialAddress?: AddressData;
}

export interface AddressData {
  name: string;
  phone: string;
  alternatePhone?: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  addressType: "home" | "work";
}

const COUNTRY_CODES = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+7", country: "Russia" },
  { code: "+971", country: "UAE" },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const AddressForm: React.FC<AddressFormProps> = ({
  onSave,
  onCancel,
  initialAddress,
}) => {
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [formData, setFormData] = useState<AddressData>(
    initialAddress || {
      name: "",
      phone: "",
      alternatePhone: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "Maharashtra",
      landmark: "",
      addressType: "home",
    },
  );

  // Location detection states
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [locationMessage, setLocationMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Real geolocation implementation
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationMessage('Geolocation is not supported by this browser');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('idle');
    setLocationMessage('Detecting your location...');

    try {
      // Get user's coordinates
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
          }
        );
      });

      const { latitude, longitude } = position.coords;
      setLocationMessage('Getting address details...');

      // Reverse geocoding using OpenStreetMap Nominatim (free service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Bengal-Bay-Restaurant-App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get address details');
      }

      const data = await response.json();

      if (!data || !data.address) {
        throw new Error('Unable to determine address from location');
      }

      // Parse the address data
      const addressData = data.address;
      const displayName = data.display_name;

      // Extract address components with fallbacks
      const houseNumber = addressData.house_number || '';
      const road = addressData.road || addressData.street || '';
      const suburb = addressData.suburb || addressData.neighbourhood || addressData.locality || '';
      const city = addressData.city || addressData.town || addressData.village || addressData.municipality || '';
      const state = addressData.state || addressData.region || '';
      const postcode = addressData.postcode || '';
      const country = addressData.country || '';

      // Build address string
      const addressParts = [houseNumber, road].filter(Boolean);
      const fullAddress = addressParts.length > 0 ? addressParts.join(' ') : displayName.split(',')[0];

      // Update form with detected location
      setFormData(prev => ({
        ...prev,
        address: fullAddress || 'Current Location',
        locality: suburb || road || 'Current Area',
        city: city || 'Current City',
        state: state || prev.state, // Keep existing state if not detected
        pincode: postcode || prev.pincode, // Keep existing pincode if not detected
      }));

      setLocationStatus('success');
      setLocationMessage(`✅ Location detected: ${city || 'Current City'}, ${state || 'Current State'}`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setLocationStatus('idle');
        setLocationMessage('');
      }, 3000);

    } catch (error: any) {
      console.error('Location detection error:', error);

      let errorMessage = 'Unable to detect location';

      if (error.code === 1) {
        errorMessage = 'Location access denied. Please allow location access and try again.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your GPS/internet connection.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setLocationStatus('error');
      setLocationMessage(errorMessage);

      // Clear error message after 5 seconds
      setTimeout(() => {
        setLocationStatus('idle');
        setLocationMessage('');
      }, 5000);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 sticky top-0 bg-white z-10 pb-2 border-b">Edit Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>

          {/* Phone Number with Country Code */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="+91" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 ml-2"
                placeholder="10-digit mobile number"
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          </div>

          {/* Alternate Phone */}
          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
            <div className="flex">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="+91" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.code} {country.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="alternatePhone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="flex-1 ml-2"
                placeholder="Alternate phone number"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              required
              pattern="[0-9]{6}"
              maxLength={6}
            />
          </div>

          {/* Locality */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="locality">Locality/Area/Street</Label>
            <Input
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="Locality, Area, Street"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address (Area and Street)</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House No., Building Name, Street Name"
              required
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City/District/Town</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, state: value }))
              }
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Landmark */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="landmark">Landmark (Optional)</Label>
            <Input
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Nearby landmark for easier navigation"
            />
          </div>
        </div>

        {/* Address Type */}
        <div className="space-y-2">
          <Label>Address Type</Label>
          <RadioGroup
            value={formData.addressType}
            onValueChange={(value: "home" | "work") =>
              setFormData((prev) => ({ ...prev, addressType: value }))
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label htmlFor="home">Home (All day delivery)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="work" id="work" />
              <Label htmlFor="work">Work (Delivery between 10 AM - 5 PM)</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Use Current Location Button */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleUseCurrentLocation}
            disabled={isDetectingLocation}
          >
            {isDetectingLocation ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="mr-2 h-4 w-4" />
            )}
            {isDetectingLocation ? 'Detecting location...' : 'Use my current location'}
          </Button>

          {/* Location status message */}
          {locationMessage && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${locationStatus === 'success'
                ? 'text-green-700 bg-green-50 border border-green-200'
                : locationStatus === 'error'
                  ? 'text-red-700 bg-red-50 border border-red-200'
                  : 'text-blue-700 bg-blue-50 border border-blue-200'
              }`}>
              {locationStatus === 'success' && <CheckCircle className="h-4 w-4" />}
              {locationStatus === 'error' && <AlertCircle className="h-4 w-4" />}
              {locationStatus === 'idle' && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{locationMessage}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-4 sticky bottom-0 bg-white border-t pb-2">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
          >
            Save and Deliver Here
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
