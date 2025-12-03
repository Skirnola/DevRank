import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check authentication status
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
          setIsGuest(false);
        } else {
          setUser(null);
          setProfile(null);
          checkGuestMode();
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        setIsGuest(false);
      } else {
        setUser(null);
        setProfile(null);
        checkGuestMode();
      }
    } catch (error) {
      console.error('Error checking user:', error);
      checkGuestMode();
    } finally {
      setLoading(false);
    }
  };

  const checkGuestMode = () => {
    // Check if guest data exists (only if user has interacted before)
    const guestData = localStorage.getItem('devrank_guest');
    if (guestData) {
      const guest = JSON.parse(guestData);
      setProfile(guest.profile);
      setIsGuest(true);
    } else {
      // Don't create guest profile yet - wait until user submits something
      setProfile(null);
      setIsGuest(false);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      // First check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        // User doesn't exist, create profile
        const { data: authUser } = await supabase.auth.getUser();
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: authUser.user.email,
            name: authUser.user.user_metadata?.name || authUser.user.email.split('@')[0],
            total_points: 0,
            badge: 'Beginner',
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return;
        }

        // Now fetch stats
        await fetchAndSetProfile(userId, newUser);
      } else {
        await fetchAndSetProfile(userId, userData);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const fetchAndSetProfile = async (userId, userData) => {
    try {
      // Get all completed/accepted submissions
      const { data: submissions, error: subError } = await supabase
        .from('submissions')
        .select('challenge_id, status')
        .eq('user_id', userId)
        .in('status', ['completed', 'accepted']);

      if (subError) {
        console.error('Error fetching submissions:', subError);
      }

      // Get unique completed challenges
      const uniqueChallenges = submissions 
        ? [...new Set(submissions.map(s => s.challenge_id))]
        : [];

      // Fetch challenge details to get points
      let totalPoints = 0;
      if (uniqueChallenges.length > 0) {
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('id, points')
          .in('id', uniqueChallenges);

        if (!challengesError && challengesData) {
          // Sum up all points from completed challenges
          totalPoints = challengesData.reduce((sum, challenge) => sum + (challenge.points || 0), 0);
        }
      }

      // Calculate badge based on total points
      let badge = 'Beginner';
      if (totalPoints >= 200) badge = 'Expert';
      else if (totalPoints >= 100) badge = 'Advanced';
      else if (totalPoints >= 50) badge = 'Intermediate';

      // Update users table with calculated values
      await supabase
        .from('users')
        .update({
          total_points: totalPoints,
          badge: badge,
        })
        .eq('id', userId);

      setProfile({
        ...userData,
        points: totalPoints,
        completed_challenges: uniqueChallenges.length,
        name: userData.name,
        email: userData.email,
        badge: badge,
        created_at: userData.created_at,
      });
    } catch (error) {
      console.error('Error in fetchAndSetProfile:', error);
    }
  };

  const updateGuestProfile = (updates) => {
    const guestData = JSON.parse(localStorage.getItem('devrank_guest'));
    guestData.profile = {
      ...guestData.profile,
      ...updates,
    };
    localStorage.setItem('devrank_guest', JSON.stringify(guestData));
    setProfile(guestData.profile);
  };

  const initializeGuestProfile = () => {
    // Create new guest profile (called when user first submits something)
    const newGuest = {
      profile: {
        name: 'Guest',
        points: 0,
        completed_challenges: 0,
        badge: 'Beginner',
        created_at: new Date().toISOString(),
      }
    };
    localStorage.setItem('devrank_guest', JSON.stringify(newGuest));
    setProfile(newGuest.profile);
    setIsGuest(true);
    return newGuest.profile;
  };

  const refreshProfile = async () => {
    if (user && !isGuest) {
      await fetchProfile(user.id);
    } else if (isGuest) {
      checkGuestMode();
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setUser(data.user);
    await fetchProfile(data.user.id);
    setIsGuest(false);
    
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        name: name,
        total_points: 0,
        badge: 'Beginner',
      });

      setUser(data.user);
      await fetchProfile(data.user.id);
      setIsGuest(false);
    }

    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    checkGuestMode();
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isGuest,
    login,
    register,
    logout,
    updateGuestProfile,
    initializeGuestProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;