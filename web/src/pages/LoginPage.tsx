import { motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Compass,
  Heart,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login, register } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const DEV_FIXED_ACCOUNT = import.meta.env.DEV
  ? {
      username: "devplayer",
      password: "123456",
    }
  : null;

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

const quickStats = [
  { icon: Heart, label: "体力", value: "120/120" },
  { icon: Coins, label: "金币", value: "2450" },
  { icon: Sparkles, label: "水晶", value: "180" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState(DEV_FIXED_ACCOUNT?.username ?? "");
  const [password, setPassword] = useState(DEV_FIXED_ACCOUNT?.password ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "回到冒险世界" : "创建你的冒险者"),
    [mode],
  );

  async function completeLogin(nextUsername: string, nextPassword: string) {
    const result = await login({ username: nextUsername, password: nextPassword });
    setAuth(result.token, result.user);
    navigate(location.state?.from ?? "/map", { replace: true });
  }

  async function handleFixedAccountLogin() {
    if (!DEV_FIXED_ACCOUNT) {
      return;
    }

    setLoading(true);
    setError("");
    setMode("login");
    setUsername(DEV_FIXED_ACCOUNT.username);
    setPassword(DEV_FIXED_ACCOUNT.password);

    try {
      try {
        await completeLogin(DEV_FIXED_ACCOUNT.username, DEV_FIXED_ACCOUNT.password);
        return;
      } catch {
        try {
          await register(DEV_FIXED_ACCOUNT);
        } catch (registerError) {
          const message = registerError instanceof Error ? registerError.message : "";

          if (!/already exists/i.test(message)) {
            throw registerError;
          }
        }
      }

      await completeLogin(DEV_FIXED_ACCOUNT.username, DEV_FIXED_ACCOUNT.password);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "测试账号进入失败，请稍后重试",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        await register({ username, password });
      }

      await completeLogin(username, password);
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
    <div className="relative min-h-screen overflow-hidden text-stone-100">
      <div className="absolute inset-0 pixel-stars opacity-70" />
      <div className="absolute inset-0 pixel-grid-bg opacity-15" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(180deg,transparent_0%,rgba(13,24,18,0.38)_30%,rgba(8,18,12,0.88)_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-7 px-5 py-6 lg:px-8">
        <div className="pixel-status-bar flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="pixel-outline bg-[#13253c] px-3 py-2">
              <p className="font-display text-[10px] text-[#ffcf57]">WEBQUEST</p>
            </div>
            <div>
              <p className="font-display text-[10px] text-stone-50 pixel-text-shadow">
                像素冒险入口
              </p>
              <p className="mt-1 text-xs text-slate-300">Web 开发闯关之旅</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickStats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="pixel-chip flex items-center gap-2 px-3 py-2 text-[11px] text-slate-100"
              >
                <Icon size={14} className="text-amber-200" />
                <span className="text-slate-300">{label}</span>
                <span className="font-semibold text-stone-100">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col justify-between gap-8 py-2">
            <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pixel-panel p-6 md:p-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 pixel-chip text-[11px] text-cyan-100">
              <Sparkles size={14} />
              像素勇者大厅
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-[28px] leading-[2.1] text-[#ffe58b] pixel-text-shadow md:text-[38px]">
              用像素冒险的方式
              <br />
              挑战 Web 开发大陆
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              从新手村出发，踏入 CSS 森林和 JS 风暴，在一场场剧情任务与代码战斗中升级成长。每一关都像 RPG 副本，每一次提交都决定你能否继续前进。
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {featureCards.map(({ icon: Icon, title: cardTitle, description }, index) => (
                <motion.article
                  key={cardTitle}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.45 }}
                  className="pixel-map-tile p-4"
                >
                  <div className="mb-3 inline-flex rounded-md border-2 border-slate-600 bg-[#16253a] p-2 text-cyan-200 shadow-[0_4px_0_0_#0f1724]">
                    <Icon size={18} />
                  </div>
                  <h2 className="font-display text-[11px] leading-6 text-stone-100">
                    {cardTitle}
                  </h2>
                  <p className="mt-3 text-xs leading-6 text-slate-300">{description}</p>
                </motion.article>
              ))}
            </div>
            </motion.div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="pixel-map-tile p-4">
              <p className="font-display text-[11px] text-lime-200">今日任务</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>- 登录平台并创建你的冒险者存档</li>
                <li>- 解锁新手村第一批 HTML 关卡</li>
                <li>- 准备进入地图页面选择副本</li>
              </ul>
            </div>
            <div className="pixel-map-tile p-4">
              <p className="font-display text-[11px] text-fuchsia-200">当前版本</p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>认证已接入 MySQL</p>
                <p>地图、关卡、结算页已上线</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="pixel-panel w-full max-w-xl p-6 md:p-8"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[11px] text-cyan-200">ACCESS PANEL</p>
                <h2 className="mt-4 font-display text-[24px] leading-[1.9] text-stone-50">
                  {title}
                </h2>
              </div>
              <div className="pixel-outline flex h-16 w-16 items-center justify-center bg-[#163149] text-[#8ff4de]">
                <Compass size={22} />
              </div>
            </div>

            <div className="mb-6 inline-flex gap-2 rounded-md bg-[#09131f] p-2 pixel-outline">
              <button
                type="button"
                className={`px-4 py-2 text-[11px] font-display ${
                  mode === "login"
                    ? "pixel-button text-white"
                    : "pixel-button-secondary text-slate-200"
                }`}
                onClick={() => setMode("login")}
              >
                登录
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-[11px] font-display ${
                  mode === "register"
                    ? "pixel-button text-white"
                    : "pixel-button-secondary text-slate-200"
                }`}
                onClick={() => setMode("register")}
              >
                注册
              </button>
            </div>

            {DEV_FIXED_ACCOUNT ? (
              <div className="mb-5 space-y-3">
                <div className="pixel-map-tile px-4 py-3 text-sm text-slate-300">
                  <p className="font-display text-[11px] text-cyan-200">测试模式固定账号</p>
                  <p className="mt-2">
                    用户名：`{DEV_FIXED_ACCOUNT.username}` / 密码：`{DEV_FIXED_ACCOUNT.password}`
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  className="pixel-button-secondary flex w-full items-center justify-center gap-3 px-5 py-4 text-[11px] font-display disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={handleFixedAccountLogin}
                >
                  {loading ? "正在连接测试账号" : "测试模式一键进入"}
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-xs tracking-[0.14em] text-slate-300 uppercase">
                  用户名
                </span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="pixel-input w-full px-4 py-3 text-sm text-stone-100 placeholder:text-slate-500"
                  placeholder="输入冒险者名称"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs tracking-[0.14em] text-slate-300 uppercase">
                  密码
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pixel-input w-full px-4 py-3 text-sm text-stone-100 placeholder:text-slate-500"
                  placeholder="至少 6 位字符"
                  required
                />
              </label>

              {error ? (
                <div className="pixel-outline bg-[#3a1a25] px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="pixel-button flex w-full items-center justify-center gap-3 px-5 py-4 text-[11px] font-display disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "正在进入世界" : mode === "login" ? "进入冒险" : "创建角色"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 grid gap-3">
              <div className="pixel-map-tile flex items-center justify-between px-4 py-3 text-sm text-slate-300">
                <span>推荐起点</span>
                <span className="text-emerald-200">新手村 / HTML 基础</span>
              </div>
              <div className="pixel-map-tile flex items-center justify-between px-4 py-3 text-sm text-slate-300">
                <span>首版体验重点</span>
                <span className="text-amber-200">地图 / 关卡 / 代码战斗</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
    </div>
  );
}
