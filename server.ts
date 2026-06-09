import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import type { Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ----------------------------
// Types
// ----------------------------
type UserData = {
  peerId: string;
  userName: string;
};

type RoomMap = Map<string, Map<string, UserData>>;

const rooms: RoomMap = new Map();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on(
      "join-room",
      (payload: { roomId: string; peerId: string; userName: string }) => {
        const { roomId, peerId, userName } = payload;

        socket.join(roomId);

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Map());
        }

        rooms.get(roomId)!.set(socket.id, { peerId, userName });

        // Notify others
        socket.to(roomId).emit("user-joined", { peerId, userName });

        // Send existing users
        const existing: UserData[] = [];

        rooms.get(roomId)!.forEach((data, sid) => {
          if (sid !== socket.id) {
            existing.push(data);
          }
        });

        socket.emit("existing-users", existing);

        // Handle disconnect (scoped correctly)
        socket.once("disconnect", () => {
          const room = rooms.get(roomId);
          if (room) {
            room.delete(socket.id);

            if (room.size === 0) {
              rooms.delete(roomId);
            }
          }

          socket.to(roomId).emit("user-left", { peerId });
        });
      }
    );
  });

  const port = Number(process.env.PORT) || 3000;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});