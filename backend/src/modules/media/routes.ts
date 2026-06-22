import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { env } from "../../config/env.js";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { buildPublicUploadPath } from "../../utils/media.js";
import {
  ensureUploadFolder,
  getUploadRootDir,
  listUploadFiles,
  listUploadFolders,
  normalizeUploadFolder
} from "../../utils/uploads.js";

const storage = multer.diskStorage({
  destination: (request, _file, callback) => {
    try {
      const { absolutePath } = ensureUploadFolder(typeof request.body.folder === "string" ? request.body.folder : null);
      callback(null, absolutePath);
    } catch (error) {
      callback(error instanceof Error ? error : new Error("Invalid upload folder"), "");
    }
  },
  filename: (_request, file, callback) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    callback(null, safeName);
  }
});

const upload = multer({ storage });

const mediaSchema = z.object({
  altText: z.string().optional().nullable(),
  isUsed: z.boolean().default(true)
});

const createFolderSchema = z.object({
  folder: z.string().trim().min(1)
});

export const mediaRouter = Router();

mediaRouter.get(
  "/",
  requirePermission("media.manage"),
  asyncHandler(async (_request, response) => {
    response.json({
      data: await query("SELECT * FROM media_files ORDER BY created_at DESC LIMIT 200")
    });
  })
);

mediaRouter.get(
  "/library",
  requirePermission("media.manage"),
  asyncHandler(async (request, response) => {
    const currentFolder = normalizeUploadFolder(
      typeof request.query.folder === "string" ? request.query.folder : null
    );

    response.json({
      data: {
        currentFolder,
        folders: listUploadFolders(),
        files: listUploadFiles(currentFolder)
      }
    });
  })
);

mediaRouter.post(
  "/folders",
  requirePermission("media.manage"),
  validate(createFolderSchema),
  asyncHandler(async (request, response) => {
    const { normalizedFolder } = ensureUploadFolder(request.body.folder);

    response.status(201).json({
      message: "Folder created successfully",
      data: {
        folder: normalizedFolder,
        folders: listUploadFolders()
      }
    });
  })
);

mediaRouter.post(
  "/upload",
  requirePermission("media.manage"),
  upload.single("file"),
  asyncHandler(async (request, response) => {
    const file = request.file;

    if (!file) {
      response.status(400).json({ message: "File is required" });
      return;
    }

    const relativeDestination = path.relative(getUploadRootDir(), file.destination).replace(/\\/g, "/");
    const folder =
      relativeDestination && relativeDestination !== "."
        ? normalizeUploadFolder(relativeDestination)
        : normalizeUploadFolder(typeof request.body.folder === "string" ? request.body.folder : null);
    const relativePath = path.posix.join(env.UPLOAD_DIR, folder, file.filename);
    const fileUrl = buildPublicUploadPath(`${folder}/${file.filename}`);

    await execute(
      `
        INSERT INTO media_files (
          file_name, file_path, file_url, mime_type, extension, file_size, uploaded_by, is_used
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        file.originalname,
        relativePath,
        fileUrl,
        file.mimetype,
        path.extname(file.originalname).replace(".", ""),
        file.size,
        request.adminUser!.id
      ]
    );

    response.status(201).json({
      message: "File uploaded successfully",
      data: { fileUrl, filePath: relativePath, fileName: file.originalname }
    });
  })
);

mediaRouter.patch(
  "/:id",
  requirePermission("media.manage"),
  validate(mediaSchema),
  asyncHandler(async (request, response) => {
    await execute(
      `
        UPDATE media_files
        SET alt_text = ?, is_used = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [request.body.altText ?? null, request.body.isUsed ? 1 : 0, Number(request.params.id)]
    );
    response.json({ message: "Media file updated" });
  })
);

mediaRouter.delete(
  "/:id",
  requirePermission("media.manage"),
  asyncHandler(async (request, response) => {
    const [media] = await query<any[]>("SELECT * FROM media_files WHERE id = ? LIMIT 1", [
      Number(request.params.id)
    ]);

    if (!media) {
      throw new AppError("Media file not found", 404);
    }

    if (media?.file_path) {
      const relativeFilePath = String(media.file_path).replace(/^uploads\/?/i, "");
      const absolutePath = path.join(getUploadRootDir(), relativeFilePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await execute("DELETE FROM media_files WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Media file deleted" });
  })
);
