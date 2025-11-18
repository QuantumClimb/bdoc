/**
 * Loading Screen Template Component
 * Full-page loading screen with spinner and optional message
 */

import Spinner from "../common/Spinner";

export function LoadingScreenTemplate({
  message = "Loading...",
  variant = "spinner",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {variant === "spinner" ? (
        <div className="text-center">
          <Spinner size="lg" message={message} />
        </div>
      ) : variant === "skeleton" ? (
        <div className="w-full max-w-2xl px-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LoadingScreenTemplate;
