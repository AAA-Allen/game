import { motion } from "framer-motion";
import { ArrowLeft, ChevronUp, Crown, Medal, Star, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LeaderboardEntry } from "@/types/api";

type FilterKey = "all" | "monthly" | "weekly";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全服" },
  { key: "monthly", label: "本月" },
  { key: "weekly", label: "本周" },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "alpha01", username: "代码剑圣", level: 25, xp: 15400, title: "全栈大师", completedLevels: 48 },
  { rank: 2, userId: "beta02", username: "像素法师", level: 22, xp: 13100, title: "算法王者", completedLevels: 42 },
  { rank: 3, userId: "gamma03", username: "网络游侠", level: 20, xp: 11800, title: "CSS幻术师", completedLevels: 38 },
  { rank: 4, userId: "delta04", username: "逻辑领主", level: 18, xp: 9600, title: "JS操纵者", completedLevels: 34 },
  { rank: 5, userId: "epsilon05", username: "数据猎人", level: 16, xp: 8200, title: "数据库探险家", completedLevels: 30 },
  { rank: 6, userId: "zeta06", username: "脚本忍者", level: 14, xp: 6800, title: "前端守卫", completedLevels: 25 },
  { rank: 7, userId: "current", username: "你", level: 7, xp: 3200, title: "代码冒险家", completedLevels: 12 },
  { rank: 8, userId: "eta08", username: "编译勇者", level: 12, xp: 5500, title: "调试专家", completedLevels: 22 },
  { rank: 9, userId: "theta09", username: "递归骑士", level: 10, xp: 4600, title: "递归大师", completedLevels: 18 },
  { rank: 10, userId: "iota10", username: "异步射手", level: 9, xp: 3900, title: "Promise战士", completedLevels: 15 },
  { rank: 11, userId: "kappa11", username: "缓存行者", level: 8, xp: 3500, title: "性能优化师", completedLevels: 14 },
  { rank: 12, userId: "lambda12", username: "守卫先锋", level: 6, xp: 2800, title: "类型卫士", completedLevels: 10 },
  { rank: 13, userId: "mu13", username: "状态舵手", level: 5, xp: 2100, title: "React学徒", completedLevels: 8 },
  { rank: 14, userId: "nu14", username: "样式织者", level: 4, xp: 1500, title: "CSS新手", completedLevels: 6 },
  { rank: 15, userId: "xi15", username: "初行代码", level: 2, xp: 600, title: "代码学徒", completedLevels: 3 },
];

const rankColors = [
  { border: "border-amber-400", glow: "shadow-[0_0_20px_rgba(255,200,50,0.25)]", bg: "from-amber-400/10 via-amber-500/5 to-transparent" },
  { border: "border-slate-300", glow: "shadow-[0_0_16px_rgba(200,210,220,0.2)]", bg: "from-slate-300/10 via-slate-400/5 to-transparent" },
  { border: "border-amber-700", glow: "shadow-[0_0_14px_rgba(180,120,50,0.2)]", bg: "from-amber-700/10 via-amber-800/5 to-transparent" },
];

const rankMedalIcons = [Crown, Medal, Medal];
const rankMedalColors = ["text-amber-300", "text-slate-200", "text-amber-600"];

const podiumLayout = [
  { position: "center", order: 1, offsetY: "translateY(0)", scale: "scale(1)" },
  { position: "left", order: 0, offsetY: "translateY(18px)", scale: "scale(0.92)" },
  { position: "right", order: 2, offsetY: "translateY(32px)", scale: "scale(0.88)" },
];

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function xpToPercent(xp: number, maxXp: number): number {
  if (maxXp <= 0) return 0;
  return Math.min((xp / maxXp) * 100, 100);
}

function nextLevelXp(xp: number): number {
  if (xp < 1000) return 1000;
  if (xp < 3000) return 3000;
  if (xp < 6000) return 6000;
  if (xp < 10000) return 10000;
  if (xp < 16000) return 16000;
  return 20000;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const topThree = mockLeaderboard.slice(0, 3);
  const restRankings = mockLeaderboard.slice(3);

  const maxXp = mockLeaderboard.reduce((max, entry) => Math.max(max, entry.xp), 0);

  return (
    <div className="relative min-h-screen overflow-hidden text-stone-100">
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-35" />

      <div className="relative mx-auto max-w-[1100px] px-3 py-4">
        {/* ── Status Bar ── */}
        <div className="pixel-status-bar mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-amber-300" />
            <h1 className="font-display text-[16px] leading-8 text-[#ffd45a]">
              排行榜
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-xs">
              <Users size={14} className="text-cyan-200" />
              {mockLeaderboard.length} 位冒险者
            </div>
            <button
              type="button"
              className="pixel-button-secondary flex items-center gap-2 px-4 py-2 text-xs"
              onClick={() => navigate("/map")}
            >
              <ArrowLeft size={14} />
              返回地图
            </button>
          </div>
        </div>

        {/* ── Podium Section ── */}
        <section className="mb-6">
          <div className="flex flex-col items-center justify-end gap-1 sm:flex-row sm:items-end sm:gap-0">
            {podiumLayout.map((layout, index) => {
              const entryIndex = layout.order;
              const entry = topThree[entryIndex];
              if (!entry) return null;
              const colors = rankColors[entryIndex];
              const Icon = rankMedalIcons[entryIndex];
              const medalColor = rankMedalColors[entryIndex];

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12 }}
                  className={`flex w-full flex-col items-center px-2 sm:w-auto ${
                    layout.position === "center"
                      ? "z-10 sm:-mx-2"
                      : "z-0"
                  }`}
                  style={{ transform: layout.scale }}
                >
                  {/* Crown / Medal */}
                  <div className="mb-1">
                    {entryIndex === 0 ? (
                      <Crown size={28} className="text-amber-300 drop-shadow-[0_0_10px_rgba(255,200,50,0.6)]" />
                    ) : (
                      <Medal size={24} className={medalColor} />
                    )}
                  </div>

                  {/* Avatar placeholder */}
                  <div
                    className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full border-2 ${colors.border} bg-gradient-to-b ${colors.bg} ${colors.glow}`}
                  >
                    <span className="font-display text-lg text-stone-100">
                      {entry.username.charAt(0)}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className={`pixel-map-tile w-full min-w-[180px] px-4 py-3 text-center sm:min-w-[200px] ${
                      entryIndex === 0 ? "border-amber-400/60" : ""
                    }`}
                    style={
                      entryIndex === 0
                        ? { boxShadow: "0 0 30px rgba(255,200,50,0.15), 0 10px 0 rgba(5,10,18,0.9)" }
                        : undefined
                    }
                  >
                    <p className="font-display text-[10px] leading-6 text-stone-100">
                      {entry.username}
                    </p>
                    <p className="mt-1 text-xs text-slate-300">{entry.title}</p>
                    <div className="mt-2 flex items-center justify-center gap-3 text-xs">
                      <span className="pixel-chip px-2 py-0.5 text-[10px] text-cyan-200">
                        Lv.{entry.level}
                      </span>
                      <span className="flex items-center gap-1 text-amber-200">
                        <Zap size={12} />
                        {entry.xp.toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {entry.completedLevels} 关通关
                    </p>
                  </div>

                  {/* Base height offset */}
                  <div
                    className={`h-6 w-full rounded-b-lg ${
                      entryIndex === 0
                        ? "bg-gradient-to-t from-amber-500/20 to-transparent"
                        : entryIndex === 1
                          ? "bg-gradient-to-t from-slate-400/15 to-transparent"
                          : "bg-gradient-to-t from-amber-700/15 to-transparent"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Filter Tabs ── */}
        <div className="mb-4 flex items-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={
                activeFilter === filter.key
                  ? "pixel-button px-5 py-2.5 text-xs"
                  : "pixel-button-secondary px-5 py-2.5 text-xs"
              }
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
          <div className="ml-auto hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <BarChartIcon className="h-4 w-4" />
            <span>数据每 5 分钟更新</span>
          </div>
        </div>

        {/* ── Rankings Table ── */}
        <section className="pixel-panel overflow-hidden p-1">
          {/* Header row (hidden on very small screens) */}
          <div className="hidden items-center gap-2 px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:flex">
            <span className="w-12 shrink-0 text-center">排名</span>
            <span className="flex-1">冒险者</span>
            <span className="w-16 shrink-0 text-center">等级</span>
            <span className="w-32 shrink-0 text-center">经验值</span>
            <span className="w-24 shrink-0 text-center">通关</span>
          </div>

          <div className="max-h-[580px] space-y-2 overflow-y-auto px-2 pb-3 pt-2">
            {restRankings.map((entry, index) => {
              const isCurrentUser = entry.userId === "current";
              const entryMaxXp = nextLevelXp(entry.xp);
              const xpPercent = xpToPercent(entry.xp, entryMaxXp);

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`pixel-map-tile flex items-center gap-3 px-4 py-3 transition-colors ${
                    isCurrentUser
                      ? "border-[#55d6c2]/60 shadow-[0_0_16px_rgba(85,214,194,0.12)]"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="flex w-10 shrink-0 items-center justify-center">
                    {entry.rank <= 3 ? (
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          entry.rank === 1
                            ? "bg-amber-400/20 text-amber-300"
                            : entry.rank === 2
                              ? "bg-slate-300/20 text-slate-200"
                              : "bg-amber-700/20 text-amber-600"
                        }`}
                      >
                        {entry.rank}
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-slate-400">
                        {String(entry.rank).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  {/* Username + Title */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-stone-100">
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <span className="pixel-chip px-2 py-0.5 text-[9px] text-cyan-200">
                          当前
                        </span>
                      )}
                      {entry.rank === 1 && (
                        <ChevronUp size={14} className="shrink-0 text-amber-300" />
                      )}
                    </div>
                    <p className="truncate text-[10px] text-slate-400">{entry.title}</p>
                  </div>

                  {/* Level */}
                  <div className="hidden w-16 shrink-0 text-center sm:block">
                    <span className="pixel-chip px-2 py-1 text-[10px] text-cyan-200">
                      Lv.{entry.level}
                    </span>
                  </div>

                  {/* XP */}
                  <div className="hidden w-32 shrink-0 sm:block">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-medium text-amber-200">
                        {entry.xp.toLocaleString()}
                      </span>
                      <div className="w-16">
                        <div className="pixel-progress h-2">
                          <span style={{ width: `${xpPercent}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completed levels */}
                  <div className="hidden w-24 shrink-0 text-center sm:block">
                    <span className="text-xs text-slate-300">
                      {entry.completedLevels}
                    </span>
                  </div>

                  {/* Mobile: compact stats row */}
                  <div className="flex items-center gap-2 sm:hidden">
                    <span className="pixel-chip px-2 py-0.5 text-[9px] text-cyan-200">
                      Lv.{entry.level}
                    </span>
                    <span className="text-[10px] text-amber-200">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Your position floating badge ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-6 right-6 z-40 hidden sm:block"
        >
          <div className="pixel-map-tile border-[#55d6c2]/40 px-4 py-3 shadow-[0_0_20px_rgba(85,214,194,0.1)]">
            <p className="text-[10px] text-slate-400">我的排名</p>
            <p className="font-display mt-1 text-lg text-[#55d6c2]">#7</p>
            <p className="text-[10px] text-slate-400">3200 XP</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
