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
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "admin123";
const SEED_PASSWORD_USER = process.env.SEED_PASSWORD_USER ?? "user123";

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

  // Ensure at least one active village code exists
  if (process.env.NODE_ENV === "production") {
    // In production: auto-generate a code if none active
    const activeCount = await prisma.villageCode.count({
      where: { isActive: true },
    });
    if (activeCount === 0) {
      const autoCode = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();
      await prisma.villageCode.create({
        data: {
          code: autoCode,
          validFrom,
          validTo,
          isActive: true,
          createdBy: "System (Auto-Seed)",
        },
      });
      console.log("Production: Auto-generated village code:", autoCode);
    } else {
      console.log(
        "Production: Active codes already exist, skipping auto-generation.",
      );
    }
  } else {
    // In development: use the well-known dev code
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
  }

  const users = [
    {
      id: ids.superAdmin,
      email: "admin@mekarsawit",
      passwordHash: bcrypt.hashSync(SEED_PASSWORD, 10),
      phone: "+6281111111111",
      role: Role.super_admin,
      villageCode: DEV_VILLAGE_CODE,
      createdAt: validFrom,
    },
    {
      id: ids.umkm1,
      name: "Pak Budi Santoso",
      passwordHash: bcrypt.hashSync(SEED_PASSWORD_USER, 10),
      phone: "+6281234500001",
      role: Role.admin_umkm,
      villageCode: DEV_VILLAGE_CODE,
      createdAt: validFrom,
    },
    {
      id: ids.umkm2,
      name: "Ibu Siti Aminah",
      passwordHash: bcrypt.hashSync(SEED_PASSWORD_USER, 10),
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
      category: "Kuliner (Makanan/Minuman)",
      address: "Jalan Utama Desa Mekar Sawit, RT 02 / RW 01",
      whatsapp: "081234500001",
      description:
        "Produsen gula semut aren murni berkualitas tinggi. Diproses secara higienis dari nira aren pilihan petani lokal. Cocok untuk pemanis alami kopi, teh, dan kue.",
      verified: true,
      active: true,
      coverImageUrl:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop",
      createdAt: validFrom,
    },
    {
      id: ids.business2,
      ownerId: ids.umkm2,
      name: "Kopi Bukit Sawit",
      slug: slugify("Kopi Bukit Sawit"),
      category: "Pertanian & Perkebunan",
      address: "Dusun II, Desa Mekar Sawit, Kecamatan Sawit Seberang",
      whatsapp: "081234500002",
      description:
        "Kopi robusta dan liberika asli dari dataran tinggi Bukit Sawit. Dipetik merah dan diproses dengan metode honey process untuk cita rasa terbaik.",
      verified: true,
      active: true,
      coverImageUrl:
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
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
