import { useState, useEffect } from "react";
import { Heart, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MovingBorder } from "../components/ui/moving-border";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      setLoading(true);
      const storedFavorites = localStorage.getItem("devrank_favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (challengeId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== challengeId);
    setFavorites(updatedFavorites);
    localStorage.setItem("devrank_favorites", JSON.stringify(updatedFavorites));
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
    // TODO: Replace with real completion data
    return challengeId === 1 || challengeId === 3;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-32">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
            <h1 className="text-4xl font-bold">Favorite Challenges</h1>
          </div>
          <p className="text-neutral-400">
            {favorites.length} challenge{favorites.length !== 1 ? "s" : ""}{" "}
            saved
          </p>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        ) : favorites.length === 0 ? (
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg mb-2">
              No favorite challenges yet
            </p>
            <p className="text-neutral-500 text-sm mb-6">
              Click the heart icon on any challenge to add it to your favorites
            </p>
            <MovingBorder
              borderRadius="9999px"
              containerClassName="inline-block rounded-full transition-transform duration-300 hover:scale-105
                     border border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              className="animate-border-moving"
            >
              <Link
                to="/challenges"
                className="px-8 py-4 bg-neutral-950 rounded-full text-white font-semibold text-lg 
               flex items-center gap-2 cursor-pointer transition-all duration-300 
               hover:bg-neutral-900 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                Browse Challenges
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MovingBorder>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((challenge) => {
              const completed = isCompleted(challenge.id);

              return (
                <div
                  key={challenge.id}
                  className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-pink-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 flex flex-col h-full"
                >
                  {/* Remove Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(challenge.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors group/btn"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400 group-hover/btn:scale-110 transition-transform" />
                  </button>

                  {completed && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">
                          Completed
                        </span>
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/challenge/${challenge.id}`}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 mt-8">
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

                      <h3 className="text-xl font-semibold text-white group-hover:text-pink-400 transition-colors mb-3 line-clamp-2">
                        {challenge.title}
                      </h3>

                      <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {challenge.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                      <span className="text-xs text-pink-400 font-medium">
                        {challenge.category}
                      </span>
                      <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-pink-400 transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
