import { Server, Socket } from "socket.io";
import prisma from "./config/prisma";

interface CustomeSocket extends Socket {
  room?: string;
}

export function setUpSocket(io: Server) {
  io.use((socket: CustomeSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;

    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomeSocket) => {
    console.log("client connected", socket.id);

    socket.on("send-rating", async (data) => {
      const findIsDataPresent = await prisma.ratings.findFirst({
        where: {
          user_id: data.user_id,
          solution_id: data.solution_id,
        },
      });

      if (findIsDataPresent) {
        await prisma.ratings.delete({
          where: {
            id: findIsDataPresent.id,
          },
        });
        socket.emit("remove-solution-rating", data.solution_id);
      } else {
        await prisma.ratings.create({ data: data });
        socket.emit("recive-solutionId", data.solution_id);
      }
    });

    // * Join room

    socket.join(socket.room);

    socket.on("message", async (data) => {
      await prisma.chats.create({
        data: data,
      });
      io.to(socket.room).emit("recive-message", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnect", socket.id);
    });
  });
}
