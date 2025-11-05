import multer from "multer";
import path from "path";

// Full absolute path to the uploads folder
const uploadsPath = path.join(process.cwd(), "uploads");
// process.cwd() — current working directory where node is running

// Configure storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath); // folder where files will be saved, create it beforehand
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // create unique filename with original extension
  },
});

// File filter to accept only images (jpeg, jpg, png, gif, jfif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|jfif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max file size 5 MB
  fileFilter,
});

// Middleware to upload a single file with the field name 'lien_image'
export const uploadSingleImage = upload.single("image");

// If you want to upload multiple files:
// export const uploadMultipleImages = upload.array('images', 5);
