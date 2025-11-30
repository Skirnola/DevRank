import { useState, useEffect } from 'react';
import { Search, Filter, Code2, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import challengeService from '../services/challengeService';

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
      
      // Extract unique categories
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

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    // Filter by category
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
    // TODO: Replace with real completion data
    return challengeId === 1 || challengeId === 3;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    
    {/* Header */}
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">All Challenges</h1>
      <p className="text-neutral-400 text-sm sm:text-base">
        {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} available
      </p>
    </div>

    {/* Search + Filters */}
    <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" />

        <input
          type="text"
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-4 
           bg-neutral-900/50 border border-neutral-800/50 rounded-xl sm:rounded-2xl 
           text-sm sm:text-base placeholder-neutral-500 
           focus:border-purple-500/50 outline-none"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 
         bg-neutral-900/50 border border-neutral-800/50 rounded-xl 
         text-neutral-400 text-sm sm:text-base hover:text-white"
      >
        <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Filters</span>
        {(selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Difficulty */}
            <div>
              <label className="block text-xs sm:text-sm text-neutral-400 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border text-xs sm:text-base
                      ${
                        selectedDifficulty === difficulty
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                          : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:text-white'
                      }
                    `}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs sm:text-sm text-neutral-400 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border text-xs sm:text-base
                      ${
                        selectedCategory === category
                          ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                          : 'bg-neutral-900/50 border-neutral-800/50 text-neutral-400 hover:text-white'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-sm"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>

    {/* Challenges Grid */}
    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse h-40 sm:h-64" />
        ))}
      </div>
    ) : filteredChallenges.length === 0 ? (
      <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-8 sm:p-12 text-center">
        <Code2 className="w-10 h-10 sm:w-16 sm:h-16 text-neutral-600 mx-auto mb-3 sm:mb-4" />
        <p className="text-neutral-400 text-sm sm:text-lg mb-1">No challenges found</p>
        <p className="text-neutral-500 text-xs sm:text-sm">Try adjusting filters or search</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filteredChallenges.map((challenge) => {
          const completed = isCompleted(challenge.id);
          return (
            <Link
              key={challenge.id}
              to={`/challenge/${challenge.id}`}
              className="group relative bg-neutral-900/60 border border-neutral-800/50 rounded-xl sm:rounded-2xl 
              p-4 sm:p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-purple-500/20 
              flex flex-col h-full"
            >
              {/* Completed badge */}
              {completed && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-[10px] sm:text-xs rounded-lg border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-[10px] sm:text-xs text-neutral-500">
                    {challenge.points} pts
                  </span>
                </div>

                <h3 className="text-sm sm:text-xl font-semibold line-clamp-2 group-hover:text-purple-400">
                  {challenge.title}
                </h3>

                <p className="text-neutral-400 text-xs sm:text-sm mt-2 line-clamp-3">
                  {challenge.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-neutral-800/50 mt-2 sm:mt-4">
                <span className="text-[10px] sm:text-xs text-purple-400">
                  {challenge.category}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 group-hover:text-purple-400" />
              </div>
            </Link>
          );
        })}
      </div>
    )}
  </div>
</div>

  );
};

export default ChallengesPage;