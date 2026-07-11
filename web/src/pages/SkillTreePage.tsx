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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSkillTree } from "@/services/game.service";
import type { SkillNode } from "@/types/api";

const categoryConfig: Record<string, { label: string; color: string; borderColor: string }> = {
  HTML基础: { label: "HTML 基础", color: "#84cc16", borderColor: "border-lime-500/40" },
  CSS样式: { label: "CSS 样式", color: "#34d399", borderColor: "border-emerald-400/40" },
  JavaScript: { label: "JavaScript", color: "#38bdf8", borderColor: "border-sky-400/40" },
  前端框架: { label: "前端框架", color: "#a78bfa", borderColor: "border-violet-400/40" },
  后端开发: { label: "后端开发", color: "#fb923c", borderColor: "border-orange-400/40" },
  数据库: { label: "数据库", color: "#facc15", borderColor: "border-yellow-400/40" },
};

const categoryOrder = ["HTML基础", "CSS样式", "JavaScript", "前端框架", "后端开发", "数据库"];

// ── Helpers ────────────────────────────────────────
function calcNodeProgress(node: SkillNode): number {
  return node.maxLevel > 0 ? (node.currentLevel / node.maxLevel) * 100 : 0;
}

function canUpgrade(node: SkillNode, nodes: SkillNode[], userLevel: number): boolean {
  if (!node.isUnlocked) return false;
  if (node.currentLevel >= node.maxLevel) return false;
  if (userLevel < node.requiredLevel) return false;
  return node.requiredNodeIds.every((rid) => {
    const parent = nodes.find((n) => n.id === rid);
    return parent !== undefined && parent.currentLevel >= parent.maxLevel;
  });
}

// ── Component ──────────────────────────────────────
export default function SkillTreePage() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [userLevel, setUserLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getSkillTree()
      .then((data) => {
        if (cancelled) return;
        setNodes(data.nodes);
        setUserLevel(data.userLevel);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "加载技能树失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  // Group by category
  const grouped = useMemo(() => {
    const map: Record<string, SkillNode[]> = {};
    for (const cat of categoryOrder) map[cat] = [];
    for (const node of nodes) {
      if (map[node.category]) map[node.category].push(node);
    }
    return map;
  }, [nodes]);

  const unlockedCount = useMemo(
    () => nodes.filter((n) => n.isUnlocked).length,
    [nodes],
  );

  const toggleCat = useCallback((cat: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0a1320]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400/30 border-t-sky-400" />
          <p className="font-display text-[11px] text-slate-400">技能树加载中...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a1320] px-4">
        <p className="font-display text-[13px] text-rose-300">{error}</p>
        <button
          type="button"
          className="pixel-button px-4 py-2 text-[11px] font-display"
          onClick={() => window.location.reload()}
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-stone-100">
      {/* Background layers */}
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-30" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col gap-3 px-3 py-3 lg:flex-row">
        {/* ── Main Area ── */}
        <div className="flex flex-1 flex-col gap-3 min-w-0">
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
                Lv.{userLevel}
              </div>
              <div className="pixel-chip flex items-center gap-2 px-3 py-1.5">
                <Star size={13} className="text-amber-200" />
                {unlockedCount}/{nodes.length}
              </div>
            </div>
          </div>

          {/* Skill Tree (vertical layout) */}
          <section className="pixel-panel relative flex-1 overflow-y-auto p-3 lg:p-5">
            <div className="absolute inset-0 pixel-grid-bg opacity-[0.06] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.06),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(167,139,250,0.05),transparent_35%)] pointer-events-none" />

            {/* Category labels (horizontal, scrollable) */}
            <div className="relative z-10 mb-4 flex flex-wrap gap-2">
              {categoryOrder.map((cat) => {
                const cfg = categoryConfig[cat];
                return (
                  <span
                    key={cat}
                    className="pixel-chip px-3 py-1.5 text-[9px] font-display cursor-pointer"
                    style={{ borderColor: cfg.color + "55", color: cfg.color }}
                    onClick={() => {
                      const el = document.getElementById(`cat-${cat}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    {cfg.label}
                  </span>
                );
              })}
            </div>

            {/* Category sections (stacked vertically) */}
            <div className="relative z-10 flex flex-col gap-5">
              {categoryOrder.map((cat) => {
                const catNodes = grouped[cat] ?? [];
                if (catNodes.length === 0) return null;
                const cfg = categoryConfig[cat];
                const collapsed = collapsedCats.has(cat);
                const catCompleted = catNodes.filter((n) => n.isUnlocked).length;

                return (
                  <div key={cat} id={`cat-${cat}`}>
                    {/* Category header */}
                    <button
                      type="button"
                      onClick={() => toggleCat(cat)}
                      className="flex w-full items-center gap-2 border-b pb-1.5 mb-3 transition-colors hover:opacity-80"
                      style={{ borderColor: cfg.color + "44" }}
                    >
                      <span
                        className="font-display text-[12px] tracking-wide"
                        style={{ color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {catCompleted}/{catNodes.length}
                      </span>
                      {collapsed ? (
                        <ChevronDown size={13} className="ml-auto text-slate-500" />
                      ) : (
                        <ChevronUp size={13} className="ml-auto text-slate-500" />
                      )}
                    </button>

                    {/* Skill cards row */}
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                      >
                        {catNodes.map((node) => {
                          const isSelected = selectedNodeId === node.id;
                          const progress = calcNodeProgress(node);
                          const locked = !node.isUnlocked;

                          return (
                            <motion.button
                              key={node.id}
                              type="button"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => setSelectedNodeId(node.id)}
                              className="text-left"
                            >
                              <div
                                className={`pixel-map-tile relative overflow-hidden px-3 py-2.5 transition-all duration-200 ${
                                  isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                                } ${locked ? "opacity-55 saturate-50" : ""}`}
                                style={{
                                  borderColor: isSelected ? cfg.color : undefined,
                                  boxShadow: isSelected
                                    ? `0 0 0 3px #0a1320, 0 8px 0 0 rgba(5,10,18,0.9), 0 0 20px ${cfg.color}33`
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

                                {/* Description */}
                                <p className="relative mt-1 text-[9px] leading-5 text-slate-400 line-clamp-1">
                                  {node.description}
                                </p>

                                {/* Level + Required Level */}
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
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {nodes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Star size={32} className="text-slate-500 opacity-40" />
                <p className="mt-3 font-display text-[11px] text-slate-400">暂无技能数据</p>
              </div>
            )}
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
                          userLevel >= selectedNode.requiredLevel
                            ? "text-lime-300"
                            : "text-rose-300"
                        }
                      >
                        Lv.{selectedNode.requiredLevel}
                        {userLevel >= selectedNode.requiredLevel
                          ? " ✓"
                          : ` (当前 Lv.${userLevel})`}
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
                            const pn = nodes.find((n) => n.id === rid);
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
                              backgroundColor:
                                categoryConfig[selectedNode.category]?.color ?? "#94a3b8",
                            }}
                          />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Upgrade hint */}
                <div
                  className="pixel-button flex w-full items-center justify-center gap-2 px-4 py-3 text-[11px] font-display opacity-60 cursor-default"
                >
                  <Zap size={14} />
                  {selectedNode.currentLevel >= selectedNode.maxLevel
                    ? "已满级"
                    : canUpgrade(selectedNode, nodes, userLevel)
                      ? "继续通关关卡以升级"
                      : "提升等级并完成前置技能"}
                </div>
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
