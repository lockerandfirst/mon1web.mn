"use client";

import { DollarSign, Ruler } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { FormData } from "@/components/add-property/types";
import { PropertyTypeGrid } from "@/components/add-property/selection-grids";
import {
  ChoiceRow,
  FieldCard,
  FormSection,
  MetricCard,
  StepNavigation,
} from "@/components/grid/Ui";

export function Step1({
  formData,
  pricePerSqm,
  onUpdate,
  onNext,
}: {
  formData: FormData;
  pricePerSqm: string | null;
  onUpdate: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  onNext: () => void;
}) {
  return (
    <FormSection
      eyebrow="Үндсэн Мэдээлэл"
      title="Зарын"
      accent="сууриа"
      description="Эхний алхам дээр төрлөө сонгоод үндсэн тоон мэдээллээ бөглө."
    >
      <PropertyTypeGrid
        value={formData.propertyType}
        onChange={(value) => onUpdate("propertyType", value)}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ChoiceRow
          label="Өрөөний тоо"
          activeValue={formData.rooms}
          color="blue"
          options={["1", "2", "3", "4", "5+"]}
          onChange={(value) => onUpdate("rooms", value)}
        />
        <ChoiceRow
          label="Ариун цэврийн өрөө"
          activeValue={formData.bathrooms}
          color="pink"
          options={["1", "2", "3"]}
          onChange={(value) => onUpdate("bathrooms", value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FieldCard label="Үнэ (₮)" icon={DollarSign} iconColor="text-[#ff3bad]">
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => onUpdate("price", e.target.value)}
            placeholder="үнэ"
            className="h-[4.5rem] rounded-[1.8rem] border-none bg-[#f8f6ff] pl-14 text-2xl font-black text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5"
          />
        </FieldCard>

        <FieldCard label="Талбай (м²)" icon={Ruler} iconColor="text-[#2a00ff]">
          <Input
            type="number"
            value={formData.sqm}
            onChange={(e) => onUpdate("sqm", e.target.value)}
            placeholder="метр квадрат"
            className="h-[4.5rem] rounded-[1.8rem] border-none bg-[#f8f6ff] pl-14 text-2xl font-black text-[#1a0b3b] focus:ring-8 focus:ring-[#ff2bad]/5"
          />
        </FieldCard>
      </div>

      {pricePerSqm && (
        <MetricCard label="Нэг м² үнэ" value={pricePerSqm} suffix="₮ / м²" />
      )}

      <StepNavigation onNext={onNext} nextLabel="Байршил руу" />
    </FormSection>
  );
}
