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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Challenges</h1>
          <p className="text-neutral-400">
            {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search challenges by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-neutral-900/50 border border-neutral-800/50 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-neutral-900/50 border border-neutral-800/50 rounded-xl text-neutral-400 hover:text-white transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
            {(selectedDifficulty !== 'All' || selectedCategory !== 'All') && (
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Filters */}
          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
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
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-800/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
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
        </div>

        {/* Error Message */}
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

        {/* Challenges Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-6 animate-pulse h-64">
                <div className="h-6 bg-neutral-800 rounded w-2/3 mb-3" />
                <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4" />
                <div className="h-4 bg-neutral-800 rounded w-full mb-2" />
                <div className="h-4 bg-neutral-800 rounded w-5/6" />
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
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
                        <span className="text-xs text-emerald-400 font-medium">Completed</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-neutral-500">{challenge.points} pts</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors mb-3 line-clamp-2">
                      {challenge.title}
                    </h3>
                    
                    <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {challenge.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                    <span className="text-xs text-purple-400 font-medium">{challenge.category}</span>
                    <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-purple-400 transition-colors group-hover:translate-x-1 duration-300" />
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