import { prisma } from "@/lib/prisma";
import { buildWaLink } from "../wa";

export type LandingProduct = {
  id: string;
  name: string;
  price: number;
  unit: string;
  stockStatus: string;
  imageUrl?: string | null;
  description?: string | null;
  businessName: string;
  businessCategory: string;
  whatsapp: string;
  waLink: string;
};

export async function getLandingCatalog(): Promise<LandingProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      verified: true,
      business: {
        active: true,
        verified: true,
      },
    },
    include: {
      business: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => {
    const business = product.business;
    const whatsapp = business.whatsapp;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      stockStatus: product.stockStatus,
      imageUrl: product.imageUrl,
      description: product.description,
      businessName: business.name,
      businessCategory: business.category,
      whatsapp,
      waLink: buildWaLink({
        phone: whatsapp,
        productName: product.name,
        businessName: business.name,
        quantity: 1,
      }),
    };
  });
}

export async function getHeroStats() {
  const [activeBusinesses, activeProducts, categories] = await Promise.all([
    prisma.business.count({ where: { active: true, verified: true } }),
    prisma.product.count({
      where: { active: true, business: { active: true, verified: true } },
    }),
    prisma.business
      .groupBy({
        by: ["category"],
        where: { active: true, verified: true },
      })
      .then((groups) => groups.length),
  ]);

  return { activeBusinesses, activeProducts, categories };
}
