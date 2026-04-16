import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AgentHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-left"
    >
      <div className="mb-6 inline-flex items-center  gap-2 rounded-full bg-blue-600/10 border border-blue-600/20 px-4 py-2 text-xs font-black text-blue-600 uppercase tracking-widest">
        <Sparkles className="h-4 w-4" />
        Official Agent Network
      </div>

      <h1 className="mb-6 text-6xl lg:text-8xl font-bold text-slate-900 tracking-tighter leading-[0.85]">
        <div className="mt-2 flex items-baseline">
          <div className="bg-linear-to-r from-[#ff3bad] to-[#2a00ff] bg-clip-text text-transparent font-black tracking-tighter">
            <span className="text-[1.2em]">M</span>on
            <span className="text-[1.2em]">1</span>.mn
          </div>
          <span className="text-slate-900 font-bold text-[0.8em] ml-2">
            -тэй
          </span>
        </div>
        хамт хөгжицгөөя
      </h1>

      <p className="max-w-md text-lg text-slate-500 mb-8 font-semibold italic">
        Баталгаажсан агент болсноор эзэмшигчдийн шууд хүсэлтийг хүлээн авч,
        борлуулалтаа хурдасга.
      </p>

      <div className="flex gap-4">
        {[
          { val: "150+", label: "Агентууд" },
          { val: "98%", label: "Сэтгэл ханамж" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
              {stat.val}
            </p>
            <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
