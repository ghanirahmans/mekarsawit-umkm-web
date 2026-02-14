export type WaMessageInput = {
  phone: string; // in international format without +
  productName?: string;
  businessName?: string;
  quantity?: number;
  notes?: string;
};

export function normalizePhoneNumber(phone: string): string {
  // 1. Remove non-numeric characters
  let clean = phone.replace(/\D/g, "");

  // 2. Handle generic 08 prefix (Indonesian common format)
  if (clean.startsWith("08")) {
    clean = "62" + clean.substring(1);
  }
  // 3. Handle 8 prefix (sometimes people type 812...)
  else if (clean.startsWith("8")) {
    clean = "62" + clean;
  }
  // 4. If it already starts with 62, keep it.

  // 5. Add + prefix if not present (User requested +62 format)
  return "+" + clean;
}

export function buildWaLink({
  phone,
  productName,
  businessName,
  quantity = 1,
  notes,
}: WaMessageInput) {
  const messageParts = [
    "Halo admin UMKM Mekar Sawit!",
    productName ? `Saya mau pesan ${productName}` : undefined,
    businessName ? `dari ${businessName}` : undefined,
    quantity ? `qty ${quantity}` : undefined,
    notes,
  ].filter(Boolean);

  const text = encodeURIComponent(messageParts.join(" \n"));
  // wa.me links should normally be numeric-only, so we strip the + from normalization result
  const normalized = normalizePhoneNumber(phone);
  const sanitizedPhone = normalized.replace("+", "");
  return `https://wa.me/${sanitizedPhone}?text=${text}`;
}
