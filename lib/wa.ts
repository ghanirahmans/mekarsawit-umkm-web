export type WaMessageInput = {
  phone: string; // in international format without +
  productName?: string;
  businessName?: string;
  quantity?: number;
  notes?: string;
};

export function buildWaLink({ phone, productName, businessName, quantity = 1, notes }: WaMessageInput) {
  const messageParts = [
    "Halo admin UMKM Mekar Sawit!",
    productName ? `Saya mau pesan ${productName}` : undefined,
    businessName ? `dari ${businessName}` : undefined,
    quantity ? `qty ${quantity}` : undefined,
    notes,
  ].filter(Boolean);

  const text = encodeURIComponent(messageParts.join(" \n"));
  const sanitizedPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${sanitizedPhone}?text=${text}`;
}
