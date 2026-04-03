import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";

import type { Product, ProductSegment } from "@/types/domain";
import { productFamilies } from "@/lib/site-data";
import type { ManagedProduct } from "@/lib/catalog-store";

export interface ProductAdminInput {
  name: string;
  price: string;
  description: string;
  tags: string[];
  imageFile?: File | null;
}

const familyNameMap = [
  { key: "magnatec hybrid", familySlug: "magnatec-hybrid", categorySlug: "ev-and-hybrid-fluids", segment: "ev" as ProductSegment },
  { key: "castrol on", familySlug: "castrol-on", categorySlug: "ev-and-hybrid-fluids", segment: "ev" as ProductSegment },
  { key: "magnatec", familySlug: "magnatec", categorySlug: "engine-oils", segment: "passenger" as ProductSegment },
  { key: "transmax", familySlug: "transmax", categorySlug: "commercial-and-driveline", segment: "driveline" as ProductSegment },
  { key: "vecton", familySlug: "vecton", categorySlug: "commercial-and-driveline", segment: "commercial" as ProductSegment },
  { key: "edge", familySlug: "edge", categorySlug: "engine-oils", segment: "passenger" as ProductSegment },
  { key: "gtx", familySlug: "gtx", categorySlug: "engine-oils", segment: "passenger" as ProductSegment },
  { key: "crb", familySlug: "crb", categorySlug: "commercial-and-driveline", segment: "commercial" as ProductSegment },
] as const;

export async function buildManagedProductFromInput({
  input,
  existingProduct,
}: {
  input: ProductAdminInput;
  existingProduct?: ManagedProduct;
}) {
  const normalizedName = input.name.trim();
  const slug = existingProduct?.slug ?? slugify(normalizedName);
  const tags = input.tags.filter(Boolean);
  const familyConfig = inferFamilyConfig(normalizedName, tags, existingProduct);
  const imagePath =
    input.imageFile && input.imageFile.size > 0
      ? await saveProductImage({ slug, file: input.imageFile })
      : existingProduct?.imagePath;

  const basePackSize = existingProduct?.packSizes?.[0];
  const nextProduct: ManagedProduct = {
    id: existingProduct?.id ?? `admin-${slug}`,
    slug,
    familySlug: familyConfig.familySlug,
    categorySlug: familyConfig.categorySlug,
    name: normalizedName,
    headline: `${normalizedName} available in the admin-managed catalogue.`,
    description: input.description.trim(),
    segment: familyConfig.segment,
    featured: existingProduct?.featured ?? false,
    applications:
      existingProduct?.applications?.length
        ? existingProduct.applications
        : [`${familyConfig.label} service support`, "Admin-managed catalogue entry"],
    tags,
    specs:
      tags.length > 0
        ? tags.map((tag, index) => ({
            label: `Tag ${index + 1}`,
            value: tag,
          }))
        : existingProduct?.specs ?? [],
    packSizes: [
      {
        id: basePackSize?.id ?? `${slug}-default-pack`,
        label: basePackSize?.label ?? "Standard pack",
        volumeLiters: basePackSize?.volumeLiters ?? 1,
        sku: basePackSize?.sku ?? `${familyConfig.familySlug.toUpperCase()}-${slug.toUpperCase()}`,
        priceLabel: input.price.trim(),
        inventoryStatus: basePackSize?.inventoryStatus ?? "in-stock",
      },
    ],
    imagePath,
    hidden: existingProduct?.hidden ?? false,
    origin: existingProduct?.origin ?? "admin",
  };

  return nextProduct;
}

function inferFamilyConfig(name: string, tags: string[], existingProduct?: Product) {
  if (existingProduct) {
    const family = productFamilies.find((entry) => entry.slug === existingProduct.familySlug);
    return {
      familySlug: existingProduct.familySlug,
      categorySlug: existingProduct.categorySlug,
      segment: existingProduct.segment,
      label: family?.name ?? existingProduct.familySlug,
    };
  }

  const haystack = `${name} ${tags.join(" ")}`.toLowerCase();
  const matched =
    familyNameMap.find((entry) => haystack.includes(entry.key)) ??
    familyNameMap.find((entry) => entry.familySlug === "gtx")!;

  return {
    ...matched,
    label: productFamilies.find((entry) => entry.slug === matched.familySlug)?.name ?? matched.familySlug,
  };
}

async function saveProductImage({
  slug,
  file,
}: {
  slug: string;
  file: File;
}) {
  const extension = getFileExtension(file.name);
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "catalog");
  await mkdir(uploadDirectory, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const targetFileName = `${slug}${extension}`;
  const targetPath = path.join(uploadDirectory, targetFileName);
  await writeFile(targetPath, buffer);
  return `/uploads/catalog/${targetFileName}`;
}

function getFileExtension(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  return extension || ".jpg";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
