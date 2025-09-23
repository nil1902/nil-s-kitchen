import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService, UserProfile as UserProfileType } from "@/lib/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar } from "lucide-react";

const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await UserService.getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Profile information not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-500" />
          <div>
            <p className="font-medium">{userProfile.displayName}</p>
            <p className="text-sm text-gray-500">Full Name</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-500" />
          <div>
            <p className="font-medium">{userProfile.email}</p>
            <p className="text-sm text-gray-500">Email Address</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-500" />
          <div>
            <p className="font-medium">{userProfile.mobileNumber}</p>
            <p className="text-sm text-gray-500">Mobile Number</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div>
            <p className="font-medium">
              {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">Member Since</p>
          </div>
        </div>
        
        <div className="pt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ✓ Verified Account
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;