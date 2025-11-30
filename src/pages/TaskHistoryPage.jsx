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
        const guestSubmissions = JSON.parse(
          localStorage.getItem("devrank_guest_submissions") || "[]"
        );
        setSubmissions(guestSubmissions);
      } else {
        const { data: submissionsData } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        const challengeIds = [
          ...new Set(submissionsData.map((sub) => sub.challenge_id)),
        ];

        const { data: challengesData } = await supabase
          .from("challenges")
          .select("*")
          .in("id", challengeIds);

        const challengesMap = {};
        (challengesData || []).forEach((challenge) => {
          challengesMap[challenge.id] = challenge;
        });

        const formatted = submissionsData.map((sub) => {
          const c = challengesMap[sub.challenge_id];
          return {
            id: sub.id,
            challenge_id: sub.challenge_id,
            title: c?.title || `Challenge #${sub.challenge_id}`,
            difficulty: c?.difficulty || "Easy",
            points: sub.points_earned || c?.points || 0,
            date: sub.submitted_at || sub.created_at,
            category: c?.category || "General",
            status: sub.status || "completed",
          };
        });

        setSubmissions(formatted);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = profile?.points || 0;
  const completedCount = submissions.filter((s) => s.status === "completed")
    .length;

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

  const getDifficultyColor = (d) => {
    switch (d) {
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
    if (status === "completed") {
      return (
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
          <span className="text-[10px] sm:text-xs text-emerald-400">
            Completed
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
        <span className="text-[10px] sm:text-xs text-amber-400">Ongoing</span>
      </div>
    );
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-spin" />
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-sm">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-6">
            Please login to view your history.
          </p>
          <Link
            to="/login"
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold text-sm sm:text-base"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Task History
          </h1>
          <p className="text-neutral-400 text-sm sm:text-lg">
            Track your progress & achievements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-8">
          
          {/* Badge */}
          <div className="bg-neutral-900/60 border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-center flex flex-col items-center">
              <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl mb-2 sm:mb-3">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mb-1 sm:mb-2">
                Your Badge
              </p>

              <div
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-base font-bold bg-gradient-to-r ${badge.color}`}
              >
                {badge.icon} {badge.name}
              </div>

              {badge.nextLevel && (
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-xs text-neutral-500">
                      Next Badge
                    </span>
                    <span className="text-[10px] sm:text-xs text-purple-400 font-semibold">
                      {totalPoints}/{badge.nextLevel}
                    </span>
                  </div>

                  <div className="bg-neutral-800/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${badge.color}`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Total Points */}
          <div className="bg-neutral-900/60 border border-pink-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-center flex flex-col items-center">
              <div className="p-2 sm:p-3 bg-pink-500/20 rounded-xl mb-2 sm:mb-3">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mb-1">
                Total Points
              </p>
              <p className="text-2xl sm:text-4xl font-bold">{totalPoints}</p>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-neutral-900/60 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="text-center flex flex-col items-center">
              <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-xl mb-2 sm:mb-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mb-1">
                Completed
              </p>
              <p className="text-2xl sm:text-4xl font-bold">{completedCount}</p>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold">Your Challenges</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-neutral-900/60 border border-neutral-800/50 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
              <div className="p-3 sm:p-4 bg-purple-500/10 border border-purple-500/30 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
              </div>
              <p className="text-neutral-400 text-base sm:text-lg mb-1">
                No submissions yet
              </p>
              <p className="text-neutral-500 text-xs sm:text-sm mb-4 sm:mb-6">
                Solve challenges to see them here
              </p>
              <Link
                to="/challenges"
                className="px-5 py-3 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white"
              >
                Browse Challenges
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {submissions.map((task) => (
                <Link
                  key={task.id}
                  to={`/challenge/${task.challenge_id}`}
                  className="group bg-neutral-900/60 border border-neutral-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    
                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-xl font-semibold group-hover:text-purple-400">
                          {task.title}
                        </h3>
                        {getStatusBadge(task.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        
                        <span
                          className={`px-2 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs rounded-full border ${getDifficultyColor(
                            task.difficulty
                          )}`}
                        >
                          {task.difficulty}
                        </span>

                        <span className="text-neutral-500 text-[10px] sm:text-sm">
                          Category:{" "}
                          <span className="text-purple-400 font-medium">
                            {task.category}
                          </span>
                        </span>

                        {task.status === "completed" && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                            <span className="text-[10px] sm:text-sm text-emerald-400 font-semibold">
                              +{task.points} pts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 sm:gap-2 text-neutral-400 text-[10px] sm:text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
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
