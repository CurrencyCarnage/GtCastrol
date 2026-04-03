import { NextResponse } from "next/server";

import {
  deleteManagedProduct,
  getManagedProduct,
  setManagedProductHidden,
  updateManagedProduct,
} from "@/lib/catalog-store";
import { buildManagedProductFromInput } from "@/lib/product-admin";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = await getManagedProduct(slug, { includeHidden: true });

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const existingProduct = await getManagedProduct(slug, { includeHidden: true });

  if (!existingProduct) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const product = await buildManagedProductFromInput({
    existingProduct,
    input: {
      name: String(formData.get("name") ?? existingProduct.name),
      price: String(formData.get("price") ?? existingProduct.packSizes[0]?.priceLabel ?? ""),
      description: String(formData.get("description") ?? existingProduct.description),
      tags,
      imageFile: formData.get("image") instanceof File ? (formData.get("image") as File) : null,
    },
  });

  await updateManagedProduct(product);
  return NextResponse.json({ product });
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const payload = (await request.json().catch(() => null)) as { hidden?: boolean } | null;

  if (typeof payload?.hidden !== "boolean") {
    return NextResponse.json({ message: "Invalid visibility payload." }, { status: 400 });
  }

  await setManagedProductHidden(slug, payload.hidden);
  const product = await getManagedProduct(slug, { includeHidden: true });
  return NextResponse.json({ product });
}

export async function DELETE(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  await deleteManagedProduct(slug);
  return NextResponse.json({ success: true });
}
