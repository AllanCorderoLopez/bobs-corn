"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = setupSocketHandlers;
const rateLimiter_1 = __importDefault(require("./rateLimiter"));
const utils_1 = require("./utils");
function setupSocketHandlers(io) {
    io.on("connection", (socket) => {
        socket.on("user:connected", ({ clientId }) => {
            if (!clientId || clientId.trim() === "") {
                socket.disconnect();
                return;
            }
            socket.join(clientId);
            rateLimiter_1.default.updateSocketId(clientId, socket.id);
            const user = rateLimiter_1.default.getUserState(clientId);
            const tierData = (0, utils_1.calculateTier)(user.totalPurchases);
            let currentPhase = "ready";
            let timeRemaining = 0;
            let canBuy = true;
            if (user.lastPurchase) {
                const elapsed = Date.now() - user.lastPurchase;
                const cooldownMs = user.cooldownSeconds * 1000;
                timeRemaining = Math.max(0, cooldownMs - elapsed);
                canBuy = elapsed >= cooldownMs;
                currentPhase = canBuy
                    ? "ready"
                    : (0, utils_1.calculatePhase)(elapsed, user.cooldownSeconds);
            }
            socket.emit("corn:initial-state", {
                totalCorn: user.totalPurchases,
                tier: tierData,
                phase: currentPhase,
                timeRemaining,
                canBuy,
                nextTierAt: (0, utils_1.getNextTierThreshold)(user.totalPurchases),
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
            const result = rateLimiter_1.default.canPurchase(clientId);
            if (!result.allowed) {
                const errorData = {
                    statusCode: 429,
                    message: `Aún no puedes cosechar. Espera ${result.retryAfter}s.`,
                    retryAfter: result.retryAfter,
                    timeRemaining: result.timeRemaining,
                };
                io.to(clientId).emit("corn:error", errorData);
                return;
            }
            const { user, tierUpgraded, newTierData } = rateLimiter_1.default.recordPurchase(clientId);
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
                    nextTierAt: (0, utils_1.getNextTierThreshold)(user.totalPurchases),
                });
            }
        });
        socket.on("disconnect", () => { });
    });
    setInterval(() => {
        const users = rateLimiter_1.default.getAllUsers();
        users.forEach((user) => {
            if (!user.lastPurchase || !user.socketId)
                return;
            const elapsed = Date.now() - user.lastPurchase;
            const cooldownMs = user.cooldownSeconds * 1000;
            const newPhase = (0, utils_1.calculatePhase)(elapsed, user.cooldownSeconds);
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
                const tierData = (0, utils_1.calculateTier)(user.totalPurchases);
                io.to(user.clientId).emit("corn:ready", {
                    message: `${tierData.badge} Tu maíz está listo`,
                    canHarvest: true,
                });
            }
        });
    }, 1000);
}
