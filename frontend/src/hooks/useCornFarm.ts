import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  CornFarmState,
  CornFarmHook,
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000/';

export function useCornFarm(clientId: string, isInitialized: boolean): CornFarmHook {
  const [state, setState] = useState<CornFarmState>({
    totalCorn: 0,
    tier: null,
    phase: 'ready',
    canBuy: true,
    timeRemaining: 0,
    nextTierAt: null,
    isConnected: false,
    error: null,
  });

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    if (!isInitialized || !clientId) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true }));
      newSocket.emit('user:connected', { clientId });
    });

    newSocket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }));
    });

    newSocket.on('corn:initial-state', data => {
      setState(prev => ({
        ...prev,
        totalCorn: data.totalCorn,
        tier: data.tier,
        phase: data.phase,
        timeRemaining: data.timeRemaining,
        canBuy: data.canBuy,
        nextTierAt: data.nextTierAt,
      }));
    });

    newSocket.on('corn:state', data => {
      setState(prev => ({
        ...prev,
        phase: data.phase,
        timeRemaining: data.timeRemaining,
        canBuy: data.phase === 'ready',
      }));
    });

    newSocket.on('corn:ready', () => {
      setState(prev => ({
        ...prev,
        phase: 'ready',
        canBuy: true,
        timeRemaining: 0,
      }));
    });

    newSocket.on('corn:harvested', data => {
      setState(prev => ({
        ...prev,
        totalCorn: data.totalCorn,
        tier: data.tier,
        phase: 'planting',
        canBuy: false,
        timeRemaining: data.timeRemaining || prev.tier?.cooldownSeconds! * 1000 || 60000,
        error: null,
      }));
    });

    newSocket.on('corn:error', data => {
      setState(prev => ({
        ...prev,
        error: data.message,
        timeRemaining: data.timeRemaining,
        canBuy: false,
      }));
    });

    newSocket.on('tier:upgraded', data => {
      setState(prev => ({
        ...prev,
        tier: data.newTier,
        nextTierAt: data.nextTierAt,
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [clientId, isInitialized]);

  const buyCorn = () => {
    if (!socket || !state.isConnected) {
      setState(prev => ({
        ...prev,
        error: 'No hay conexión con el servidor',
      }));
      return;
    }

    socket.emit('corn:buy', { clientId });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    buyCorn,
    clearError,
  };
}
