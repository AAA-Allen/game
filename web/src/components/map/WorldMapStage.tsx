import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";

import { IslandLandmark } from "@/components/map/IslandLandmark";
import { type RouteSegment, type ZoneVisual } from "@/components/map/map-data";
import type { Zone } from "@/types/api";

type WorldMapStageProps = {
  completedCountByZoneId: Record<string, number>;
  levelCountByZoneId: Record<string, number>;
  loading: boolean;
  routeSegments: RouteSegment[];
  selectedZone: Zone | undefined;
  selectedZoneId: string;
  selectedZoneVisual: ZoneVisual;
  visualZones: Zone[];
  onSelectZone: (zoneId: string) => void;
  isZoneUnlocked: (zone: Zone) => boolean;
  getZoneVisual: (zoneName?: string) => ZoneVisual;
};

export function WorldMapStage({
  completedCountByZoneId,
  getZoneVisual,
  isZoneUnlocked,
  levelCountByZoneId,
  loading,
  routeSegments,
  selectedZone,
  selectedZoneId,
  selectedZoneVisual,
  visualZones,
  onSelectZone,
}: WorldMapStageProps) {
  return (
    <section className="quest-panel-strong relative flex h-full min-h-0 flex-col overflow-hidden p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(126,217,87,0.08),transparent_24%),radial-gradient(circle_at_80%_12%,rgba(73,168,255,0.14),transparent_22%),radial-gradient(circle_at_54%_78%,rgba(139,92,246,0.1),transparent_26%)]" />

      <div className="quest-stage relative h-full min-h-0 flex-1 overflow-hidden p-4 xl:pr-[300px]">
        <div className="map-ocean-backdrop" />
        <div className="map-ocean-foam" />
        <div className="map-ocean-cloud map-ocean-cloud-left" />
        <div className="map-ocean-cloud map-ocean-cloud-right" />
        <div className="map-ocean-glow map-ocean-glow-left" />
        <div className="map-ocean-glow map-ocean-glow-right" />

        <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-3">
          <div className="quest-badge px-3 py-1.5 text-[10px] text-cyan-100">世界地图</div>
          <div className="hidden text-[11px] text-slate-300 md:block">
            {selectedZone?.name ?? "未选择区域"} · {selectedZoneVisual.biome}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-5 z-20 quest-badge flex items-center gap-4 px-4 py-2 text-[11px] text-slate-200">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffe58b] shadow-[0_0_10px_rgba(255,229,139,0.8)]" />
            当前选中
          </span>
          <span className="flex items-center gap-2">
            <Shield size={13} className="text-emerald-300" />
            已解锁
          </span>
          <span className="flex items-center gap-2">
            <Lock size={13} className="text-slate-300" />
            封印中
          </span>
        </div>

        {routeSegments.map((segment, index) => (
          <motion.div
            key={`${segment.left}-${segment.top}`}
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: index * 0.08 + 0.15 }}
            className="map-route-path pointer-events-none absolute z-0"
            style={{
              left: segment.left,
              top: segment.top,
              width: segment.width,
              transform: `rotate(${segment.rotate})`,
            }}
          />
        ))}

        {selectedZone ? (
          <div
            className="pointer-events-none absolute z-30"
            style={{
              top: `calc(${selectedZoneVisual.top} - 62px)`,
              left: `calc(${selectedZoneVisual.left} + 12px)`,
            }}
          >
            <div className="quest-badge px-3 py-2 text-[10px] text-[#ffe58b] shadow-[0_0_18px_rgba(255,207,87,0.16)]">
              玩家当前位置
            </div>
            <div className="mx-auto h-4 w-[2px] bg-gradient-to-b from-[#ffe58b] to-transparent" />
          </div>
        ) : null}

        <div className="relative h-full min-h-0">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-300">
              世界正在绘制中...
            </div>
          ) : (
            visualZones.map((zone, index) => {
              const unlocked = isZoneUnlocked(zone);
              const levelCount = levelCountByZoneId[zone.id] ?? 0;
              const completedCount = completedCountByZoneId[zone.id] ?? 0;
              const visual =
                selectedZone?.name === zone.name ? selectedZoneVisual : getZoneVisual(zone.name);

              return (
                <IslandLandmark
                  key={zone.id}
                  active={selectedZoneId === zone.id}
                  completedCount={completedCount}
                  index={index}
                  levelCount={levelCount}
                  unlocked={unlocked}
                  visual={visual}
                  zone={zone}
                  onSelect={onSelectZone}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
