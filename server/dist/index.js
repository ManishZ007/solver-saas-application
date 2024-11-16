"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const index_1 = __importDefault(require("./routes/index"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const redis_streams_adapter_1 = require("@socket.io/redis-streams-adapter");
const redis_1 = __importDefault(require("./config/redis"));
const admin_ui_1 = require("@socket.io/admin-ui");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const PostController_1 = __importDefault(require("./controllers/PostController"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io", "http://localhost:3000"],
        credentials: true,
    },
    adapter: (0, redis_streams_adapter_1.createAdapter)(redis_1.default),
});
exports.io = io;
(0, admin_ui_1.instrument)(io, {
    auth: false,
    mode: "development",
});
(0, socket_1.setUpSocket)(io);
//multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.resolve(__dirname, "../dist/uploads");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        const formatFilename = file.originalname.split(" ").join("");
        cb(null, uniqueSuffix + "-" + formatFilename);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "/uploads")));
// Router
app.post("/create-post", upload.single("file"), PostController_1.default.create);
app.post("/edit_profile", upload.single("profile"), UserController_1.default.editUserProfileImage);
app.use("/api", index_1.default);
httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
