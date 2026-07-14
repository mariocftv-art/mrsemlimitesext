/**
 * Serviço de sessão (heartbeat). Somente estrutura.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import type { HeartbeatRequest, HeartbeatResponse } from "@/backend/types";

export const sessionService = {
  heartbeat(req: HeartbeatRequest): Promise<HeartbeatResponse> {
    return backendAdapter.heartbeat(req);
  },
};
