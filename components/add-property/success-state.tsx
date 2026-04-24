import { CheckCircle2, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SuccessState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-4xl border border-slate-100 bg-white shadow-[0_24px_60px_-28px_rgba(42, 0, 255,0.18)]">
        <CheckCircle2 className="h-16 w-16 text-[#2a00ff]" strokeWidth={2.5} />
      </div>
      <p className="rounded-full border border-[#ebe3ff] bg-[#f8f6ff] px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
        Амжилттай бүртгэгдлээ
      </p>
      <h2 className="mt-4 text-4xl font-black uppercase italic leading-tight tracking-tight text-[#1a0b3b] sm:text-5xl">
        Зар <span className="text-[#ff3bad]">хадгалагдлаа</span>
      </h2>
      <p className="mt-5 max-w-md text-base font-semibold leading-relaxed text-slate-600">
        Таны зар хадгалагдлаа. Баталгаажуулалтын дараа жагсаалтад орно.
      </p>
      <Button
        type="button"
        onClick={onGoHome}
        className="mt-10 h-16 rounded-4xl bg-[#2a00ff] px-10 text-base font-black uppercase tracking-widest text-white shadow-xl shadow-[#2a00ff]/25 transition-all hover:bg-[#ff3bad]"
      >
        <Home className="mr-2 h-5 w-5" />
        Нүүр рүү буцах
      </Button>
    </div>
  );
}
