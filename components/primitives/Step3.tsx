"use client";

import { FEATURE_GUIDE } from "@/components/add-property/constants";
import { ServicePicker } from "@/components/add-property/service-picker";
import type { FormData } from "@/components/add-property/types";
import {
  AiTextarea,
  FormSection,
  PlainField,
  StepNavigation,
} from "@/components/grid/Ui";

export function Step3({
  formData,
  isAiProcessing,
  onUpdate,
  onBack,
  onAiOptimize,
  onSubmit,
}: {
  formData: FormData;
  isAiProcessing: boolean;
  onUpdate: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onBack: () => void;
  onAiOptimize: () => void;
  onSubmit: () => void;
}) {
  return (
    <FormSection
      eyebrow="Нийтлэх"
      title="Илүү"
      accent="дэлгэрэнгүй болгоё"
      description="Давхар, барилгын мэдээлэл, тайлбар болон нийтлэх аргаа эндээс шийднэ."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PlainField
          label="Хэдэн давхарт вэ?"
          value={formData.floor}
          placeholder="8"
          onChange={(value) => onUpdate("floor", value)}
        />
        <PlainField
          label="Нийт хэдэн давхар вэ?"
          value={formData.totalFloors}
          placeholder="16"
          onChange={(value) => onUpdate("totalFloors", value)}
        />
      </div>

      <div className="rounded-[2rem] border border-[#ebe3ff] bg-[#f8f6ff] p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
          Тайлбарт оруулах санал
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {FEATURE_GUIDE.map((item) => (
            <div
              key={item}
              className="rounded-[1.25rem] bg-white px-4 py-3 text-sm font-semibold text-[#6d4d84]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <AiTextarea
        value={formData.description}
        onChange={(value) => onUpdate("description", value)}
        onOptimize={onAiOptimize}
        isProcessing={isAiProcessing}
        placeholder="Байрны давуу тал, нар үзэлт, засвар, зогсоол, сургууль болон үйлчилгээний төвийн ойр байдал зэргийг дэлгэрэнгүй бичнэ үү..."
      />

      <ServicePicker
        serviceType={formData.serviceType}
        selectedAgentId={formData.selectedAgentId}
        onServiceChange={(value) => {
          onUpdate("serviceType", value);
          if (value === "self") {
            onUpdate("selectedAgentId", null);
          }
        }}
        onAgentSelect={(value) => onUpdate("selectedAgentId", value)}
      />

      <StepNavigation
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Зар нэмэх"
        submit
      />
    </FormSection>
  );
}
