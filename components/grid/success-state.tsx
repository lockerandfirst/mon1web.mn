"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-10 flex h-36 w-36 rotate-6 items-center justify-center rounded-[3.5rem] bg-[#eef0ff] shadow-2xl shadow-[#2a00ff]/10">
        <CheckCircle2 className="h-16 w-16 text-[#2a00ff]" />
      </div>
      <h2 className="text-5xl font-black uppercase italic tracking-tight text-[#1a0b3b]">
        Амжилттай
        <span className="text-[#ff3bad]"> бүртгэгдлээ!</span>
      </h2>
      <p className="mt-6 max-w-md text-xl font-bold italic leading-relaxed text-[#ff9ce0]">
        Таны зар хадгалагдлаа. Баталгаажуулалтын дараа жагсаалтад орно.
      </p>
      <Button
        onClick={onReset}
        className="mt-12 h-20 rounded-[2rem] bg-[#1a0b3b] px-16 text-xl font-black uppercase italic text-white transition-all hover:bg-[#2a00ff]"
      >
        Шинэ зар нэмэх
      </Button>
    </div>
  );
}
