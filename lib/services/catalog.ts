import { businesses, products } from "@/data/catalog";
import { buildWaLink } from "../wa";

type LandingProduct = {
  id: string;
  name: string;
  price: number;
  unit: string;
  stockStatus: string;
  imageUrl?: string;
  description?: string;
  businessName: string;
  businessCategory: string;
  whatsapp: string;
  waLink: string;
};

export function getLandingCatalog(): LandingProduct[] {
  return products
    .filter((p) => p.active)
    .map((product) => {
      const business = businesses.find((b) => b.id === product.businessId);
      const whatsapp = business?.whatsapp ?? "";
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        stockStatus: product.stockStatus,
        imageUrl: product.imageUrl,
        description: product.description,
        businessName: business?.name ?? "UMKM Mekar Sawit",
        businessCategory: business?.category ?? "",
        whatsapp,
        waLink: buildWaLink({
          phone: whatsapp,
          productName: product.name,
          businessName: business?.name,
          quantity: 1,
        }),
      };
    });
}

export function getHeroStats() {
  const activeBusinesses = businesses.filter((b) => b.active && b.verified).length;
  const activeProducts = products.filter((p) => p.active).length;
  const categories = new Set(businesses.map((b) => b.category)).size;
  return { activeBusinesses, activeProducts, categories };
}
