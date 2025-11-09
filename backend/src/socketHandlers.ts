import { Server, Socket } from "socket.io";
import rateLimiter from "./rateLimiter";
import { calculatePhase, getNextTierThreshold, calculateTier } from "./utils";
import { ServerToClientEvents, ClientToServerEvents, CornPhase } from "./types";

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function setupSocketHandlers(io: TypedServer): void {
  io.on("connection", (socket: TypedSocket) => {
    socket.on("user:connected", ({ clientId }) => {
      if (!clientId || clientId.trim() === "") {
        socket.disconnect();
        return;
      }

      socket.join(clientId);
      rateLimiter.updateSocketId(clientId, socket.id);

      const user = rateLimiter.getUserState(clientId);
      const tierData = calculateTier(user.totalPurchases);

      let currentPhase: CornPhase = "ready";
      let timeRemaining = 0;
      let canBuy = true;

      if (user.lastPurchase) {
        const elapsed = Date.now() - user.lastPurchase;
        const cooldownMs = user.cooldownSeconds * 1000;
        timeRemaining = Math.max(0, cooldownMs - elapsed);
        canBuy = elapsed >= cooldownMs;
        currentPhase = canBuy
          ? "ready"
          : calculatePhase(elapsed, user.cooldownSeconds);
      }

      socket.emit("corn:initial-state", {
        totalCorn: user.totalPurchases,
        tier: tierData,
        phase: currentPhase,
        timeRemaining,
        canBuy,
        nextTierAt: getNextTierThreshold(user.totalPurchases),
      });
    });

    socket.on("corn:buy", ({ clientId }) => {
      if (!clientId || clientId.trim() === "") {
        socket.emit("corn:error", {
          statusCode: 400,
          message: "ClientId inválido o vacío",
          retryAfter: 0,
          timeRemaining: 0,
        });
        return;
      }

      const result = rateLimiter.canPurchase(clientId);

      if (!result.allowed) {
        const errorData = {
          statusCode: 429,
          message: `Aún no puedes cosechar. Espera ${result.retryAfter}s.`,
          retryAfter: result.retryAfter!,
          timeRemaining: result.timeRemaining!,
        };

        io.to(clientId).emit("corn:error", errorData);
        return;
      }

      const { user, tierUpgraded, newTierData } =
        rateLimiter.recordPurchase(clientId);

      const cooldownMs = user.cooldownSeconds * 1000;

      io.to(clientId).emit("corn:harvested", {
        statusCode: 200,
        success: true,
        totalCorn: user.totalPurchases,
        tier: newTierData,
        timeRemaining: cooldownMs,
        message: "Maíz comprado",
      });

      if (tierUpgraded) {
        io.to(clientId).emit("tier:upgraded", {
          newTier: newTierData,
          totalCorn: user.totalPurchases,
          nextTierAt: getNextTierThreshold(user.totalPurchases),
        });
      }
    });

    socket.on("disconnect", () => {});
  });

  setInterval(() => {
    const users = rateLimiter.getAllUsers();

    users.forEach((user) => {
      if (!user.lastPurchase || !user.socketId) return;

      const elapsed = Date.now() - user.lastPurchase;
      const cooldownMs = user.cooldownSeconds * 1000;
      const newPhase = calculatePhase(elapsed, user.cooldownSeconds);
      const timeRemaining = Math.max(0, cooldownMs - elapsed);

      if (newPhase !== user.currentPhase) {
        user.currentPhase = newPhase;

        io.to(user.clientId).emit("corn:state", {
          phase: newPhase,
          timeRemaining,
          progress: (elapsed / cooldownMs) * 100,
        });
      }

      if (elapsed >= cooldownMs && newPhase === "ready") {
        const tierData = calculateTier(user.totalPurchases);

        io.to(user.clientId).emit("corn:ready", {
          message: `${tierData.badge} Tu maíz está listo`,
          canHarvest: true,
        });
      }
    });
  }, 1000);
}
