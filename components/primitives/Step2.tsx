"use client";

import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { FormData } from "@/components/add-property/types";
import {
  DistrictGrid,
  SurroundingsGrid,
} from "@/components/add-property/selection-grids";
import { FieldCard, FormSection, StepNavigation } from "@/components/grid/Ui";

export function Step2({
  formData,
  onUpdate,
  onBack,
  onNext,
}: {
  formData: FormData;
  onUpdate: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <FormSection
      eyebrow="Байршил"
      title="Хаана"
      accent="байрлаж байна?"
      description="Дүүрэг, хаяг, ойр орчмын мэдээлэл нь зарыг илүү бодит, илүү итгэлтэй харагдуулна."
    >
      <DistrictGrid
        value={formData.district}
        onChange={(value) => onUpdate("district", value)}
      />

      <FieldCard
        label="Дэлгэрэнгүй хаяг"
        icon={MapPin}
        iconColor="text-[#ff3bad]"
      >
        <Input
          value={formData.location}
          onChange={(e) => onUpdate("location", e.target.value)}
          placeholder="Зайсан, River Garden, Academy..."
          className="h-[4.5rem] rounded-[1.8rem] border-none bg-[#f8f6ff] pl-14 text-lg font-bold text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5"
        />
      </FieldCard>

      <SurroundingsGrid
        value={formData.surroundings}
        onToggle={(id) => {
          const current = formData.surroundings;
          onUpdate(
            "surroundings",
            current.includes(id)
              ? current.filter((item) => item !== id)
              : [...current, id],
          );
        }}
      />

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextLabel="Нийтлэх хэсэг"
      />
    </FormSection>
  );
}
