import { useEffect, useState } from 'react';
import { Code2, Sparkles } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Start exit animation
          setTimeout(() => {
            setIsExiting(true);
            // Call onComplete after exit animation
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(139, 92, 246, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(139, 92, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridMove 20s linear infinite",
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(168, 85, 247, 0.4) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Logo Container with Animation */}
        <div
          className={`mb-8 relative transition-all duration-700 ${
            isExiting ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
          
          {/* Logo Box */}
          <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 p-8 rounded-3xl shadow-2xl">
            <Sparkles className="w-16 h-16 text-white" strokeWidth={2.5} />
          </div>
          
          {/* Orbiting Particles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Brand Name */}
        <h1
          className={`text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent transition-all duration-700 ${
            isExiting ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          DevRank
        </h1>

        {/* Tagline */}
        <p
          className={`text-xl text-neutral-400 mb-12 text-center max-w-md transition-all duration-700 ${
            isExiting ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          Level up your coding skills
        </p>

        {/* Progress Bar Container */}
        <div
          className={`w-80 transition-all duration-700 ${
            isExiting ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Progress Bar Background */}
          <div className="relative h-2 bg-neutral-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-neutral-700/30">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 animate-shimmer" />
            
            {/* Progress Fill */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Glow on progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-sm opacity-50" />
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-neutral-500">Loading</span>
            <span className="text-sm font-semibold text-purple-400">{progress}%</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className={`flex gap-2 mt-8 transition-all duration-700 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;