import {
  Trophy,
  CheckCircle,
  Calendar,
  Award,
  TrendingUp,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";

const TaskHistoryPage = () => {
  // Mock data - will be replaced with API calls
  const completedTasks = [
    {
      id: 1,
      title: "Two Sum Problem",
      difficulty: "Easy",
      points: 10,
      date: "2025-11-20",
      category: "Arrays",
    },
    {
      id: 3,
      title: "Binary Search",
      difficulty: "Medium",
      points: 20,
      date: "2025-11-22",
      category: "Algorithms",
    },
    {
      id: 7,
      title: "Count Vowels",
      difficulty: "Easy",
      points: 10,
      date: "2025-11-23",
      category: "Strings",
    },
  ];

  const totalPoints = completedTasks.reduce(
    (sum, task) => sum + task.points,
    0
  );

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Your Badge</p>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${badge.color} mt-1`}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              </div>
            </div>

            {/* Progress to Next Badge */}
            {badge.nextLevel && (
              <div className="mt-4">
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

          {/* Total Points */}
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Total Points</p>
                <p className="text-4xl font-bold text-white">{totalPoints}</p>
              </div>
            </div>
          </div>

          {/* Completed Challenges */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Completed</p>
                <p className="text-4xl font-bold text-white">
                  {completedTasks.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Challenges List */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Completed Challenges</h2>
          </div>

          {completedTasks.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-12 text-center">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-neutral-400 text-lg mb-2">
                No completed challenges yet
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
              {completedTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/challenge/${task.id}`}
                  className="group bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-medium">
                            Completed
                          </span>
                        </div>
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
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">
                            +{task.points} pts
                          </span>
                        </div>
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
