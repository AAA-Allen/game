import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Wand2,
  Play,
  RotateCcw,
  ScrollText,
  Send,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getLevelById, getLevels, getProgress, submitLevel } from "@/services/game.service";
import type { Level } from "@/types/api";

type CodeTab = "html" | "css" | "javascript";
type MissionTab = "overview" | "tasks" | "hints";
type LevelDraft = {
  html: string;
  css: string;
  javascript: string;
};

function getLevelDraftKey(levelId: string) {
  return `webquest_level_draft_${levelId}`;
}

function readLevelDraft(levelId: string): LevelDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getLevelDraftKey(levelId));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LevelDraft>;

    if (
      typeof parsed.html === "string" &&
      typeof parsed.css === "string" &&
      typeof parsed.javascript === "string"
    ) {
      return {
        html: parsed.html,
        css: parsed.css,
        javascript: parsed.javascript,
      };
    }
  } catch {
    window.localStorage.removeItem(getLevelDraftKey(levelId));
  }

  return null;
}

function writeLevelDraft(levelId: string, draft: LevelDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getLevelDraftKey(levelId), JSON.stringify(draft));
}

function clearLevelDraft(levelId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getLevelDraftKey(levelId));
}

export default function LevelPage() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [level, setLevel] = useState<Level | null>(null);
  const [previousLevel, setPreviousLevel] = useState<Level | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>([]);
  const [currentUnlockedLevelId, setCurrentUnlockedLevelId] = useState("");
  const [activeTab, setActiveTab] = useState<CodeTab>("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [javascript, setJavascript] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [activeMissionTab, setActiveMissionTab] = useState<MissionTab>("overview");

  useEffect(() => {
    async function loadLevel() {
      setLoading(true);
      setFeedback("");

      try {
        const [levelData, allLevels, progressData] = await Promise.all([
          getLevelById(id),
          getLevels(),
          getProgress().catch(() => null),
        ]);
        const sortedLevels = [...allLevels].sort((a, b) => a.sortOrder - b.sortOrder);
        const currentIndex = sortedLevels.findIndex((item) => item.id === id);
        const defaultUnlockedLevelId = progressData?.currentLevelId ?? sortedLevels[0]?.id ?? "";

        setLevel(levelData);
        setCompletedLevelIds(progressData?.completedLevelIds ?? []);
        setCurrentUnlockedLevelId(defaultUnlockedLevelId);
        setPreviousLevel(
          currentIndex > 0
            ? sortedLevels[currentIndex - 1]
            : null,
        );
        setNextLevel(
          currentIndex >= 0 && currentIndex < sortedLevels.length - 1
            ? sortedLevels[currentIndex + 1]
            : null,
        );
        const savedDraft = readLevelDraft(levelData.id);
        const draft = savedDraft ?? levelData.starterCode;

        setHtml(draft.html);
        setCss(draft.css);
        setJavascript(draft.javascript);
        setActiveTab("html");
        setActiveMissionTab("overview");

        if (savedDraft) {
          setFeedback("已恢复上次保存的答题内容。");
        }
      } catch (error) {
        setCompletedLevelIds([]);
        setCurrentUnlockedLevelId("");
        setPreviousLevel(null);
        setNextLevel(null);
        setFeedback(error instanceof Error ? error.message : "关卡加载失败");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      void loadLevel();
    }
  }, [id]);

  const previewContent = useMemo(
    () => {
      // Escape </script> in user code to prevent it from breaking the iframe's script tag
      const safeJs = javascript.replace(/<\/script>/gi, '<\\/script>');
      return `
      <!doctype html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: "Noto Sans SC", sans-serif; padding: 16px; background: #f6f7fb; color: #111827; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${safeJs}
            } catch (error) {
              document.body.insertAdjacentHTML("beforeend", '<pre style="margin-top:16px;color:#b91c1c;background:#fee2e2;padding:12px;border-radius:12px;">' + String(error) + '</pre>');
            }
          <\/script>
        </body>
      </html>
    `;
    },
    [html, css, javascript],
  );

  async function handleSubmit() {
    if (!level) {
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      writeLevelDraft(level.id, { html, css, javascript });

      const result = await submitLevel({
        levelId: level.id,
        html,
        css,
        javascript,
      });

      // Clear draft after successful submission so re-entering shows fresh starter code
      clearLevelDraft(level.id);

      navigate(`/result/${level.id}`, {
        state: {
          levelTitle: level.title,
          result,
        },
      });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "提交失败，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  }

  function resetCode() {
    if (!level) {
      return;
    }

    clearLevelDraft(level.id);
    setHtml(level.starterCode.html);
    setCss(level.starterCode.css);
    setJavascript(level.starterCode.javascript);
    setFeedback("已恢复到关卡初始代码。");
  }

  function goToNextLevel() {
    if (!nextLevel) {
      return;
    }

    if (!isLevelUnlocked(nextLevel)) {
      setFeedback(`下一关「${nextLevel.title}」尚未解锁，请先返回地图推进当前区域进度。`);
      return;
    }

    setFeedback("");
    setActiveTab("html");
    setActiveMissionTab("overview");
    navigate(`/levels/${nextLevel.id}`);
  }

  function goToPreviousLevel() {
    if (!previousLevel) {
      return;
    }

    setFeedback("");
    setActiveTab("html");
    setActiveMissionTab("overview");
    navigate(`/levels/${previousLevel.id}`);
  }

  function isLevelUnlocked(targetLevel: Level | null) {
    if (!targetLevel) {
      return false;
    }

    return completedLevelIds.includes(targetLevel.id) || currentUnlockedLevelId === targetLevel.id;
  }

  const tabs: Array<{ key: CodeTab; label: string }> = [
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "javascript", label: "JavaScript" },
  ];

  const activeValue =
    activeTab === "html" ? html : activeTab === "css" ? css : javascript;
  const currentLevelUnlocked = isLevelUnlocked(level);
  const nextLevelUnlocked = isLevelUnlocked(nextLevel);

  const missionObjectives = level?.learningObjectives ?? [];
  const taskList = level?.taskDescription ?? [];
  const passChecklist = level?.passCriteria ?? [];
  const hintList = level?.hintLevels ?? [];
  const knowledgePoints = level?.knowledgePoints ?? [];
  const prerequisites = level?.prerequisites ?? [];
  const firstStep = level?.firstStep ?? "";
  const stepGuide = level?.stepByStep ?? [];
  const targetPreview = level?.targetPreview ?? [];
  const commonMistakes = level?.commonMistakes ?? [];
  const missionTabItems: Array<{ key: MissionTab; label: string }> = [
    { key: "overview", label: "概览" },
    { key: "tasks", label: "要求" },
    { key: "hints", label: "提示" },
  ];

  function getEditorPath(tab: CodeTab) {
    if (tab === "html") return "file:///challenge/index.html";
    if (tab === "css") return "file:///challenge/styles.css";
    return "file:///challenge/main.js";
  }

  function getEditorLanguage(tab: CodeTab) {
    return tab === "javascript" ? "javascript" : tab;
  }

  function formatCurrentEditor() {
    const editorElement = document.querySelector(
      ".monaco-editor",
    ) as HTMLElement | null;

    if (!editorElement) {
      setFeedback("编辑器尚未准备完成，请稍后再试。");
      return;
    }

    editorElement.focus();
    void (
      globalThis as {
        monacoEditorInstance?: {
          getAction: (id: string) => { run: () => Promise<void> };
        };
      }
    ).monacoEditorInstance
      ?.getAction("editor.action.formatDocument")
      ?.run();
    setFeedback("已执行代码格式化。");
  }

  // Debounced draft auto-save to avoid excessive localStorage writes during fast typing
  const draftSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef<LevelDraft>({ html, css, javascript });

  // Keep ref in sync so beforeunload can read latest values synchronously
  draftRef.current = { html, css, javascript };

  useEffect(() => {
    if (!level) {
      return;
    }

    if (draftSaveTimer.current) {
      clearTimeout(draftSaveTimer.current);
    }
    draftSaveTimer.current = setTimeout(() => {
      writeLevelDraft(level.id, draftRef.current);
    }, 800);

    return () => {
      if (draftSaveTimer.current) {
        clearTimeout(draftSaveTimer.current);
      }
    };
  }, [level, html, css, javascript]);

  // Save draft synchronously on page unload to avoid losing unsaved changes
  useEffect(() => {
    function handleBeforeUnload() {
      if (level) {
        writeLevelDraft(level.id, draftRef.current);
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [level]);

  return (
    <div className="h-screen overflow-hidden bg-[#0a1220] text-stone-100">
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-30" />

      <div className="relative mx-auto flex h-screen max-w-[1560px] flex-col px-4 py-4 lg:px-6">
        <div className="pixel-status-bar mb-4 shrink-0 flex flex-wrap items-center justify-between gap-3 px-3 py-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] font-display"
              onClick={() => navigate("/map")}
            >
              <ArrowLeft size={14} />
              返回
            </button>
            <div className="pixel-outline bg-[#13253c] px-3 py-1.5">
              <p className="font-display text-[9px] text-[#ffcf57]">
                {loading ? "LOADING..." : level?.chapter ?? "挑战关卡"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-[11px]">
              <Swords size={14} className="text-amber-200" />
              <span className="font-semibold text-amber-100">
                {level?.difficulty?.toUpperCase() ?? "NORMAL"}
              </span>
            </div>
            <div className="pixel-chip flex items-center gap-2 px-3 py-1.5 text-[11px]">
              <Trophy size={14} className="text-amber-200" />
              <span className="font-semibold text-amber-100">
                {level?.rewardXp ?? 0} XP
              </span>
            </div>
          </div>
        </div>

        {!loading && level && !currentLevelUnlocked ? (
          <div className="pixel-panel flex min-h-0 flex-1 items-center justify-center p-6">
            <div className="w-full max-w-2xl text-center">
              <p className="font-display text-[11px] text-rose-200">LOCKED LEVEL</p>
              <h2 className="mt-4 font-display text-[22px] leading-[1.9] text-stone-50 pixel-text-shadow">
                这一关尚未解锁
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                需要先通关上一关，才能继续挑战 <span className="font-semibold text-amber-100">{level.title}</span>。
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className="pixel-button-secondary flex items-center gap-2 px-4 py-3 text-[11px] font-display"
                  onClick={() => navigate("/map")}
                >
                  <ArrowLeft size={14} />
                  返回地图
                </button>
                {previousLevel ? (
                  <button
                    type="button"
                    className="pixel-button flex items-center gap-2 px-4 py-3 text-[11px] font-display"
                    onClick={goToPreviousLevel}
                  >
                    前往上一关
                    <ArrowRight size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[360px_minmax(0,1.15fr)_minmax(300px,0.85fr)] 2xl:grid-cols-[390px_minmax(0,1.2fr)_minmax(340px,0.9fr)]">
          <section className="pixel-panel min-h-0 overflow-hidden p-5 md:p-6">
            <div className="h-full overflow-y-auto pr-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[11px] text-cyan-200">MISSION PANEL</p>
                  <h1 className="mt-3 font-display text-[20px] leading-[1.8] text-stone-50 pixel-text-shadow">
                    {loading ? "正在载入关卡..." : level?.title ?? "关卡不存在"}
                  </h1>
                  {level?.subtitle ? (
                    <p className="mt-2 text-sm text-cyan-100">{level.subtitle}</p>
                  ) : null}
                </div>
                <div className="pixel-outline bg-[#13253c] px-3 py-2">
                  <p className="font-display text-[10px] text-[#ffcf57]">
                    {level?.difficulty?.toUpperCase() ?? "EASY"}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {level?.description ??
                  "阅读左侧任务要求，在右侧编辑器中完成代码并提交挑战。"}
              </p>

              {level?.story ? (
                <div className="mt-4 pixel-map-tile p-4">
                  <div className="flex items-center gap-2 text-fuchsia-100">
                    <ScrollText size={15} />
                    <p className="font-display text-[10px]">剧情背景</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{level.story}</p>
                </div>
              ) : null}

              {knowledgePoints.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {knowledgePoints.map((point) => (
                    <span key={point} className="pixel-chip px-3 py-1.5 text-[11px]">
                      {point}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="pixel-map-tile p-4">
                  <div className="flex items-center gap-2 text-lime-100">
                    <Target size={15} />
                    <p className="font-display text-[10px]">第一步先做什么</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {firstStep || "先从最核心的结构开始，完成后再逐步补完整个页面。"}
                  </p>
                </div>

                <div className="pixel-map-tile p-4">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <ScrollText size={15} />
                    <p className="font-display text-[10px]">学习目标</p>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                    {missionObjectives.length ? (
                      missionObjectives.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-cyan-200">&gt;</span>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li>完成当前页面需求，让代码同时满足结构、样式或交互要求。</li>
                    )}
                  </ul>
                </div>

                <div className="pixel-map-tile p-4">
                  <div className="flex items-center gap-2 text-amber-100">
                    <Trophy size={15} />
                    <p className="font-display text-[10px]">关卡奖励</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    通关可获得{" "}
                    <span className="font-semibold text-amber-100">{level?.rewardXp ?? 0} XP</span>
                    ，并推进当前章节进度。
                  </p>
                  {prerequisites.length ? (
                    <div className="mt-3 border-t border-slate-700/60 pt-3 text-xs leading-6 text-slate-400">
                      前置：{prerequisites.join(" / ")}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 pixel-map-tile p-3">
                <div className="inline-flex gap-1 rounded-md bg-[#09131f] p-1 pixel-outline">
                  {missionTabItems.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={`px-4 py-2 text-[11px] font-display ${
                        activeMissionTab === tab.key
                          ? "pixel-button text-white"
                          : "pixel-button-secondary text-slate-200"
                      }`}
                      onClick={() => setActiveMissionTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeMissionTab === "overview" ? (
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-amber-100">
                        <ArrowRight size={15} />
                        <p className="font-display text-[10px]">分步路线</p>
                      </div>
                      <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {stepGuide.length ? (
                          stepGuide.map((item, index) => (
                            <li key={item}>
                              {index + 1}. {item}
                            </li>
                          ))
                        ) : (
                          <li>先补结构，再检查预览，最后再提交挑战。</li>
                        )}
                      </ol>
                    </div>

                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-lime-100">
                        <Target size={15} />
                        <p className="font-display text-[10px]">任务要求</p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {taskList.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-amber-200">&gt;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-cyan-100">
                        <Trophy size={15} />
                        <p className="font-display text-[10px]">通关重点</p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {passChecklist.slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-lime-300">+</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-fuchsia-100">
                        <Eye size={15} />
                        <p className="font-display text-[10px]">完成后你会看到</p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {targetPreview.length ? (
                          targetPreview.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="text-cyan-200">&gt;</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li>页面会出现更完整的结构，并能在预览区看到变化。</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {activeMissionTab === "tasks" ? (
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-lime-100">
                        <Target size={15} />
                        <p className="font-display text-[10px]">任务要求</p>
                      </div>
                      <ul className="mt-3 space-y-3 text-sm text-slate-300">
                        {taskList.length ? (
                          taskList.map((item) => (
                            <li key={item} className="flex items-start gap-3 leading-6">
                              <span className="mt-1 text-amber-200">&gt;</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="leading-6">
                            当前关卡暂未配置详细检查点，请根据任务描述完成页面。
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-cyan-100">
                        <Trophy size={15} />
                        <p className="font-display text-[10px]">通关标准</p>
                      </div>
                      <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                        {passChecklist.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-1 text-lime-300">+</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                {activeMissionTab === "hints" ? (
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-fuchsia-100">
                        <Sparkles size={15} />
                        <p className="font-display text-[10px]">分层提示</p>
                      </div>
                      <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                        {hintList.length ? (
                          hintList.map((item, index) => (
                            <li key={item}>
                              {index + 1}. {item}
                            </li>
                          ))
                        ) : (
                          <>
                            <li>1. 先补结构，再补样式，最后补交互。</li>
                            <li>2. 先点“运行”检查预览，再点击“提交挑战”。</li>
                            <li>3. 如果失败，优先对照左侧要求逐项排查。</li>
                          </>
                        )}
                      </ol>
                    </div>

                    <div className="rounded-lg border border-slate-700/70 bg-[#101a28] px-4 py-3">
                      <div className="flex items-center gap-2 text-rose-100">
                        <Target size={15} />
                        <p className="font-display text-[10px]">常见错误</p>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {commonMistakes.length ? (
                          commonMistakes.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="text-rose-300">x</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li>提交前重点检查：标签是否写对、结构是否嵌套正确。</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>

              {feedback ? (
                <div className="mt-4 pixel-outline bg-[#3a1a25] px-4 py-3 text-sm leading-6 text-rose-200">
                  {feedback}
                </div>
              ) : null}
            </div>
          </section>

          <section className="pixel-panel flex min-h-0 flex-col p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-[11px] text-cyan-200">CODE EDITOR</p>
                <p className="mt-1 text-xs text-slate-400">
                  中间专注写代码，右侧实时查看结果。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!previousLevel || loading}
                  className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] font-display disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={goToPreviousLevel}
                  title={previousLevel ? `前往 ${previousLevel.title}` : "当前已经是第一关"}
                >
                  <ArrowLeft size={14} />
                  上一关
                </button>
                <button
                  type="button"
                  disabled={!nextLevel || loading || !nextLevelUnlocked}
                  className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] font-display disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={goToNextLevel}
                  title={
                    !nextLevel
                      ? "当前已经是最后一关"
                      : nextLevelUnlocked
                        ? `前往 ${nextLevel.title}`
                        : `${nextLevel.title} 尚未解锁`
                  }
                >
                  下一关
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex gap-1 rounded-md bg-[#09131f] p-1 pixel-outline">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`px-4 py-2 text-[11px] font-display ${
                      activeTab === tab.key
                        ? "pixel-button text-white"
                        : "pixel-button-secondary text-slate-200"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] font-display"
                  onClick={formatCurrentEditor}
                >
                  <Wand2 size={14} />
                  格式化
                </button>
                <button
                  type="button"
                  className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] font-display"
                  onClick={resetCode}
                >
                  <RotateCcw size={14} />
                  重置
                </button>
                <button
                  type="button"
                  className="pixel-button-secondary flex items-center gap-2 px-3 py-2 text-[11px] font-display"
                  onClick={() => setFeedback("预览已实时更新，可以直接查看右侧运行结果。")}
                >
                  <Play size={14} />
                  运行
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  className="pixel-button flex items-center gap-2 px-4 py-2 text-[11px] font-display disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={handleSubmit}
                >
                  <Send size={14} />
                  {submitting ? "提交中..." : "提交挑战"}
                </button>
              </div>
            </div>

            {feedback ? (
              <div className="mb-3 pixel-outline bg-[#3a1a25] px-4 py-3 text-sm leading-6 text-rose-200">
                {feedback}
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-hidden pixel-outline">
              <Editor
                path={getEditorPath(activeTab)}
                height="100%"
                language={getEditorLanguage(activeTab)}
                value={activeValue}
                theme="vs-dark"
                beforeMount={(monaco) => {
                  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                    allowNonTsExtensions: true,
                    target: monaco.languages.typescript.ScriptTarget.ES2020,
                  });

                  monaco.languages.html.htmlDefaults.setOptions({
                    format: {
                      tabSize: 2,
                      insertSpaces: true,
                      wrapLineLength: 120,
                      unformatted: "wbr",
                      contentUnformatted: "pre,code,textarea",
                      indentInnerHtml: true,
                      preserveNewLines: true,
                      maxPreserveNewLines: 2,
                    },
                    suggest: {
                      html5: true,
                      angular1: false,
                      ionic: false,
                    },
                  });

                  monaco.languages.css.cssDefaults.setOptions({
                    validate: true,
                    lint: {
                      compatibleVendorPrefixes: "ignore",
                      vendorPrefix: "warning",
                      duplicateProperties: "warning",
                      emptyRules: "warning",
                      importStatement: "ignore",
                      boxModel: "ignore",
                      universalSelector: "ignore",
                      zeroUnits: "ignore",
                    },
                  });
                }}
                onMount={(editor, monaco) => {
                  (
                    globalThis as {
                      monacoEditorInstance?: typeof editor;
                    }
                  ).monacoEditorInstance = editor;

                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                    void editor.getAction("editor.action.formatDocument")?.run();
                    setFeedback("已格式化当前代码。");
                  });
                }}
                onChange={(value) => {
                  const next = value ?? "";
                  if (activeTab === "html") setHtml(next);
                  if (activeTab === "css") setCss(next);
                  if (activeTab === "javascript") setJavascript(next);
                }}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 2,
                  insertSpaces: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  autoClosingDelete: "always",
                  autoClosingOvertype: "always",
                  autoIndent: "advanced",
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true,
                  },
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: "on",
                  tabCompletion: "on",
                  wordBasedSuggestions: "currentDocument",
                  parameterHints: {
                    enabled: true,
                  },
                  snippetSuggestions: "top",
                  inlineSuggest: {
                    enabled: true,
                  },
                }}
              />
            </div>
          </section>

          <section className="pixel-panel flex min-h-0 flex-col p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-cyan-200" />
                <p className="font-display text-[11px] text-slate-400">实时预览</p>
              </div>
              <div className="pixel-chip px-3 py-1.5 text-[10px] text-slate-300">
                预览画布
              </div>
            </div>
            <div className="min-h-0 flex-1 pixel-outline overflow-hidden bg-[#d9e2ef] p-3">
              <div className="flex h-full items-center justify-center rounded-[10px] border border-slate-400/60 bg-[#eef3fb] p-2">
                <div className="h-full w-full overflow-hidden rounded-[8px] border border-slate-300 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
                  <iframe
                    title="WebQuest Preview"
                    sandbox="allow-scripts"
                    srcDoc={previewContent}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        )}
      </div>
    </div>
  );
}
