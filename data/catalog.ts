export type Business = {
  id: string;
  name: string;
  slug: string;
  category: string;
  address?: string;
  whatsapp: string;
  description?: string;
  verified: boolean;
  active: boolean;
  coverImageUrl?: string;
};

export type Product = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  stockStatus: "ready" | "preorder";
  imageUrl?: string;
  description?: string;
  active: boolean;
};

export const businesses: Business[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Gula Semut Pak Budi",
    slug: "gula-semut-pak-budi",
    category: "Makanan",
    address: "RT 02 / RW 01, Mekar Sawit",
    whatsapp: "6281234500001",
    description: "Gula semut aren asli, tanpa campuran.",
    verified: true,
    active: true,
    coverImageUrl: "https://picsum.photos/seed/gula/800",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Kopi Bukit Sawit",
    slug: "kopi-bukit-sawit",
    category: "Pertanian",
    address: "RT 03 / RW 02, Mekar Sawit",
    whatsapp: "6281234500002",
    description: "Kopi robusta panen mingguan, sangrai medium.",
    verified: true,
    active: true,
    coverImageUrl: "https://picsum.photos/seed/kopi/800",
  },
];

export const products: Product[] = [
  {
    id: "33333333-3333-3333-3333-333333333331",
    businessId: businesses[0].id,
    name: "Gula Semut 250g",
    slug: "gula-semut-250g",
    price: 18000,
    unit: "pack",
    stockStatus: "ready",
    imageUrl: "https://picsum.photos/seed/gula250/800",
    description: "Tanpa pengawet, kemasan zip.",
    active: true,
  },
  {
    id: "33333333-3333-3333-3333-333333333332",
    businessId: businesses[0].id,
    name: "Gula Semut 1kg",
    slug: "gula-semut-1kg",
    price: 65000,
    unit: "kg",
    stockStatus: "preorder",
    imageUrl: "https://picsum.photos/seed/gula1kg/800",
    description: "Pre-order 2 hari.",
    active: true,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    businessId: businesses[1].id,
    name: "Kopi Bubuk 250g",
    slug: "kopi-bubuk-250g",
    price: 35000,
    unit: "pack",
    stockStatus: "ready",
    imageUrl: "https://picsum.photos/seed/kopibubuk/800",
    description: "Sangrai medium, giling halus.",
    active: true,
  },
  {
    id: "33333333-3333-3333-3333-333333333334",
    businessId: businesses[1].id,
    name: "Kopi Biji 1kg",
    slug: "kopi-biji-1kg",
    price: 120000,
    unit: "kg",
    stockStatus: "preorder",
    imageUrl: "https://picsum.photos/seed/kopibiji/800",
    description: "Pre-order panen Jumat.",
    active: true,
  },
];
