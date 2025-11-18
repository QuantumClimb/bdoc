/**
 * ProcessingOverlay Component
 * 8-stage animated overlay for document upload processing
 * Pixel-perfect match to 7-Processing Overlay.html
 */

import { useState, useEffect } from 'react';

export function ProcessingOverlay({ isVisible, onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    { id: 0, label: 'Uploading document...', icon: 'bi-upload', duration: 1000 },
    { id: 1, label: 'Validating file format...', icon: 'bi-file-check', duration: 800 },
    { id: 2, label: 'Extracting data...', icon: 'bi-file-text', duration: 1200 },
    { id: 3, label: 'Analyzing content...', icon: 'bi-search', duration: 1000 },
    { id: 4, label: 'Matching suppliers...', icon: 'bi-building', duration: 900 },
    { id: 5, label: 'Verifying amounts...', icon: 'bi-calculator', duration: 800 },
    { id: 6, label: 'Generating preview...', icon: 'bi-eye', duration: 700 },
    { id: 7, label: 'Finalizing...', icon: 'bi-check-circle', duration: 600 }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    let stageTimer;
    let progressTimer;
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    let elapsedTime = 0;

    const updateProgress = () => {
      progressTimer = setInterval(() => {
        elapsedTime += 50;
        const newProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
        setProgress(newProgress);

        // Determine current stage based on elapsed time
        let accumulatedTime = 0;
        for (let i = 0; i < stages.length; i++) {
          accumulatedTime += stages[i].duration;
          if (elapsedTime < accumulatedTime) {
            setCurrentStage(i);
            break;
          }
        }

        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }, 50);
    };

    updateProgress();

    return () => {
      if (stageTimer) clearTimeout(stageTimer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-darker/95 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-white dark:bg-dark border border-gray-300 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center relative">
            <i className={`${stages[currentStage].icon} text-primary text-4xl animate-pulse`}></i>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#2a363b] dark:text-white text-center mb-2">Processing Document</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Please wait while we process your upload</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-darker rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-primary/50 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stages List */}
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                index === currentStage 
                  ? 'opacity-100 scale-105' 
                  : index < currentStage 
                  ? 'opacity-60' 
                  : 'opacity-30'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStage 
                  ? 'bg-green-500/20 border-2 border-green-500' 
                  : index === currentStage 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : 'bg-gray-700 border-2 border-gray-600'
              }`}>
                {index < currentStage ? (
                  <i className="bi bi-check text-green-400 text-sm font-bold"></i>
                ) : index === currentStage ? (
                  <i className={`${stage.icon} text-primary text-xs`}></i>
                ) : (
                  <span className="text-gray-500 text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${
                index === currentStage 
                  ? 'text-white font-medium' 
                  : index < currentStage 
                  ? 'text-gray-400 line-through' 
                  : 'text-gray-500'
              }`}>
                {stage.label}
              </span>
              {index === currentStage && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Do not close this window. You will be redirected automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProcessingOverlay;
