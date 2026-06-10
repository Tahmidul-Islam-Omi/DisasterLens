import { CloudSun } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

/**
 * LoadingSpinner Component
 * 
 * Displays a loading animation with optional message
 * Can be used as full-screen overlay or inline
 */
export function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <div className="relative">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
          style={{ backgroundColor: '#1E3A8A' }}
        >
          <CloudSun className="w-8 h-8 text-white" />
        </div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"
        />
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        {content}
      </div>
    );
  }

  return content;
}
