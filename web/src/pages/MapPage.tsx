import { motion } from "framer-motion";
import {
  ArrowRight,
  Gem,
  Lock,
  LogOut,
  Map,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getLevels, getProgress, getZones } from "@/services/game.service";
import { useAuthStore } from "@/store/auth.store";
import type { Level, ProgressData, Zone } from "@/types/api";

const menuItems = [
  { icon: Map, label: "世界地图", path: "/map" },
  { icon: Trophy, label: "技能树", path: "/skill-tree" },
  { icon: User, label: "角色档案", path: "/profile" },
  { icon: Shield, label: "排行榜", path: "/leaderboard" },
];

type ZoneVisual = {
  top: string;
  left: string;
  width: string;
  height: string;
  tone: string;
  biome: string;
  terrainLabel: string;
  terrainClass: string;
};

const defaultZoneVisual: ZoneVisual = {
  top: "50%",
  left: "50%",
  width: "184px",
  height: "118px",
  tone: "from-slate-200/20 via-slate-100/10 to-transparent",
  biome: "未知区域",
  terrainLabel: "探索中",
  terrainClass: "from-slate-500/50 via-slate-300/20 to-transparent",
};

const zoneVisuals: Record<string, ZoneVisual> = {
  "新手村": {
    top: "15%",
    left: "12%",
    width: "188px",
    height: "120px",
    tone: "from-lime-300/45 via-emerald-400/20 to-transparent",
    biome: "草地训练场",
    terrainLabel: "平原",
    terrainClass: "from-lime-300/65 via-emerald-500/30 to-transparent",
  },
  "CSS 森林": {
    top: "12%",
    left: "38%",
    width: "198px",
    height: "124px",
    tone: "from-emerald-300/45 via-cyan-300/20 to-transparent",
    biome: "样式森林",
    terrainLabel: "森林",
    terrainClass: "from-emerald-300/70 via-cyan-500/25 to-transparent",
  },
  "JS 风暴": {
    top: "15%",
    left: "71%",
    width: "196px",
    height: "124px",
    tone: "from-sky-300/40 via-indigo-400/18 to-transparent",
    biome: "脚本峡湾",
    terrainLabel: "雷暴",
    terrainClass: "from-sky-300/65 via-indigo-500/30 to-transparent",
  },
  "前端框架城": {
    top: "48%",
    left: "15%",
    width: "198px",
    height: "128px",
    tone: "from-slate-200/20 via-slate-400/18 to-transparent",
    biome: "组件城邦",
    terrainLabel: "城堡",
    terrainClass: "from-slate-300/55 via-slate-500/22 to-transparent",
  },
  "后端王国": {
    top: "47%",
    left: "44%",
    width: "208px",
    height: "130px",
    tone: "from-amber-300/30 via-orange-400/18 to-transparent",
    biome: "接口王国",
    terrainLabel: "高地",
    terrainClass: "from-amber-300/55 via-orange-500/25 to-transparent",
  },
  "数据库遗迹": {
    top: "46%",
    left: "73%",
    width: "200px",
    height: "128px",
    tone: "from-yellow-200/32 via-amber-300/18 to-transparent",
    biome: "存储遗迹",
    terrainLabel: "遗迹",
    terrainClass: "from-yellow-200/60 via-amber-500/25 to-transparent",
  },
  "全栈Boss战": {
    top: "78%",
    left: "44%",
    width: "220px",
    height: "132px",
    tone: "from-fuchsia-300/32 via-violet-400/18 to-transparent",
    biome: "终局战场",
    terrainLabel: "Boss",
    terrainClass: "from-fuchsia-300/55 via-violet-500/25 to-transparent",
  },
};

const routeSegments = [
  { left: "18%", top: "22%", width: "17%", rotate: "7deg" },
  { left: "47%", top: "21%", width: "18%", rotate: "-6deg" },
  { left: "23%", top: "49%", width: "18%", rotate: "-11deg" },
  { left: "51%", top: "49%", width: "18%", rotate: "8deg" },
  { left: "43%", top: "66%", width: "12%", rotate: "90deg" },
];

const reserveZones: Zone[] = [
  {
    id: "reserve-framework",
    name: "前端框架城",
    slug: "framework-city",
    description: "React 与 Vue 的高级副本等待解锁。",
    requiredLevel: 12,
  },
  {
    id: "reserve-backend",
    name: "后端王国",
    slug: "backend-kingdom",
    description: "Node.js 与接口设计王国尚未开启。",
    requiredLevel: 20,
  },
  {
    id: "reserve-db",
    name: "数据库遗迹",
    slug: "database-ruins",
    description: "MySQL 与 Redis 的遗迹还在沉睡。",
    requiredLevel: 28,
  },
  {
    id: "reserve-boss",
    name: "全栈Boss战",
    slug: "fullstack-boss",
    description: "终极项目副本将在后续版本开放。",
    requiredLevel: 40,
  },
];

const difficultyTone: Record<Level["difficulty"], string> = {
  easy: "text-lime-100 border-lime-500/30",
  medium: "text-amber-100 border-amber-500/30",
  hard: "text-rose-100 border-rose-500/30",
};

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
  const selectedZoneVisual = zoneVisuals[selectedZone?.name ?? ""] ?? defaultZoneVisual;

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
  const nextLevel = displayedLevels.find(
    (level) => !completedLevelIds.includes(level.id),
  ) ?? displayedLevels[0];

  return (
    <div className="relative h-screen overflow-hidden text-stone-100">
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-35" />

      <div className="relative mx-auto grid h-screen max-w-[1500px] gap-3 px-3 py-3 xl:grid-cols-[180px_minmax(0,1fr)_310px]">
        <aside className="pixel-panel flex min-h-0 flex-col gap-4 overflow-hidden p-4">
          <div className="pixel-outline bg-[linear-gradient(180deg,#143150,#0f1f32)] px-4 py-3">
            <p className="font-display text-[17px] leading-7 text-[#ffd45a]">WebQuest</p>
          </div>

          <div className="pixel-map-tile p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-slate-600 bg-[#173149] text-cyan-200 shadow-[0_4px_0_0_#0d1725]">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-100">
                  {user?.username ?? "游客"}
                </p>
                <p className="text-xs text-slate-400">Lv.{currentLevel} · {currentXp} XP</p>
              </div>
            </div>
          </div>

          <nav className="space-y-3">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${
                  location.pathname === path ? "pixel-button" : "pixel-button-secondary"
                }`}
                onClick={() => navigate(path)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="pixel-map-tile p-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-lime-200">
              <Sparkles size={13} />
              <span className="font-display text-[10px]">冒险提示</span>
            </div>
            <p className="mt-2 leading-6">
              探索选中区域，完成推荐副本来累计 XP，解锁下一地图。盾牌 = 已解锁，锁图标 = 需升级。
            </p>
          </div>

          <button
            type="button"
            className="pixel-button-secondary flex items-center justify-center gap-2 px-4 py-3 text-sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut size={16} />
            退出登录
          </button>
        </aside>

        <main className="flex min-h-0 flex-col gap-3">
          <div className="pixel-status-bar flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <div className="flex flex-wrap gap-2">
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-xs">
                <Map size={13} className="text-cyan-200" />
                {selectedZone?.name ?? "地图加载中"}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5">
                <Zap size={13} className="text-amber-200" />
                {currentXp} XP
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5">
                <Star size={13} className="text-amber-200" />
                {completedLevelIds.length} 通关
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5">
                <Gem size={13} className="text-cyan-200" />
                {unlockedZoneTotal} 区域
              </div>
            </div>
          </div>

          {error ? (
            <div className="pixel-outline bg-[#3a1a25] px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <section className="pixel-panel relative flex min-h-0 flex-1 flex-col overflow-hidden p-4">
            <div className="absolute inset-0 pixel-grid-bg opacity-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(111,227,193,0.14),transparent_20%),radial-gradient(circle_at_78%_18%,rgba(107,154,255,0.16),transparent_18%),radial-gradient(circle_at_50%_72%,rgba(194,117,255,0.12),transparent_18%),linear-gradient(180deg,rgba(8,18,31,0.22),transparent_30%,rgba(4,10,18,0.26))]" />

            <div className="relative flex shrink-0 flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-[22px] leading-[1.8] text-[#ffe58b]">
                  世界地图主舞台
                </h1>
              </div>
            </div>

            <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-[12px] border-2 border-slate-700 bg-[linear-gradient(180deg,#14365d_0%,#13345b_26%,#0d2a4a_46%,#0e223b_60%,#0c1625_100%)] shadow-[inset_0_0_0_3px_#091321]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.06),transparent_30%),repeating-linear-gradient(180deg,transparent_0,transparent_20px,rgba(255,255,255,0.02)_20px,rgba(255,255,255,0.02)_21px)]" />
              <div className="absolute left-6 top-6 pixel-outline bg-[#0f2035]/90 px-3 py-2 text-[10px] text-cyan-100">
                冒险路径自左向右推进
              </div>
              <div className="absolute right-6 top-6 pixel-outline bg-[#0f2035]/90 px-3 py-2 text-[10px] text-amber-100">
                当前视角：{selectedZoneVisual.biome}
              </div>

              <div className="relative h-full min-h-0">
                <div className="absolute left-[6%] top-[10%] h-7 w-7 rounded-[6px] border-2 border-[#9ad0ff]/30 bg-[#f0f8ff]/10" />
                <div className="absolute left-[82%] top-[15%] h-5 w-5 rounded-[6px] border-2 border-[#9ad0ff]/25 bg-[#f0f8ff]/10" />
                <div className="absolute left-[12%] top-[76%] h-6 w-6 rounded-[6px] border-2 border-[#bdfcc4]/25 bg-[#f0f8ff]/10" />
                <div className="absolute left-[85%] top-[68%] h-8 w-8 rounded-[8px] border-2 border-[#f8dd8e]/20 bg-[#f0f8ff]/10" />

                {routeSegments.map((segment, index) => (
                  <div
                    key={`${segment.left}-${segment.top}`}
                    className="absolute h-[8px] rounded-full opacity-85"
                    style={{
                      left: segment.left,
                      top: segment.top,
                      width: segment.width,
                      transform: `rotate(${segment.rotate})`,
                      background:
                        "repeating-linear-gradient(90deg, rgba(255,240,167,0.95) 0 12px, rgba(255,184,44,0.92) 12px 24px)",
                      boxShadow: "0 0 0 2px rgba(9,19,33,0.55), 0 0 18px rgba(255,207,87,0.18)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          index < 2
                            ? "repeating-linear-gradient(90deg, rgba(255,240,167,0.98) 0 12px, rgba(255,184,44,0.95) 12px 24px)"
                            : "repeating-linear-gradient(90deg, rgba(255,240,167,0.6) 0 12px, rgba(255,184,44,0.5) 12px 24px)",
                      }}
                    />
                  </div>
                ))}

                {selectedZone ? (
                  <div
                    className="absolute z-30"
                    style={{
                      top: `calc(${selectedZoneVisual.top} - 62px)`,
                      left: `calc(${selectedZoneVisual.left} + 58px)`,
                    }}
                  >
                    <div className="pixel-outline bg-[#101d2f] px-3 py-2 text-[10px] text-[#ffdd8c] shadow-[0_0_14px_rgba(255,207,87,0.22)]">
                      玩家当前位置
                    </div>
                    <div className="mx-auto h-4 w-[3px] bg-[#ffcf57]" />
                  </div>
                ) : null}

                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-300">
                    地图加载中...
                  </div>
                ) : (
                  visualZones.map((zone, index) => {
                    const unlocked = isZoneUnlocked(zone);
                    const active = selectedZoneId === zone.id;
                    const levelCount = levelCountByZoneId[zone.id] ?? 0;
                    const completedCount = completedCountByZoneId[zone.id] ?? 0;
                    const visual = zoneVisuals[zone.name] ?? defaultZoneVisual;

                    return (
                      <motion.button
                        key={zone.id}
                        type="button"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          top: visual.top,
                          left: visual.left,
                          width: visual.width,
                          height: visual.height,
                        }}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 text-left ${
                          active ? "z-20" : "z-10"
                        }`}
                      >
                        <div
                          className={`pixel-map-tile relative h-full overflow-hidden px-4 py-3 transition ${
                            active ? "scale-[1.03] border-[#ffcf57]" : ""
                          } ${!unlocked ? "opacity-70 saturate-75" : ""}`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${visual.tone}`} />
                          <div
                            className={`absolute inset-x-4 bottom-5 top-[34%] rounded-[10px] bg-gradient-to-br ${visual.terrainClass}`}
                          />
                          <div className="absolute inset-x-5 bottom-3 h-4 rounded-[6px] bg-[#0c1827]/70" />

                          <div className="relative flex h-full flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="pixel-chip px-2 py-1 text-[10px] text-slate-200">
                                ZONE {index + 1}
                              </span>
                              {unlocked ? (
                                <Shield size={16} className="text-lime-200" />
                              ) : (
                                <Lock size={16} className="text-slate-300" />
                              )}
                            </div>

                            <div>
                              <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-300">
                                <span>{visual.terrainLabel}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-400" />
                                <span>{visual.biome}</span>
                              </div>
                              <h3 className="font-display text-[11px] leading-6 text-stone-100">
                                {zone.name}
                              </h3>
                              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-200">
                                <span>
                                  {unlocked
                                    ? `${completedCount}/${levelCount || 0} 进度`
                                    : `Lv.${zone.requiredLevel} 解锁`}
                                </span>
                                <span>{unlocked ? `${levelCount} 个关卡` : "封锁中"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="pixel-outline bg-[#0d1a2b]/95 inline-flex flex-wrap items-center gap-4 px-4 py-2 text-xs text-slate-200">
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-[3px] border border-[#ffcf57] bg-[#ffcf57]/20" />
                      当前选中
                    </span>
                    <span className="flex items-center gap-2">
                      <Shield size={13} className="text-lime-200" />
                      已解锁
                    </span>
                    <span className="flex items-center gap-2">
                      <Lock size={13} className="text-slate-300" />
                      待解锁
                    </span>
                    <span className="flex items-center gap-2 text-slate-400">
                      <Map size={13} />
                      {selectedZone?.name ?? "未选择"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="pixel-panel flex min-h-0 flex-col gap-3 overflow-hidden p-4">
          <div className="shrink-0">
            <h2 className="font-display text-[18px] leading-[1.8] text-[#ffe58b]">
              {selectedZone?.name ?? "请选择区域"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {selectedZone?.description ?? "选择地图中的区域后，这里会显示详细挑战信息。"}
            </p>
          </div>

          <div className="grid shrink-0 gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <div className="pixel-map-tile p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-slate-300">{selectedZoneVisual.biome}</span>
                <span className={`text-xs ${selectedZoneUnlocked ? "text-lime-200" : "text-slate-400"}`}>
                  {selectedZoneUnlocked ? "已解锁" : `Lv.${selectedZone?.requiredLevel ?? 0}`}
                </span>
              </div>
            </div>

            <div className="pixel-map-tile p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-slate-300">累计奖励</span>
                <span className="text-xs text-amber-100">{selectedZoneRewardXp} XP</span>
              </div>
            </div>
          </div>

          <div className="pixel-map-tile shrink-0 p-3">
            <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
              <span>探索进度</span>
              <span>{selectedZoneLevelCount ? `${selectedZoneCompleted}/${selectedZoneLevelCount}` : "0/0"}</span>
            </div>
            <div className="pixel-progress h-3">
              <span style={{ width: `${selectedZoneProgress}%` }} />
            </div>
          </div>

          <div className="pixel-map-tile shrink-0 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-fuchsia-100">推荐副本</p>
                <p className="mt-1 text-sm text-stone-100">
                  {nextLevel?.title ?? "暂无可挑战副本"}
                </p>
              </div>
              <button
                type="button"
                disabled={!nextLevel || !selectedZoneUnlocked}
                className="pixel-button flex items-center gap-2 px-3 py-2 text-[10px] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  if (nextLevel) {
                    navigate(`/levels/${nextLevel.id}`);
                  }
                }}
              >
                出发
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-[11px] text-cyan-200">关卡列表</p>
              <span className="text-[11px] text-slate-400">
                {displayedLevels.length} 个关卡
              </span>
            </div>
            <div className="h-full space-y-2 overflow-y-auto pr-1">
            {displayedLevels.length ? (
              displayedLevels.map((level) => {
                const completed = completedLevelIds.includes(level.id);
                const current = progress?.currentLevelId === level.id;

                return (
                  <div key={level.id} className="pixel-map-tile p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div
                          className={`pixel-chip inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] ${
                            difficultyTone[level.difficulty]
                          }`}
                        >
                          <Swords size={12} />
                          {level.difficulty.toUpperCase()}
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-stone-100">
                          {level.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-300">
                          {level.description}
                        </p>
                      </div>
                      <div className="pixel-outline bg-[#372912] px-2 py-1 text-center text-xs text-amber-100">
                        +{level.rewardXp}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">
                        {completed ? "已通关" : current ? "推荐关卡" : "可挑战"}
                      </div>
                      <button
                        type="button"
                        disabled={!selectedZoneUnlocked}
                        className="pixel-button flex items-center gap-2 px-3 py-1.5 text-[10px] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => navigate(`/levels/${level.id}`)}
                      >
                        开始
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pixel-map-tile p-4 text-sm leading-6 text-slate-300">
                这个区域暂未开放可挑战关卡。
              </div>
            )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
