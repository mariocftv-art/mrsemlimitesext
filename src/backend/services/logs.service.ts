/**
 * Serviço de logs remotos. Somente estrutura.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import type { RemoteLogEntry } from "@/backend/types";

export const logsService = {
  send(entry: RemoteLogEntry): Promise<void> {
    return backendAdapter.sendLog(entry);
  },
};
