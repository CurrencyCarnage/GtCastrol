import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface AffiliateRegistrationRecord {
  id: string;
  role: "affiliate";
  username: string;
  email: string;
  serviceName: string;
  address: string;
  phone: string;
  status: "pending" | "approved";
  createdAt: string;
  approvedAt: string | null;
}

const dataDirectory = path.join(process.cwd(), ".data");
const storePath = path.join(dataDirectory, "affiliate-registrations.json");

export async function listAffiliateRegistrations() {
  return readAffiliateRegistrations();
}

export async function createAffiliateRegistration(
  values: Omit<AffiliateRegistrationRecord, "id" | "status" | "createdAt" | "approvedAt"> & { id: string },
) {
  const records = await readAffiliateRegistrations();
  records.push({
    ...values,
    status: "pending",
    createdAt: new Date().toISOString(),
    approvedAt: null,
  });
  await writeAffiliateRegistrations(records);
}

export async function approveAffiliateRegistration(id: string) {
  const records = await readAffiliateRegistrations();
  const target = records.find((record) => record.id === id);

  if (!target) {
    throw new Error("Affiliate registration not found.");
  }

  target.status = "approved";
  target.approvedAt = new Date().toISOString();
  await writeAffiliateRegistrations(records);
  return target;
}

async function readAffiliateRegistrations() {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as AffiliateRegistrationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }

    throw error;
  }
}

async function writeAffiliateRegistrations(records: AffiliateRegistrationRecord[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(storePath, JSON.stringify(records, null, 2), "utf8");
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
