import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login, register } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const featureCards = [
  {
    icon: Compass,
    title: "地图闯关",
    description: "把 HTML、CSS、JavaScript 拆成可探索的技术大陆。",
  },
  {
    icon: ScrollText,
    title: "剧情任务",
    description: "每一关都带着明确目标、奖励和通关反馈。",
  },
  {
    icon: ShieldCheck,
    title: "成长系统",
    description: "经验值、等级与解锁机制让学习过程更像游戏冒险。",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "回到冒险世界" : "创建你的冒险者"),
    [mode],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        await register({ username, password });
      }

      const result = await login({ username, password });
      setAuth(result.token, result.user);
      navigate(location.state?.from ?? "/map", { replace: true });
    } catch (requestError) {
      const fallback = mode === "login" ? "登录失败，请检查账号信息" : "注册失败，请稍后重试";
      setError(
        requestError instanceof Error ? requestError.message : fallback,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(65,197,176,0.18),_transparent_30%),linear-gradient(135deg,_#07111f,_#0e1f2f_45%,_#13253a_100%)] text-stone-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-12 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="flex flex-col justify-between py-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs tracking-[0.28em] text-cyan-100 uppercase">
              <Sparkles size={14} />
              WebQuest Frontier
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl font-display text-5xl leading-tight text-stone-50 md:text-6xl">
                像打游戏一样，
                <span className="block bg-[linear-gradient(120deg,#d7ff91,#56d9ff,#ffd47b)] bg-clip-text text-transparent">
                  征服 Web 开发世界
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
                从新手村到 JS 风暴，用闯关、战斗、成长和奖励，把前端学习变成一段真正能沉浸进去的冒险旅程。
              </p>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map(({ icon: Icon, title: cardTitle, description }, index) => (
              <motion.article
                key={cardTitle}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * index, duration: 0.6 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-cyan-300/15 p-3 text-cyan-100">
                  <Icon size={18} />
                </div>
                <h2 className="mb-2 text-sm font-semibold tracking-[0.18em] text-stone-100 uppercase">
                  {cardTitle}
                </h2>
                <p className="text-sm leading-6 text-stone-300">{description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xl rounded-[2rem] border border-emerald-200/10 bg-[linear-gradient(180deg,rgba(16,26,41,0.88),rgba(9,16,28,0.92))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.24em] text-emerald-200 uppercase">
                  Adventurer Access
                </p>
                <h2 className="mt-3 font-display text-3xl text-stone-50">{title}</h2>
              </div>
              <div className="rounded-2xl border border-emerald-200/20 bg-emerald-300/10 p-3 text-emerald-100">
                <Compass size={22} />
              </div>
            </div>

            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm transition ${
                  mode === "login"
                    ? "bg-stone-100 text-slate-950 shadow"
                    : "text-stone-300"
                }`}
                onClick={() => setMode("login")}
              >
                登录
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm transition ${
                  mode === "register"
                    ? "bg-stone-100 text-slate-950 shadow"
                    : "text-stone-300"
                }`}
                onClick={() => setMode("register")}
              >
                注册
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm text-stone-300">用户名</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-cyan-300/60 focus:bg-cyan-300/5"
                  placeholder="输入你的冒险者名称"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-stone-300">密码</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-cyan-300/60 focus:bg-cyan-300/5"
                  placeholder="至少 6 位字符"
                  required
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(120deg,#d8f796,#5ee4ff,#ffcf6c)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(94,228,255,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "正在进入世界..." : mode === "login" ? "进入冒险" : "创建角色并进入"}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </button>
            </form>

            <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-stone-300">
              <div className="flex items-center justify-between">
                <span>首版体验重点</span>
                <span className="text-cyan-200">地图 / 关卡 / 代码战斗</span>
              </div>
              <div className="flex items-center justify-between">
                <span>当前后端状态</span>
                <span className="text-emerald-200">认证已接入 MySQL</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
