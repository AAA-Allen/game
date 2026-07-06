import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Send,
  Swords,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getLevelById, submitLevel } from "@/services/game.service";
import type { Level } from "@/types/api";

type CodeTab = "html" | "css" | "javascript";

export default function LevelPage() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [level, setLevel] = useState<Level | null>(null);
  const [activeTab, setActiveTab] = useState<CodeTab>("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [javascript, setJavascript] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function loadLevel() {
      setLoading(true);
      setFeedback("");

      try {
        const levelData = await getLevelById(id);
        setLevel(levelData);
        setHtml(levelData.starterCode.html);
        setCss(levelData.starterCode.css);
        setJavascript(levelData.starterCode.javascript);
      } catch (error) {
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
    () => `
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
              ${javascript}
            } catch (error) {
              document.body.insertAdjacentHTML("beforeend", '<pre style="margin-top:16px;color:#b91c1c;background:#fee2e2;padding:12px;border-radius:12px;">' + String(error) + '</pre>');
            }
          </script>
        </body>
      </html>
    `,
    [html, css, javascript],
  );

  async function handleSubmit() {
    if (!level) {
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const result = await submitLevel({
        levelId: level.id,
        html,
        css,
        javascript,
      });

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

    setHtml(level.starterCode.html);
    setCss(level.starterCode.css);
    setJavascript(level.starterCode.javascript);
    setFeedback("");
  }

  const tabs: Array<{ key: CodeTab; label: string }> = [
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "javascript", label: "JavaScript" },
  ];

  const activeValue =
    activeTab === "html" ? html : activeTab === "css" ? css : javascript;

  return (
    <div className="min-h-screen bg-[#0a1220] text-stone-100">
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 lg:px-6">
        <div className="pixel-status-bar mb-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="pixel-button-secondary flex items-center gap-2 px-4 py-2 text-[11px] font-display"
              onClick={() => navigate("/map")}
            >
              <ArrowLeft size={14} />
              返回
            </button>
            <div className="pixel-outline bg-[#13253c] px-3 py-2">
              <p className="font-display text-[10px] text-[#ffcf57]">
                {loading ? "LOADING..." : `LV.${level?.rewardXp ?? 0}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="pixel-chip flex items-center gap-2 px-3 py-2 text-[11px]">
              <Swords size={14} className="text-amber-200" />
              <span className="text-slate-300">战斗</span>
              <span className="font-semibold text-amber-100">
                {level?.difficulty?.toUpperCase() ?? "NORMAL"}
              </span>
            </div>
            <div className="pixel-chip flex items-center gap-2 px-3 py-2 text-[11px]">
              <Trophy size={14} className="text-amber-200" />
              <span className="text-slate-300">奖励</span>
              <span className="font-semibold text-amber-100">
                {level?.rewardXp ?? 0} XP
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
          <section className="pixel-panel p-5 md:p-6">
            <p className="font-display text-[11px] text-cyan-200">
              任务剧情
            </p>
            <h1 className="mt-4 font-display text-[22px] leading-[1.9] text-stone-50 pixel-text-shadow">
              {loading ? "正在载入关卡..." : level?.title ?? "关卡不存在"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {level?.description ??
                "进入战斗后，你需要根据右侧编辑器中的代码完成指定目标。"}
            </p>

            <div className="mt-6 pixel-map-tile p-4">
              <p className="font-display text-[11px] text-cyan-100">通关提示</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {(level?.requiredKeywords ?? []).map((keyword) => (
                  <li key={keyword} className="flex items-start gap-2">
                    <span className="text-amber-200">&gt;</span>
                    <span>包含关键片段：{keyword}</span>
                  </li>
                ))}
              </ul>
            </div>

            {feedback ? (
              <div className="mt-5 pixel-outline bg-[#3a1a25] px-4 py-3 text-sm text-rose-200">
                {feedback}
              </div>
            ) : null}
          </section>

          <section className="grid gap-5">
            <div className="pixel-panel p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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

                <div className="flex flex-wrap gap-2">
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

              <div className="overflow-hidden pixel-outline">
                <Editor
                  height="420px"
                  language={activeTab === "javascript" ? "javascript" : activeTab}
                  value={activeValue}
                  theme="vs-dark"
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
                  }}
                />
              </div>
            </div>

            <div className="pixel-panel p-4">
              <p className="mb-3 font-display text-[11px] text-slate-400">
                实时预览
              </p>
              <div className="pixel-outline overflow-hidden bg-white">
                <iframe
                  title="WebQuest Preview"
                  sandbox="allow-scripts"
                  srcDoc={previewContent}
                  className="h-[360px] w-full"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
