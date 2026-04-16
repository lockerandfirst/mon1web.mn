/** Зар үүсгэх payload-д төлбөрийн талбарыг нэгтгэх */

export type ListingPaymentMethod =
  | "cash"
  | "mortgage"
  | "installment"
  | "any";

type SpecificPaymentMethod = Exclude<ListingPaymentMethod, "any">;

export type ListingPaymentInput = {
  paymentFlexible?: boolean;
  paymentMethods?: ListingPaymentMethod[];
  paymentMethod?: ListingPaymentMethod;
};

function toPaymentMethod(
  value: ListingPaymentMethod | undefined,
): ListingPaymentMethod {
  if (value === "any") return "any";
  return value === "mortgage" || value === "installment" ? value : "cash";
}

function normalizePaymentMethods(
  methods: ListingPaymentMethod[] | undefined,
): SpecificPaymentMethod[] {
  if (!methods?.length) return [];
  const order: SpecificPaymentMethod[] = ["cash", "mortgage", "installment"];
  return order.filter((m) => methods.includes(m));
}

export function resolvePayloadPaymentMethod(
  input: ListingPaymentInput,
): ListingPaymentMethod {
  if (input.paymentFlexible) {
    return "any";
  }
  const methods = normalizePaymentMethods(input.paymentMethods);
  if (methods.length === 0) {
    return toPaymentMethod(input.paymentMethod);
  }
  return toPaymentMethod(methods[0]);
}

export function appendPaymentMethodsToDescription(
  description: string,
  input: ListingPaymentInput,
): string {
  if (input.paymentFlexible) {
    return description.trim();
  }
  const methods = normalizePaymentMethods(input.paymentMethods);
  if (methods.length <= 1) {
    return description.trim();
  }
  const labels: Record<SpecificPaymentMethod, string> = {
    cash: "Бэлэн",
    mortgage: "Зээл",
    installment: "Лизинг",
  };
  const line = methods.map((m) => labels[m]).join(", ");
  return `${description.trim()}\n\nТөлбөрийн боломжууд: ${line}.`;
}
