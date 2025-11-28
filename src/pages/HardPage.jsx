import { useState, useEffect } from "react";
import { CheckCircle2, Code, ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import challengeService from "../services/challengeService";

const HardPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch hard challenges from Supabase
    const fetchHardChallenges = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await challengeService.getChallengesByDifficulty("Hard");
        // Mark some as completed for demo
        const challengesWithStatus = data.map((challenge, index) => ({
          ...challenge,
          completed: false, // None completed for demo
        }));
        setChallenges(challengesWithStatus);
      } catch (error) {
        console.error("Error fetching hard challenges:", error);
        setError(
          "Failed to load challenges. Please check your Supabase configuration."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHardChallenges();
  }, []);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalPoints = completedCount * 30;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-24">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-red-600/20 blur-3xl" />
        <div className="relative px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full mb-4">
              <Flame className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-rose-300">Expert Level</span>
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
              Hard Challenges
            </h1>
            <p className="text-neutral-400 text-lg mb-6">
              30 points each • Master advanced concepts
            </p>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-400 mb-1">
                    Your Progress
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {completedCount} / {challenges.length}
                  </div>
                  <div className="text-sm text-rose-400">
                    {totalPoints} points earned
                  </div>
                </div>
                <div className="p-4 bg-rose-500/20 rounded-2xl">
                  <Code className="w-8 h-8 text-rose-400" />
                </div>
              </div>
              <div className="mt-4 bg-neutral-800/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-500 h-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / challenges.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Hard Challenges</h2>
          <div className="text-sm text-neutral-400">
            {challenges.length} challenges
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 mb-6">
            <p className="text-rose-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-neutral-800 rounded w-1/3 mb-3" />
                <div className="h-4 bg-neutral-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : challenges.length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-12 text-center">
            <Flame className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg">
              No hard challenges available yet.
            </p>
            <p className="text-neutral-500 text-sm mt-2">
              Check back soon for expert-level challenges!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                to={`/challenge/${challenge.id}`}
                className="group relative bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 backdrop-blur-sm border border-neutral-800/50 hover:border-rose-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1"
              >
                {challenge.completed && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-20">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-rose-400 transition-colors">
                        {challenge.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium rounded-full border bg-rose-500/10 text-rose-400 border-rose-500/30">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-neutral-400 mb-4 leading-relaxed">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Category:</span>
                        <span className="text-rose-400 font-medium">
                          {challenge.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Points:</span>
                        <span className="text-rose-400 font-bold">
                          {challenge.points}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-neutral-600 group-hover:text-rose-400 transition-colors group-hover:translate-x-1 duration-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HardPage;
