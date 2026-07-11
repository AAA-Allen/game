import { ArrowRight, Crown, Lock, ScrollText, Sparkles, Swords, Wand2 } from "lucide-react";

import { difficultyTone, type ZoneVisual } from "@/components/map/map-data";
import type { Level, ProgressData, Zone } from "@/types/api";

type QuestDrawerProps = {
  completedLevelIds: string[];
  displayedLevels: Level[];
  nextLevel: Level | undefined;
  progress: ProgressData | null;
  selectedZone: Zone | undefined;
  selectedZoneCompleted: number;
  selectedZoneLevelCount: number;
  selectedZoneProgress: number;
  selectedZoneRewardXp: number;
  selectedZoneUnlocked: boolean;
  selectedZoneVisual: ZoneVisual;
  isLevelUnlocked: (level: Level) => boolean;
  onStartLevel: (levelId: string) => void;
};

export function QuestDrawer({
  completedLevelIds,
  displayedLevels,
  nextLevel,
  progress,
  selectedZone,
  selectedZoneCompleted,
  selectedZoneLevelCount,
  selectedZoneProgress,
  selectedZoneRewardXp,
  selectedZoneUnlocked,
  selectedZoneVisual,
  isLevelUnlocked,
  onStartLevel,
}: QuestDrawerProps) {
  return (
    <aside className="quest-panel flex h-full min-h-0 max-h-full flex-col gap-3 overflow-hidden p-3">
      <div className="shrink-0">
        <p className="quest-badge inline-flex items-center gap-2 px-3 py-1.5 text-[10px] text-cyan-100">
          <ScrollText size={13} />
          Quest Drawer
        </p>
        <h2 className="mt-3 font-display text-[15px] leading-[1.8] text-[#ffe58b]">
          {selectedZone?.name ?? "请选择区域"}
        </h2>
        <p className="mt-2 text-xs leading-6 text-slate-300">
          {selectedZone?.description ?? "选择地图中的区域后，这里会显示剧情、Boss 情报与推荐任务。"}
        </p>
      </div>

      <div className="grid shrink-0 gap-2">
        <div className="quest-panel rounded-panel px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-slate-400">区域生态</p>
              <p className="mt-1.5 text-[13px] font-semibold text-stone-100">{selectedZoneVisual.biome}</p>
            </div>
            <div className="quest-badge px-3 py-1.5 text-[11px] text-cyan-100">
              {selectedZoneUnlocked ? "已点亮" : `Lv.${selectedZone?.requiredLevel ?? 0}`}
            </div>
          </div>
          <div className="mt-2 text-[11px] leading-5 text-slate-300">
            Boss：{selectedZoneVisual.bossName}
            <br />
            NPC：{selectedZoneVisual.npcName}
          </div>
        </div>

        <div className="quest-panel rounded-panel px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-slate-400">探索奖励</p>
              <p className="mt-1.5 text-[13px] font-semibold text-amber-100">{selectedZoneRewardXp} XP</p>
            </div>
            <div className="quest-badge px-3 py-1.5 text-[11px] text-amber-100">
              {selectedZoneVisual.rewardLabel}
            </div>
          </div>
          <div className="mt-2 text-[11px] leading-5 text-slate-300">
            清理该区域的副本后，将解锁新的世界节点与主线路径。
          </div>
        </div>
      </div>

      <div className="quest-panel shrink-0 rounded-panel px-3 py-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-300">
          <span>探索进度</span>
          <span className="font-mono">
            {selectedZoneLevelCount ? `${selectedZoneCompleted}/${selectedZoneLevelCount}` : "0/0"}
          </span>
        </div>
        <div className="pixel-progress h-3">
          <span style={{ width: `${selectedZoneProgress}%` }} />
        </div>
      </div>

      <div className="quest-panel shrink-0 rounded-panel px-3 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#ffe58b]">
              <Sparkles size={14} />
              <p className="font-display text-[10px]">推荐挑战</p>
            </div>
            <p className="mt-2 text-[13px] font-semibold text-stone-50">
              {nextLevel?.title ?? "暂无可挑战副本"}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-slate-300">
              {nextLevel?.subtitle ?? "继续点亮其他区域，等待新的旅程开启。"}
            </p>
          </div>
          <button
            type="button"
            disabled={!nextLevel || !selectedZoneUnlocked || !isLevelUnlocked(nextLevel)}
            className="quest-button flex items-center gap-2 px-3 py-2.5 text-[10px] font-display disabled:cursor-not-allowed disabled:opacity-55"
            onClick={() => {
              if (nextLevel) {
                onStartLevel(nextLevel.id);
              }
            }}
          >
            出发
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-display text-[11px] text-cyan-100">区域任务卷轴</p>
          <span className="font-mono text-[11px] text-slate-400">{displayedLevels.length} 个副本</span>
        </div>

        <div className="quest-scroll h-full min-h-0 space-y-2 overflow-y-auto pr-1">
          {displayedLevels.length ? (
            displayedLevels.map((level) => {
              const completed = completedLevelIds.includes(level.id);
              const current = progress?.currentLevelId === level.id;
              const unlocked = isLevelUnlocked(level);

              return (
                <div key={level.id} className="quest-panel rounded-panel px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] ${difficultyTone[level.difficulty]}`}
                        >
                          <Swords size={12} />
                          {level.difficulty.toUpperCase()}
                        </span>
                        {completed ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-100">
                            <Crown size={12} />
                            已通关
                          </span>
                        ) : null}
                        {!selectedZoneUnlocked || !unlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-[10px] text-slate-300">
                            <Lock size={12} />
                            封印中
                          </span>
                        ) : null}
                        {current ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] text-cyan-100">
                            <Wand2 size={12} />
                            当前推荐
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-2 text-[13px] font-semibold text-stone-50">{level.title}</h3>
                      <p className="mt-1.5 text-[11px] leading-5 text-slate-300">{level.description}</p>
                    </div>

                    <div className="quest-badge px-2.5 py-1.5 text-center text-[11px] text-amber-100">
                      +{level.rewardXp}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400">
                      {completed
                        ? "副本已通关"
                        : current
                          ? "主线路径推荐挑战"
                          : unlocked
                            ? "已解锁副本"
                            : "需先通关上一关"}
                    </div>
                    <button
                      type="button"
                      disabled={!selectedZoneUnlocked || !unlocked}
                      className="quest-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] disabled:cursor-not-allowed disabled:opacity-55"
                      onClick={() => onStartLevel(level.id)}
                    >
                      开始挑战
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="quest-panel rounded-panel px-4 py-4 text-sm leading-7 text-slate-300">
              这个区域暂未开放可挑战关卡，等你再推进主线，新的冒险就会出现。
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
