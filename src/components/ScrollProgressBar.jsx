import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollable = Math.max(docHeight - winHeight, 1);
      const pct = Math.min(Math.max((scrollTop / scrollable) * 100, 0), 100);
      setProgress(pct);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      {/* Track */}
      <div className="h-1 bg-slate-800/40 backdrop-blur-sm">
        {/* Fill */}
        <div
          className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressBar;
