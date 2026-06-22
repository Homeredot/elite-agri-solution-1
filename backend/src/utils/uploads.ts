import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";
import { buildPublicUploadPath } from "./media.js";

export const DEFAULT_UPLOAD_FOLDER = "General";
export const DEFAULT_UPLOAD_FOLDERS = ["Products", "Categories", "Logos", "Hero", DEFAULT_UPLOAD_FOLDER];

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".bmp",
  ".dib",
  ".gif",
  ".heic",
  ".heif",
  ".ico",
  ".jfif",
  ".jif",
  ".jpe",
  ".jpeg",
  ".jpg",
  ".pjp",
  ".pjpeg",
  ".png",
  ".svg",
  ".tif",
  ".tiff",
  ".webp"
]);

const sanitizeFolderSegment = (segment: string) => {
  const normalized = segment.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9_-]/g, "");

  if (!normalized) {
    throw new AppError("Folder names may only contain letters, numbers, hyphens, and underscores");
  }

  return normalized;
};

const backendRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const getUploadRootDir = () =>
  path.isAbsolute(env.UPLOAD_DIR) ? env.UPLOAD_DIR : path.resolve(backendRootDir, env.UPLOAD_DIR);

export const normalizeUploadFolder = (value?: string | null) => {
  if (!value?.trim()) {
    return DEFAULT_UPLOAD_FOLDER;
  }

  const stripped = value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "").replace(/^uploads\/?/i, "");
  if (!stripped) {
    return DEFAULT_UPLOAD_FOLDER;
  }

  const normalized = path.posix.normalize(stripped);
  if (normalized === "." || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new AppError("Invalid upload folder");
  }

  return normalized
    .split("/")
    .filter(Boolean)
    .map(sanitizeFolderSegment)
    .join("/");
};

export const ensureUploadFolder = (folder?: string | null) => {
  const normalizedFolder = normalizeUploadFolder(folder);
  const absolutePath = path.join(getUploadRootDir(), normalizedFolder);

  fs.mkdirSync(absolutePath, { recursive: true });

  return {
    normalizedFolder,
    absolutePath
  };
};

export const ensureDefaultUploadFolders = () => {
  fs.mkdirSync(getUploadRootDir(), { recursive: true });

  DEFAULT_UPLOAD_FOLDERS.forEach((folder) => {
    ensureUploadFolder(folder);
  });
};

const listImageFilesFromDirectory = (absoluteDir: string, folder: string) => {
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => {
      const absolutePath = path.join(absoluteDir, entry.name);
      const stats = fs.statSync(absolutePath);
      const relativePath =
        folder === DEFAULT_UPLOAD_FOLDER && absoluteDir === getUploadRootDir()
          ? entry.name
          : path.posix.join(folder, entry.name);

      return {
        name: entry.name,
        folder,
        filePath: path.posix.join(env.UPLOAD_DIR, relativePath),
        fileUrl: buildPublicUploadPath(relativePath),
        size: stats.size,
        modifiedAt: stats.mtime.toISOString()
      };
    })
    .sort((left, right) => new Date(right.modifiedAt).getTime() - new Date(left.modifiedAt).getTime());
};

export const listUploadFiles = (folder?: string | null) => {
  const normalizedFolder = normalizeUploadFolder(folder);
  const primaryDirectory = path.join(getUploadRootDir(), normalizedFolder);
  const files = listImageFilesFromDirectory(primaryDirectory, normalizedFolder);

  if (normalizedFolder !== DEFAULT_UPLOAD_FOLDER) {
    return files;
  }

  const rootFiles = listImageFilesFromDirectory(getUploadRootDir(), DEFAULT_UPLOAD_FOLDER);
  const seen = new Set(files.map((file) => file.fileUrl));

  rootFiles.forEach((file) => {
    if (!seen.has(file.fileUrl)) {
      files.push(file);
    }
  });

  return files.sort((left, right) => new Date(right.modifiedAt).getTime() - new Date(left.modifiedAt).getTime());
};

const walkUploadFolders = (absoluteDir: string, relativeDir = ""): string[] => {
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const childRelativeDir = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      const childAbsoluteDir = path.join(absoluteDir, entry.name);
      return [childRelativeDir, ...walkUploadFolders(childAbsoluteDir, childRelativeDir)];
    });
};

export const listUploadFolders = () => {
  ensureDefaultUploadFolders();

  const discoveredFolders = new Set<string>([...DEFAULT_UPLOAD_FOLDERS, ...walkUploadFolders(getUploadRootDir())]);

  return [...discoveredFolders]
    .sort((left, right) => left.localeCompare(right))
    .map((folder) => ({
      name: path.posix.basename(folder),
      path: folder,
      fileCount: listUploadFiles(folder).length
    }));
};
