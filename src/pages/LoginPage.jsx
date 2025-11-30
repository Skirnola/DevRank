import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2, AlertCircle, ArrowLeft, UserCircle, WifiOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest, isOffline } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Invalid email or password");
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
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

      <div className="relative z-10 w-full max-w-md">
        {/* Offline Indicator */}
        {isOffline && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-amber-400" />
            <p className="text-amber-400 text-sm">You are offline. Use Guest Mode to continue.</p>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              DevRank
            </h1>
          </Link>
          <p className="text-neutral-400 mt-2">
            Welcome back! Please login to continue.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <h2 className="text-2xl font-bold mb-6">Login to Your Account</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all hover:scale-[1.02] disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-900/80 text-neutral-400">Or continue with</span>
            </div>
          </div>

          {/* Guest Mode Button */}
          <button
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600/50 rounded-xl text-white font-semibold transition-all hover:scale-[1.02]"
          >
            <UserCircle className="w-5 h-5" />
            Continue as Guest (Offline Mode)
          </button>

          <p className="text-xs text-neutral-500 text-center mt-3">
            Guest mode works offline. Progress is saved locally on this device only.
          </p>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                state={{ from: location.state?.from }}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;