import api from './api';

export const submissionService = {
  // Get user's submission history
  getUserSubmissions: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      
      const query = queryParams.toString();
      return await api.get(`/submissions${query ? '?' + query : ''}`);
    } catch (error) {
      console.error('Get user submissions error:', error);
      throw error;
    }
  },

  // Get submissions for a specific challenge
  getChallengeSubmissions: async (challengeId) => {
    try {
      return await api.get(`/submissions/challenge/${challengeId}`);
    } catch (error) {
      console.error('Get challenge submissions error:', error);
      throw error;
    }
  },

  // Get a specific submission by ID
  getSubmissionById: async (submissionId) => {
    try {
      return await api.get(`/submissions/${submissionId}`);
    } catch (error) {
      console.error('Get submission by ID error:', error);
      throw error;
    }
  },

  // Get user's total points
  getUserPoints: async () => {
    try {
      return await api.get('/submissions/points');
    } catch (error) {
      console.error('Get user points error:', error);
      throw error;
    }
  },

  // Get user's rank/badge
  getUserRank: async () => {
    try {
      return await api.get('/submissions/rank');
    } catch (error) {
      console.error('Get user rank error:', error);
      throw error;
    }
  },

  // Get user's statistics
  getUserStats: async () => {
    try {
      return await api.get('/submissions/stats');
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      if (params.timeframe) queryParams.append('timeframe', params.timeframe); // 'daily', 'weekly', 'monthly', 'all-time'
      
      const query = queryParams.toString();
      return await api.get(`/submissions/leaderboard${query ? '?' + query : ''}`);
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  },

  // Get submission streak
  getUserStreak: async () => {
    try {
      return await api.get('/submissions/streak');
    } catch (error) {
      console.error('Get user streak error:', error);
      throw error;
    }
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    try {
      return await api.get(`/submissions/recent?limit=${limit}`);
    } catch (error) {
      console.error('Get recent activity error:', error);
      throw error;
    }
  },

  // Get submissions by date range
  getSubmissionsByDateRange: async (startDate, endDate) => {
    try {
      return await api.get(`/submissions/range?start=${startDate}&end=${endDate}`);
    } catch (error) {
      console.error('Get submissions by date range error:', error);
      throw error;
    }
  },

  // Delete a submission (if allowed)
  deleteSubmission: async (submissionId) => {
    try {
      return await api.delete(`/submissions/${submissionId}`);
    } catch (error) {
      console.error('Delete submission error:', error);
      throw error;
    }
  },

  // Get completion percentage by difficulty
  getCompletionStats: async () => {
    try {
      return await api.get('/submissions/completion');
    } catch (error) {
      console.error('Get completion stats error:', error);
      throw error;
    }
  },

  // Get category-wise progress
  getCategoryProgress: async () => {
    try {
      return await api.get('/submissions/categories');
    } catch (error) {
      console.error('Get category progress error:', error);
      throw error;
    }
  },
};

export default submissionService;