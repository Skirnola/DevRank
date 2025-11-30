import { useState, useEffect } from "react";
import {
  Trophy,
  CheckCircle,
  Calendar,
  Award,
  TrendingUp,
  Code2,
  Clock,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const TaskHistoryPage = () => {
  const { user, profile, isAuthenticated, isGuest } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      if (isGuest) {
        // Get submissions from localStorage for guest
        const guestSubmissions = JSON.parse(
          localStorage.getItem('devrank_guest_submissions') || '[]'
        );
        setSubmissions(guestSubmissions);
      } else {
        // Get submissions from Supabase for real users
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (submissionsError) throw submissionsError;

        // Get all unique challenge IDs
        const challengeIds = [...new Set(submissionsData.map(sub => sub.challenge_id))];
        
        // Fetch challenge details separately
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('*')
          .in('id', challengeIds);

        if (challengesError) {
          console.error('Error fetching challenges:', challengesError);
        }

        // Create a map of challenges by ID
        const challengesMap = {};
        (challengesData || []).forEach(challenge => {
          challengesMap[challenge.id] = challenge;
        });

        // Transform data to match our format
        const formattedSubmissions = submissionsData.map(sub => {
          const challenge = challengesMap[sub.challenge_id];
          return {
            id: sub.id,
            challenge_id: sub.challenge_id,
            title: challenge?.title || `Challenge #${sub.challenge_id}`,
            difficulty: challenge?.difficulty || 'Easy',
            points: sub.points_earned || challenge?.points || 0, // Use points_earned or fallback to challenge points
            date: sub.submitted_at || sub.created_at, // Use submitted_at if available
            category: challenge?.category || 'General',
            status: sub.status || 'completed',
          };
        });

        setSubmissions(formattedSubmissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user stats from Supabase profile
  const totalPoints = profile?.points || 0;
  const completedChallenges = profile?.completed_challenges || 0;

  // Count ongoing vs completed
  const ongoingCount = submissions.filter(s => s.status === 'ongoing').length;
  const completedCount = submissions.filter(s => s.status === 'completed').length;

  // Badge calculation based on points
  const getBadge = (points) => {
    if (points >= 200)
      return {
        name: "Expert",
        color: "from-purple-500 to-pink-500",
        icon: "🏆",
        nextLevel: null,
        progress: 100,
      };
    if (points >= 100)
      return {
        name: "Advanced",
        color: "from-blue-500 to-purple-500",
        icon: "⭐",
        nextLevel: 200,
        progress: ((points - 100) / 100) * 100,
      };
    if (points >= 50)
      return {
        name: "Intermediate",
        color: "from-emerald-500 to-blue-500",
        icon: "🎯",
        nextLevel: 100,
        progress: ((points - 50) / 50) * 100,
      };
    return {
      name: "Beginner",
      color: "from-emerald-500 to-green-500",
      icon: "🌱",
      nextLevel: 50,
      progress: (points / 50) * 100,
    };
  };

  const badge = getBadge(totalPoints);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">
            Completed
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium">
            Ongoing
          </span>
        </div>
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          <p className="text-neutral-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-neutral-400 mb-6">
            Please login to view your task history and track your progress.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all hover:scale-105"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-32">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Task History
          </h1>
          <p className="text-neutral-400 text-lg">
            Track your progress and achievements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Badge Display */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-500/20 rounded-xl mb-3">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm text-neutral-400 mb-2">Your Badge</p>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${badge.color}`}
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>

              {/* Progress to Next Badge */}
              {badge.nextLevel && (
                <div className="mt-4 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500">Next Badge</span>
                    <span className="text-xs text-purple-400 font-semibold">
                      {totalPoints} / {badge.nextLevel} pts
                    </span>
                  </div>
                  <div className="bg-neutral-800/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${badge.color} transition-all duration-500`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Total Points */}
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/50 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-pink-500/20 rounded-xl mb-3">
                <Trophy className="w-6 h-6 text-pink-400" />
              </div>
              <p className="text-sm text-neutral-400 mb-2">Total Points</p>
              <p className="text-4xl font-bold text-white">{totalPoints}</p>
            </div>
          </div>

          {/* Completed Challenges */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-emerald-500/20 rounded-xl mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-neutral-400 mb-2">Completed</p>
              <p className="text-4xl font-bold text-white">
                {completedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Your Challenges</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-12 text-center">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Code2 className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-neutral-400 text-lg mb-2">
                No challenges attempted yet
              </p>
              <p className="text-neutral-500 text-sm mb-6">
                Start solving challenges to track your progress!
              </p>
              <Link
                to="/challenges"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all hover:scale-105"
              >
                <Code2 className="w-5 h-5" />
                Browse Challenges
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map((task) => (
                <Link
                  key={task.id}
                  to={`/challenge/${task.challenge_id}`}
                  className="group bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {task.title}
                        </h3>
                        {getStatusBadge(task.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                            task.difficulty
                          )}`}
                        >
                          {task.difficulty}
                        </span>
                        <span className="text-neutral-500">
                          Category:{" "}
                          <span className="text-purple-400 font-medium">
                            {task.category}
                          </span>
                        </span>
                        {task.status === 'completed' && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">
                              +{task.points} pts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(task.date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryPage;