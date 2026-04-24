import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { cloudinary } from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "mon1-agents",
    format: "webp",
    transformation: [
      { width: 600, height: 600, crop: "fill", gravity: "face" },
      { quality: "auto:good" },
    ],
  }),
});

export const agentAvatarUpload = multer({ storage });
