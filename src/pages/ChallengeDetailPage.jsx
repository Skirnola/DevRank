import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Trophy,
  CheckCircle2,
  Loader2,
  Play,
  Heart,
} from "lucide-react";
import challengeService from "../services/challengeService";

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchChallenge();
    checkIfFavorite();
  }, [id]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const data = await challengeService.getChallengeById(id);
      setChallenge(data);

      // Load starter code if available
      if (data?.starter_code) {
        setSolution(data.starter_code);
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
      alert("Challenge not found!");
      navigate("/challenges");
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("devrank_favorites") || "[]"
    );
    setIsFavorite(favorites.some((fav) => fav.id === parseInt(id)));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("devrank_favorites") || "[]"
    );

    if (isFavorite) {
      const updated = favorites.filter((fav) => fav.id !== parseInt(id));
      localStorage.setItem("devrank_favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(challenge);
      localStorage.setItem("devrank_favorites", JSON.stringify(favorites));
      setIsFavorite(true);
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

  const handleSubmit = async () => {
    if (!solution.trim()) {
      alert("Please write your solution first!");
      return;
    }

    setSubmitting(true);

    try {
      // TODO: Replace with real user ID when auth is implemented
      const userId = "mock-user-id";
      await challengeService.submitSolution(id, solution, userId);
      setSubmitted(true);

      setTimeout(() => {
        alert("Solution submitted successfully! 🎉");
        navigate("/history");
      }, 500);
    } catch (error) {
      console.error("Error submitting solution:", error);
      alert("Failed to submit solution. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          <p className="text-neutral-400">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>

              <button
                onClick={toggleFavorite}
                className="p-2 rounded-xl hover:bg-neutral-800/50 transition-colors"
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isFavorite
                      ? "fill-pink-400 text-pink-400"
                      : "text-neutral-400"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2">
            {/* Left Panel - Problem Description */}
            <div className="border-r border-neutral-800/50 overflow-y-auto bg-neutral-950/50 backdrop-blur-sm">
              <div className="p-6 lg:p-8 max-w-3xl mx-auto">
                {/* Title and Meta */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {challenge.title}
                  </h1>

                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-2 text-sm font-medium rounded-xl border ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Trophy className="w-5 h-5 text-purple-400" />
                      <span className="font-bold text-purple-400">
                        {challenge.points}
                      </span>
                      <span>points</span>
                    </div>
                    <span className="px-3 py-1 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-neutral-400">
                      {challenge.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">
                      Description
                    </h2>
                  </div>
                  <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6">
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                {challenge.examples && challenge.examples.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Examples
                    </h2>
                    <div className="space-y-4">
                      {challenge.examples.map((example, index) => (
                        <div
                          key={index}
                          className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6"
                        >
                          <div className="mb-2">
                            <span className="text-sm font-medium text-purple-400">
                              Example {index + 1}:
                            </span>
                          </div>
                          <div className="space-y-2 font-mono text-sm">
                            <div>
                              <span className="text-neutral-500">Input: </span>
                              <span className="text-emerald-400">
                                {example.input}
                              </span>
                            </div>
                            <div>
                              <span className="text-neutral-500">Output: </span>
                              <span className="text-amber-400">
                                {example.output}
                              </span>
                            </div>
                            {example.explanation && (
                              <div className="mt-3 pt-3 border-t border-neutral-800/50">
                                <span className="text-neutral-500">
                                  Explanation:{" "}
                                </span>
                                <span className="text-neutral-400">
                                  {example.explanation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {challenge.constraints && challenge.constraints.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Constraints
                    </h2>
                    <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6">
                      <ul className="space-y-2">
                        {challenge.constraints.map((constraint, index) => (
                          <li
                            key={index}
                            className="text-neutral-400 text-sm flex items-start gap-2"
                          >
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="overflow-y-auto bg-neutral-950/50 backdrop-blur-sm">
              <div className="p-6 lg:p-8 h-full flex flex-col">
                {/* Editor Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-white">
                      Your Solution
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">
                        JavaScript
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-400">
                    Write your solution below:
                  </p>
                </div>

                {/* Code Editor */}
                <div className="flex-1 mb-6">
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="// Write your solution here...
function solution() {
  // Your code here
}"
                    className="w-full h-full p-6 bg-neutral-900/80 border border-neutral-800/50 rounded-2xl text-white font-mono text-sm resize-none focus:outline-none focus:border-purple-500/50 transition-colors placeholder-neutral-600"
                    style={{
                      minHeight: "400px",
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || submitted || !solution.trim()}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 
  rounded-xl text-white font-semibold transition-all 
  ${
    submitting || submitted || !solution.trim()
      ? "border border-neutral-700 text-neutral-500 cursor-not-allowed"
      : "border border-purple-500/50 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
  }
`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : submitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Submitted!
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Submit Solution
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSolution(challenge.starter_code || "")}
                    className="px-6 py-4 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 rounded-xl text-white font-medium transition-colors"
                  >
                    Reset Code
                  </button>
                </div>

                {/* Success Message */}
                {submitted && (
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 text-sm text-center">
                      🎉 Solution submitted successfully! You earned{" "}
                      {challenge.points} points!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailPage;
