import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";

import type { ZoneVisual } from "@/components/map/map-data";
import type { Zone } from "@/types/api";

type IslandLandmarkProps = {
  active: boolean;
  completedCount: number;
  index: number;
  levelCount: number;
  unlocked: boolean;
  visual: ZoneVisual;
  zone: Zone;
  onSelect: (zoneId: string) => void;
};

export function IslandLandmark({
  active,
  completedCount,
  index,
  levelCount,
  unlocked,
  visual,
  zone,
  onSelect,
}: IslandLandmarkProps) {
  const starCount =
    levelCount === 0 ? 0 : completedCount >= levelCount ? 3 : completedCount > 0 ? 1 : 0;

  const Icon = visual.icon;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: active ? 1.04 : 1.06, y: -4 }}
      style={{
        top: visual.top,
        left: visual.left,
        "--zone-accent": visual.accent,
        "--zone-glow": visual.glowColor,
      } as React.CSSProperties}
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left ${active ? "z-20" : ""}`}
      onClick={() => onSelect(zone.id)}
    >
      <div
        className={`flex flex-col items-center gap-2 ${unlocked ? "" : "opacity-55 saturate-[0.55]"}`}
      >
        {/* 岛屿/地标主体 */}
        <div className="relative">
          {/* 发光光晕 */}
          {unlocked && (
            <div
              className={`absolute -inset-4 rounded-full transition-all duration-500 ${active ? "opacity-100 blur-2xl" : "opacity-60 blur-xl"}`}
              style={{
                background: `radial-gradient(circle, ${visual.glowColor}, transparent 72%)`,
              }}
            />
          )}

          {/* 六边形地标 */}
          <div
            className={`relative h-[clamp(82px,6.8vw,108px)] w-[clamp(78px,6.4vw,102px)] transition-all duration-200 ${active ? "drop-shadow-[0_0_28px_var(--zone-glow)]" : "drop-shadow-[0_8px_18px_rgba(2,8,16,0.45)]"}`}
          >
            {/* 六边形背景 */}
            <svg
              viewBox="0 0 100 110"
              className="h-full w-full"
              style={{ filter: unlocked ? "none" : "grayscale(0.5)" }}
            >
              <defs>
                <linearGradient id={`hex-bg-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={visual.topLight} />
                  <stop offset="55%" stopColor={visual.topMid} />
                  <stop offset="100%" stopColor={visual.topDark} />
                </linearGradient>

                <linearGradient id={`hex-border-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={visual.sandLight} />
                  <stop offset="100%" stopColor={visual.sandDark} />
                </linearGradient>

                {/* 选中高亮边框 */}
                {active && (
                  <filter id={`hex-glow-${zone.id}`}>
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={visual.accent} floodOpacity="0.6" />
                  </filter>
                )}
              </defs>

              {/* 外部边框（沙滩色） */}
              <polygon
                points="50,2 94,27 94,83 50,108 6,83 6,27"
                fill={`url(#hex-border-${zone.id})`}
              />

              {/* 内部主色（草地/地表色） */}
              <polygon
                points="50,8 88,30 88,80 50,102 12,80 12,30"
                fill={`url(#hex-bg-${zone.id})`}
              />

              {/* 表面纹理光泽 */}
              <ellipse cx="38" cy="44" rx="22" ry="16" fill="rgba(255,255,255,0.08)" />
              <ellipse cx="60" cy="64" rx="12" ry="8" fill="rgba(0,0,0,0.06)" />
            </svg>

            {/* 编号徽章 */}
            <div className="absolute left-1/2 top-[10%] z-10 -translate-x-1/2">
              <div
                className="flex h-[clamp(18px,1.5vw,24px)] w-[clamp(18px,1.5vw,24px)] items-center justify-center rounded-full text-[clamp(7px,0.6vw,10px)] font-bold text-white shadow-[0_0_0_3px_rgba(8,18,31,0.25)]"
                style={{
                  background: `linear-gradient(180deg, ${visual.accent}CC, ${visual.accent}88)`,
                }}
              >
                {index + 1}
              </div>
            </div>

            {/* 锁定/已解锁标记 */}
            {!unlocked && (
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-[clamp(26px,2.2vw,36px)] w-[clamp(26px,2.2vw,36px)] items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                  <Lock size={clampVal(14, 18, 1.4)} className="text-white/80" />
                </div>
              </div>
            )}

            {/* 区域图标 */}
            <div
              className="absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
              style={{ opacity: unlocked ? 1 : 0.3 }}
            >
              <Icon
                size={clampVal(22, 30, 2.4)}
                className={unlocked ? visual.iconTone : "text-white/50"}
                strokeWidth={1.6}
              />
            </div>
          </div>
        </div>

        {/* 标签 */}
        <div
          className={`min-w-[clamp(92px,7.6vw,124px)] rounded-[clamp(12px,1vw,18px)] px-[clamp(8px,0.7vw,14px)] py-[clamp(6px,0.5vw,10px)] text-center shadow-[0_8px_18px_rgba(2,8,16,0.22)] backdrop-blur-[10px] ${active ? "ring-1" : ""}`}
          style={{
            background: `linear-gradient(180deg, rgba(19,37,66,0.92), rgba(10,18,33,0.88))`,
            border: `1px solid ${unlocked ? `${visual.accent}44` : "rgba(220,232,255,0.08)"}`,
            ...(active ? { boxShadow: `0 0 20px ${visual.glowColor}` } : {}),
          }}
        >
          <p
            className="font-display text-[clamp(7px,0.58vw,9px)]"
            style={{ color: unlocked ? visual.accent : "#8899ad" }}
          >
            {zone.name}
          </p>
          <p className="mt-[2px] text-[clamp(8px,0.62vw,10px)] text-slate-300">
            {unlocked
              ? `${completedCount}/${levelCount || 0} 关`
              : `Lv.${zone.requiredLevel}`}
          </p>
        </div>

        {/* 星级 */}
        <div className="flex gap-[3px]">
          {[0, 1, 2].map((starIndex) => (
            <Star
              key={`${zone.id}-${starIndex}`}
              size={clampVal(10, 12, 0.9)}
              className={
                starIndex < starCount
                  ? "fill-[#ffcf57] text-[#ffcf57] drop-shadow-[0_0_6px_rgba(255,207,87,0.3)]"
                  : "text-white/25"
              }
            />
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function clampVal(min: number, max: number, vw: number): number {
  if (typeof window === "undefined") return max;
  const screenW = typeof window !== "undefined" ? window.innerWidth : 1280;
  const val = (screenW * vw) / 100;
  return Math.max(min, Math.min(max, val));
}
