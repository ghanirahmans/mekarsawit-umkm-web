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
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessCategory: string;
  productSlug: string;
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
      businessId: business.id,
      businessName: business.name,
      businessSlug: business.slug,
      businessCategory: business.category,
      productSlug: product.slug,
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

export async function getProductDetail(
  businessSlug: string,
  productSlug: string,
) {
  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    include: {
      owner: { select: { name: true } },
      products: {
        where: { active: true, verified: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!business) return null;

  const product = business.products.find((p) => p.slug === productSlug);
  if (!product) return null;

  const otherProducts = business.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      unit: product.unit,
      stockStatus: product.stockStatus,
      imageUrl: product.imageUrl,
      description: product.description,
      createdAt: product.createdAt,
    },
    business: {
      id: business.id,
      name: business.name,
      slug: business.slug,
      category: business.category,
      address: business.address,
      whatsapp: business.whatsapp,
      description: business.description,
      coverImageUrl: business.coverImageUrl,
      ownerName: business.owner.name,
      viewCount: business.viewCount,
    },
    otherProducts: otherProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      unit: p.unit,
      stockStatus: p.stockStatus,
      imageUrl: p.imageUrl,
    })),
    waLink: buildWaLink({
      phone: business.whatsapp,
      productName: product.name,
      businessName: business.name,
      quantity: 1,
    }),
  };
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
