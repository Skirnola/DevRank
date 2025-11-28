import { useState, useEffect } from "react";
import {
  Code2,
  Trophy,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import challengeService from "../services/challengeService";
import { MovingBorder } from "../components/ui/moving-border";
import { TypewriterEffect } from "../components/ui/typewriter-effect";

const HomePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 40,
    completedChallenges: 2,
    badge: "Intermediate",
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await challengeService.getAllChallenges();
      setChallenges(data || []);

      const completed = data?.filter((c) => c.id === 1 || c.id === 3) || [];
      setUserStats({
        totalPoints: completed.length * 20,
        completedChallenges: completed.length,
        badge: completed.length >= 2 ? "Intermediate" : "Beginner",
      });
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setError("Failed to load challenges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const isCompleted = (challengeId) => {
    return challengeId === 1 || challengeId === 3;
  };

  const scrollToChallenges = () => {
    document.getElementById("challenges-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Featured challenge selections
  const featuredEasy = challenges.find((c) => c.difficulty === "Easy");
  const featuredMedium = challenges.find((c) => c.difficulty === "Medium");
  const featuredHard = challenges.find((c) => c.difficulty === "Hard");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/codingbackground.jpg"
            alt="Coding Background"
            className="w-full h-full object-cover"
          />
          {/* Diagonal Dark Overlay - Mirrored: bottom-left to top-right (-45 degrees) */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-950/95 to-transparent"
            style={{
              clipPath: "polygon(0 0, 0 100%, 40% 100%, 60% 0)",
            }}
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
        </div>

        {/* Hero Content - Far Left */}
        <div className="relative z-10 pl-8 md:pl-16 lg:pl-24 pr-6 w-full">
          <div className="max-w-2xl mb-24">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full mb-8 animate-fade-in">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-lg text-purple-300 font-medium">
                Level Up Your Coding Skills
              </span>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-fade-in leading-tight">
              DevRank
            </h1>

            <div className="max-w-[620px]">
              <TypewriterEffect
                words={[
                  { text: "Solve\u00A0", className: "text-white" },
                  { text: "challenges,\u00A0", className: "text-purple-300" },
                  { text: "earn\u00A0", className: "text-white" },
                  { text: "points,\u00A0", className: "text-purple-300" },
                  { text: "and\u00A0", className: "text-white" },
                  { text: "climb\u00A0", className: "text-purple-300" },
                  { text: "the\u00A0", className: "text-white" },
                  { text: "ranks.\u00A0", className: "text-purple-300" },
                ]}
                className="text-base md:text-lg lg:text-4xl font-light mb-12 whitespace-nowrap"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in max-w-2xl">
              <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <Code2 className="w-10 h-10 text-purple-400 mb-3" />
                  <div className="text-4xl font-bold text-white">
                    {challenges.length}
                  </div>
                  <div className="text-sm text-neutral-300 mt-1">
                    Total Challenges
                  </div>
                </div>
              </div>

              <div className="bg-pink-500/10 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/50 transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <Trophy className="w-10 h-10 text-pink-400 mb-3" />
                  <div className="text-4xl font-bold text-white">
                    {userStats.totalPoints}
                  </div>
                  <div className="text-sm text-neutral-300 mt-1">
                    Your Points
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <Zap className="w-10 h-10 text-purple-400 mb-3" />
                  <div className="text-4xl font-bold text-white">
                    {userStats.badge}
                  </div>
                  <div className="text-sm text-neutral-300 mt-1">
                    Current Badge
                  </div>
                </div>
              </div>
            </div>

            {/* Start Coding Button */}
            <MovingBorder
              borderRadius="9999px"
              containerClassName="inline-block rounded-full transition-transform duration-300 hover:scale-105"
              className="animate-border-moving"
            >
              <button
                onClick={scrollToChallenges}
                className="px-8 py-4 bg-neutral-950 rounded-full text-white font-semibold text-lg flex items-center gap-2 cursor-pointer
               transition-all duration-300 hover:bg-neutral-900 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] "
              >
                Start Coding
                <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1 " />
              </button>
            </MovingBorder>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </div>

      {/* Featured Challenge Sections */}
      <div className="bg-neutral-950 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* EASY SECTION — Text Left, Card Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* TEXT LEFT */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                Easy Challenges
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Warm up your brain with beginner-friendly problems.
              </p>
            </div>

            {/* CARD RIGHT */}
            {featuredEasy && (
              <Link
                to={`/challenge/${featuredEasy.id}`}
                className="group bg-neutral-900/60 rounded-2xl border border-neutral-800/50 p-8 
                 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/20 
                 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-emerald-400 transition">
                  {featuredEasy.title}
                </h3>
                <p className="text-neutral-400">{featuredEasy.description}</p>
              </Link>
            )}
          </div>

          {/* MEDIUM SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* CARD LEFT */}
            {featuredMedium && (
              <Link
                to={`/challenge/${featuredMedium.id}`}
                className="group bg-neutral-900/60 rounded-2xl border border-neutral-800/50 p-8 
                 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/20 
                 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-amber-400 transition">
                  {featuredMedium.title}
                </h3>
                <p className="text-neutral-400">{featuredMedium.description}</p>
              </Link>
            )}

            {/* TEXT RIGHT */}
            <div className="space-y-4 text-right md:text-left">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
                Medium Challenges
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Balanced difficulty for sharpening your skills.
              </p>
            </div>
          </div>

          {/* HARD SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
            {/* LEFT TEXT */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 text-transparent bg-clip-text">
                Hard Challenges
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                For coders seeking serious mental workout.
              </p>
            </div>

            {/* CENTER CARD */}
            {featuredHard && (
              <Link
                to={`/challenge/${featuredHard.id}`}
                className="group bg-neutral-900/60 rounded-2xl border border-neutral-800/50 p-10 
                 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/20 
                 transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-rose-400 transition">
                  {featuredHard.title}
                </h3>
                <p className="text-neutral-400">{featuredHard.description}</p>
              </Link>
            )}

            {/* RIGHT TEXT */}
            <div className="space-y-4 hidden md:block">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 text-transparent bg-clip-text">
                Test Your Limits
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Climb higher by taking on the toughest logic puzzles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Section with 3x3 Grid */}
      <div id="challenges-section" className="bg-neutral-950 px-6 py-16 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold">Challenges</h2>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 mb-8">
              <p className="text-rose-400">{error}</p>
              <button
                onClick={fetchChallenges}
                className="mt-3 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 rounded-xl text-rose-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6 animate-pulse h-64"
                >
                  <div className="h-6 bg-neutral-800 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-neutral-800 rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-800 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : challenges.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-12 text-center">
              <Code2 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg">
                No challenges available yet.
              </p>
              <p className="text-neutral-500 text-sm mt-2">
                Check back soon for new challenges!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => {
                const completed = isCompleted(challenge.id);

                return (
                  <Link
                    key={challenge.id}
                    to={`/challenge/${challenge.id}`}
                    className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 flex flex-col h-full"
                  >
                    {completed && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-medium">
                            Completed
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                            challenge.difficulty
                          )}`}
                        >
                          {challenge.difficulty}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {challenge.points} pts
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-3 line-clamp-2">
                        {challenge.title}
                      </h3>

                      <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {challenge.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                      <span className="text-xs text-purple-400 font-medium">
                        {challenge.category}
                      </span>
                      <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
