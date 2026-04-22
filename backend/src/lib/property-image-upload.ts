import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { cloudinary } from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "mon1-properties",
    format: "webp",
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto:good" },
    ],
  }),
});

export const propertyImageUpload = multer({ storage });
