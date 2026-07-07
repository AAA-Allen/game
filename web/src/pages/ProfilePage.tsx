import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Gamepad2,
  Gem,
  Lock,
  Map,
  Star,
  Sword,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type {
  Achievement,
  ActivityEntry,
  ProfileStats,
  UserProfile,
} from "@/types/api";

// ── Mock Data ──────────────────────────────────────

const mockStats: ProfileStats = {
  totalSubmissions: 84,
  passedLevels: 31,
  totalXpEarned: 3200,
  currentStreak: 5,
  longestStreak: 12,
};

function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

const mockActivities: ActivityEntry[] = [
  {
    id: "act-1",
    type: "level_completed",
    description: "通过「HTML 基础结构」关卡",
    timestamp: hoursAgo(1),
    xpEarned: 120,
  },
  {
    id: "act-2",
    type: "achievement_unlocked",
    description: "达成成就「代码新手」",
    timestamp: hoursAgo(3),
  },
  {
    id: "act-3",
    type: "level_started",
    description: "开始挑战「CSS 盒子模型」",
    timestamp: hoursAgo(5),
  },
  {
    id: "act-4",
    type: "level_completed",
    description: "通过「JavaScript 变量」关卡",
    timestamp: hoursAgo(8),
    xpEarned: 150,
  },
  {
    id: "act-5",
    type: "level_completed",
    description: "通过「Flexbox 布局」关卡",
    timestamp: hoursAgo(24),
    xpEarned: 200,
  },
  {
    id: "act-6",
    type: "level_started",
    description: "开始挑战「数组与方法」",
    timestamp: hoursAgo(30),
  },
  {
    id: "act-7",
    type: "achievement_unlocked",
    description: "达成成就「连续挑战者」",
    timestamp: hoursAgo(48),
  },
];

const mockAchievements: Achievement[] = [
  {
    id: "ach-1",
    name: "代码新手",
    description: "完成第一个关卡",
    icon: "star",
    unlockedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "ach-2",
    name: "连续挑战者",
    description: "连续登录 7 天",
    icon: "flame",
    unlockedAt: "2026-02-20T08:00:00Z",
  },
  {
    id: "ach-3",
    name: "CSS 大师",
    description: "通过所有 CSS 关卡",
    icon: "sword",
    unlockedAt: "2026-03-10T14:20:00Z",
  },
  {
    id: "ach-4",
    name: "百次提交",
    description: "累计提交 100 次",
    icon: "zap",
    unlockedAt: undefined,
  },
  {
    id: "ach-5",
    name: "JS 征服者",
    description: "通过所有 JavaScript 关卡",
    icon: "trophy",
    unlockedAt: undefined,
  },
  {
    id: "ach-6",
    name: "完美主义者",
    description: "全部关卡获得满分",
    icon: "gem",
    unlockedAt: undefined,
  },
];

const mockProfile: UserProfile = {
  id: "user-1",
  username: "冒险者小明",
  level: 7,
  xp: 3200,
  xpToNextLevel: 5000,
  title: "新手冒险家",
  joinedAt: "2025-12-01T00:00:00Z",
  stats: mockStats,
  recentActivity: mockActivities,
  achievements: mockAchievements,
};

// ── Helpers ────────────────────────────────────────

function timeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "刚刚";
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 30) return `${diffDays} 天前`;
  return new Date(isoString).toLocaleDateString("zh-CN");
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const activityIconMap: Record<
  ActivityEntry["type"],
  typeof Star
> = {
  level_completed: CheckCircle2,
  level_started: Sword,
  achievement_unlocked: Trophy,
};

const activityColorMap: Record<ActivityEntry["type"], string> = {
  level_completed: "text-emerald-300",
  level_started: "text-sky-300",
  achievement_unlocked: "text-amber-300",
};

const achievementIconMap: Record<string, typeof Star> = {
  star: Star,
  flame: Flame,
  sword: Sword,
  zap: Zap,
  trophy: Trophy,
  gem: Gem,
};

function getAchievementIcon(iconName: string) {
  return achievementIconMap[iconName] ?? Award;
}

const statCards: {
  key: keyof ProfileStats;
  icon: typeof Star;
  label: string;
  color: string;
}[] = [
  { key: "totalSubmissions", icon: Target, label: "累计提交", color: "text-cyan-300" },
  { key: "passedLevels", icon: Map, label: "通关关卡", color: "text-emerald-300" },
  { key: "totalXpEarned", icon: Zap, label: "获得经验", color: "text-amber-300" },
  { key: "currentStreak", icon: Flame, label: "当前连胜", color: "text-orange-300" },
  { key: "longestStreak", icon: Trophy, label: "最长连胜", color: "text-fuchsia-300" },
];

// ── Component ──────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const profile = mockProfile;

  const xpPercent = useMemo(
    () =>
      profile.xpToNextLevel > 0
        ? Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100))
        : 0,
    [profile.xp, profile.xpToNextLevel],
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-stone-100">
      {/* Background layers */}
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-25" />

      <div className="relative mx-auto min-h-screen max-w-[1280px] px-3 py-3">
        {/* ── Status Bar ── */}
        <div className="pixel-status-bar mb-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-xs">
              <Gamepad2 size={14} className="text-cyan-200" />
              <span>角色档案</span>
            </div>
            <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-xs">
              <Gem size={14} className="text-amber-200" />
              {profile.xp} / {profile.xpToNextLevel} XP
            </div>
            <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-xs">
              <Star size={14} className="text-amber-200" />
              Lv.{profile.level}
            </div>
          </div>
          <button
            type="button"
            className="pixel-button-secondary flex items-center gap-2 px-4 py-1.5 text-xs"
            onClick={() => navigate("/map")}
          >
            <Map size={14} />
            返回地图
          </button>
        </div>

        {/* ── Hero Section ── */}
        <div className="pixel-panel relative mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(111,227,193,0.10),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(107,154,255,0.10),transparent_40%)]" />
          <div className="relative flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:items-start sm:gap-8">
            {/* Avatar */}
            <div className="pixel-map-tile flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] border-2 border-slate-500/40 bg-[linear-gradient(180deg,#1a3a5c,#0f1f32)]">
                <User size={48} className="text-cyan-200/80" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
              <h1 className="font-display text-xl leading-relaxed text-[#ffe58b] sm:text-2xl">
                {profile.username}
              </h1>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <span className="pixel-chip px-3 py-1 text-xs text-cyan-200">
                  Lv.{profile.level}
                </span>
                <span className="pixel-chip px-3 py-1 text-xs text-amber-200">
                  {profile.title}
                </span>
              </div>

              {/* XP Bar */}
              <div className="mt-4 w-full max-w-md">
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-200" />
                    经验值
                  </span>
                  <span>
                    {profile.xp} / {profile.xpToNextLevel}
                  </span>
                </div>
                <div className="pixel-progress h-4">
                  <span style={{ width: `${xpPercent}%` }} />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  下一等级还需 {profile.xpToNextLevel - profile.xp} XP
                </p>
              </div>

              {/* Member since */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={13} />
                加入于 {formatDate(profile.joinedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {statCards.map(({ key, icon: Icon, label, color }) => (
            <div key={key} className="pixel-map-tile px-3 py-4 text-center transition hover:border-cyan-500/40">
              <Icon size={22} className={`mx-auto ${color}`} />
              <p className="mt-2 font-display text-lg leading-relaxed text-stone-100">
                {profile.stats[key]}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Bottom Grid: Activity + Achievements ── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          {/* Recent Activity */}
          <div className="pixel-panel p-5">
            <h2 className="font-display mb-4 text-base leading-relaxed text-[#ffe58b]">
              最近活动
            </h2>
            <div className="space-y-3">
              {profile.recentActivity.map((activity, index) => {
                const Icon = activityIconMap[activity.type];
                const iconColor = activityColorMap[activity.type];
                return (
                  <div
                    key={activity.id}
                    className="pixel-map-tile flex items-start gap-3 px-4 py-3"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-slate-600/60 bg-[#15283f] ${iconColor}`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-stone-100">{activity.description}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <Clock size={11} />
                        <span>{timeAgo(activity.timestamp)}</span>
                        {activity.xpEarned ? (
                          <span className="pixel-chip px-2 py-0.5 text-[10px] text-amber-200">
                            +{activity.xpEarned} XP
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="pixel-panel p-5">
            <h2 className="font-display mb-4 text-base leading-relaxed text-[#ffe58b]">
              成就
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {profile.achievements.map((ach) => {
                const Icon = getAchievementIcon(ach.icon);
                const unlocked = !!ach.unlockedAt;
                return (
                  <div
                    key={ach.id}
                    className={`pixel-map-tile flex flex-col items-center gap-2 px-3 py-4 text-center transition ${
                      unlocked
                        ? ""
                        : "opacity-55 saturate-0"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${
                        unlocked
                          ? "border-amber-500/50 bg-[linear-gradient(180deg,#3a2e1a,#1f1a10)]"
                          : "border-slate-600/40 bg-[#111a26]"
                      }`}
                    >
                      {unlocked ? (
                        <Icon size={22} className="text-amber-300" />
                      ) : (
                        <Lock size={18} className="text-slate-500" />
                      )}
                    </div>
                    <p
                      className={`text-xs font-semibold ${
                        unlocked ? "text-stone-100" : "text-slate-500"
                      }`}
                    >
                      {ach.name}
                    </p>
                    <p className="text-[10px] leading-4 text-slate-400">
                      {ach.description}
                    </p>
                    {unlocked ? (
                      <span className="pixel-chip flex items-center gap-1 px-2 py-0.5 text-[9px] text-emerald-300">
                        <CheckCircle2 size={10} />
                        已解锁
                      </span>
                    ) : (
                      <span className="pixel-chip px-2 py-0.5 text-[9px] text-slate-500">
                        未解锁
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
