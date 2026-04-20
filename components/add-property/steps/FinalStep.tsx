import { FormSection } from "../form-shell";
import { PlainField } from "../inputs";
import { AmenitiesGrid } from "../selection-grids";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FEATURE_GUIDE, PAYMENT_METHOD_OPTIONS } from "../constants";
import type { PaymentMethodOption } from "../types";
import { ImageUpload } from "../image/ImageUpload";

export function FinalStep({ formData, updateField }: any) {
  return (
    <div className="w-full">
      <FormSection
        eyebrow="Нийтлэх"
        title="Илүү"
        accent="дэлгэрэнгүй болгоё"
        description="Давхар, барилгын мэдээлэл, тайлбар, нийтлэх аргаа эндээс шийднэ."
      >
        {/* Floor Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <PlainField
            label="Хэдэн давхарт вэ?"
            value={formData.floor}
            placeholder="8"
            onChange={(v: string) => updateField("floor", v)}
          />
          <PlainField
            label="Нийт хэдэн давхар вэ?"
            value={formData.totalFloors}
            placeholder="16"
            onChange={(v: string) => updateField("totalFloors", v)}
          />
        </div>

        {/* Year & Payment */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <PlainField
            label="Ашиглалтад орсон он"
            value={formData.commissionYear}
            placeholder="2021"
            onChange={(v: string) => updateField("commissionYear", v)}
          />
          <PlainField
            label="Утасны дугаар"
            value={formData.contactPhone}
            placeholder="99112233"
            onChange={(v: string) => updateField("contactPhone", v)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="space-y-2.5 md:space-y-3">
            <p className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Төлбөрийн нөхцөл
            </p>
            <div className="flex flex-col gap-2.5 md:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const next = !formData.paymentFlexible;
                  updateField("paymentFlexible", next);
                  if (next) {
                    updateField("paymentMethods", []);
                  } else if (formData.paymentMethods.length === 0) {
                    updateField("paymentMethods", ["cash"]);
                  }
                }}
                className={cn(
                  "h-auto min-h-11 justify-start rounded-2xl border-2 px-4 py-2.5 text-left font-black transition-all md:min-h-14 md:rounded-4xl md:px-5 md:py-3",
                  formData.paymentFlexible
                    ? "border-[#2a00ff] bg-[#eef0ff] text-[#1a0b3b]"
                    : "border-slate-100 bg-[#f8f6ff] text-slate-600 hover:border-[#2a00ff]/30",
                )}
              >
                Дурын / тохиролцоно
                <span className="mt-0.5 block text-[11px] font-semibold text-[#6d4d84] md:mt-1 md:text-xs">
                  Нөхцөлгүй тохиролцоно
                </span>
              </Button>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {PAYMENT_METHOD_OPTIONS.map((opt) => {
                  const active = formData.paymentMethods.includes(
                    opt.value as PaymentMethodOption,
                  );
                  return (
                    <Button
                      key={opt.value}
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (formData.paymentFlexible) {
                          updateField("paymentFlexible", false);
                          updateField("paymentMethods", [
                            opt.value as PaymentMethodOption,
                          ]);
                          return;
                        }
                        const cur = formData.paymentMethods;
                        if (cur.includes(opt.value as PaymentMethodOption)) {
                          if (cur.length <= 1) return;
                          updateField(
                            "paymentMethods",
                            cur.filter(
                              (m: PaymentMethodOption) => m !== opt.value,
                            ),
                          );
                        } else {
                          updateField("paymentMethods", [
                            ...cur,
                            opt.value as PaymentMethodOption,
                          ]);
                        }
                      }}
                      className={cn(
                        "h-11 rounded-2xl border-2 text-xs font-black transition-all md:h-14 md:rounded-4xl md:text-sm",
                        active
                          ? "border-[#2a00ff] bg-white text-[#2a00ff] shadow-md shadow-[#2a00ff]/15"
                          : "border-slate-100 bg-white text-slate-400 hover:border-[#ff3bad]/40",
                      )}
                    >
                      {opt.label}
                    </Button>
                  );
                })}
              </div>
              <p className="text-[10px] font-semibold text-slate-400 md:text-[11px]">
                Олон сонголт хийх бол Бэлэн / Зээл / Лизинг-ийг даралтаар нэмнэ.
                Дурын идэвхтэй үед товч дарахад дурын горимоос гарч тухайн
                нөхцөл сонгогдоно.
              </p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <AmenitiesGrid
          value={formData.features}
          onToggle={(feature: string) => {
            const cur = formData.features;
            updateField(
              "features",
              cur.includes(feature)
                ? cur.filter((i: string) => i !== feature)
                : [...cur, feature],
            );
          }}
        />
        <div className="hidden rounded-3xl border border-[#ebe3ff] bg-[#f8f6ff] p-4 md:block md:rounded-4xl md:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]">
            Тайлбарт оруулах санал
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2.5 md:mt-4 md:gap-3 md:grid-cols-2">
            {FEATURE_GUIDE.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-[#6d4d84] md:rounded-[1.25rem] md:px-4 md:py-3 md:text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* AI Description Area */}
        <div className="relative">
          <Textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Давуу талуудаа бичнэ үү..."
            className="min-h-40 rounded-3xl border-none bg-[#fff9fd] p-4 pr-4 text-sm font-bold text-[#1a0b3b] resize-none focus:ring-8 focus:ring-[#2a00ff]/5 md:min-h-56 md:rounded-4xl md:p-6 md:pr-10 md:text-base"
          />
        </div>

        {/* Image Links */}
        {/* Instead of the Textarea */}
        <ImageUpload
          onImagesChange={(files) => {
            // You can store the actual File objects in your state
            // To upload them later to your server or Supabase/Firebase
            updateField("images", files);
          }}
        />

        <div className="rounded-2xl border border-[#ebe3ff] bg-[#f8f6ff] p-4 md:rounded-3xl md:p-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#2a00ff]/70">
            Нийтлэх төрөл
          </p>

          <div
            className={cn(
              "rounded-xl border-2 p-3 transition-all duration-300 shadow-sm md:rounded-2xl md:p-4",
              formData.serviceType === "agent"
                ? "border-[#2a00ff] bg-white" // High contrast when ON
                : "border-slate-200 bg-slate-50", // Clearly visible when OFF
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-[#1a0b3b] md:text-[13px]">
                  Агентаар заруулах
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-slate-500 md:text-[11px]">
                  {formData.serviceType === "agent"
                    ? "Мэргэжлийн агент таны байрыг борлуулна"
                    : "Та өөрөө хариуцаж байраа борлуулна"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-lg px-2 py-1 text-[9px] font-black transition-colors md:px-2.5 md:py-1.5 md:text-[10px]",
                    formData.serviceType === "agent"
                      ? "bg-[#2a00ff] text-white"
                      : "bg-slate-200 text-slate-500",
                  )}
                >
                  {formData.serviceType === "agent" ? "ACTIVE" : "OFF"}
                </span>

                <Switch
                  checked={formData.serviceType === "agent"}
                  onCheckedChange={(checked) =>
                    updateField("serviceType", checked ? "agent" : "self")
                  }
                  className={cn(
                    "scale-110 transition-colors md:scale-125",
                    "data-[state=checked]:bg-[#2a00ff] data-[state=unchecked]:bg-slate-300", // Track color
                    "[&_span]:bg-[#2a00ff] data-[state=checked]:[&_span]:bg-white", // Thumb is blue when OFF, white when ON
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
}
