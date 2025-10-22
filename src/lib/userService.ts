import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  mobileNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  private static readonly COLLECTION_NAME = "users";

  /**
   * Check if mobile number is already registered
   */
  static async isMobileNumberUnique(mobileNumber: string): Promise<boolean> {
    try {
      const usersRef = collection(db, this.COLLECTION_NAME);
      const q = query(usersRef, where("mobileNumber", "==", mobileNumber));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking mobile number uniqueness:", error);
      throw new Error("Failed to validate mobile number");
    }
  }

  /**
   * Create user profile in Firestore
   */
  static async createUserProfile(
    user: User, 
    mobileNumber: string
  ): Promise<void> {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        mobileNumber: mobileNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userDocRef = doc(db, this.COLLECTION_NAME, user.uid);
      await setDoc(userDocRef, userProfile);
      
      console.log("✅ User profile created successfully");
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Failed to create user profile");
    }
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, this.COLLECTION_NAME, uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    uid: string, 
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userDocRef = doc(db, this.COLLECTION_NAME, uid);
      await setDoc(userDocRef, {
        ...updates,
        updatedAt: new Date(),
      }, { merge: true });
      
      console.log("✅ User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }

  /**
   * Validate mobile number format
   */
  static validateMobileNumber(mobileNumber: string): {
    isValid: boolean;
    error?: string;
  } {
    // Remove spaces and special characters
    const cleanNumber = mobileNumber.replace(/[\s\-\(\)]/g, "");
    
    // Check if it starts with + and has country code
    if (!cleanNumber.startsWith("+")) {
      return { isValid: false, error: "Mobile number must include country code" };
    }

    // Check length (minimum 10 digits after country code)
    if (cleanNumber.length < 12) {
      return { isValid: false, error: "Mobile number is too short" };
    }

    // Check if it contains only digits after +
    const numberPart = cleanNumber.slice(1);
    if (!/^\d+$/.test(numberPart)) {
      return { isValid: false, error: "Mobile number can only contain digits" };
    }

    // Specific validation for Indian numbers
    if (cleanNumber.startsWith("+91")) {
      const indianNumber = cleanNumber.slice(3);
      if (indianNumber.length !== 10) {
        return { isValid: false, error: "Indian mobile number must be 10 digits" };
      }
      if (!indianNumber.match(/^[6-9]\d{9}$/)) {
        return { isValid: false, error: "Invalid Indian mobile number format" };
      }
    }

    return { isValid: true };
  }
}