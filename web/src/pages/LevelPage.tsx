import Editor from "@monaco-editor/react";
import { ArrowLeft, Play, RotateCcw, Send, Trophy } from "lucide-react";
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
    <div className="min-h-screen bg-[#08111d] px-6 py-8 text-stone-100 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
            onClick={() => navigate("/map")}
          >
            <ArrowLeft size={16} />
            返回地图
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-300/10 px-4 py-2 text-xs text-amber-100">
            <Trophy size={14} />
            {level?.rewardXp ?? 0} XP
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr]">
          <section className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs tracking-[0.24em] text-stone-400 uppercase">任务剧情</p>
            <h1 className="mt-3 font-display text-3xl text-stone-50">
              {loading ? "正在载入关卡..." : level?.title ?? "关卡不存在"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              {level?.description ??
                "进入战斗后，你需要根据右侧编辑器中的代码完成指定目标。"}
            </p>

            <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-4">
              <p className="text-sm font-medium text-cyan-100">通关提示</p>
              <ul className="mt-3 space-y-2 text-sm text-stone-300">
                {(level?.requiredKeywords ?? []).map((keyword) => (
                  <li key={keyword}>- 包含关键片段：{keyword}</li>
                ))}
              </ul>
            </div>

            {feedback ? (
              <div className="mt-5 rounded-3xl border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-200">
                {feedback}
              </div>
            ) : null}
          </section>

          <section className="grid gap-6">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-white/10 bg-black/20 p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        activeTab === tab.key
                          ? "bg-stone-100 text-slate-950"
                          : "text-stone-300"
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                    onClick={resetCode}
                  >
                    <RotateCcw size={16} />
                    重置
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
                    onClick={() => setFeedback("预览已实时更新，可以直接查看右侧运行结果。")}
                  >
                    <Play size={16} />
                    运行
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-stone-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-100 disabled:opacity-70"
                    onClick={handleSubmit}
                  >
                    <Send size={16} />
                    {submitting ? "提交中..." : "提交挑战"}
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.4rem] border border-white/10">
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

            <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs tracking-[0.24em] text-stone-400 uppercase">实时预览</p>
              <iframe
                title="WebQuest Preview"
                sandbox="allow-scripts"
                srcDoc={previewContent}
                className="h-[360px] w-full rounded-[1.2rem] border border-white/10 bg-white"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
