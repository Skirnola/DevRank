import { supabase } from "../lib/supabase";

export const challengeService = {
  // Get all challenges
  getAllChallenges: async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get all challenges error:", error);
      throw error;
    }
  },

  // Get challenges by difficulty
  getChallengesByDifficulty: async (difficulty) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("difficulty", difficulty)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get challenges by difficulty error:", error);
      throw error;
    }
  },

  // Get single challenge by ID
  getChallengeById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get challenge by ID error:", error);
      throw error;
    }
  },

  // Get challenges by category
  getChallengesByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get challenges by category error:", error);
      throw error;
    }
  },

  // Search challenges
  searchChallenges: async (query) => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .or(
          `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Search challenges error:", error);
      throw error;
    }
  },

  // Submit solution
  submitSolution: async (challengeId, solution, userId) => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .upsert(
          {
            user_id: userId,
            challenge_id: challengeId,
            solution: solution,
            status: "accepted", // In production, run tests first
            submitted_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,challenge_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Submit solution error:", error);
      throw error;
    }
  },

  // Get challenge with user's submission status
  getChallengeWithStatus: async (challengeId, userId) => {
    try {
      // Get challenge
      const { data: challenge, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

      if (challengeError) throw challengeError;

      // Get user's submission
      const { data: submission } = await supabase
        .from("submissions")
        .select("*")
        .eq("challenge_id", challengeId)
        .eq("user_id", userId)
        .maybeSingle();

      return {
        ...challenge,
        completed: submission?.status === "accepted",
        submission: submission || null,
      };
    } catch (error) {
      console.error("Get challenge with status error:", error);
      throw error;
    }
  },

  // Run test cases (placeholder - implement with code execution service)
  runTestCases: async (challengeId, solution) => {
    try {
      // TODO: Implement actual code execution and testing
      // For now, return mock result
      return {
        success: true,
        passed: 3,
        total: 3,
        message: "All tests passed!",
      };
    } catch (error) {
      console.error("Run test cases error:", error);
      throw error;
    }
  },

  // Get challenge statistics
  getChallengeStats: async (challengeId) => {
    try {
      const { count, error } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("challenge_id", challengeId)
        .eq("status", "accepted");

      if (error) throw error;
      return { completions: count || 0 };
    } catch (error) {
      console.error("Get challenge stats error:", error);
      throw error;
    }
  },

  // Toggle like (placeholder)
  toggleLike: async (challengeId) => {
    try {
      // TODO: Implement likes table
      return { liked: true };
    } catch (error) {
      console.error("Toggle like error:", error);
      throw error;
    }
  },

  // Get user's progress on a challenge
  getChallengeProgress: async (challengeId) => {
    try {
      // TODO: Implement progress tracking
      return { progress: 0 };
    } catch (error) {
      console.error("Get challenge progress error:", error);
      throw error;
    }
  },

  // Get featured challenges (most recent 5)
  getFeaturedChallenges: async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get featured challenges error:", error);
      throw error;
    }
  },

  // Get popular challenges (most completed)
  getPopularChallenges: async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select(
          `
          *,
          submissions!inner(id)
        `
        )
        .limit(5);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Get popular challenges error:", error);
      throw error;
    }
  },
};

export default challengeService;
