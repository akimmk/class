import React from "react";

const apps = [
  { id: "excel", name: "MS Excel", icon: "📊" },
  { id: "word", name: "MS Word", icon: "📄" },
  { id: "opera", name: "Opera Browser", icon: "🌐" },
  { id: "figma", name: "Figma", icon: "🎨" },
  { id: "photoshop", name: "Photoshop", icon: "🖌️" },
  { id: "terminal", name: "Terminal", icon: ">_" },
  { id: "telegram", name: "Telegram", icon: "✈️" },
  { id: "vivaldi", name: "Vivaldi", icon: "🦊" },
];

const navLinks = [
  { id: "favorites", label: "Favorites", active: true },
  { id: "recent", label: "Recent" },
  { id: "all", label: "All Apps" },
];

export const AppDrawer = () => {
  return (
    <div className="bg-white/10 fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] flex rounded-2xl shadow-2xl bg-white/30 backdrop-blur-lg border border-white/20">
      {/* Sidebar */}
      <div className="w-40 flex flex-col justify-between py-6 px-4 bg-black/30 rounded-l-2xl">
        <div>
          {navLinks.map((link) => (
            <div
              key={link.id}
              className={`mb-2 px-3 py-2 rounded-lg cursor-pointer text-white/80 hover:bg-white/10 transition ${link.active ? "bg-blue-600/80 text-white" : ""}`}
            >
              {link.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 transition">
            <span>⚙️</span> <span>Settings</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 transition">
            <span>⏻</span> <span>Shutdown</span>
          </button>
        </div>
      </div>
      {/* App Grid */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-8 content-start">
        {apps.map((app) => (
          <button
            key={app.id}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-white/20 transition"
            title={app.name}
          >
            <span className="text-3xl">{app.icon}</span>
            <span className="text-sm text-white drop-shadow font-medium">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
