import { NextResponse } from "next/server";

import { addManagedProduct, getManagedProducts } from "@/lib/catalog-store";
import { buildManagedProductFromInput } from "@/lib/product-admin";

export const runtime = "nodejs";

export async function GET() {
  const products = await getManagedProducts({ includeHidden: true });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const product = await buildManagedProductFromInput({
    input: {
      name: String(formData.get("name") ?? ""),
      price: String(formData.get("price") ?? ""),
      description: String(formData.get("description") ?? ""),
      tags,
      imageFile: formData.get("image") instanceof File ? (formData.get("image") as File) : null,
    },
  });

  await addManagedProduct(product);
  return NextResponse.json({ product });
}
