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

const ProfilePage = () => {
  // Mock user data - will be replaced with API calls
  const user = {
    name: "Iqbal Ghifari",
    email: "iqbalghifari@gmail.com",
    joinDate: "November 2025",
    totalPoints: 40,
    completedChallenges: 3,
    badge: "Beginner",
    avatar: "IG",
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-neutral-400 text-lg">
            Your DevRank information and statistics
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 md:p-8 mb-6 hover:border-purple-400/50 transition-all">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-4 ring-purple-500/20 shadow-2xl shadow-purple-500/50">
                <span className="text-4xl font-bold text-white">
                  {user.avatar}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-neutral-950 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3">{user.name}</h2>
              <div
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${getBadgeColor(
                  user.badge
                )} shadow-lg mb-6`}
              >
                <span className="text-lg">{getBadgeIcon(user.badge)}</span>
                <span>{user.badge}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 hover:border-neutral-700/50 transition-colors">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Email</p>
                    <p className="font-medium text-sm text-neutral-200 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 hover:border-neutral-700/50 transition-colors">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Joined</p>
                    <p className="font-medium text-sm text-neutral-200">
                      {user.joinDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 hover:border-neutral-700/50 transition-colors">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Code className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Solved</p>
                    <p className="font-medium text-sm text-neutral-200">
                      {user.completedChallenges} challenges
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-6 hover:border-opacity-50 transition-all hover:scale-105`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 ${stat.iconBg} rounded-xl`}>
                  <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link
            to="/challenges"
            className="group bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-1">
                  Browse Challenges
                </h3>
                <p className="text-sm text-neutral-400">
                  Solve new coding problems
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/history"
            className="group bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-emerald-500/50 rounded-2xl p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">
                  View History
                </h3>
                <p className="text-sm text-neutral-400">Check your progress</p>
              </div>
            </div>
          </Link>
        </div>

        {/* About DevRank Card */}
        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Info className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold">About DevRank</h2>
          </div>

          <div className="space-y-4 text-neutral-300 leading-relaxed mb-8">
            <p>
              DevRank is a Progressive Web App designed to help developers
              improve their programming fundamentals through gamified coding
              challenges.
            </p>
            <p>
              Solve challenges across three difficulty levels, earn points based
              on complexity, and watch your skills grow as you climb through the
              ranks!
            </p>
          </div>

          {/* Difficulty Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-neutral-800/50">
            <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                Easy
              </div>
              <div className="text-sm text-neutral-400">10 points each</div>
            </div>
            <div className="text-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="text-3xl font-bold text-amber-400 mb-2">
                Medium
              </div>
              <div className="text-sm text-neutral-400">20 points each</div>
            </div>
            <div className="text-center p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <div className="text-3xl font-bold text-rose-400 mb-2">Hard</div>
              <div className="text-sm text-neutral-400">30 points each</div>
            </div>
          </div>

          {/* Badge System */}
          <div className="mt-8 pt-6 border-t border-neutral-800/50">
            <h3 className="text-lg font-semibold mb-4 text-neutral-200">
              Badge System
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-semibold text-emerald-400">
                  Beginner
                </div>
                <div className="text-xs text-neutral-500 mt-1">0-49 pts</div>
              </div>
              <div className="text-center p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-blue-400">
                  Intermediate
                </div>
                <div className="text-xs text-neutral-500 mt-1">50-99 pts</div>
              </div>
              <div className="text-center p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm font-semibold text-purple-400">
                  Advanced
                </div>
                <div className="text-xs text-neutral-500 mt-1">100-199 pts</div>
              </div>
              <div className="text-center p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-semibold text-pink-400">
                  Expert
                </div>
                <div className="text-xs text-neutral-500 mt-1">200+ pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
