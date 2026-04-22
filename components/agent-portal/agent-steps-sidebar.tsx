"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

const STEPS = [
  { t: "Хүсэлт", d: "Мэдээллээ илгээх" },
  { t: "Уулзалт", d: "Баталгаажуулалт хийх" },
  { t: "Нэвтрэх", d: "Эрхээ идэвхжүүлэх" },
];

export function AgentStepsSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-4 md:space-y-6"
    >
      {/* Steps Card */}
      <div className="relative overflow-hidden rounded-4xl bg-[#2a00ff] p-5 text-white shadow-xl md:rounded-[2.5rem] md:p-10 md:shadow-2xl">
        <h3 className="mb-5 text-2xl font-black italic tracking-tight uppercase md:mb-8 md:text-3xl md:tracking-tighter">
          Алхмууд
        </h3>
        <div className="relative z-10 space-y-5 md:space-y-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-3 md:gap-5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#2a00ff] md:h-8 md:w-8 md:text-sm">
                {i + 1}
              </div>
              <div>
                <p className="mb-1 text-base leading-none font-bold italic tracking-tight uppercase md:text-lg">
                  {s.t}
                </p>
                <p className="text-xs font-medium text-white/70 md:text-sm">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-3xl md:h-40 md:w-40" />
      </div>

      {/* Support Cards */}
      <div className="space-y-2.5 md:space-y-3">
        <SupportCard phone="+976 94948873" email="agents@mon1.mn" />
        <SupportCard phone="+976 94498873" email="support@mon1.mn" />
      </div>
    </motion.aside>
  );
}

function SupportCard({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="group rounded-3xl border-2 border-dashed border-[#2a00ff]/20 bg-white p-4 transition-colors hover:border-[#2a00ff]/40 md:rounded-[2.5rem] md:p-8">
      <div className="mb-2.5 flex items-center gap-2 md:mb-4 md:gap-3">
        <Phone className="h-4 w-4 text-[#2a00ff] md:h-5 md:w-5" />
        <p className="text-[9px] font-black tracking-wide text-[#2a00ff]/55 uppercase md:text-[10px] md:tracking-tight">
          Direct Support
        </p>
      </div>
      <p className="text-xl font-black italic tracking-tight text-[#2a00ff] md:text-2xl md:tracking-tighter">
        {phone}
      </p>
      <p className="mt-1 cursor-pointer text-xs font-bold text-[#2a00ff] underline md:text-sm">
        {email}
      </p>
    </div>
  );
}
