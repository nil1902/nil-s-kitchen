import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserService } from "@/lib/userService";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string, mobileNumber: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  checkMobileUnique: (mobileNumber: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function register(email: string, password: string, name: string, mobileNumber: string) {
    // First check if mobile number is unique
    const isUnique = await UserService.isMobileNumberUnique(mobileNumber);
    if (!isUnique) {
      throw new Error("This mobile number is already registered");
    }

    // Validate mobile number format
    const validation = UserService.validateMobileNumber(mobileNumber);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid mobile number");
    }

    // Create Firebase auth user
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with name
    if (result.user) {
      await updateProfile(result.user, { displayName: name });
      
      // Create user profile in Firestore with mobile number
      await UserService.createUserProfile(result.user, mobileNumber);
    }
    
    return result;
  }

  async function checkMobileUnique(mobileNumber: string): Promise<boolean> {
    return await UserService.isMobileNumberUnique(mobileNumber);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserProfile(displayName: string) {
    if (!currentUser) throw new Error("No user logged in");
    return updateProfile(currentUser, { displayName });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    checkMobileUnique,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
