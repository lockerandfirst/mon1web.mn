import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
export default function ChecklistRow({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[1.4rem] bg-white px-4 py-3">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          done ? "bg-[#2a00ff] text-white" : "bg-[#ffe5f5] text-[#ff9ce0]",
        )}
      >
        <CheckCircle2 className="h-4 w-4" />
      </div>
      <p
        className={cn(
          "text-sm font-black",
          done ? "text-[#1a0b3b]" : "text-[#c48ab6]",
        )}
      >
        {label}
      </p>
    </div>
  );
}
