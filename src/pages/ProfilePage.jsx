import {
  User,
  Mail,
  Calendar,
  Code,
  Trophy,
  Target,
  Award,
  Info,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user: authUser, profile } = useAuth();

  const user = {
    name: profile?.name || "User",
    email: authUser?.email || "Not logged in",
    joinDate: profile?.created_at
      ? new Date(profile.created_at).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Recently",
    totalPoints: profile?.points || 0,
    completedChallenges: profile?.completed_challenges || 0,
    badge: profile?.badge || "Beginner",
    avatar: profile?.name
      ? profile.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U",
  };

  const stats = [
    {
      label: "Total Points",
      value: user.totalPoints,
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Completed Challenges",
      value: user.completedChallenges,
      icon: Target,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Current Rank",
      value: user.badge,
      icon: Award,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      iconBg: "bg-pink-500/20",
      iconColor: "text-pink-400",
    },
  ];

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "Expert":
        return "🏆";
      case "Advanced":
        return "⭐";
      case "Intermediate":
        return "🎯";
      default:
        return "🌱";
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Expert":
        return "from-purple-500 to-pink-500";
      case "Advanced":
        return "from-blue-500 to-purple-500";
      case "Intermediate":
        return "from-emerald-500 to-blue-500";
      default:
        return "from-emerald-500 to-green-500";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-neutral-400 text-sm md:text-lg">
            Your DevRank information and statistics
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 md:p-8 mb-6 hover:border-purple-400/50 transition-all">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-4 ring-purple-500/20 shadow-2xl shadow-purple-500/50">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {user.avatar}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-neutral-950 shadow-lg">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">
                {user.name}
              </h2>

              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-xl font-bold text-white bg-gradient-to-r ${getBadgeColor(
                  user.badge
                )} shadow-lg mb-4 md:mb-6 text-sm md:text-base`}
              >
                <span>{getBadgeIcon(user.badge)}</span>
                <span>{user.badge}</span>
              </div>

              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* Email */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-3 hover:border-neutral-700/50 transition-colors">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 mb-0.5">Email</p>
                    <p className="font-medium text-xs md:text-sm text-neutral-200 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-3 hover:border-neutral-700/50 transition-colors">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 mb-0.5">Joined</p>
                    <p className="font-medium text-xs md:text-sm text-neutral-200">
                      {user.joinDate}
                    </p>
                  </div>
                </div>

                {/* Solved */}
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-3 hover:border-neutral-700/50 transition-colors">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Code className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 mb-0.5">Solved</p>
                    <p className="font-medium text-xs md:text-sm text-neutral-200">
                      {user.completedChallenges} challenges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-4 md:p-6 hover:border-opacity-50 transition-all`}
            >
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className={`p-3 md:p-4 ${stat.iconBg} rounded-xl`}>
                  <stat.icon
                    className={`w-6 h-6 md:w-8 md:h-8 ${stat.iconColor}`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-neutral-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <Link
            to="/challenges"
            className="group bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-2xl p-4 md:p-6 transition-all hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-1">
                  Browse Challenges
                </h3>
                <p className="text-xs md:text-sm text-neutral-400">
                  Solve new coding problems
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/history"
            className="group bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-emerald-500/50 rounded-2xl p-4 md:p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
                  View History
                </h3>
                <p className="text-xs md:text-sm text-neutral-400">
                  Check your progress
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* About DevRank */}
        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-4 md:p-8">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-purple-500/20 rounded-xl">
              <Info className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">About DevRank</h2>
          </div>

          <div className="space-y-3 md:space-y-4 text-neutral-300 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
            <p>
              DevRank is a Progressive Web App designed to help developers
              improve their programming fundamentals through gamified coding
              challenges.
            </p>
            <p>
              Solve challenges across three difficulty levels, earn points based
              on complexity, and climb through the ranks as your skills grow.
            </p>
          </div>

          {/* Difficulty Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-neutral-800/50">
            <div className="text-center p-3 md:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1 md:mb-2">
                Easy
              </div>
              <div className="text-xs md:text-sm text-neutral-400">
                10 points each
              </div>
            </div>
            <div className="text-center p-3 md:p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1 md:mb-2">
                Medium
              </div>
              <div className="text-xs md:text-sm text-neutral-400">
                20 points each
              </div>
            </div>
            <div className="text-center p-3 md:p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <div className="text-2xl md:text-3xl font-bold text-rose-400 mb-1 md:mb-2">
                Hard
              </div>
              <div className="text-xs md:text-sm text-neutral-400">
                30 points each
              </div>
            </div>
          </div>

          {/* Badge System */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-neutral-800/50">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-neutral-200">
              Badge System
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { emoji: "🌱", label: "Beginner", color: "text-emerald-400", pts: "0-49 pts" },
                { emoji: "🎯", label: "Intermediate", color: "text-blue-400", pts: "50-99 pts" },
                { emoji: "⭐", label: "Advanced", color: "text-purple-400", pts: "100-199 pts" },
                { emoji: "🏆", label: "Expert", color: "text-pink-400", pts: "200+ pts" },
              ].map((b, i) => (
                <div
                  key={i}
                  className="text-center p-3 md:p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl"
                >
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2">{b.emoji}</div>
                  <div className={`text-xs md:text-sm font-semibold ${b.color}`}>
                    {b.label}
                  </div>
                  <div className="text-[10px] md:text-xs text-neutral-500 mt-1">
                    {b.pts}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
