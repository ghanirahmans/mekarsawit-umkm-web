import { PrismaClient, Role, StockStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/mekarsawit";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  const users = [
    {
      id: ids.superAdmin,
      email: "admin@mekarsawit.local",
      passwordHash: bcrypt.hashSync("admin123", 10),
      phone: "+6281111111111",
      role: Role.super_admin,
      villageCode: DEV_VILLAGE_CODE,
      createdAt: validFrom,
    },
    {
      id: ids.umkm1,
      phone: "+6281234500001",
      role: Role.admin_umkm,
      villageCode: DEV_VILLAGE_CODE,
      createdAt: validFrom,
    },
    {
      id: ids.umkm2,
      phone: "+6281234500002",
      role: Role.admin_umkm,
      villageCode: DEV_VILLAGE_CODE,
      createdAt: validFrom,
    },
  ];

  await prisma.user.createMany({ data: users, skipDuplicates: true });

  const businesses = [
    {
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
      createdAt: validFrom,
    },
    {
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
      createdAt: validFrom,
    },
  ];

  await prisma.business.createMany({ data: businesses, skipDuplicates: true });

  const products = [
    {
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
      createdAt: validFrom,
    },
    {
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
      createdAt: validFrom,
    },
    {
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
      createdAt: validFrom,
    },
    {
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
      createdAt: validFrom,
    },
  ];

  await prisma.product.createMany({ data: products, skipDuplicates: true });

  console.log("Seed complete. Dev code:", DEV_VILLAGE_CODE);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
