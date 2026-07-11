import { ArrowLeft, ArrowRight, Coins, Sparkles, Star, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getLevels } from "@/services/game.service";
import type { Level, SubmissionResult } from "@/types/api";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as SubmissionResult | undefined;
  const levelTitle = location.state?.levelTitle as string | undefined;
  const [nextLevel, setNextLevel] = useState<Level | null>(null);

  const stars = useMemo(() => {
    if (!result) return 0;
    if (result.submission.score >= 90) return 3;
    if (result.submission.score >= 60) return 2;
    if (result.submission.score >= 30) return 1;
    return 0;
  }, [result]);

  useEffect(() => {
    let isMounted = true;

    async function loadNextLevel() {
      if (!result) {
        setNextLevel(null);
        return;
      }

      try {
        const allLevels = await getLevels();
        const sortedLevels = [...allLevels].sort((left, right) => left.sortOrder - right.sortOrder);
        const currentIndex = sortedLevels.findIndex(
          (level) => level.id === result.submission.levelId,
        );

        if (!isMounted) {
          return;
        }

        setNextLevel(
          currentIndex >= 0 && currentIndex < sortedLevels.length - 1
            ? sortedLevels[currentIndex + 1]
            : null,
        );
      } catch {
        if (isMounted) {
          setNextLevel(null);
        }
      }
    }

    void loadNextLevel();

    return () => {
      isMounted = false;
    };
  }, [result]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1220] px-6 text-stone-100">
        <div className="pixel-panel w-full max-w-xl p-8 text-center">
          <h1 className="font-display text-[22px] text-stone-50 pixel-text-shadow">
            暂时没有结算数据
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            请先从关卡页面提交一次挑战，再进入结算页查看奖励。
          </p>
          <button
            type="button"
            className="pixel-button mt-6 px-6 py-3 text-[11px] font-display"
            onClick={() => navigate("/map")}
          >
            返回地图
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_32%),linear-gradient(180deg,#0a1220,#08101a_45%,#0a1220_100%)] text-stone-100">
      <div className="absolute inset-0 pixel-grid-bg opacity-10" />
      <div className="absolute inset-0 pixel-stars opacity-50" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-5 py-8">
        <div className="pixel-status-bar inline-flex items-center gap-2 px-4 py-2 text-[10px] font-display text-[#ffcf57]">
          <Sparkles size={14} />
          战斗结算
        </div>

        <div className="pixel-panel w-full max-w-2xl p-8 text-center md:p-10">
          <p className="font-display text-[11px] text-slate-400">当前关卡</p>
          <h1 className="mt-3 font-display text-[28px] leading-[1.9] text-stone-50 pixel-text-shadow">
            {levelTitle ?? "挑战结算"}
          </h1>

          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Star
                key={index}
                size={32}
                className={
                  index < stars
                    ? "fill-[#ffcf57] text-[#ffcf57] drop-shadow-[0_0_6px_rgba(255,207,87,0.6)]"
                    : "text-slate-600 opacity-30"
                }
              />
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="pixel-map-tile p-5">
              <p className="font-display text-[10px] text-slate-400">得分</p>
              <p className="mt-3 font-display text-[28px] text-stone-50 pixel-text-shadow">
                {result.submission.score}
              </p>
            </div>
            <div className="pixel-map-tile border-lime-500/30 p-5">
              <div className="flex items-center justify-center gap-2">
                <Coins size={18} className="text-lime-200" />
                <p className="font-display text-[10px] text-lime-200">获得 XP</p>
              </div>
              <p className="mt-3 font-display text-[28px] text-lime-100 pixel-text-shadow">
                +{result.submission.earnedXp}
              </p>
            </div>
            <div className="pixel-map-tile border-cyan-500/30 p-5">
              <p className="font-display text-[10px] text-cyan-200">当前等级</p>
              <p className="mt-3 font-display text-[28px] text-cyan-100 pixel-text-shadow">
                Lv.{result.progress.level}
              </p>
            </div>
          </div>

          <div className="mt-6 pixel-map-tile p-5">
            <div className="flex items-center justify-center gap-2">
              <Trophy size={18} className="text-amber-200" />
              <span className="font-display text-[11px] text-amber-100">
                {result.submission.passed ? "挑战成功" : "挑战失败"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {result.feedback}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="pixel-button-secondary flex items-center gap-2 px-5 py-3 text-[11px] font-display"
              onClick={() => navigate("/map")}
            >
              <ArrowLeft size={16} />
              返回地图
            </button>
            <button
              type="button"
              className="pixel-button flex items-center gap-2 px-5 py-3 text-[11px] font-display"
              onClick={() => navigate(`/levels/${result.submission.levelId}`)}
            >
              再试一次
              <ArrowRight size={16} />
            </button>
            {stars === 3 && nextLevel ? (
              <button
                type="button"
                className="pixel-button flex items-center gap-2 px-5 py-3 text-[11px] font-display"
                onClick={() => navigate(`/levels/${nextLevel.id}`)}
                title={`前往 ${nextLevel.title}`}
              >
                下一关
                <ArrowRight size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
