import path from "node:path";
import { z } from "zod";
import { env } from "../config/env.js";

const PUBLIC_UPLOAD_PREFIX = "/uploads/";

export const buildPublicUploadPath = (filePath: string) => {
  const normalizedPath = filePath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^uploads\/?/i, "");
  const safePath = path.posix.normalize(normalizedPath);

  if (!safePath || safePath === "." || safePath.startsWith("../") || safePath.includes("/../")) {
    throw new Error("Invalid upload path");
  }

  return `${PUBLIC_UPLOAD_PREFIX}${safePath}`;
};

export const isLocalImageReference = (value: string) => {
  const normalized = value.trim();
  const uploadPrefix = PUBLIC_UPLOAD_PREFIX;
  const relativeUploadPrefix = uploadPrefix.replace(/^\//, "");

  if (normalized.startsWith(uploadPrefix) || normalized.startsWith(relativeUploadPrefix)) {
    return true;
  }

  try {
    const baseUrl = new URL(env.APP_BASE_URL);
    const resolvedUrl = new URL(normalized, env.APP_BASE_URL);
    return (
      resolvedUrl.origin === baseUrl.origin &&
      resolvedUrl.pathname.startsWith(uploadPrefix)
    );
  } catch {
    return false;
  }
};

const localImageMessage = "Image references must point to files uploaded under /uploads";

export const localImageSchema = z
  .string()
  .trim()
  .min(1)
  .refine(isLocalImageReference, localImageMessage);

export const optionalLocalImageSchema = z
  .string()
  .trim()
  .min(1)
  .refine(isLocalImageReference, localImageMessage)
  .optional()
  .nullable();
