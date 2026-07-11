import type { LucideIcon } from "lucide-react";
import {
  Castle,
  Cloud,
  Compass,
  Crown,
  Gem,
  Leaf,
  Map,
  Shield,
  Swords,
  Trees,
  Trophy,
  User,
  Waves,
  Zap,
} from "lucide-react";

import type { Level, Zone } from "@/types/api";

export type MapMenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export type ZoneVisual = {
  top: string;
  left: string;
  width: string;
  height: string;
  accent: string;
  icon: LucideIcon;
  iconTone: string;
  labelClass: string;
  biome: string;
  terrainLabel: string;
  bossName: string;
  npcName: string;
  rewardLabel: string;
  glowColor: string;
  topLight: string;
  topMid: string;
  topDark: string;
  sandLight: string;
  sandDark: string;
  cliffLight: string;
  cliffDark: string;
  featureType:
    | "village"
    | "forest"
    | "storm"
    | "castle"
    | "forge"
    | "ruins"
    | "boss";
};

export type RouteSegment = {
  left: string;
  top: string;
  width: string;
  rotate: string;
};

export const mapMenuItems: MapMenuItem[] = [
  { icon: Map, label: "世界地图", path: "/map" },
  { icon: Shield, label: "技能树", path: "/skill-tree" },
  { icon: User, label: "角色档案", path: "/profile" },
  { icon: Trophy, label: "排行榜", path: "/leaderboard" },
];

export const reserveZones: Zone[] = [
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

export const defaultZoneVisual: ZoneVisual = {
  top: "50%",
  left: "50%",
  width: "clamp(116px, 10vw, 180px)",
  height: "clamp(92px, 7vw, 136px)",
  accent: "#DCE8FF",
  icon: Gem,
  iconTone: "text-slate-100",
  labelClass: "border-slate-300/20 bg-slate-900/80 text-slate-100",
  biome: "未知区域",
  terrainLabel: "探索中",
  bossName: "迷雾守望者",
  npcName: "巡路者",
  rewardLabel: "未知遗物",
  glowColor: "rgba(220,232,255,0.35)",
  topLight: "#d8e2ef",
  topMid: "#8899ad",
  topDark: "#5e6d80",
  sandLight: "#bda980",
  sandDark: "#9b845c",
  cliffLight: "#6b7486",
  cliffDark: "#394351",
  featureType: "ruins",
};

export const zoneVisuals: Record<string, ZoneVisual> = {
  "新手村": {
    top: "14%",
    left: "16%",
    width: "clamp(170px, 14.5vw, 226px)",
    height: "clamp(134px, 11vw, 182px)",
    accent: "#7ED957",
    icon: Leaf,
    iconTone: "text-lime-100",
    labelClass: "border-lime-300/20 bg-[#122617]/85 text-lime-50",
    biome: "晨光平原",
    terrainLabel: "草地",
    bossName: "启程守卫",
    npcName: "村长阿洛",
    rewardLabel: "新手纹章",
    glowColor: "rgba(126,217,87,0.36)",
    topLight: "#a8ef72",
    topMid: "#74c54f",
    topDark: "#3f8439",
    sandLight: "#ddc37c",
    sandDark: "#b3904e",
    cliffLight: "#99653b",
    cliffDark: "#61391f",
    featureType: "village",
  },
  "CSS 森林": {
    top: "12%",
    left: "40%",
    width: "clamp(178px, 15.2vw, 236px)",
    height: "clamp(140px, 11.4vw, 190px)",
    accent: "#3FAE63",
    icon: Trees,
    iconTone: "text-emerald-50",
    labelClass: "border-emerald-300/20 bg-[#10241d]/85 text-emerald-50",
    biome: "雾湖森林",
    terrainLabel: "湖岸",
    bossName: "层叠女巫",
    npcName: "织纹精灵",
    rewardLabel: "湖纹水晶",
    glowColor: "rgba(63,174,99,0.34)",
    topLight: "#5bd077",
    topMid: "#2d9659",
    topDark: "#1a603b",
    sandLight: "#d8c487",
    sandDark: "#ab9555",
    cliffLight: "#725941",
    cliffDark: "#433323",
    featureType: "forest",
  },
  "布局峡谷": {
    top: "30%",
    left: "50%",
    width: "clamp(186px, 15.8vw, 244px)",
    height: "clamp(146px, 12vw, 196px)",
    accent: "#49A8FF",
    icon: Waves,
    iconTone: "text-sky-50",
    labelClass: "border-sky-300/20 bg-[#102137]/86 text-sky-50",
    biome: "回声峡谷",
    terrainLabel: "峡谷",
    bossName: "栅格石像",
    npcName: "排版向导",
    rewardLabel: "布局罗盘",
    glowColor: "rgba(73,168,255,0.34)",
    topLight: "#79c8ff",
    topMid: "#4796dc",
    topDark: "#285f97",
    sandLight: "#d9cf9c",
    sandDark: "#b59b63",
    cliffLight: "#7b6d5f",
    cliffDark: "#4b3f36",
    featureType: "castle",
  },
  "JS 风暴": {
    top: "52%",
    left: "22%",
    width: "clamp(182px, 15.4vw, 238px)",
    height: "clamp(144px, 11.8vw, 194px)",
    accent: "#8a93ff",
    icon: Zap,
    iconTone: "text-indigo-50",
    labelClass: "border-indigo-300/20 bg-[#19192e]/88 text-indigo-50",
    biome: "雷暴火山",
    terrainLabel: "风暴",
    bossName: "闪电祭司",
    npcName: "石纹学者",
    rewardLabel: "风暴符石",
    glowColor: "rgba(138,147,255,0.34)",
    topLight: "#545b74",
    topMid: "#2f3444",
    topDark: "#161925",
    sandLight: "#5a4b4c",
    sandDark: "#42363a",
    cliffLight: "#2d2b3a",
    cliffDark: "#12121a",
    featureType: "storm",
  },
  "前端框架城": {
    top: "32%",
    left: "20%",
    width: "clamp(182px, 15.4vw, 240px)",
    height: "clamp(144px, 11.8vw, 196px)",
    accent: "#73D7FF",
    icon: Castle,
    iconTone: "text-cyan-50",
    labelClass: "border-cyan-300/20 bg-[#102436]/85 text-cyan-50",
    biome: "浮空王城",
    terrainLabel: "王国",
    bossName: "组件领主",
    npcName: "蓝图骑士",
    rewardLabel: "天空徽章",
    glowColor: "rgba(115,215,255,0.34)",
    topLight: "#7fdfff",
    topMid: "#5894d4",
    topDark: "#315f94",
    sandLight: "#dccf97",
    sandDark: "#b9a35f",
    cliffLight: "#7f6f59",
    cliffDark: "#514638",
    featureType: "castle",
  },
  "后端王国": {
    top: "34%",
    left: "76%",
    width: "clamp(182px, 15.6vw, 242px)",
    height: "clamp(144px, 11.8vw, 198px)",
    accent: "#F38A3C",
    icon: Swords,
    iconTone: "text-orange-50",
    labelClass: "border-orange-300/20 bg-[#2b190f]/85 text-orange-50",
    biome: "机械高地",
    terrainLabel: "工坊",
    bossName: "接口君王",
    npcName: "机匠布兰",
    rewardLabel: "齿轮核心",
    glowColor: "rgba(243,138,60,0.34)",
    topLight: "#f6b65b",
    topMid: "#d48b34",
    topDark: "#8f521f",
    sandLight: "#e7cf8a",
    sandDark: "#b69853",
    cliffLight: "#8a633e",
    cliffDark: "#55361d",
    featureType: "forge",
  },
  "数据库遗迹": {
    top: "14%",
    left: "74%",
    width: "clamp(178px, 15.2vw, 234px)",
    height: "clamp(140px, 11.4vw, 190px)",
    accent: "#D89E3F",
    icon: Gem,
    iconTone: "text-amber-50",
    labelClass: "border-amber-300/20 bg-[#2b2110]/85 text-amber-50",
    biome: "黄昏遗迹",
    terrainLabel: "遗迹",
    bossName: "档案守墓人",
    npcName: "记录使徒",
    rewardLabel: "黄金卷轴",
    glowColor: "rgba(216,158,63,0.32)",
    topLight: "#e3be5f",
    topMid: "#c4943f",
    topDark: "#8f6223",
    sandLight: "#e0ce95",
    sandDark: "#b59c5a",
    cliffLight: "#8f7652",
    cliffDark: "#5c4730",
    featureType: "ruins",
  },
  "交互遗迹": {
    top: "50%",
    left: "48%",
    width: "clamp(170px, 14.5vw, 226px)",
    height: "clamp(134px, 11vw, 182px)",
    accent: "#c084fc",
    icon: Gem,
    iconTone: "text-purple-50",
    labelClass: "border-purple-300/20 bg-[#1f1635]/85 text-purple-50",
    biome: "暮色遗迹",
    terrainLabel: "遗迹",
    bossName: "机关守护者",
    npcName: "远古记录者",
    rewardLabel: "交互核心",
    glowColor: "rgba(192,132,252,0.36)",
    topLight: "#b87bf5",
    topMid: "#9357d4",
    topDark: "#6637a6",
    sandLight: "#b28acf",
    sandDark: "#8a62b0",
    cliffLight: "#6f4f8c",
    cliffDark: "#3a2350",
    featureType: "ruins",
  },
  "前端试炼塔": {
    top: "52%",
    left: "76%",
    width: "clamp(178px, 15.2vw, 236px)",
    height: "clamp(142px, 11.6vw, 192px)",
    accent: "#fbbf24",
    icon: Trophy,
    iconTone: "text-yellow-50",
    labelClass: "border-yellow-300/20 bg-[#2b240f]/85 text-yellow-50",
    biome: "试炼顶峰",
    terrainLabel: "Boss",
    bossName: "Web Master",
    npcName: "挑战者之魂",
    rewardLabel: "传奇冠冕",
    glowColor: "rgba(251,191,36,0.36)",
    topLight: "#fcd34d",
    topMid: "#e0a82b",
    topDark: "#b57f16",
    sandLight: "#e2ce94",
    sandDark: "#bfa25e",
    cliffLight: "#9f8354",
    cliffDark: "#5d482b",
    featureType: "boss",
  },
  "全栈Boss战": {
    top: "76%",
    left: "48%",
    width: "clamp(198px, 16.6vw, 258px)",
    height: "clamp(156px, 12.8vw, 208px)",
    accent: "#8B5CF6",
    icon: Crown,
    iconTone: "text-fuchsia-50",
    labelClass: "border-violet-300/20 bg-[#1f1635]/85 text-violet-50",
    biome: "终局圣域",
    terrainLabel: "Boss",
    bossName: "Web Master",
    npcName: "沉默守门人",
    rewardLabel: "传奇冠冕",
    glowColor: "rgba(139,92,246,0.38)",
    topLight: "#8d69f4",
    topMid: "#6236c7",
    topDark: "#34186d",
    sandLight: "#7d63b8",
    sandDark: "#5c4390",
    cliffLight: "#45305f",
    cliffDark: "#1a0f2f",
    featureType: "boss",
  },
};

export const routeSegments: RouteSegment[] = [
  { left: "22%", top: "26%", width: "15%", rotate: "-5deg" },
  { left: "42%", top: "24%", width: "12%", rotate: "8deg" },
  { left: "39%", top: "35%", width: "11%", rotate: "44deg" },
  { left: "56%", top: "34%", width: "11%", rotate: "-44deg" },
  { left: "27%", top: "44%", width: "14%", rotate: "26deg" },
  { left: "58%", top: "44%", width: "12%", rotate: "16deg" },
  { left: "22%", top: "52%", width: "6%", rotate: "58deg" },
  { left: "30%", top: "62%", width: "10%", rotate: "3deg" },
  { left: "56%", top: "63%", width: "11%", rotate: "34deg" },
];

export const difficultyTone: Record<Level["difficulty"], string> = {
  easy: "text-lime-100 border-lime-400/25 bg-lime-400/10",
  medium: "text-amber-100 border-amber-400/25 bg-amber-400/10",
  hard: "text-rose-100 border-rose-400/25 bg-rose-400/10",
};

export function getZoneVisual(zoneName?: string) {
  if (!zoneName) {
    return defaultZoneVisual;
  }

  return zoneVisuals[zoneName] ?? defaultZoneVisual;
}

export function getZoneCompassLabel(zoneName?: string) {
  if (!zoneName) {
    return "未命名区域";
  }

  return `${zoneName} · 探索路线`;
}

export const questHint = {
  icon: Compass,
  title: "冒险者指引",
  description:
    "点亮地图节点、逐步解锁新区域。已解锁区域会散发呼吸光，未解锁区域则被迷雾与封印包围。",
};
