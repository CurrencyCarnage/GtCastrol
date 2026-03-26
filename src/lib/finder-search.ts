import { products, serviceCenters, vehicleMakes, vehicleModels, vehicleNeeds } from "@/lib/site-data";

export interface FinderSearchOption {
  id: string;
  label: string;
  kind: "make" | "model" | "service" | "product" | "center";
  href: string;
}

export function getFinderSearchOptions() {
  const options: FinderSearchOption[] = [];
  const seen = new Set<string>();

  const pushOption = (option: FinderSearchOption) => {
    const key = `${option.kind}:${option.label.toLowerCase().trim()}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    options.push(option);
  };

  vehicleMakes.forEach((make) => {
    pushOption({
      id: `make-${make.slug}`,
      label: make.name,
      kind: "make",
      href: `/finder?query=${encodeURIComponent(make.name)}`,
    });
  });

  vehicleModels.forEach((model) => {
    pushOption({
      id: `model-${model.slug}`,
      label: model.name,
      kind: "model",
      href: `/finder?query=${encodeURIComponent(model.name)}`,
    });
  });

  vehicleNeeds.forEach((need) => {
    pushOption({
      id: `need-${need.slug}`,
      label: need.name,
      kind: "service",
      href: `/finder?query=${encodeURIComponent(need.name)}`,
    });
  });

  products.forEach((product) => {
    pushOption({
      id: `product-${product.slug}`,
      label: product.name,
      kind: "product",
      href: `/finder?query=${encodeURIComponent(product.name)}`,
    });
  });

  serviceCenters.forEach((center) => {
    pushOption({
      id: `center-${center.slug}`,
      label: center.name,
      kind: "center",
      href: `/finder?query=${encodeURIComponent(center.name)}`,
    });
  });

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

export function filterFinderSearchOptions(options: FinderSearchOption[], query: string, limit = 8) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return options.slice(0, limit);
  }

  return options
    .filter((option) => option.label.toLowerCase().includes(normalizedQuery))
    .slice(0, limit);
}
