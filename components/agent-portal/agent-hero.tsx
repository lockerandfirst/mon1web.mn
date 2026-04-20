import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AgentHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-left max-md:text-center"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-blue-600 md:mb-6 md:px-4 md:py-2 md:text-xs md:tracking-widest">
        <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
        Official Agent Network
      </div>

      <h1 className="mb-4 text-4xl font-bold leading-[0.9] tracking-tight text-slate-900 md:mb-6 md:text-6xl md:tracking-tighter lg:text-8xl">
        <div className="mt-1 flex items-baseline max-md:justify-center md:mt-2">
          <div className="bg-linear-to-r from-[#ff3bad] to-[#2a00ff] bg-clip-text text-transparent font-black tracking-tighter">
            <span className="text-[1.2em]">M</span>on
            <span className="text-[1.2em]">1</span>.mn
          </div>
          <span className="ml-1.5 text-[0.75em] font-bold text-slate-900 md:ml-2 md:text-[0.8em]">
            -тэй
          </span>
        </div>
        хамт хөгжицгөөя
      </h1>

      <p className="mb-6 max-w-md text-sm font-semibold italic text-slate-500 max-md:mx-auto md:mb-8 md:text-lg">
        Баталгаажсан агент болсноор эзэмшигчдийн шууд хүсэлтийг хүлээн авч,
        борлуулалтаа хурдасга.
      </p>

      <div className="flex gap-2.5 max-md:justify-center md:gap-4">
        {[
          { val: "150+", label: "Агентууд" },
          { val: "98%", label: "Сэтгэл ханамж" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm md:rounded-3xl md:p-5"
          >
            <p className="text-2xl font-black italic tracking-tight text-slate-900 md:text-3xl md:tracking-tighter">
              {stat.val}
            </p>
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-400 md:text-[10px] md:tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
