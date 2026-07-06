import { motion } from "framer-motion";
import {
  ArrowRight,
  Gem,
  Home,
  Lock,
  LogOut,
  Map,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLevels, getProgress, getZones } from "@/services/game.service";
import { useAuthStore } from "@/store/auth.store";
import type { Level, ProgressData, Zone } from "@/types/api";

const menuItems = [
  { icon: Map, label: "世界地图", active: true },
  { icon: ScrollText, label: "任务", active: false },
  { icon: Trophy, label: "成就", active: false },
  { icon: User, label: "背包", active: false },
  { icon: Settings, label: "设置", active: false },
];

const zonePositions: Record<string, { top: string; left: string; tone: string }> = {
  "新手村": { top: "12%", left: "8%", tone: "from-lime-300/35 to-emerald-500/10" },
  "CSS 森林": { top: "10%", left: "37%", tone: "from-emerald-300/35 to-cyan-500/10" },
  "JS 风暴": { top: "14%", left: "70%", tone: "from-sky-300/35 to-indigo-500/10" },
  "前端框架城": { top: "50%", left: "14%", tone: "from-slate-200/20 to-slate-500/10" },
  "后端王国": { top: "48%", left: "42%", tone: "from-amber-300/25 to-orange-500/10" },
  "数据库遗迹": { top: "46%", left: "71%", tone: "from-yellow-300/25 to-amber-500/10" },
  "全栈Boss战": { top: "78%", left: "39%", tone: "from-fuchsia-300/25 to-violet-600/10" },
};

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

export default function MapPage() {
  const navigate = useNavigate();
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
  const selectedZone = visualZones.find((zone) => zone.id === selectedZoneId) ?? visualZones[0];
  const displayedLevels = useMemo(
    () => levels.filter((level) => level.zoneId === selectedZone?.id),
    [levels, selectedZone],
  );

  return (
    <div className="min-h-screen text-stone-100">
      <div className="mx-auto grid min-h-screen max-w-[1500px] gap-5 px-4 py-4 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        <aside className="pixel-panel flex flex-col gap-4 p-4">
          <div className="pixel-outline bg-[#102338] p-4">
            <p className="font-display text-[18px] leading-8 text-[#ffd45a]">WebQuest</p>
            <p className="mt-2 text-xs text-slate-300">Web 开发像素之旅</p>
          </div>

          <div className="pixel-map-tile flex items-center gap-3 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-slate-600 bg-[#173149] text-cyan-200 shadow-[0_4px_0_0_#0d1725]">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-100">{user?.username ?? "游客"}</p>
              <p className="text-xs text-slate-400">Lv.{progress?.currentLevel ?? user?.level ?? 1}</p>
            </div>
          </div>

          <nav className="space-y-3">
            {menuItems.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${
                  active ? "pixel-button" : "pixel-button-secondary"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="pixel-map-tile mt-auto p-4 text-sm text-slate-300">
            <p className="font-display text-[11px] text-lime-200">今日目标</p>
            <p className="mt-3 leading-6">选择一个已解锁区域，完成首个前端副本并获得 XP。</p>
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

        <main className="flex flex-col gap-5">
          <div className="pixel-status-bar flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              <div className="pixel-chip flex items-center gap-2 px-3 py-2 text-xs">
                <Home size={14} className="text-lime-200" />
                主城在线
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-2 text-xs">
                <Zap size={14} className="text-amber-200" />
                当前 XP {progress?.currentXp ?? user?.xp ?? 0}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="pixel-chip flex items-center gap-2 px-3 py-2">
                <Star size={14} className="text-amber-200" />
                已通关 {progress?.completedLevelIds.length ?? 0}
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-2">
                <Gem size={14} className="text-cyan-200" />
                解锁区域 {progress?.unlockedZoneIds.length ?? zones.length}
              </div>
            </div>
          </div>

          {error ? (
            <div className="pixel-outline bg-[#3a1a25] px-4 py-3 text-sm text-rose-200">{error}</div>
          ) : null}

          <section className="pixel-panel relative min-h-[720px] overflow-hidden p-5">
            <div className="absolute inset-0 pixel-grid-bg opacity-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(77,189,164,0.18),transparent_18%),radial-gradient(circle_at_70%_20%,rgba(86,160,255,0.14),transparent_18%),radial-gradient(circle_at_52%_70%,rgba(191,120,255,0.12),transparent_20%)]" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="font-display text-[11px] text-cyan-200">WORLD MAP</p>
                <h1 className="mt-3 font-display text-[24px] leading-[1.8] text-[#ffe58b]">选择你的冒险区域</h1>
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-2 text-xs text-slate-200">
                <Sparkles size={14} className="text-fuchsia-200" />
                像素地图模式
              </div>
            </div>

            <div className="relative mt-6 h-[600px] rounded-[12px] border-2 border-slate-700 bg-[linear-gradient(180deg,#0d2541_0%,#113054_36%,#0e2743_58%,#0d1e2e_100%)] shadow-[inset_0_0_0_3px_#091321]">
              <div className="absolute left-[17%] top-[22%] h-[2px] w-[21%] rotate-[9deg] bg-white/35" />
              <div className="absolute left-[49%] top-[21%] h-[2px] w-[22%] rotate-[-8deg] bg-white/35" />
              <div className="absolute left-[24%] top-[48%] h-[2px] w-[20%] rotate-[-10deg] bg-white/25" />
              <div className="absolute left-[51%] top-[50%] h-[2px] w-[22%] rotate-[10deg] bg-white/25" />
              <div className="absolute left-[39%] top-[68%] h-[2px] w-[14%] rotate-[90deg] bg-white/25" />

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-300">地图加载中...</div>
              ) : (
                visualZones.map((zone, index) => {
                  const unlocked =
                    progress?.unlockedZoneIds.includes(zone.id) ?? zone.isUnlocked ?? false;
                  const active = selectedZoneId === zone.id;
                  const levelCount = levels.filter((level) => level.zoneId === zone.id).length;
                  const position = zonePositions[zone.name] ?? { top: "50%", left: "50%", tone: "from-white/10 to-transparent" };

                  return (
                    <motion.button
                      key={zone.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.04 }}
                      style={{ top: position.top, left: position.left }}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`absolute w-[170px] -translate-x-1/2 -translate-y-1/2 text-left ${active ? "z-20" : "z-10"}`}
                    >
                      <div className={`pixel-map-tile overflow-hidden p-4 transition ${active ? "scale-[1.03]" : ""} ${!unlocked ? "opacity-65" : ""}`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${position.tone}`} />
                        <div className="relative">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="pixel-chip px-2 py-1 text-[10px] text-slate-200">{index + 1}</span>
                            {unlocked ? (
                              <Shield size={15} className="text-lime-200" />
                            ) : (
                              <Lock size={15} className="text-slate-400" />
                            )}
                          </div>
                          <h3 className="font-display text-[11px] leading-6 text-stone-100">{zone.name}</h3>
                          <p className="mt-2 text-xs text-slate-300">{unlocked ? `${levelCount} 个关卡` : `Lv.${zone.requiredLevel} 解锁`}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </section>
        </main>

        <aside className="pixel-panel flex flex-col gap-4 p-5">
          <div>
            <p className="font-display text-[11px] text-cyan-200">STAGE PANEL</p>
            <h2 className="mt-3 font-display text-[20px] leading-[1.9] text-[#ffe58b]">
              {selectedZone?.name ?? "请选择区域"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {selectedZone?.description ?? "选择地图中的区域后，这里会显示详细挑战信息。"}
            </p>
          </div>

          <div className="pixel-map-tile p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>区域探索进度</span>
              <span>{displayedLevels.length ? `${progress?.completedLevelIds.filter((id) => displayedLevels.some((level) => level.id === id)).length ?? 0}/${displayedLevels.length}` : "0/0"}</span>
            </div>
            <div className="pixel-progress h-4">
              <span style={{ width: `${displayedLevels.length ? ((progress?.completedLevelIds.filter((id) => displayedLevels.some((level) => level.id === id)).length ?? 0) / displayedLevels.length) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {displayedLevels.length ? (
              displayedLevels.map((level) => {
                const completed = progress?.completedLevelIds.includes(level.id) ?? false;
                const current = progress?.currentLevelId === level.id;

                return (
                  <div key={level.id} className="pixel-map-tile p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="pixel-chip inline-flex items-center gap-2 px-3 py-1 text-[10px] text-slate-200">
                          <Swords size={13} />
                          {level.difficulty.toUpperCase()}
                        </div>
                        <h3 className="mt-3 text-base font-semibold text-stone-100">{level.title}</h3>
                        <p className="mt-2 text-xs leading-6 text-slate-300">{level.description}</p>
                      </div>
                      <div className="pixel-outline bg-[#372912] px-3 py-2 text-center text-xs text-amber-100">
                        +{level.rewardXp}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">{completed ? "已通关" : current ? "推荐关卡" : "可挑战"}</div>
                      <button
                        type="button"
                        className="pixel-button flex items-center gap-2 px-3 py-2 text-[10px]"
                        onClick={() => navigate(`/levels/${level.id}`)}
                      >
                        开始
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pixel-map-tile p-5 text-sm leading-7 text-slate-300">
                这个区域暂未开放可挑战关卡。继续升级后，将解锁新的地图与副本内容。
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
