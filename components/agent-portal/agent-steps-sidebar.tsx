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
      className="space-y-6"
    >
      {/* Steps Card */}
      <div className="p-10 rounded-[2.5rem] bg-[#2a00ff] text-white shadow-2xl relative overflow-hidden">
        <h3 className="text-3xl font-black tracking-tighter uppercase mb-8 italic">
          Алхмууд
        </h3>
        <div className="space-y-10 relative z-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="w-8 h-8 rounded-full bg-white text-[#2a00ff] flex items-center justify-center font-black text-sm shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="font-bold text-lg leading-none mb-1 uppercase tracking-tight italic">
                  {s.t}
                </p>
                <p className="text-white/60 text-sm font-medium">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Support Cards */}
      <div className="space-y-3">
        <SupportCard phone="+976 94948873" email="agents@mon1.mn" />
        <SupportCard phone="+976 94498873" email="support@mon1.mn" />
      </div>
    </motion.aside>
  );
}

function SupportCard({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-white hover:border-blue-600/30 transition-colors group">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="h-5 w-5 text-[#2a00ff]" />
        <p className="font-black tracking-tight uppercase text-[10px] text-zinc-400">
          Direct Support
        </p>
      </div>
      <p className="text-2xl font-black text-zinc-950 tracking-tighter italic">
        {phone}
      </p>
      <p className="text-[#2a00ff] font-bold underline text-sm mt-1 cursor-pointer">
        {email}
      </p>
    </div>
  );
}
