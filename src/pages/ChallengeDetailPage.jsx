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
  AlertCircle,
  Eye,
} from "lucide-react";
import challengeService from "../services/challengeService";
import CodeEditor from "../components/CodeEditor";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import Modal from "../components/Modal";

const ChallengeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isGuest, updateGuestProfile } =
    useAuth();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [previousSubmission, setPreviousSubmission] = useState(null);
  const [viewingPrevious, setViewingPrevious] = useState(false);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    showCancel: false,
  });

  useEffect(() => {
    fetchChallenge();
    checkIfFavorite();
    checkIfCompleted();
  }, [id, user]);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const data = await challengeService.getChallengeById(id);
      setChallenge(data);

      // Load starter code if available and clean it up
      if (data?.starter_code) {
        // Remove everything after the opening brace on line 1, keep only the function signature
        const cleanCode = data.starter_code
          .split("\n")
          .map((line, index) => {
            // First line - remove everything after the opening brace
            if (index === 0 && line.includes("{")) {
              return line.substring(0, line.indexOf("{") + 1);
            }
            // Remove lines with color codes or "Your code here" comments
            if (line.includes("color:") || line.includes("Your code here")) {
              return "";
            }
            return line;
          })
          .filter((line) => line !== "") // Remove empty lines we created
          .join("\n");

        setSolution(cleanCode);
      } else {
        setSolution("");
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
      showModal({
        type: "error",
        title: "Challenge Not Found",
        message: "The challenge you're looking for doesn't exist.",
        onConfirm: () => navigate("/challenges"),
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIfCompleted = async () => {
    if (!isAuthenticated) return;

    try {
      if (isGuest) {
        // Check localStorage for guest mode
        const guestSubmissions = JSON.parse(
          localStorage.getItem("devrank_guest_submissions") || "[]"
        );
        const completed = guestSubmissions.find(
          (sub) =>
            sub.challenge_id === parseInt(id) && sub.status === "completed"
        );
        if (completed) {
          setAlreadyCompleted(true);
          setPreviousSubmission(completed);
        }
      } else {
        // Check Supabase for real users
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", user.id)
          .eq("challenge_id", id)
          .in("status", ["completed", "accepted"])
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setAlreadyCompleted(true);
          setPreviousSubmission(data[0]);
        }
      }
    } catch (error) {
      console.error("Error checking completion:", error);
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

  const showModal = (config) => {
    setModalConfig({
      isOpen: true,
      ...config,
    });
  };

  const closeModal = () => {
    setModalConfig({
      ...modalConfig,
      isOpen: false,
    });
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

  const handleViewPreviousSubmission = () => {
    if (previousSubmission) {
      setViewingPrevious(true);
      setSolution(previousSubmission.solution || previousSubmission.code || "");
    }
  };

  const handleSubmit = async () => {
    // Check if logged in
    if (!isAuthenticated) {
      showModal({
        type: "warning",
        title: "Login Required",
        message: "Please login to submit solutions and track your progress!",
        confirmText: "Go to Login",
        onConfirm: () => navigate("/login", { state: { from: { pathname: `/challenge/${id}` } } }),
      });
      return;
    }

    if (!solution.trim()) {
      showModal({
        type: "warning",
        title: "Empty Solution",
        message: "Please write your solution first before submitting!",
      });
      return;
    }

    // Check for duplicate submission
    if (alreadyCompleted) {
      showModal({
        type: "confirm",
        title: "Already Completed",
        message: "You've already completed this challenge. Submit again? (No additional points will be awarded)",
        confirmText: "Submit Again",
        cancelText: "Cancel",
        showCancel: true,
        onConfirm: () => submitSolution(),
      });
      return;
    }

    submitSolution();
  };

  const submitSolution = async () => {
    setSubmitting(true);

    try {
      if (isGuest) {
        // Guest mode submission
        await handleGuestSubmission();
      } else {
        // Real user submission to Supabase
        await handleRealSubmission();
      }

      setSubmitted(true);

      const earnedPoints = alreadyCompleted ? 0 : challenge.points;
      
      setTimeout(() => {
        showModal({
          type: "success",
          title: "Success! 🎉",
          message: alreadyCompleted
            ? "Solution submitted! (Already completed - no additional points)"
            : `Solution submitted successfully! You earned ${earnedPoints} points!`,
          confirmText: "View History",
          onConfirm: () => navigate("/history"),
        });
      }, 500);
    } catch (error) {
      console.error("Error submitting solution:", error);
      showModal({
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit solution. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestSubmission = async () => {
    // Save to localStorage
    const guestSubmissions = JSON.parse(
      localStorage.getItem("devrank_guest_submissions") || "[]"
    );

    const newSubmission = {
      id: Date.now(),
      challenge_id: parseInt(id),
      challenge_title: challenge.title,
      code: solution,
      solution: solution,
      status: "completed",
      points: alreadyCompleted ? 0 : challenge.points,
      submitted_at: new Date().toISOString(),
    };

    guestSubmissions.push(newSubmission);
    localStorage.setItem(
      "devrank_guest_submissions",
      JSON.stringify(guestSubmissions)
    );

    // Update guest profile if first completion
    if (!alreadyCompleted) {
      const currentProfile = JSON.parse(
        localStorage.getItem("devrank_guest")
      ).profile;
      const newPoints = currentProfile.points + challenge.points;
      const newCompletedCount = currentProfile.completed_challenges + 1;

      // Calculate new badge
      let newBadge = "Beginner";
      if (newPoints >= 200) newBadge = "Expert";
      else if (newPoints >= 100) newBadge = "Advanced";
      else if (newPoints >= 50) newBadge = "Intermediate";

      updateGuestProfile({
        points: newPoints,
        completed_challenges: newCompletedCount,
        badge: newBadge,
      });
    }
  };

  const handleRealSubmission = async () => {
    try {
      console.log("🚀 Submitting to Supabase...");
      console.log("User ID:", user.id);
      console.log("Challenge ID:", id);
      console.log("Solution:", solution);

      // Submit to Supabase with CORRECT column names
      const { data, error: submitError } = await supabase
        .from("submissions")
        .insert({
          user_id: user.id,
          challenge_id: id,
          solution: solution,
          status: "completed",
          language: "javascript",
        })
        .select();

      if (submitError) {
        console.error("❌ Submission error:", submitError);
        throw submitError;
      }

      console.log("✅ Submission successful:", data);
    } catch (error) {
      console.error("💥 Error in handleRealSubmission:", error);
      throw error;
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
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden pb-36 sm:pb-0">
      <style>{`
        /* Modern scrollbar styling for challenge panels */
        .modern-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .modern-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .modern-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .modern-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        
        .modern-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar */
        .modern-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }
      `}</style>

      {/* Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showCancel={modalConfig.showCancel}
        onConfirm={modalConfig.onConfirm}
      />

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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">Back</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Already Completed Badge */}
                {alreadyCompleted && (
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm text-emerald-400 font-medium hidden sm:inline">
                      Completed
                    </span>
                  </div>
                )}

                {/* Not Logged In Warning */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium hidden md:inline">
                      Login to submit
                    </span>
                  </div>
                )}

                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-xl hover:bg-neutral-800/50 transition-colors"
                  title={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                      isFavorite
                        ? "fill-pink-400 text-pink-400"
                        : "text-neutral-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-2">
            {/* Left Panel - Problem Description */}
            <div className="modern-scroll border-r border-neutral-800/50 overflow-y-auto bg-neutral-950/50 backdrop-blur-sm">
              <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
                {/* Title and Meta */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {challenge.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <span
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl border ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <span className="font-bold text-purple-400">
                        {challenge.points}
                      </span>
                      <span className="hidden sm:inline">points</span>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-xs sm:text-sm text-neutral-400">
                      {challenge.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      Description
                    </h2>
                  </div>
                  <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {/* Examples */}
                {challenge.examples && challenge.examples.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      Examples
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {challenge.examples.map((example, index) => (
                        <div
                          key={index}
                          className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                        >
                          <div className="mb-2">
                            <span className="text-xs sm:text-sm font-medium text-purple-400">
                              Example {index + 1}:
                            </span>
                          </div>
                          <div className="space-y-2 font-mono text-xs sm:text-sm">
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
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      Constraints
                    </h2>
                    <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <ul className="space-y-2">
                        {challenge.constraints.map((constraint, index) => (
                          <li
                            key={index}
                            className="text-neutral-400 text-xs sm:text-sm flex items-start gap-2"
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
            <div className="modern-scroll overflow-y-auto bg-neutral-950/50 backdrop-blur-sm">
              <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                {/* Editor Header */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                      {viewingPrevious ? "Your Previous Submission" : "Your Solution"}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-neutral-500">
                        JavaScript
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    {viewingPrevious 
                      ? "Viewing your previous submission for this challenge"
                      : "Write your solution below:"}
                  </p>
                </div>

                {/* Code Editor */}
                <div className="flex-1 mb-4 sm:mb-6 min-h-[300px] sm:min-h-[400px]">
                  <CodeEditor
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="// Write your solution here..."
                    disabled={submitting || submitted || viewingPrevious}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* Show different buttons based on completion status */}
                  {alreadyCompleted && !viewingPrevious ? (
                    // View Previous Submission button
                    <button
                      onClick={handleViewPreviousSubmission}
                      className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 
                        bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600
                        rounded-xl text-sm sm:text-base text-white font-semibold transition-all"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Your Submission
                    </button>
                  ) : viewingPrevious ? (
                    // Back to Challenge button when viewing previous
                    <button
                      onClick={() => {
                        setViewingPrevious(false);
                        setSolution(challenge.starter_code || "");
                      }}
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 
                        bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 
                        rounded-xl text-white text-sm sm:text-base font-medium transition-colors"
                    >
                      Back to Challenge
                    </button>
                  ) : (
                    // Normal Submit and Reset buttons
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting || submitted || !solution.trim()}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 
                          rounded-xl text-sm sm:text-base text-white font-semibold transition-all 
                          ${
                            submitting || submitted || !solution.trim()
                              ? "border border-neutral-700 text-neutral-500 cursor-not-allowed"
                              : "border border-purple-500/50 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                          }
                        `}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <span className="hidden sm:inline">Submitting...</span>
                            <span className="sm:hidden">Submit...</span>
                          </>
                        ) : submitted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            Submitted!
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                            Submit Solution
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setSolution(challenge.starter_code || "")}
                        className="px-4 sm:px-6 py-3 sm:py-4 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 rounded-xl text-white text-sm sm:text-base font-medium transition-colors"
                      >
                        Reset Code
                      </button>
                    </>
                  )}
                </div>

                {/* Success Message */}
                {submitted && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-emerald-400 text-xs sm:text-sm text-center">
                      🎉 Solution submitted successfully! You earned{" "}
                      {alreadyCompleted ? 0 : challenge.points} points!
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