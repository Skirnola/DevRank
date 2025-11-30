import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for existing session
    checkUser();
    
    // Listen for auth changes (but don't override guest mode)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only respond to auth changes if NOT in guest mode
      const guestData = localStorage.getItem('devrank_guest');
      if (!guestData) {
        if (session?.user) {
          setUser(session.user);
          setIsGuest(false);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setIsGuest(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      
      // Check for guest mode FIRST
      const guestData = localStorage.getItem('devrank_guest');
      if (guestData) {
        const guest = JSON.parse(guestData);
        setUser(guest);
        setProfile(guest.profile);
        setIsGuest(true);
        setLoading(false);
        console.log('✅ Guest session restored:', guest);
        return;
      }

      // Check for real Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsGuest(false);
        await fetchUserProfile(session.user.id);
        console.log('✅ Supabase session restored');
      } else {
        console.log('❌ No session found');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      email: 'guest@local',
      profile: {
        name: 'Guest User',
        points: 0,
        badge: 'Beginner',
        completed_challenges: 0,
        created_at: new Date().toISOString()
      }
    };

    localStorage.setItem('devrank_guest', JSON.stringify(guestUser));
    setUser(guestUser);
    setProfile(guestUser.profile);
    setIsGuest(true);
    
    console.log('✅ Guest login successful:', guestUser);

    return { success: true, isGuest: true };
  };

  const login = async (email, password) => {
    // If offline, suggest guest mode
    if (isOffline) {
      return { 
        success: false, 
        error: 'You are offline. Please try Guest Mode or connect to the internet.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Clear any guest data when logging in with real account
      localStorage.removeItem('devrank_guest');
      
      setUser(data.user);
      setIsGuest(false);
      await fetchUserProfile(data.user.id);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message === 'Invalid login credentials' 
          ? 'Invalid email or password' 
          : error.message 
      };
    }
  };

  const register = async (name, email, password) => {
    // If offline, suggest guest mode
    if (isOffline) {
      return { 
        success: false, 
        error: 'You are offline. Please try Guest Mode or connect to the internet.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { 
          success: true, 
          message: 'Please check your email to confirm your account' 
        };
      }

      // Clear any guest data when registering real account
      localStorage.removeItem('devrank_guest');
      
      setUser(data.user);
      setIsGuest(false);
      await fetchUserProfile(data.user.id);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message === 'User already registered' 
          ? 'This email is already registered' 
          : error.message 
      };
    }
  };

  const logout = async () => {
    try {
      if (isGuest) {
        // Clear guest data
        localStorage.removeItem('devrank_guest');
        setUser(null);
        setProfile(null);
        setIsGuest(false);
        console.log('✅ Guest logout successful');
      } else {
        // Real logout
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setIsGuest(false);
        console.log('✅ Supabase logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateGuestProfile = (updates) => {
    if (!isGuest) {
      console.warn('⚠️ Cannot update profile: not in guest mode');
      return;
    }

    const guestData = JSON.parse(localStorage.getItem('devrank_guest'));
    guestData.profile = { ...guestData.profile, ...updates };
    
    localStorage.setItem('devrank_guest', JSON.stringify(guestData));
    setProfile(guestData.profile);
    
    console.log('✅ Guest profile updated:', guestData.profile);
  };

  const value = {
    user,
    profile,
    login,
    register,
    logout,
    loginAsGuest,
    updateGuestProfile,
    loading,
    isAuthenticated: !!user,
    isGuest,
    isOffline
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};