import multer from "multer";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "properties");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const safe = base.replace(/[^\w\-]+/g, "_");
        cb(null, `${Date.now()}_${safe}${ext}`);
    }
});

//chi nhan file anh
const fileFilter = (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed"));
};

export const uploadPropertyImages = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});



