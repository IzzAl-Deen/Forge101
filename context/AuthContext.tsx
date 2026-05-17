import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

import authApi, { UserProfile } from "@/api/authApi";
import { disableBiometrics } from "@/hooks/use-biometric-auth";
import { supabase } from "@/lib/supabase";

const PROFILE_CACHE_KEY = "forge_profile";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchingProfile = useRef(false);

  const loadCachedProfile = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const fetchProfile = useCallback(async () => {
    if (fetchingProfile.current) return;
    fetchingProfile.current = true;
    try {
      const data = await authApi.getProfile();
      setProfile(data);
      await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data));
    } catch {
    } finally {
      fetchingProfile.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      await loadCachedProfile();

      const {
        data: { session: initial },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(initial);
        setUser(initial?.user ?? null);
        setIsLoading(false);
        if (initial) fetchProfile();
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      setSession(next);
      setUser(next?.user ?? null);
      if (next) {
        fetchProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadCachedProfile, fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return error?.message ?? null;
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<string | null> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      return error?.message ?? null;
    },
    [],
  );

  const signOut = useCallback(async () => {
    await disableBiometrics();
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, profile, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
