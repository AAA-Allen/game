import { LogOut, Sparkles, type LucideIcon } from "lucide-react";
import type { Location } from "react-router-dom";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

type MapAdventureRailProps = {
  currentLevel: number;
  currentXp: number;
  hintDescription: string;
  location: Location;
  menuItems: MenuItem[];
  username?: string;
  onLogout: () => void;
  onNavigate: (path: string) => void;
};

export function MapAdventureRail({
  currentLevel,
  currentXp,
  hintDescription,
  location,
  menuItems,
  username,
  onLogout,
  onNavigate,
}: MapAdventureRailProps) {
  return (
    <aside className="quest-panel flex min-h-0 flex-col gap-3 overflow-hidden px-3 py-3">
      <div className="rounded-panel border border-white/8 bg-white/[0.03] px-3 py-3">
        <p className="font-display text-[13px] leading-6 text-[#ffe58b]">WebQuest</p>
        <p className="mt-1 text-[11px] leading-5 text-slate-400">Adventure World</p>
      </div>

      <div className="rounded-panel border border-white/8 bg-white/[0.03] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-orb border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(115,215,255,0.32),transparent_60%),linear-gradient(180deg,rgba(42,74,121,0.88),rgba(20,34,57,0.94))] shadow-glow">
            <span className="font-display text-[10px] text-cyan-100">Lv</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-stone-50">{username ?? "游客"}</p>
            <p className="font-mono text-[11px] text-slate-400">
              Lv.{currentLevel} / {currentXp} XP
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;

          return (
            <button
              key={label}
              type="button"
              className={`group relative flex items-center gap-3 overflow-hidden rounded-quest px-3 py-2.5 text-left text-[13px] ${
                active ? "quest-button" : "quest-button-secondary"
              }`}
              onClick={() => onNavigate(path)}
            >
              {active ? (
                <span className="absolute inset-y-2 left-2 w-1 rounded-full bg-[#ffe58b]" />
              ) : null}
              <Icon
                size={16}
                className={`${active ? "text-white" : "text-cyan-100/85"} transition-transform duration-200 group-hover:scale-110`}
              />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-panel border border-white/8 bg-white/[0.03] px-3 py-3">
        <div className="flex items-center gap-2 text-cyan-100">
          <Sparkles size={13} />
          <p className="font-display text-[10px]">冒险提示</p>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-400">{hintDescription}</p>
      </div>

      <button
        type="button"
        className="quest-button-secondary flex items-center justify-center gap-2 px-3 py-2.5 text-[13px]"
        onClick={onLogout}
      >
        <LogOut size={15} />
        退出登录
      </button>
    </aside>
  );
}
