import { create } from "zustand";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  initAuth: () => void;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  createUserDocument: (user: User, displayName?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },

  setUser: (user) => set({ user }),

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  createUserDocument: async (user: User, displayName?: string) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          name: displayName || user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error creating user document:", error);
        throw error;
      }
    }
  },
}));
