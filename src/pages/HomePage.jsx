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
import { TypewriterEffect } from "../components/ui/typewriter-effect";
import { MovingBorder } from "../components/ui/moving-border";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import LazyFadeIn from "../components/LazyFadeIn";

const HomePage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { profile, isAuthenticated } = useAuth();

  const userStats = {
    totalPoints: isAuthenticated && profile ? profile.points : 0,
    completedChallenges:
      isAuthenticated && profile ? profile.completed_challenges : 0,
    badge: isAuthenticated && profile ? profile.badge : "Beginner",
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await challengeService.getAllChallenges();
      setChallenges(data || []);
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

  const isCompleted = () => false;

  const scrollToChallenges = () => {
    document.getElementById("challenges-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const featuredEasy = challenges.find((c) => c.difficulty === "Easy");
  const featuredMedium = challenges.find((c) => c.difficulty === "Medium");
  const featuredHard = challenges.find((c) => c.difficulty === "Hard");

  return (
    <motion.div
      className="min-h-screen bg-neutral-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center overflow-hidden py-10 md:py-0">
        <div className="absolute inset-0 z-0">
          <img
            src="/codingbackground.jpg"
            alt="Coding Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/80 md:bg-transparent" />
          <div
            className="hidden md:block absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-950/95 to-transparent"
            style={{
              clipPath: "polygon(0 0, 0 100%, 40% 100%, 60% 0)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
        </div>

        <div className="relative z-10 px-6 md:pl-16 lg:pl-24 md:pr-6 w-full">
          <LazyFadeIn>
            <div className="max-w-2xl mx-auto md:mx-0 mb-10 md:mb-24 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full mb-6 md:mb-8">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                <span className="text-sm md:text-lg text-purple-300 font-medium">
                  Level Up Your Coding Skills
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                DevRank
              </h1>
              <p className="text-center text-base text-neutral-200 font-light mb-8 md:hidden px-2">
                Solve challenges, earn points, and climb the ranks.
              </p>
              
              {/* DESKTOP — Typewriter effect */}{" "}
              <div className="hidden md:block">
                {" "}
                <TypewriterEffect
                  words={[
                    { text: "Solve\u00A0", className: "text-white" },
                    { text: "challenges,\u00A0", className: "text-purple-300" },
                    { text: "earn\u00A0", className: "text-white" },
                    { text: "points,\u00A0", className: "text-purple-300" },
                    { text: "and\u00A0", className: "text-white" },
                    { text: "climb\u00A0", className: "text-purple-300" },
                    { text: "the\u00A0", className: "text-white" },
                    { text: "ranks.", className: "text-purple-300" },
                  ]}
                  className="text-center md:text-left text-xl md:text-3xl lg:text-4xl font-light mb-12 whitespace-nowrap"
                />{" "}
              </div>

              {/* STATS */}
              <LazyFadeIn delay={0.1}>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-12">
                  <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3 sm:p-4 md:p-6 hover:border-purple-400/50 transition-all">
                    <div className="flex flex-col items-center">
                      <Code2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-400 mb-1 sm:mb-2" />
                      <div className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
                        {challenges.length}
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-neutral-300 mt-1">
                        Total
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-500/10 backdrop-blur-xl border border-pink-500/30 rounded-xl p-3 sm:p-4 md:p-6 hover:border-pink-400/50 transition-all">
                    <div className="flex flex-col items-center">
                      <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-pink-400 mb-1 sm:mb-2" />
                      <div className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
                        {userStats.totalPoints}
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-neutral-300 mt-1">
                        Points
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3 sm:p-4 md:p-6 hover:border-purple-400/50 transition-all">
                    <div className="flex flex-col items-center">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-400 mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl md:text-3xl font-bold text-white mt-1">
                        {userStats.badge}
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-neutral-300 mt-1">
                        Badge
                      </div>
                    </div>
                  </div>
                </div>
              </LazyFadeIn>
              {/* BUTTON */}
              <LazyFadeIn delay={0.2}>
                <MovingBorder
                  borderRadius="9999px"
                  containerClassName="inline-block rounded-full transition-transform duration-300 hover:scale-105"
                  className="animate-border-moving"
                >
                  <button
                    onClick={scrollToChallenges}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-neutral-950 rounded-full text-white font-semibold text-lg flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-neutral-900 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    Start Coding
                    <ChevronDown className="w-5 h-5 transition-transform duration-300 md:group-hover:translate-y-1" />
                  </button>
                </MovingBorder>
              </LazyFadeIn>
            </div>
          </LazyFadeIn>
        </div>

        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </div>

      {/* FEATURED */}
      <div className="bg-neutral-950 py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
          {/* EASY */}
          <LazyFadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="space-y-3 md:space-y-4 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                  Easy Challenges
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed">
                  Warm up your brain with beginner-friendly problems.
                </p>
              </div>

              {featuredEasy && (
                <Link
                  to={`/challenge/${featuredEasy.id}`}
                  className="group bg-neutral-900/60 rounded-2xl border border-neutral-800/50 p-4 sm:p-6 md:p-8 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 group-hover:text-emerald-400 transition">
                    {featuredEasy.title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm md:text-base">
                    {featuredEasy.description}
                  </p>
                </Link>
              )}
            </div>
          </LazyFadeIn>

          {/* MEDIUM */}
          <LazyFadeIn delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              {featuredMedium && (
                <Link
                  to={`/challenge/${featuredMedium.id}`}
                  className="group bg-neutral-900/60 rounded-2xl border border-neutral-800/50 p-4 sm:p-6 md:p-8 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 order-2 md:order-1"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 group-hover:text-amber-400 transition">
                    {featuredMedium.title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm md:text-base">
                    {featuredMedium.description}
                  </p>
                </Link>
              )}

              <div className="space-y-3 md:space-y-4 text-center md:text-left order-1 md:order-2 md:pl-60">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
                  Medium Challenges
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed">
                  Balanced difficulty for sharpening your skills.
                </p>
              </div>
            </div>
          </LazyFadeIn>

          {/* HARD */}
          <LazyFadeIn delay={0.25}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-center">
              <div className="space-y-3 md:space-y-4 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 text-transparent bg-clip-text">
                  Hard Challenges
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed">
                  For coders seeking serious mental workout.
                </p>
              </div>

              {featuredHard && (
                <Link
                  to={`/challenge/${featuredHard.id}`}
                  className="group bg-neutral-900/60 rounded-2xl border border-neutral-800/50 p-4 sm:p-8 md:p-10 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/20 transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1"
                >
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 group-hover:text-rose-400 transition">
                    {featuredHard.title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm md:text-base">
                    {featuredHard.description}
                  </p>
                </Link>
              )}

              <div className="space-y-3 md:space-y-4 hidden md:block">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-400 to-rose-600 text-transparent bg-clip-text">
                  Test Your Limits
                </h2>
                <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                  Climb higher by taking on the toughest logic puzzles.
                </p>
              </div>
            </div>
          </LazyFadeIn>
        </div>
      </div>

      {/* CHALLENGES SECTION */}
      <div
        id="challenges-section"
        className="bg-neutral-950 px-4 sm:px-6 py-12 md:py-16 pb-24 md:pb-32"
      >
        <div className="max-w-7xl mx-auto">
          <LazyFadeIn>
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Challenges
              </h2>
              <p className="text-neutral-400 text-sm md:text-base">
                Start your coding journey with these challenges
              </p>
            </div>
          </LazyFadeIn>

          {error && (
            <LazyFadeIn>
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                <p className="text-rose-400 text-sm md:text-base">{error}</p>
                <button
                  onClick={fetchChallenges}
                  className="mt-3 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 rounded-xl text-rose-400 transition-colors text-sm md:text-base"
                >
                  Try Again
                </button>
              </div>
            </LazyFadeIn>
          )}

          {loading ? (
            <LazyFadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div
                    key={i}
                    className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-3 sm:p-4 md:p-6 animate-pulse h-48 md:h-64"
                  >
                    <div className="h-6 bg-neutral-800 rounded w-2/3 mb-3" />
                    <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-neutral-800 rounded w-full mb-2" />
                    <div className="h-4 bg-neutral-800 rounded w-5/6" />
                  </div>
                ))}
              </div>
            </LazyFadeIn>
          ) : challenges.length === 0 ? (
            <LazyFadeIn>
              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12 text-center">
                <Code2 className="w-12 h-12 md:w-16 md:h-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 text-base md:text-lg">
                  No challenges available yet.
                </p>
                <p className="text-neutral-500 text-sm mt-2">
                  Check back soon for new challenges!
                </p>
              </div>
            </LazyFadeIn>
          ) : (
            <>
              <LazyFadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {challenges.slice(0, 9).map((challenge, i) => {
                    const completed = isCompleted(challenge.id);

                    return (
                      <LazyFadeIn delay={i * 0.05} key={challenge.id}>
                        <Link
                          to={`/challenge/${challenge.id}`}
                          className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-2xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col h-full"
                        >
                          {completed && (
                            <div className="absolute top-3 right-3 z-10">
                              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs text-emerald-400 font-medium">
                                  Completed
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(
                                  challenge.difficulty
                                )}`}
                              >
                                {challenge.difficulty}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {challenge.points} pts
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-2 line-clamp-2">
                              {challenge.title}
                            </h3>

                            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
                              {challenge.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
                            <span className="text-xs text-purple-400 font-medium truncate mr-2">
                              {challenge.category}
                            </span>
                            <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-300 flex-shrink-0" />
                          </div>
                        </Link>
                      </LazyFadeIn>
                    );
                  })}
                </div>
              </LazyFadeIn>

              {challenges.length > 9 && (
                <LazyFadeIn delay={0.2}>
                  <div className="flex justify-center mt-8 md:mt-12">
                    <MovingBorder
                      borderRadius="9999px"
                      containerClassName="inline-block rounded-full transition-transform duration-300 hover:scale-105 p-[2px] bg-gradient-to-r from-purple-500 to-pink-500"
                      className="animate-border-moving"
                    >
                      <Link
                        to="/challenges"
                        className="block rounded-full bg-neutral-950 px-8 md:px-10 py-3 md:py-4 text-white font-semibold flex items-center gap-2"
                      >
                        See All Challenges
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                      </Link>
                    </MovingBorder>
                  </div>
                </LazyFadeIn>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
