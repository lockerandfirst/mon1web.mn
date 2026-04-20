import { PropertyTypeGrid, ChoiceRow } from "../selection-grids";
import { FieldCard, MetricCard, PlainField } from "../inputs";
import { DollarSign, Ruler } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormSection } from "../form-shell";

export function BasicInfoStep({
  formData,
  updateField,
  pricePerSqm,
}: any) {
  return (
    <div className="w-full">
      <FormSection
        eyebrow="Үндсэн Мэдээлэл"
        title="Зарын"
        accent="төрөл"
        description="Эхний алхам дээр төрлөө сонгоод үндсэн тоон мэдээллээ бөглөнө."
      >
        <PropertyTypeGrid
          value={formData.propertyType}
          onChange={(v) => updateField("propertyType", v)}
        />
        <PlainField
          label="Зарын гарчиг"
          value={formData.title}
          placeholder="Modern 3-Bedroom Apartment in Zaisan"
          onChange={(v) => updateField("title", v)}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <ChoiceRow
            label="Өрөө"
            activeValue={formData.rooms}
            color="blue"
            options={["1", "2", "3", "4", "5+"]}
            onChange={(v) => updateField("rooms", v)}
          />
          <ChoiceRow
            label="Ариун цэвэр"
            activeValue={formData.bathrooms}
            color="pink"
            options={["1", "2", "3"]}
            onChange={(v) => updateField("bathrooms", v)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <FieldCard label="Үнэ (₮)" icon={DollarSign} iconColor="text-[#ff3bad]">
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="280000000"
              className="h-12 rounded-xl border-none bg-[#f8f6ff] pl-10 text-lg font-black text-[#1a0b3b] focus:ring-8 focus:ring-[#2a00ff]/5 md:h-14 md:rounded-[1.4rem] md:pl-12 md:text-xl"
            />
          </FieldCard>
          <FieldCard label="Талбай (м²)" icon={Ruler} iconColor="text-[#2a00ff]">
            <Input
              type="number"
              value={formData.sqm}
              onChange={(e) => updateField("sqm", e.target.value)}
              placeholder="80"
              className="h-12 rounded-xl border-none bg-[#f8f6ff] pl-10 text-lg font-black text-[#1a0b3b] focus:ring-8 focus:ring-[#ff2bad]/5 md:h-14 md:rounded-[1.4rem] md:pl-12 md:text-xl"
            />
          </FieldCard>
        </div>

        {pricePerSqm && (
          <MetricCard
            label="Нэг м² үнэ"
            value={pricePerSqm}
            suffix="₮ / м²"
          />
        )}
      </FormSection>
    </div>
  );
}
