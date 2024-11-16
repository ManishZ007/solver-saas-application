"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Define storage engin for Multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname + "_" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Check file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type, Only image and PDF are allowed"));
    }
};
// Intialize Multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
