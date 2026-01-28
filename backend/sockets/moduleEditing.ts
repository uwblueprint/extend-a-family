import { Server, Socket } from "socket.io";
import logger from "../utilities/logger";

const Logger = logger(__filename);

// Store active module editing locks: moduleId -> { userId, userName, socketId }
const moduleEditingLocks = new Map<
  string,
  { userId: string; userName: string; socketId: string }
>();

interface AcquireLockPayload {
  moduleId: string;
  userId: string;
  userName: string;
}

interface ReleaseLockPayload {
  moduleId: string;
  userId: string;
}

const registerModuleEditingHandlers = (io: Server, socket: Socket) => {
  // Attempt to acquire editing lock for a module
  const acquireLock = (payload: AcquireLockPayload) => {
    const { moduleId, userId, userName } = payload;

    try {
      const existingLock = moduleEditingLocks.get(moduleId);

      // Check if module is already locked by someone else
      if (existingLock && existingLock.userId !== userId) {
        Logger.info(
          `Module ${moduleId} is already locked by user ${existingLock.userName}`,
        );
        socket.emit("moduleEditing:lockDenied", {
          moduleId,
          currentEditor: {
            userId: existingLock.userId,
            userName: existingLock.userName,
          },
        });
        return;
      }

      // Acquire the lock
      moduleEditingLocks.set(moduleId, {
        userId,
        userName,
        socketId: socket.id,
      });

      Logger.info(`User ${userName} acquired lock for module ${moduleId}`);
      socket.emit("moduleEditing:lockAcquired", { moduleId });
    } catch (error) {
      Logger.error(`Failed to acquire lock for module ${moduleId}: ${error}`);
      socket.emit("moduleEditing:error", {
        moduleId,
        message: "Failed to acquire editing lock",
      });
    }
  };

  // Release editing lock for a module
  const releaseLock = (payload: ReleaseLockPayload) => {
    const { moduleId, userId } = payload;

    try {
      const existingLock = moduleEditingLocks.get(moduleId);

      // Only the lock owner can release it
      if (existingLock && existingLock.userId === userId) {
        moduleEditingLocks.delete(moduleId);
        Logger.info(`User ${userId} released lock for module ${moduleId}`);
        socket.emit("moduleEditing:lockReleased", { moduleId });
      } else {
        Logger.warn(
          `User ${userId} attempted to release lock for module ${moduleId} but doesn't own it`,
        );
      }
    } catch (error) {
      Logger.error(`Failed to release lock for module ${moduleId}: ${error}`);
    }
  };

  // Clean up locks when socket disconnects
  const handleDisconnect = () => {
    try {
      // Find and remove all locks held by this socket
      const locksToRemove: string[] = [];
      moduleEditingLocks.forEach((lock, moduleId) => {
        if (lock.socketId === socket.id) {
          locksToRemove.push(moduleId);
        }
      });

      locksToRemove.forEach((moduleId) => {
        moduleEditingLocks.delete(moduleId);
        Logger.info(
          `Released lock for module ${moduleId} due to socket disconnect`,
        );
      });
    } catch (error) {
      Logger.error(`Failed to clean up locks on disconnect: ${error}`);
    }
  };

  socket.on("moduleEditing:acquireLock", acquireLock);
  socket.on("moduleEditing:releaseLock", releaseLock);
  socket.on("disconnect", handleDisconnect);
};

const removeModuleEditingHandlers = (socket: Socket) => {
  socket.removeAllListeners("moduleEditing:acquireLock");
  socket.removeAllListeners("moduleEditing:releaseLock");
};

export {
  registerModuleEditingHandlers,
  removeModuleEditingHandlers,
  moduleEditingLocks,
};
