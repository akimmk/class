import React from "react";

export const Taskbar = ({ onStartClick }) => {
  return (
    <div
      className="fixed bottom-0 left-0 w-full h-14 bg-black/40 backdrop-blur-lg rounded-t-2xl flex items-center justify-between px-8 z-40 shadow-lg border-t border-white/10"
      style={{ backgroundColor: "#FBDB93" }}
    >
      {/* Start Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-white font-semibold text-lg shadow"
        onClick={onStartClick}
      >
        <span className="text-2xl">🟦</span>
        <span className="hidden sm:inline">Start</span>
      </button>
      {/* Centered App Icons (placeholder) */}
      <div className="flex gap-6">
        <span className="text-xl text-white/80">🌐</span>
        <span className="text-xl text-white/80">📄</span>
        <span className="text-xl text-white/80">🖌️</span>
      </div>
      {/* System Tray/Clock */}
      <div className="flex items-center gap-4 text-white/80">
        <span>🔊</span>
        <span>🔋</span>
        <span>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

