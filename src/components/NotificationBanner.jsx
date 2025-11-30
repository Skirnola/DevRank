import { AlertCircle, LogIn, X, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const NotificationBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { isGuest } = useAuth();

  if (dismissed) return null;

  return (
    <div className={`border-b ${isGuest ? 'bg-amber-600 border-amber-500' : 'bg-blue-600 border-blue-500'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          {/* Icon + Message */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {isGuest ? (
              <>
                <UserCircle className="w-5 h-5 text-white flex-shrink-0" />
                <p className="text-white text-xs sm:text-sm md:text-base truncate md:whitespace-normal">
                  <span className="hidden sm:inline">Guest Mode: Your progress is saved locally on this device only. Login to sync across devices!</span>
                  <span className="sm:hidden">Guest Mode - Local storage only</span>
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
                <p className="text-white text-xs sm:text-sm md:text-base truncate md:whitespace-normal">
                  <span className="hidden sm:inline">You are not logged in. Please login to save your progress and track your achievements!</span>
                  <span className="sm:hidden">Login to save your progress!</span>
                </p>
              </>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isGuest && (
              <Link
                to="/login"
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white hover:bg-blue-50 text-blue-600 rounded-lg font-semibold text-xs md:text-sm transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                <span>Login</span>
              </Link>
            )}
            
            <button
              onClick={() => setDismissed(true)}
              className={`p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 ${
                isGuest ? 'hover:bg-amber-500/50' : 'hover:bg-blue-500/50'
              }`}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;