import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { Product } from "@/types/domain";
import { products as seedProducts } from "@/lib/site-data";

export interface ManagedProduct extends Product {
  imagePath?: string;
  hidden?: boolean;
  origin?: "seed" | "admin";
}

interface CatalogStoreData {
  addedProducts: ManagedProduct[];
  overriddenProducts: ManagedProduct[];
  deletedProductSlugs: string[];
}

const dataDirectory = path.join(process.cwd(), ".data");
const storePath = path.join(dataDirectory, "catalog-products.json");

export async function getManagedProducts({
  includeHidden = false,
}: {
  includeHidden?: boolean;
} = {}) {
  const store = await readCatalogStore();
  const deleted = new Set(store.deletedProductSlugs);
  const overrideMap = new Map(store.overriddenProducts.map((product) => [product.slug, withOrigin(product)]));

  const mergedSeedProducts = seedProducts
    .filter((product) => !deleted.has(product.slug))
    .map((product) => overrideMap.get(product.slug) ?? withOrigin(product));

  const addedProducts = store.addedProducts.map((product) => withOrigin(product));
  const merged = [...mergedSeedProducts, ...addedProducts]
    .filter((product) => (includeHidden ? true : !product.hidden))
    .sort((a, b) => a.name.localeCompare(b.name));

  return merged;
}

export async function getManagedProduct(slug: string, options?: { includeHidden?: boolean }) {
  const products = await getManagedProducts({ includeHidden: options?.includeHidden });
  return products.find((product) => product.slug === slug);
}

export async function getManagedProductsByFamily(slug: string, options?: { includeHidden?: boolean }) {
  const products = await getManagedProducts({ includeHidden: options?.includeHidden });
  return products.filter((product) => product.familySlug === slug);
}

export async function addManagedProduct(product: ManagedProduct) {
  const store = await readCatalogStore();

  if (
    seedProducts.some((entry) => entry.slug === product.slug) ||
    store.addedProducts.some((entry) => entry.slug === product.slug)
  ) {
    throw new Error("A product with this slug already exists.");
  }

  store.addedProducts.push(withOrigin(product));
  await writeCatalogStore(store);
}

export async function updateManagedProduct(product: ManagedProduct) {
  const store = await readCatalogStore();
  const addedIndex = store.addedProducts.findIndex((entry) => entry.slug === product.slug);

  if (addedIndex >= 0) {
    store.addedProducts[addedIndex] = withOrigin(product);
    await writeCatalogStore(store);
    return;
  }

  const seedProduct = seedProducts.find((entry) => entry.slug === product.slug);

  if (!seedProduct) {
    throw new Error("Product not found.");
  }

  const overrideIndex = store.overriddenProducts.findIndex((entry) => entry.slug === product.slug);

  if (overrideIndex >= 0) {
    store.overriddenProducts[overrideIndex] = withOrigin(product);
  } else {
    store.overriddenProducts.push(withOrigin(product));
  }

  await writeCatalogStore(store);
}

export async function setManagedProductHidden(slug: string, hidden: boolean) {
  const product = await getManagedProduct(slug, { includeHidden: true });

  if (!product) {
    throw new Error("Product not found.");
  }

  await updateManagedProduct({ ...product, hidden });
}

export async function deleteManagedProduct(slug: string) {
  const store = await readCatalogStore();
  const addedIndex = store.addedProducts.findIndex((entry) => entry.slug === slug);

  if (addedIndex >= 0) {
    store.addedProducts.splice(addedIndex, 1);
    await writeCatalogStore(store);
    return;
  }

  if (!seedProducts.some((entry) => entry.slug === slug)) {
    throw new Error("Product not found.");
  }

  if (!store.deletedProductSlugs.includes(slug)) {
    store.deletedProductSlugs.push(slug);
  }

  store.overriddenProducts = store.overriddenProducts.filter((entry) => entry.slug !== slug);
  await writeCatalogStore(store);
}

async function readCatalogStore() {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as CatalogStoreData;

    return {
      addedProducts: Array.isArray(parsed.addedProducts) ? parsed.addedProducts : [],
      overriddenProducts: Array.isArray(parsed.overriddenProducts) ? parsed.overriddenProducts : [],
      deletedProductSlugs: Array.isArray(parsed.deletedProductSlugs) ? parsed.deletedProductSlugs : [],
    };
  } catch (error) {
    if (isMissingFileError(error)) {
      return {
        addedProducts: [],
        overriddenProducts: [],
        deletedProductSlugs: [],
      };
    }

    throw error;
  }
}

async function writeCatalogStore(store: CatalogStoreData) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

function withOrigin(product: ManagedProduct): ManagedProduct {
  return {
    ...product,
    origin: product.origin ?? (seedProducts.some((entry) => entry.slug === product.slug) ? "seed" : "admin"),
    hidden: product.hidden ?? false,
  };
}
