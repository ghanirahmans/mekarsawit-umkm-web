import { PrismaClient, Role, StockStatus } from "@prisma/client";

const prisma = new PrismaClient();

const DEV_VILLAGE_CODE = process.env.DEV_VILLAGE_CODE ?? "MSAWITDEV";

const ids = {
  superAdmin: "00000000-0000-0000-0000-000000000001",
  umkm1: "00000000-0000-0000-0000-000000000101",
  umkm2: "00000000-0000-0000-0000-000000000102",
  business1: "11111111-1111-1111-1111-111111111111",
  business2: "22222222-2222-2222-2222-222222222222",
  product1: "33333333-3333-3333-3333-333333333331",
  product2: "33333333-3333-3333-3333-333333333332",
  product3: "33333333-3333-3333-3333-333333333333",
  product4: "33333333-3333-3333-3333-333333333334",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const validFrom = new Date();
  const validTo = new Date();
  validTo.setFullYear(validFrom.getFullYear() + 1);

  await prisma.villageCode.upsert({
    where: { code: DEV_VILLAGE_CODE },
    update: { isActive: true, validFrom, validTo },
    create: {
      id: crypto.randomUUID(),
      code: DEV_VILLAGE_CODE,
      validFrom,
      validTo,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { id: ids.superAdmin },
    update: {},
    create: {
      id: ids.superAdmin,
      phone: "+6281111111111",
      role: Role.super_admin,
      villageCode: DEV_VILLAGE_CODE,
    },
  });

  await prisma.user.upsert({
    where: { id: ids.umkm1 },
    update: {},
    create: {
      id: ids.umkm1,
      phone: "+6281234500001",
      role: Role.umkm,
      villageCode: DEV_VILLAGE_CODE,
    },
  });

  await prisma.user.upsert({
    where: { id: ids.umkm2 },
    update: {},
    create: {
      id: ids.umkm2,
      phone: "+6281234500002",
      role: Role.umkm,
      villageCode: DEV_VILLAGE_CODE,
    },
  });

  await prisma.business.upsert({
    where: { id: ids.business1 },
    update: {
      name: "Gula Semut Pak Budi",
      slug: slugify("Gula Semut Pak Budi"),
      category: "Makanan",
      address: "RT 02 / RW 01, Mekar Sawit",
      whatsapp: "6281234500001",
      description: "Gula semut aren asli, tanpa campuran.",
      verified: true,
      active: true,
      coverImageUrl: "https://picsum.photos/seed/gula/800",
    },
    create: {
      id: ids.business1,
      ownerId: ids.umkm1,
      name: "Gula Semut Pak Budi",
      slug: slugify("Gula Semut Pak Budi"),
      category: "Makanan",
      address: "RT 02 / RW 01, Mekar Sawit",
      whatsapp: "6281234500001",
      description: "Gula semut aren asli, tanpa campuran.",
      verified: true,
      active: true,
      coverImageUrl: "https://picsum.photos/seed/gula/800",
    },
  });

  await prisma.business.upsert({
    where: { id: ids.business2 },
    update: {
      name: "Kopi Bukit Sawit",
      slug: slugify("Kopi Bukit Sawit"),
      category: "Pertanian",
      address: "RT 03 / RW 02, Mekar Sawit",
      whatsapp: "6281234500002",
      description: "Kopi robusta panen mingguan, sangrai medium.",
      verified: true,
      active: true,
      coverImageUrl: "https://picsum.photos/seed/kopi/800",
    },
    create: {
      id: ids.business2,
      ownerId: ids.umkm2,
      name: "Kopi Bukit Sawit",
      slug: slugify("Kopi Bukit Sawit"),
      category: "Pertanian",
      address: "RT 03 / RW 02, Mekar Sawit",
      whatsapp: "6281234500002",
      description: "Kopi robusta panen mingguan, sangrai medium.",
      verified: true,
      active: true,
      coverImageUrl: "https://picsum.photos/seed/kopi/800",
    },
  });

  await prisma.product.upsert({
    where: { id: ids.product1 },
    update: {},
    create: {
      id: ids.product1,
      businessId: ids.business1,
      name: "Gula Semut 250g",
      slug: slugify("Gula Semut 250g"),
      price: 18000,
      unit: "pack",
      stockStatus: StockStatus.ready,
      imageUrl: "https://picsum.photos/seed/gula250/800",
      description: "Tanpa pengawet, kemasan zip.",
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { id: ids.product2 },
    update: {},
    create: {
      id: ids.product2,
      businessId: ids.business1,
      name: "Gula Semut 1kg",
      slug: slugify("Gula Semut 1kg"),
      price: 65000,
      unit: "kg",
      stockStatus: StockStatus.preorder,
      imageUrl: "https://picsum.photos/seed/gula1kg/800",
      description: "Pre-order 2 hari.",
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { id: ids.product3 },
    update: {},
    create: {
      id: ids.product3,
      businessId: ids.business2,
      name: "Kopi Bubuk 250g",
      slug: slugify("Kopi Bubuk 250g"),
      price: 35000,
      unit: "pack",
      stockStatus: StockStatus.ready,
      imageUrl: "https://picsum.photos/seed/kopibubuk/800",
      description: "Sangrai medium, giling halus.",
      active: true,
    },
  });

  await prisma.product.upsert({
    where: { id: ids.product4 },
    update: {},
    create: {
      id: ids.product4,
      businessId: ids.business2,
      name: "Kopi Biji 1kg",
      slug: slugify("Kopi Biji 1kg"),
      price: 120000,
      unit: "kg",
      stockStatus: StockStatus.preorder,
      imageUrl: "https://picsum.photos/seed/kopibiji/800",
      description: "Pre-order panen Jumat.",
      active: true,
    },
  });

  console.log("Seed complete. Dev code:", DEV_VILLAGE_CODE);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
