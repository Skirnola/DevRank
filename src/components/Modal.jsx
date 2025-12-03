import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info", // "success", "error", "warning", "info", "confirm"
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-12 h-12 text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-12 h-12 text-rose-400" />;
      case "warning":
        return <AlertCircle className="w-12 h-12 text-amber-400" />;
      case "confirm":
        return <Info className="w-12 h-12 text-purple-400" />;
      default:
        return <Info className="w-12 h-12 text-blue-400" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500/20 border-emerald-500/30";
      case "error":
        return "bg-rose-500/20 border-rose-500/30";
      case "warning":
        return "bg-amber-500/20 border-amber-500/30";
      case "confirm":
        return "bg-purple-500/20 border-purple-500/30";
      default:
        return "bg-blue-500/20 border-blue-500/30";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-800 transition-colors z-10"
        >
          <X className="w-5 h-5 text-neutral-400" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full border ${getIconBg()}`}>
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          {title && (
            <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-3">
              {title}
            </h3>
          )}

          {/* Message */}
          <p className="text-neutral-300 text-center text-sm sm:text-base leading-relaxed mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-white font-medium transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all ${
                type === "success"
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  : type === "error"
                  ? "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
                  : type === "warning"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;