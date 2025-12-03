import { useState, useEffect } from 'react';
import { Search, Filter, Code2, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import challengeService from '../services/challengeService';

import { motion } from "framer-motion"; // ⭐ added
import LazyFadeIn from "../components/LazyFadeIn"; // ⭐ same lazy wrapper as homepage

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchQuery, selectedDifficulty, selectedCategory]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await challengeService.getAllChallenges();
      setChallenges(data || []);
      
      const uniqueCategories = ['All', ...new Set(data.map(c => c.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Failed to load challenges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterChallenges = () => {
    let filtered = [...challenges];

    if (searchQuery) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    setFilteredChallenges(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <LazyFadeIn>
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">All Challenges</h1>
            <p className="text-neutral-400 text-sm sm:text-base">
              {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </LazyFadeIn>

        {/* Search + Filters */}
        <LazyFadeIn delay={0.1}>
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 bg-neutral-900/50 border border-neutral-800/50 rounded-xl sm:rounded-2xl text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-900/50 border border-neutral-800/50 rounded-xl text-neutral-400 text-sm sm:text-base hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Filters</span>
              {(selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] sm:text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {showFilters && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Difficulty</label>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => setSelectedDifficulty(difficulty)}
                          className={`px-4 py-2 rounded-xl border transition-all ${
                            selectedDifficulty === difficulty
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                              : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-xl border transition-all ${
                            selectedCategory === category
                              ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                              : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {(searchQuery || selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </LazyFadeIn>

        {/* Error */}
        {error && (
          <LazyFadeIn delay={0.1}>
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 mb-8">
              <p className="text-rose-400">{error}</p>
              <button 
                onClick={fetchChallenges}
                className="mt-3 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 rounded-xl text-rose-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          </LazyFadeIn>
        )}

        {/* Challenges Grid */}
        <LazyFadeIn delay={0.15}>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl md:rounded-2xl p-3 md:p-6 animate-pulse h-40 md:h-64" />
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-12 text-center">
              <Code2 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg mb-2">No challenges found</p>
              <p className="text-neutral-500 text-sm">Try adjusting your filters or search query</p>
              {(searchQuery || selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-xl text-purple-400 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {filteredChallenges.map((challenge, i) => {
                const completed = isCompleted(challenge.id);
                
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={`/challenge/${challenge.id}`}
                      className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 hover:border-purple-500/50 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 md:hover:-translate-y-2 flex flex-col h-full"
                    >
                      {completed && (
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                          <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                            <span className="text-[10px] md:text-xs text-emerald-400 font-medium">Completed</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 md:gap-3 mb-2 md:mb-3">
                          <span className={`px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-[10px] md:text-xs text-neutral-500">{challenge.points} pts</span>
                        </div>
                        
                        <h3 className="text-sm md:text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-1.5 md:mb-3 line-clamp-2">
                          {challenge.title}
                        </h3>
                        
                        <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-2 md:mb-4 line-clamp-2 md:line-clamp-3">
                          {challenge.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 md:pt-4 border-t border-neutral-800/50">
                        <span className="text-[10px] md:text-xs text-purple-400 font-medium truncate">{challenge.category}</span>
                        <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-neutral-600 group-hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-300 flex-shrink-0" />
                      </div>
                    </Link>
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

export default ChallengesPage;
