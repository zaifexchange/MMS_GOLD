import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured. Running in demo mode.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Create a basic user object if profile doesn't exist
        setUser({
          id: userId,
          email: session?.user?.email || '',
          full_name: session?.user?.user_metadata?.full_name || 'User',
          role: 'client',
          kyc_status: 'pending',
          balance: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const register = async (userData: RegisterData) => {
    try {
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Handle referral if provided
        let referredBy = null;
        if (userData.referralCode) {
          const { data: referrer } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', userData.referralCode)
            .single();
          
          if (referrer) {
            referredBy = referrer.id;
          }
        }

        // Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: userData.phone,
            referred_by: referredBy,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          // Don't throw here as the user is already created
        }

        // Create referral relationships if user was referred
        if (referredBy) {
          try {
            await createReferralChain(authData.user.id, referredBy);
          } catch (referralError) {
            console.error('Error creating referral chain:', referralError);
            // Don't throw here as the user is already created
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const createReferralChain = async (newUserId: string, referrerId: string) => {
    const referralRates = [10, 3, 2]; // Level 1: 10%, Level 2: 3%, Level 3: 2%
    let currentReferrer = referrerId;
    
    for (let level = 1; level <= 3 && currentReferrer; level++) {
      try {
        // Create referral record
        await supabase
          .from('referrals')
          .insert({
            referrer_id: currentReferrer,
            referred_id: newUserId,
            level,
            commission_rate: referralRates[level - 1],
          });

        // Get next level referrer
        const { data: nextReferrer } = await supabase
          .from('profiles')
          .select('referred_by')
          .eq('id', currentReferrer)
          .single();

        currentReferrer = nextReferrer?.referred_by;
      } catch (error) {
        console.error(`Error creating referral level ${level}:`, error);
        break; // Stop the chain if there's an error
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Refresh profile data
    await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};