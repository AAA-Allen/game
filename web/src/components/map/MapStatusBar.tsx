import { Compass, Gem, Sparkles, Star, Zap } from "lucide-react";

type MapStatusBarProps = {
  completedCount: number;
  currentXp: number;
  selectedZoneName?: string;
  unlockedZoneTotal: number;
};

export function MapStatusBar({
  completedCount,
  currentXp,
  selectedZoneName,
  unlockedZoneTotal,
}: MapStatusBarProps) {
  return (
    <div className="quest-panel flex flex-wrap items-center justify-between gap-2 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="quest-badge flex items-center gap-2 px-3 py-1.5 text-[11px] text-cyan-100">
          <Compass size={13} />
          {selectedZoneName ? `${selectedZoneName} · 探索中` : "世界地图 · 未命名区域"}
        </div>
        <div className="quest-badge hidden items-center gap-2 px-3 py-1.5 text-[11px] text-slate-300 md:flex">
          <Sparkles size={13} className="text-[#ffe58b]" />
          今日主线：继续推进世界路线
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <div className="quest-badge flex items-center gap-2 px-3 py-1.5 text-amber-100">
          <Zap size={13} />
          <span className="font-mono">{currentXp} XP</span>
        </div>
        <div className="quest-badge flex items-center gap-2 px-3 py-1.5 text-slate-100">
          <Star size={13} className="text-[#ffe58b]" />
          <span className="font-mono">{completedCount} 通关</span>
        </div>
        <div className="quest-badge flex items-center gap-2 px-3 py-1.5 text-cyan-100">
          <Gem size={13} />
          <span className="font-mono">{unlockedZoneTotal} 区域</span>
        </div>
      </div>
    </div>
  );
}
