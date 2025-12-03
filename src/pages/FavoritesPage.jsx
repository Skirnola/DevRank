import { useState, useEffect } from "react";
import { Heart, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MovingBorder } from "../components/ui/moving-border";

import { motion } from "framer-motion"; // ⭐ added
import LazyFadeIn from "../components/LazyFadeIn"; // ⭐ same lazy wrapper

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    return challengeId === 1 || challengeId === 3;
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-950 text-white pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">

        {/* Header */}
        <LazyFadeIn>
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-400 fill-pink-400" />
              <h1 className="text-2xl md:text-4xl font-bold">Favorite Challenges</h1>
            </div>
            <p className="text-neutral-400 text-sm md:text-base">
              {favorites.length} challenge{favorites.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </LazyFadeIn>

        {/* Favorites Grid */}
        <LazyFadeIn delay={0.1}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-4 md:p-6 animate-pulse h-40 md:h-64"
                >
                  <div className="h-5 bg-neutral-800 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-neutral-800 rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-800 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-8 md:p-12 text-center">
              <Heart className="w-12 h-12 md:w-16 md:h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-base md:text-lg mb-2">
                No favorite challenges yet
              </p>
              <p className="text-neutral-500 text-xs md:text-sm mb-6">
                Click the heart icon on any challenge to add it
              </p>

              <MovingBorder
                borderRadius="9999px"
                containerClassName="inline-block rounded-full transition-transform duration-300 hover:scale-105
                border border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                className="animate-border-moving"
              >
                <Link
                  to="/challenges"
                  className="px-6 py-3 md:px-8 md:py-4 bg-neutral-950 rounded-full text-white font-semibold text-sm md:text-lg 
                  flex items-center gap-2 cursor-pointer transition-all duration-300 
                  hover:bg-neutral-900 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Browse Challenges
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              </MovingBorder>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {favorites.map((challenge, i) => {
                const completed = isCompleted(challenge.id);

                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm 
                      border border-neutral-800/50 hover:border-pink-500/50 rounded-2xl 
                      p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 
                      hover:-translate-y-1 md:hover:-translate-y-2 flex flex-col h-full"
                    >
                      {/* Remove Favorite */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFavorite(challenge.id);
                        }}
                        className="absolute top-3 right-3 md:top-4 md:right-4 z-10 p-1.5 md:p-2 
                        bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-rose-400" />
                      </button>

                      {completed && (
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
                          <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 
                            bg-emerald-500/20 border border-emerald-500/30 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                            <span className="text-[10px] md:text-xs text-emerald-400 font-medium">
                              Completed
                            </span>
                          </div>
                        </div>
                      )}

                      <Link to={`/challenge/${challenge.id}`} className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 mt-6 md:mt-8">
                            <span
                              className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-medium 
                              rounded-full border ${getDifficultyColor(challenge.difficulty)}`}
                            >
                              {challenge.difficulty}
                            </span>
                            <span className="text-[10px] md:text-xs text-neutral-500">
                              {challenge.points} pts
                            </span>
                          </div>

                          <h3 className="text-base md:text-xl font-semibold text-white 
                            group-hover:text-pink-400 transition-colors mb-2 md:mb-3 line-clamp-2"
                          >
                            {challenge.title}
                          </h3>

                          <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-3">
                            {challenge.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-neutral-800/50">
                          <span className="text-xs md:text-sm text-pink-400 font-medium">
                            {challenge.category}
                          </span>
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-neutral-600 group-hover:text-pink-400 transition-colors group-hover:translate-x-1 duration-300" />
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </LazyFadeIn>

      </div>
    </motion.div>
  );
};

export default FavoritesPage;
