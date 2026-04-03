import { createHash, randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { type AdminLoginValues, type AdminRegistrationSubmission } from "@/lib/admin-auth-schema";

interface StoredAdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  confirmationToken: string;
  createdAt: string;
  activatedAt: string | null;
}

const storageDirectory = path.join(process.cwd(), ".data");
const storagePath = path.join(storageDirectory, "admin-users.json");

export async function createPendingAdminUser(values: AdminRegistrationSubmission) {
  const users = await readAdminUsers();
  const alreadyExists = users.find(
    (user) => user.email === values.email || user.username.toLowerCase() === values.username.toLowerCase(),
  );

  if (alreadyExists) {
    throw new Error("An admin account with that username or email already exists.");
  }

  const newUser: StoredAdminUser = {
    id: randomUUID(),
    username: values.username,
    email: values.email,
    passwordHash: hashPassword(values.password),
    isActive: false,
    confirmationToken: randomUUID(),
    createdAt: new Date().toISOString(),
    activatedAt: null,
  };

  users.push(newUser);
  await writeAdminUsers(users);

  return newUser;
}

export async function activateAdminUser(token: string) {
  const users = await readAdminUsers();
  const target = users.find((user) => user.confirmationToken === token);

  if (!target) {
    return null;
  }

  target.isActive = true;
  target.activatedAt = new Date().toISOString();
  target.confirmationToken = "";
  await writeAdminUsers(users);

  return target;
}

export async function authenticateAdminUser(values: AdminLoginValues) {
  const users = await readAdminUsers();
  const normalizedIdentifier = values.identifier.trim().toLowerCase();
  const passwordHash = hashPassword(values.password);

  const user = users.find(
    (entry) =>
      entry.email === normalizedIdentifier || entry.username.toLowerCase() === normalizedIdentifier,
  );

  if (!user) {
    return { status: "invalid" as const };
  }

  if (!user.isActive) {
    return { status: "pending" as const };
  }

  if (user.passwordHash !== passwordHash) {
    return { status: "invalid" as const };
  }

  return {
    status: "success" as const,
    user: {
      username: user.username,
      email: user.email,
    },
  };
}

function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function readAdminUsers() {
  try {
    const raw = await readFile(storagePath, "utf8");
    const parsed = JSON.parse(raw) as StoredAdminUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }

    throw error;
  }
}

async function writeAdminUsers(users: StoredAdminUser[]) {
  await mkdir(storageDirectory, { recursive: true });
  await writeFile(storagePath, JSON.stringify(users, null, 2), "utf8");
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
