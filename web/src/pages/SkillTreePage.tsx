import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Crown,
  Lock,
  Star,
  Unlock,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { SkillNode } from "@/types/api";

// ── Mock Data ──────────────────────────────────────
const mockSkillNodes: SkillNode[] = [
  // HTML基础 (green/lime)
  { id: "html-1", name: "HTML结构", description: "学习 HTML 基础标签与文档结构，构建网页骨架。", category: "HTML基础", x: 10, y: 20, requiredLevel: 1, requiredNodeIds: [], isUnlocked: true, maxLevel: 5, currentLevel: 3, effects: ["解锁基础标签", "+5 HTML 熟练度"] },
  { id: "html-2", name: "语义化标签", description: "掌握 header / main / section 等语义标签，提升可访问性。", category: "HTML基础", x: 28, y: 16, requiredLevel: 2, requiredNodeIds: ["html-1"], isUnlocked: true, maxLevel: 3, currentLevel: 2, effects: ["语义化评分 +20%", "SEO 友好"] },
  { id: "html-3", name: "表单与输入", description: "掌握 form / input / validation 等交互表单技术。", category: "HTML基础", x: 28, y: 35, requiredLevel: 3, requiredNodeIds: ["html-1"], isUnlocked: true, maxLevel: 4, currentLevel: 1, effects: ["表单提交能力", "输入验证熟练度 +15%"] },

  // CSS样式 (emerald/cyan)
  { id: "css-1", name: "CSS基础", description: "学习选择器、盒模型与常见布局属性。", category: "CSS样式", x: 42, y: 18, requiredLevel: 1, requiredNodeIds: [], isUnlocked: true, maxLevel: 5, currentLevel: 4, effects: ["+10 样式熟练度", "基础布局能力"] },
  { id: "css-2", name: "Flex/Grid布局", description: "掌握弹性布局与网格系统的核心用法。", category: "CSS样式", x: 58, y: 14, requiredLevel: 4, requiredNodeIds: ["css-1"], isUnlocked: true, maxLevel: 4, currentLevel: 2, effects: ["响应式布局能力", "Grid 精通"] },
  { id: "css-3", name: "动画与过渡", description: "学习 transition / animation / keyframes 制作流畅动效。", category: "CSS样式", x: 58, y: 30, requiredLevel: 5, requiredNodeIds: ["css-1"], isUnlocked: false, maxLevel: 3, currentLevel: 0, effects: ["动效制作能力", "交互反馈增强"] },

  // JavaScript (sky/indigo)
  { id: "js-1", name: "JS基础", description: "学习变量、函数、循环等 JavaScript 核心语法。", category: "JavaScript", x: 42, y: 48, requiredLevel: 5, requiredNodeIds: [], isUnlocked: true, maxLevel: 5, currentLevel: 3, effects: ["+15 JS 熟练度", "编程思维训练"] },
  { id: "js-2", name: "DOM操作", description: "掌握 document / querySelector / event 等 DOM API。", category: "JavaScript", x: 58, y: 43, requiredLevel: 7, requiredNodeIds: ["js-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["动态页面交互", "事件处理熟练度 +20%"] },
  { id: "js-3", name: "异步编程", description: "学习 Promise / async-await / fetch 等异步模式。", category: "JavaScript", x: 58, y: 58, requiredLevel: 8, requiredNodeIds: ["js-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["API 调用能力", "异步流程控制"] },

  // 前端框架 (slate/purple)
  { id: "framework-1", name: "React入门", description: "了解组件、props、state 等 React 基础概念。", category: "前端框架", x: 10, y: 55, requiredLevel: 10, requiredNodeIds: [], isUnlocked: false, maxLevel: 5, currentLevel: 0, effects: ["组件化思维", "SPA 开发能力"] },
  { id: "framework-2", name: "组件设计", description: "掌握高阶组件、组合模式与可复用组件设计。", category: "前端框架", x: 28, y: 52, requiredLevel: 12, requiredNodeIds: ["framework-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["高质量组件设计", "代码复用率 +30%"] },
  { id: "framework-3", name: "状态管理", description: "学习 Redux / Zustand 等状态管理方案。", category: "前端框架", x: 28, y: 66, requiredLevel: 13, requiredNodeIds: ["framework-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["全局状态管理", "复杂应用架构"] },

  // 后端开发 (amber/orange)
  { id: "backend-1", name: "Node.js基础", description: "学习 Node.js 运行时与模块系统。", category: "后端开发", x: 72, y: 18, requiredLevel: 8, requiredNodeIds: [], isUnlocked: false, maxLevel: 5, currentLevel: 0, effects: ["服务端开发入门", "+10 后端熟练度"] },
  { id: "backend-2", name: "API设计", description: "掌握 RESTful 接口设计与 Express 框架。", category: "后端开发", x: 88, y: 14, requiredLevel: 10, requiredNodeIds: ["backend-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["API 开发能力", "接口文档规范"] },
  { id: "backend-3", name: "数据库连接", description: "学习使用 Prisma / Sequelize 操作数据库。", category: "后端开发", x: 88, y: 30, requiredLevel: 12, requiredNodeIds: ["backend-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["数据库 CRUD", "ORM 熟练度 +20%"] },

  // 数据库 (yellow/gold)
  { id: "db-1", name: "数据库基础", description: "了解关系型数据库与表结构设计。", category: "数据库", x: 72, y: 48, requiredLevel: 15, requiredNodeIds: [], isUnlocked: false, maxLevel: 5, currentLevel: 0, effects: ["数据建模能力", "SQL 入门"] },
  { id: "db-2", name: "SQL查询", description: "掌握 SELECT / JOIN / GROUP BY 等高级查询语句。", category: "数据库", x: 88, y: 45, requiredLevel: 17, requiredNodeIds: ["db-1"], isUnlocked: false, maxLevel: 4, currentLevel: 0, effects: ["复杂查询能力", "数据聚合技能"] },
  { id: "db-3", name: "Redis缓存", description: "学习 Redis 缓存策略与常见应用场景。", category: "数据库", x: 88, y: 60, requiredLevel: 18, requiredNodeIds: ["db-1"], isUnlocked: false, maxLevel: 3, currentLevel: 0, effects: ["缓存优化能力", "高并发支撑"] },
];

const categoryConfig: Record<string, { label: string; color: string; borderColor: string; bgGlow: string }> = {
  "HTML基础":    { label: "HTML 基础", color: "#84cc16", borderColor: "border-lime-500/40", bgGlow: "rgba(132,204,22,0.08)" },
  "CSS样式":     { label: "CSS 样式", color: "#34d399", borderColor: "border-emerald-400/40", bgGlow: "rgba(52,211,153,0.08)" },
  "JavaScript":  { label: "JavaScript", color: "#38bdf8", borderColor: "border-sky-400/40", bgGlow: "rgba(56,189,248,0.08)" },
  "前端框架":    { label: "前端框架", color: "#a78bfa", borderColor: "border-violet-400/40", bgGlow: "rgba(167,139,250,0.08)" },
  "后端开发":    { label: "后端开发", color: "#fb923c", borderColor: "border-orange-400/40", bgGlow: "rgba(251,146,60,0.08)" },
  "数据库":      { label: "数据库", color: "#facc15", borderColor: "border-yellow-400/40", bgGlow: "rgba(250,204,21,0.08)" },
};

// ── Helpers ────────────────────────────────────────
function getNodeById(id: string): SkillNode | undefined {
  return mockSkillNodes.find((n) => n.id === id);
}

function calcNodeProgress(node: SkillNode): number {
  return node.maxLevel > 0 ? (node.currentLevel / node.maxLevel) * 100 : 0;
}

function canUpgrade(node: SkillNode, overallLevel: number): boolean {
  if (node.isUnlocked === false) return false;
  if (node.currentLevel >= node.maxLevel) return false;
  if (overallLevel < node.requiredLevel) return false;
  return node.requiredNodeIds.every((rid) => {
    const parent = getNodeById(rid);
    return parent !== undefined && parent.currentLevel >= parent.maxLevel;
  });
}

// ── Edge Drawing ───────────────────────────────────
function useEdges() {
  return useMemo(() => {
    const edges: Array<{ from: SkillNode; to: SkillNode }> = [];
    for (const node of mockSkillNodes) {
      for (const rid of node.requiredNodeIds) {
        const parent = getNodeById(rid);
        if (parent) edges.push({ from: parent, to: node });
      }
    }
    return edges;
  }, []);
}

const NODE_W = 4.8; // width in vw units (approx)
const NODE_H = 3.2;

function EdgeLine({ from, to }: { from: SkillNode; to: SkillNode }) {
  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <div
      className="absolute"
      style={{
        left: `${x1}%`,
        top: `${y1}%`,
        width: `${length}%`,
        height: "3px",
        transformOrigin: "0 50%",
        transform: `rotate(${angle}deg) translateY(-50%)`,
        zIndex: 0,
      }}
    >
      <div
        className="h-full"
        style={{
          background: "repeating-linear-gradient(90deg, rgba(148,163,184,0.35) 0 6px, transparent 6px 12px)",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}

// ── Component ──────────────────────────────────────
export default function SkillTreePage() {
  const navigate = useNavigate();
  const edges = useEdges();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [overallLevel] = useState(8); // mock player level

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) ?? null : null;

  // Group nodes by category preserving display order
  const categoryOrder = ["HTML基础", "CSS样式", "JavaScript", "前端框架", "后端开发", "数据库"];
  const grouped = useMemo(() => {
    const map: Record<string, SkillNode[]> = {};
    for (const cat of categoryOrder) map[cat] = [];
    for (const node of mockSkillNodes) {
      if (map[node.category]) map[node.category].push(node);
    }
    return map;
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-stone-100">
      {/* Background layers */}
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col gap-3 px-3 py-3 lg:flex-row">
        {/* ── Main Area ── */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Status Bar */}
          <div className="pixel-status-bar flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[10px] font-display"
                onClick={() => navigate("/map")}
              >
                <ArrowLeft size={13} />
                返回地图
              </button>
              <h1 className="font-display text-[13px] leading-6 text-[#ffd45a] pixel-text-shadow">
                技能树
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px]">
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5">
                <Crown size={13} className="text-amber-200" />
                Lv.{overallLevel}
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5">
                <Star size={13} className="text-amber-200" />
                {mockSkillNodes.filter((n) => n.isUnlocked).length}/{mockSkillNodes.length}
              </div>
            </div>
          </div>

          {/* Skill Tree Canvas */}
          <section className="pixel-panel relative flex-1 overflow-hidden p-3 lg:p-5">
            <div className="absolute inset-0 pixel-grid-bg opacity-[0.06]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.06),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(167,139,250,0.05),transparent_35%)]" />

            {/* Category column labels */}
            <div className="relative z-10 mb-2 flex flex-wrap gap-2">
              {categoryOrder.map((cat) => {
                const cfg = categoryConfig[cat];
                return (
                  <span
                    key={cat}
                    className="pixel-chip px-3 py-1.5 text-[9px] font-display"
                    style={{ borderColor: cfg.color + "55", color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                );
              })}
            </div>

            {/* Tree area */}
            <div className="relative mt-1 w-full pb-[60%] lg:pb-[50%]">
              {/* Edge lines */}
              {edges.map((edge, i) => (
                <EdgeLine key={`edge-${i}`} from={edge.from} to={edge.to} />
              ))}

              {/* Nodes */}
              {mockSkillNodes.map((node) => {
                const cfg = categoryConfig[node.category];
                const isSelected = selectedNodeId === node.id;
                const progress = calcNodeProgress(node);
                const locked = !node.isUnlocked;

                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      width: "clamp(110px, 22vw, 170px)",
                      zIndex: isSelected ? 30 : 10,
                    }}
                  >
                    <div
                      className={`pixel-map-tile relative overflow-hidden px-3 py-2.5 text-left transition-all duration-200 ${
                        isSelected ? "scale-110" : "hover:scale-105"
                      } ${locked ? "opacity-55 saturate-50" : ""}`}
                      style={{
                        borderColor: isSelected ? cfg.color : undefined,
                        boxShadow: isSelected
                          ? `0 0 0 3px #0a1320, 0 10px 0 0 rgba(5,10,18,0.9), 0 0 20px ${cfg.color}33`
                          : undefined,
                      }}
                    >
                      {/* Glow accent */}
                      <div
                        className="pointer-events-none absolute -inset-2 opacity-20"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${cfg.color} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Header */}
                      <div className="relative flex items-center justify-between gap-1">
                        <span
                          className="truncate text-[10px] font-semibold"
                          style={{ color: cfg.color }}
                        >
                          {node.name}
                        </span>
                        {locked ? (
                          <Lock size={11} className="shrink-0 text-slate-500" />
                        ) : (
                          <Unlock size={11} className="shrink-0 text-lime-300" />
                        )}
                      </div>

                      {/* Level */}
                      <div className="relative mt-1.5 flex items-center justify-between text-[9px] text-slate-400">
                        <span>
                          {node.currentLevel}/{node.maxLevel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap size={9} />
                          Lv.{node.requiredLevel}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="relative mt-1.5 pixel-progress h-2">
                        <span
                          style={{
                            width: `${progress}%`,
                            background: locked
                              ? "#334155"
                              : `repeating-linear-gradient(90deg, ${cfg.color}cc 0, ${cfg.color}cc 8px, ${cfg.color}99 8px, ${cfg.color}99 16px)`,
                          }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── Detail Panel ── */}
        <aside className="w-full shrink-0 lg:w-[300px] xl:w-[340px]">
          <div className="pixel-panel flex flex-col gap-4 p-4 lg:sticky lg:top-3">
            {selectedNode ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="font-display text-[10px]"
                      style={{ color: categoryConfig[selectedNode.category]?.color ?? "#94a3b8" }}
                    >
                      {selectedNode.category}
                    </p>
                    <h2 className="mt-1 font-display text-[14px] leading-7 text-stone-100">
                      {selectedNode.name}
                    </h2>
                  </div>
                  <div className="pixel-outline bg-[#1a2a3e] px-2.5 py-1.5 text-center">
                    <p className="text-[10px] text-slate-400">等级</p>
                    <p className="font-display text-[13px] text-[#ffd45a]">
                      {selectedNode.currentLevel}/{selectedNode.maxLevel}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-6 text-slate-300">{selectedNode.description}</p>

                {/* Progress */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span>熟练度</span>
                    <span>{Math.round(calcNodeProgress(selectedNode))}%</span>
                  </div>
                  <div className="pixel-progress h-3">
                    <span
                      style={{
                        width: `${calcNodeProgress(selectedNode)}%`,
                        background: selectedNode.isUnlocked
                          ? `repeating-linear-gradient(90deg, ${categoryConfig[selectedNode.category]?.color ?? "#ffd44a"}cc 0, ${categoryConfig[selectedNode.category]?.color ?? "#ffd44a"}cc 10px, ${categoryConfig[selectedNode.category]?.color ?? "#ffb82c"}99 10px, ${categoryConfig[selectedNode.category]?.color ?? "#ffb82c"}99 20px)`
                          : undefined,
                      }}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div className="pixel-map-tile p-3">
                  <p className="mb-2 font-display text-[10px] text-cyan-200">解锁条件</p>
                  <ul className="space-y-2 text-[10px]">
                    <li className="flex items-center gap-2">
                      <Crown size={11} className="shrink-0 text-amber-300" />
                      <span className="text-slate-300">等级要求：</span>
                      <span
                        className={
                          overallLevel >= selectedNode.requiredLevel
                            ? "text-lime-300"
                            : "text-rose-300"
                        }
                      >
                        Lv.{selectedNode.requiredLevel}
                        {overallLevel >= selectedNode.requiredLevel ? " ✓" : ` (当前 Lv.${overallLevel})`}
                      </span>
                    </li>
                    {selectedNode.requiredNodeIds.length > 0 && (
                      <li className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 text-slate-300">
                          <ArrowUp size={11} className="shrink-0" />
                          前置技能：
                        </span>
                        <div className="ml-4 flex flex-wrap gap-1.5">
                          {selectedNode.requiredNodeIds.map((rid) => {
                            const pn = getNodeById(rid);
                            if (!pn) return null;
                            const done = pn.currentLevel >= pn.maxLevel;
                            return (
                              <span
                                key={rid}
                                className={`pixel-chip px-2 py-1 text-[9px] ${
                                  done ? "text-lime-300" : "text-slate-500"
                                }`}
                              >
                                {pn.name} {done ? "✓" : `${pn.currentLevel}/${pn.maxLevel}`}
                              </span>
                            );
                          })}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Effects */}
                {selectedNode.effects.length > 0 && (
                  <div className="pixel-map-tile p-3">
                    <p className="mb-2 font-display text-[10px] text-amber-200">技能效果</p>
                    <ul className="space-y-1.5">
                      {selectedNode.effects.map((effect, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[10px] text-slate-300"
                        >
                          <span
                            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor: categoryConfig[selectedNode.category]?.color ?? "#94a3b8",
                            }}
                          />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Upgrade button */}
                <button
                  type="button"
                  disabled={!canUpgrade(selectedNode, overallLevel)}
                  className="pixel-button flex w-full items-center justify-center gap-2 px-4 py-3 text-[11px] font-display disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => {
                    // Mock upgrade logic — in production this would call an API
                    setSelectedNodeId(null);
                  }}
                >
                  <Zap size={14} />
                  {selectedNode.currentLevel >= selectedNode.maxLevel
                    ? "已满级"
                    : `升级 (${selectedNode.currentLevel + 1}/${selectedNode.maxLevel})`}
                </button>
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full opacity-40"
                  style={{
                    border: "3px solid #324863",
                    background: "rgba(12,20,34,0.78)",
                    boxShadow: "0 0 0 2px #10192a inset",
                  }}
                >
                  <Star size={28} className="text-slate-400" />
                </div>
                <p className="font-display text-[11px] text-slate-400">选择技能节点</p>
                <p className="text-xs leading-6 text-slate-500">
                  点击技能树上的节点，查看详细信息和升级条件。
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
