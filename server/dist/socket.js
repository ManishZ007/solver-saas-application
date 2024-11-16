"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpSocket = setUpSocket;
const prisma_1 = __importDefault(require("./config/prisma"));
function setUpSocket(io) {
    io.use((socket, next) => {
        const room = socket.handshake.auth.room || socket.handshake.headers.room;
        socket.room = room;
        next();
    });
    io.on("connection", (socket) => {
        console.log("client connected", socket.id);
        socket.on("send-rating", async (data) => {
            const findIsDataPresent = await prisma_1.default.ratings.findFirst({
                where: {
                    user_id: data.user_id,
                    solution_id: data.solution_id,
                },
            });
            if (findIsDataPresent) {
                await prisma_1.default.ratings.delete({
                    where: {
                        id: findIsDataPresent.id,
                    },
                });
                socket.emit("remove-solution-rating", data.solution_id);
            }
            else {
                await prisma_1.default.ratings.create({ data: data });
                socket.emit("recive-solutionId", data.solution_id);
            }
        });
        // * Join room
        socket.join(socket.room);
        socket.on("message", async (data) => {
            await prisma_1.default.chats.create({
                data: data,
            });
            io.to(socket.room).emit("recive-message", data);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnect", socket.id);
        });
    });
}
