import { motion } from "framer-motion";
import {
  ArrowRight,
  Lock,
  LogOut,
  Map,
  Shield,
  Sparkles,
  Star,
  Swords,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLevels, getProgress, getZones } from "@/services/game.service";
import { useAuthStore } from "@/store/auth.store";
import type { Level, ProgressData, Zone } from "@/types/api";

const zoneThemes: Record<string, string> = {
  "新手村": "from-emerald-300/25 via-lime-200/15 to-transparent",
  "CSS 森林": "from-teal-300/25 via-cyan-200/15 to-transparent",
  "JS 风暴": "from-sky-300/25 via-indigo-200/15 to-transparent",
};

export default function MapPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [zones, setZones] = useState<Zone[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      setError("");

      try {
        const [zoneData, levelData] = await Promise.all([
          getZones(),
          getLevels(),
        ]);
        let progressData: ProgressData | null = null;

        try {
          progressData = await getProgress();
        } catch {
          progressData = null;
        }

        setZones(zoneData);
        setLevels(levelData);
        setProgress(progressData);
        setSelectedZoneId(zoneData[0]?.id ?? "");
      } catch (requestError) {
        setError(
          requestError instanceof Error ? requestError.message : "地图加载失败",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMapData();
  }, []);

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0];

  const displayedLevels = useMemo(
    () => levels.filter((level) => level.zoneId === selectedZone?.id),
    [levels, selectedZone],
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(88,197,255,0.16),_transparent_28%),linear-gradient(180deg,_#08121d,_#0b1727_40%,_#091018_100%)] text-stone-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs tracking-[0.22em] text-cyan-100 uppercase">
              <Map size={14} />
              World Map
            </div>
            <h1 className="mt-4 font-display text-4xl text-stone-50">WebQuest 世界地图</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
              按照解锁顺序挑战你的前端区域。每一块地图都代表一组技术能力，每一关都记录你的成长。
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-black/20 p-4 text-sm md:min-w-[300px]">
            <div className="flex items-center justify-between text-stone-300">
              <span>冒险者</span>
              <span className="font-semibold text-stone-100">{user?.username ?? "游客"}</span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span>当前等级</span>
              <span className="font-semibold text-emerald-200">Lv.{progress?.currentLevel ?? user?.level ?? 1}</span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span>总经验</span>
              <span className="font-semibold text-cyan-200">{progress?.currentXp ?? user?.xp ?? 0} XP</span>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut size={16} />
              退出登录
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 px-5 py-4 text-rose-200">
            {error}
          </div>
        ) : null}

        <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.24em] text-stone-400 uppercase">
                  技术大陆
                </p>
                <h2 className="mt-2 font-display text-3xl text-stone-50">探索区域</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-4 py-2 text-xs text-emerald-100">
                <Sparkles size={14} />
                已打通认证与数据库
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-[1.5rem] bg-white/5"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {zones.map((zone, index) => {
                  const unlocked =
                    progress?.unlockedZoneIds.includes(zone.id) ?? zone.isUnlocked ?? false;
                  const levelCount = levels.filter((level) => level.zoneId === zone.id).length;

                  return (
                    <motion.button
                      key={zone.id}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => unlocked && setSelectedZoneId(zone.id)}
                      className={`relative overflow-hidden rounded-[1.8rem] border p-5 text-left transition ${
                        selectedZoneId === zone.id
                          ? "border-cyan-300/45 bg-cyan-300/10"
                          : "border-white/10 bg-black/20 hover:bg-white/5"
                      } ${unlocked ? "" : "opacity-60"}`}
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                          zoneThemes[zone.name] ?? "from-white/5 to-transparent"
                        }`}
                      />
                      <div className="relative flex items-start justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.18em] text-stone-300 uppercase">
                            {unlocked ? <Shield size={14} /> : <Lock size={14} />}
                            {unlocked ? "已解锁" : `Lv.${zone.requiredLevel} 解锁`}
                          </div>
                          <h3 className="mt-4 font-display text-2xl text-stone-50">{zone.name}</h3>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
                            {zone.description}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                          <p className="text-xs text-stone-400">关卡数量</p>
                          <p className="mt-1 text-lg font-semibold text-stone-100">{levelCount}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="mb-6">
              <p className="text-xs tracking-[0.24em] text-stone-400 uppercase">挑战面板</p>
              <h2 className="mt-2 font-display text-3xl text-stone-50">
                {selectedZone?.name ?? "请选择区域"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                {selectedZone?.description ?? "选择左侧区域后，这里会展示可挑战的关卡。"}
              </p>
            </div>

            <div className="space-y-4">
              {displayedLevels.map((level) => {
                const completed = progress?.completedLevelIds.includes(level.id) ?? false;
                const current = progress?.currentLevelId === level.id;

                return (
                  <div
                    key={level.id}
                    className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-stone-300">
                          <Swords size={14} />
                          {level.difficulty.toUpperCase()}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-stone-100">
                          {level.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone-400">
                          {level.description}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-center">
                        <p className="text-xs text-amber-100/80">奖励</p>
                        <p className="mt-1 text-base font-semibold text-amber-100">
                          {level.rewardXp} XP
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 text-xs text-stone-400">
                        {completed ? <Star size={14} className="text-amber-200" /> : null}
                        {completed ? "已通关" : current ? "当前推荐关卡" : "可挑战"}
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-stone-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-100"
                        onClick={() => navigate(`/levels/${level.id}`)}
                      >
                        进入战斗
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
