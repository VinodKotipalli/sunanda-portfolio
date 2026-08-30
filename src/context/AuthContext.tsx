import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      let errorMsg = 'Failed to sign in with Google. Please try again.';
      if (error?.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your-domain.vercel.app';
        errorMsg = `Firebase Auth Domain Not Authorized: Please add "${currentDomain}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`;
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in cancelled.';
      } else if (error?.code === 'auth/popup-blocked') {
        errorMsg = 'Pop-up was blocked by your browser. Please allow pop-ups for this site and retry.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      setAuthError(errorMsg);
      return null;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Sign-Out Error:', error);
      setAuthError(error?.message || 'Failed to sign out.');
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
