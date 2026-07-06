import { hashSync } from "bcryptjs";

export type Zone = {
  id: string;
  name: string;
  slug: string;
  description: string;
  requiredLevel: number;
  isUnlocked: boolean;
};

export type Level = {
  id: string;
  zoneId: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  rewardXp: number;
  starterCode: {
    html: string;
    css: string;
    javascript: string;
  };
  requiredKeywords: string[];
};

export type User = {
  id: string;
  username: string;
  password: string;
  level: number;
  xp: number;
};

export type Submission = {
  id: string;
  userId: string;
  levelId: string;
  code: {
    html: string;
    css: string;
    javascript: string;
  };
  passed: boolean;
  score: number;
  earnedXp: number;
  submittedAt: string;
};

export type UserProgress = {
  userId: string;
  completedLevelIds: string[];
  unlockedZoneIds: string[];
  currentLevelId: string;
};

export const users: User[] = [
  {
    id: "user-001",
    username: "player1",
    password: hashSync("123456", 10),
    level: 1,
    xp: 0,
  },
];

export const zones: Zone[] = [
  {
    id: "zone-html",
    name: "新手村",
    slug: "html-beginner",
    description: "学习 HTML 结构、标签与页面骨架。",
    requiredLevel: 1,
    isUnlocked: true,
  },
  {
    id: "zone-css",
    name: "CSS 森林",
    slug: "css-forest",
    description: "学习样式、布局与视觉表现。",
    requiredLevel: 2,
    isUnlocked: true,
  },
  {
    id: "zone-js",
    name: "JS 风暴",
    slug: "js-storm",
    description: "学习事件、DOM 与交互逻辑。",
    requiredLevel: 3,
    isUnlocked: false,
  },
];

export const levels: Level[] = [
  {
    id: "level-001",
    zoneId: "zone-html",
    title: "创建基础 HTML 页面",
    description: "在页面中创建一个标题和一个按钮。",
    difficulty: "easy",
    rewardXp: 10,
    starterCode: {
      html: "<main>\n  <h1>Welcome to WebQuest</h1>\n</main>",
      css: "body {\n  font-family: sans-serif;\n}",
      javascript: "console.log('ready');",
    },
    requiredKeywords: ["<h1", "<button"],
  },
  {
    id: "level-002",
    zoneId: "zone-css",
    title: "制作登录页面布局",
    description: "使用 HTML 和 CSS 完成一个登录表单的基础布局。",
    difficulty: "medium",
    rewardXp: 20,
    starterCode: {
      html: "<form class=\"login-form\">\n  <input placeholder=\"username\" />\n</form>",
      css: ".login-form {\n  display: flex;\n}",
      javascript: "",
    },
    requiredKeywords: ["<form", "display", "input"],
  },
  {
    id: "level-003",
    zoneId: "zone-js",
    title: "实现点击计数器",
    description: "点击按钮后，页面中的数字加一。",
    difficulty: "medium",
    rewardXp: 30,
    starterCode: {
      html: "<button id=\"btn\">+1</button>\n<p id=\"count\">0</p>",
      css: "#btn { padding: 8px 16px; }",
      javascript:
        "const btn = document.getElementById('btn');\nconst count = document.getElementById('count');",
    },
    requiredKeywords: ["addEventListener", "count", "btn"],
  },
];

export const submissions: Submission[] = [];

export const progressRecords: UserProgress[] = [
  {
    userId: "user-001",
    completedLevelIds: [],
    unlockedZoneIds: ["zone-html"],
    currentLevelId: "level-001",
  },
];
