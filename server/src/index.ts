import express, { Application, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import Routers from "./routes/index";
import { createServer } from "http";
import { Server } from "socket.io";
import { setUpSocket } from "./socket";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis";
import { instrument } from "@socket.io/admin-ui";
import multer from "multer";
import path from "path";
import fs from "fs";
import PostController from "./controllers/PostController";
import UserController from "./controllers/UserController";
import prisma from "./config/prisma";

const app: Application = express();
const PORT = process.env.PORT || 8000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  },
  adapter: createAdapter(redis),
});

instrument(io, {
  auth: false,
  mode: "development",
});

export { io };
setUpSocket(io);

//multer
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const uploadPath = path.resolve(__dirname, "../dist/uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const formatFilename = file.originalname.split(" ").join("");
    cb(null, uniqueSuffix + "-" + formatFilename);
  },
});
const upload = multer({ storage: storage });

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Rating toggle — inline route (no dist recompile needed)
app.post("/api/rating/toggle", async (req: Request, res: Response) => {
  try {
    const { user_id, solution_id } = req.body;
    if (!user_id || !solution_id) {
      return res.status(400).json({ success: false, message: "Missing user_id or solution_id" });
    }
    const existing = await prisma.ratings.findFirst({ where: { user_id, solution_id } });
    if (existing) {
      await prisma.ratings.delete({ where: { id: existing.id } });
      const count = await prisma.ratings.count({ where: { solution_id } });
      return res.json({ success: true, rated: false, count });
    } else {
      await prisma.ratings.create({ data: { user_id, solution_id } });
      const count = await prisma.ratings.count({ where: { solution_id } });
      return res.json({ success: true, rated: true, count });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// Router
app.post("/create-post", upload.single("file"), PostController.create);
app.post(
  "/edit_profile",
  upload.single("profile"),
  UserController.editUserProfileImage
);
app.use("/api", Routers);

httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
