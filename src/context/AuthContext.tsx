import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { GMAIL_SCOPES, setAccessTokenInMemory } from '../lib/gmail';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  isGmailConnected: boolean;
  signInWithGoogle: () => Promise<{ user: User; accessToken: string } | null>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setAccessToken(null);
        setAccessTokenInMemory(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      GMAIL_SCOPES.forEach((scope) => {
        provider.addScope(scope);
      });
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;

      setUser(result.user);
      if (token) {
        setAccessToken(token);
        setAccessTokenInMemory(token);
      }
      return { user: result.user, accessToken: token || '' };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      let errorMsg = 'Failed to sign in with Google. Please try again.';
      if (error?.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'your-domain.vercel.app';
        errorMsg = `Firebase Auth Domain Not Authorized: Please add "${currentDomain}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`;
      } else if (error?.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in cancelled. Please complete Google authentication.';
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
      setAccessToken(null);
      setAccessTokenInMemory(null);
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
        accessToken,
        isGmailConnected: Boolean(user && accessToken),
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
