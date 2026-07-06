import { ArrowLeft, ArrowRight, Sparkles, Star, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { SubmissionResult } from "@/types/api";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as SubmissionResult | undefined;
  const levelTitle = location.state?.levelTitle as string | undefined;

  const stars = useMemo(() => {
    if (!result) return 0;
    if (result.submission.score >= 90) return 3;
    if (result.submission.score >= 60) return 2;
    if (result.submission.score >= 30) return 1;
    return 0;
  }, [result]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08111d] px-6 text-stone-100">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="font-display text-3xl text-stone-50">暂时没有结算数据</h1>
          <p className="mt-4 text-sm text-stone-300">
            请先从关卡页面提交一次挑战，再进入结算页查看奖励。
          </p>
          <button
            type="button"
            className="mt-6 rounded-2xl bg-stone-100 px-5 py-3 text-sm font-medium text-slate-950"
            onClick={() => navigate("/map")}
          >
            返回地图
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,_#0b1020,_#0a1523_45%,_#08111d_100%)] px-6 py-8 text-stone-100 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="inline-flex items-center gap-2 self-center rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs tracking-[0.2em] text-amber-100 uppercase">
          <Sparkles size={14} />
          Battle Result
        </div>

        <div className="rounded-[2.2rem] border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-stone-400">当前关卡</p>
          <h1 className="mt-2 font-display text-5xl text-stone-50">
            {levelTitle ?? "挑战结算"}
          </h1>

          <div className="mt-6 flex items-center justify-center gap-2 text-amber-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <Star
                key={index}
                size={28}
                className={index < stars ? "fill-current" : "opacity-25"}
              />
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs text-stone-400">得分</p>
              <p className="mt-2 text-3xl font-semibold text-stone-50">
                {result.submission.score}
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-300/15 bg-emerald-300/10 p-5">
              <p className="text-xs text-emerald-100/70">获得 XP</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-100">
                +{result.submission.earnedXp}
              </p>
            </div>
            <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/10 p-5">
              <p className="text-xs text-cyan-100/70">当前等级</p>
              <p className="mt-2 text-3xl font-semibold text-cyan-100">
                Lv.{result.progress.level}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
            <div className="inline-flex items-center gap-2 text-amber-100">
              <Trophy size={18} />
              <span className="text-sm font-medium">
                {result.submission.passed ? "挑战成功" : "挑战失败"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-stone-300">{result.feedback}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm transition hover:bg-white/10"
              onClick={() => navigate("/map")}
            >
              <ArrowLeft size={16} />
              返回地图
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-stone-100 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100"
              onClick={() => navigate(`/levels/${result.submission.levelId}`)}
            >
              再试一次
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
