import multer from "multer";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return callback(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", "images"),
      );
    }

    callback(null, true);
  },
});

export const courseUpload = upload.array("images", 5);
