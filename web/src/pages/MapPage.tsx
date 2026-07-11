import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { MapAdventureRail } from "@/components/map/MapAdventureRail";
import { MapStatusBar } from "@/components/map/MapStatusBar";
import { QuestDrawer } from "@/components/map/QuestDrawer";
import {
  getZoneVisual,
  mapMenuItems,
  questHint,
  reserveZones,
  routeSegments,
} from "@/components/map/map-data";
import { WorldMapStage } from "@/components/map/WorldMapStage";
import { getLevels, getProgress, getZones } from "@/services/game.service";
import { useAuthStore } from "@/store/auth.store";
import type { Level, ProgressData, Zone } from "@/types/api";

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [zones, setZones] = useState<Zone[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      setError("");

      try {
        const [zoneData, levelData] = await Promise.all([getZones(), getLevels()]);
        let progressData: ProgressData | null = null;

        try {
          progressData = await getProgress();
        } catch {
          progressData = null;
        }

        setZones(zoneData);
        setLevels(levelData);
        setProgress(progressData);
        setSelectedZoneId(zoneData[0]?.id ?? reserveZones[0].id);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "地图加载失败");
      } finally {
        setLoading(false);
      }
    }

    void loadMapData();
  }, []);

  const visualZones = useMemo(() => [...zones, ...reserveZones], [zones]);
  const completedLevelIds = progress?.completedLevelIds ?? [];
  const unlockedZoneIds = progress?.unlockedZoneIds ?? [];
  const currentLevel = progress?.currentLevel ?? user?.level ?? 1;
  const currentXp = progress?.currentXp ?? user?.xp ?? 0;

  const levelCountByZoneId = useMemo(() => {
    return levels.reduce<Record<string, number>>((accumulator, level) => {
      accumulator[level.zoneId] = (accumulator[level.zoneId] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [levels]);

  const completedCountByZoneId = useMemo(() => {
    return levels.reduce<Record<string, number>>((accumulator, level) => {
      if (completedLevelIds.includes(level.id)) {
        accumulator[level.zoneId] = (accumulator[level.zoneId] ?? 0) + 1;
      }
      return accumulator;
    }, {});
  }, [completedLevelIds, levels]);

  const selectedZone = visualZones.find((zone) => zone.id === selectedZoneId) ?? visualZones[0];
  const selectedZoneVisual = getZoneVisual(selectedZone?.name);

  const displayedLevels = useMemo(
    () => levels.filter((level) => level.zoneId === selectedZone?.id),
    [levels, selectedZone],
  );

  function isZoneUnlocked(zone: Zone) {
    return unlockedZoneIds.includes(zone.id) || zone.isUnlocked === true;
  }

  const unlockedZoneTotal = visualZones.filter(isZoneUnlocked).length;
  const selectedZoneUnlocked = selectedZone ? isZoneUnlocked(selectedZone) : false;
  const selectedZoneCompleted = selectedZone
    ? completedCountByZoneId[selectedZone.id] ?? 0
    : 0;
  const selectedZoneLevelCount = selectedZone
    ? levelCountByZoneId[selectedZone.id] ?? 0
    : 0;
  const selectedZoneProgress =
    selectedZoneLevelCount > 0 ? (selectedZoneCompleted / selectedZoneLevelCount) * 100 : 0;
  const selectedZoneRewardXp = displayedLevels.reduce(
    (total, level) => total + level.rewardXp,
    0,
  );
  const firstLevelId = [...levels].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.id ?? "";

  function isLevelUnlocked(level: Level) {
    if (completedLevelIds.includes(level.id)) {
      return true;
    }

    return (progress?.currentLevelId ?? firstLevelId) === level.id;
  }

  const nextLevel = displayedLevels.find(
    (level) => !completedLevelIds.includes(level.id) && isLevelUnlocked(level),
  ) ?? displayedLevels.find((level) => isLevelUnlocked(level)) ?? displayedLevels[0];
  const nextLevelUnlocked = nextLevel ? isLevelUnlocked(nextLevel) : false;

  function handleNavigate(path: string) {
    navigate(path);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleStartLevel(levelId: string) {
    const targetLevel = levels.find((item) => item.id === levelId);

    if (!targetLevel) {
      setActionMessage("目标关卡不存在，请刷新后重试。");
      return;
    }

    if (!isLevelUnlocked(targetLevel)) {
      setActionMessage("该关卡尚未解锁，需要先通关上一关。");
      return;
    }

    setActionMessage("");
    navigate(`/levels/${levelId}`);
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[linear-gradient(180deg,#07111f_0%,#0b1830_44%,#132542_100%)] text-stone-100">
      <div className="absolute inset-0 pixel-grid-bg opacity-[0.03]" />
      <div className="absolute inset-0 pixel-stars opacity-[0.18]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(126,217,87,0.1),transparent_18%),radial-gradient(circle_at_82%_10%,rgba(73,168,255,0.12),transparent_22%),radial-gradient(circle_at_50%_82%,rgba(139,92,246,0.1),transparent_24%)]" />

      <div className="relative mx-auto grid h-screen max-w-[1620px] grid-rows-[minmax(0,1fr)] gap-3 px-3 py-3 md:grid-cols-[156px_minmax(0,1fr)] xl:grid-cols-[168px_minmax(0,1fr)]">
        <div className="h-full min-h-0 md:row-span-2 xl:row-span-1">
          <MapAdventureRail
            currentLevel={currentLevel}
            currentXp={currentXp}
            hintDescription={questHint.description}
            location={location}
            menuItems={mapMenuItems}
            username={user?.username}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        </div>

        <main className="flex h-full min-h-0 flex-col gap-4">
          <MapStatusBar
            completedCount={completedLevelIds.length}
            currentXp={currentXp}
            selectedZoneName={selectedZone?.name}
            unlockedZoneTotal={unlockedZoneTotal}
          />

          {error ? (
            <div className="rounded-quest border border-red-300/15 bg-red-500/10 px-4 py-3 text-sm text-rose-200 shadow-quest">
              {error}
            </div>
          ) : null}

          {!error && actionMessage ? (
            <div className="rounded-quest border border-amber-300/15 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 shadow-quest">
              {actionMessage}
            </div>
          ) : null}

          <div className="relative h-full min-h-0 flex-1">
            <WorldMapStage
              completedCountByZoneId={completedCountByZoneId}
              getZoneVisual={getZoneVisual}
              isZoneUnlocked={isZoneUnlocked}
              levelCountByZoneId={levelCountByZoneId}
              loading={loading}
              routeSegments={routeSegments}
              selectedZone={selectedZone}
              selectedZoneId={selectedZoneId}
              selectedZoneVisual={selectedZoneVisual}
              visualZones={visualZones}
              onSelectZone={setSelectedZoneId}
            />

            <div className="pointer-events-none absolute bottom-3 right-3 hidden max-h-[calc(100%-24px)] w-[214px] md:block xl:hidden">
              <div className="pointer-events-auto quest-panel flex h-full flex-col gap-3 p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/80">
                    当前区域
                  </p>
                  <h3 className="mt-2 font-display text-[11px] leading-6 text-[#ffe58b]">
                    {selectedZone?.name ?? "未选择"}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-300">
                    {nextLevel?.title ?? "继续探索以解锁新的副本。"}
                  </p>
                </div>

                <div className="quest-panel rounded-panel px-3 py-3">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-slate-300">
                    <span>区域进度</span>
                    <span className="font-mono">
                      {selectedZoneLevelCount
                        ? `${selectedZoneCompleted}/${selectedZoneLevelCount}`
                        : "0/0"}
                    </span>
                  </div>
                  <div className="pixel-progress h-3">
                    <span style={{ width: `${selectedZoneProgress}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!nextLevel || !selectedZoneUnlocked || !nextLevelUnlocked}
                  className="quest-button flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] font-display disabled:cursor-not-allowed disabled:opacity-55"
                  onClick={() => {
                    if (nextLevel) {
                      handleStartLevel(nextLevel.id);
                    }
                  }}
                >
                  进入挑战
                </button>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-3 right-3 hidden h-[calc(100%-24px)] w-[286px] xl:block">
              <div className="pointer-events-auto h-full">
                <QuestDrawer
                  completedLevelIds={completedLevelIds}
                  displayedLevels={displayedLevels}
                  nextLevel={nextLevel}
                  progress={progress}
                  selectedZone={selectedZone}
                  selectedZoneCompleted={selectedZoneCompleted}
                  selectedZoneLevelCount={selectedZoneLevelCount}
                  selectedZoneProgress={selectedZoneProgress}
                  selectedZoneRewardXp={selectedZoneRewardXp}
                  selectedZoneUnlocked={selectedZoneUnlocked}
                  selectedZoneVisual={selectedZoneVisual}
                  isLevelUnlocked={isLevelUnlocked}
                  onStartLevel={handleStartLevel}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
