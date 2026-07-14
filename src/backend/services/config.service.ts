/**
 * Serviço de configuração remota (inject-config). Somente estrutura.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import type { InjectConfigResponse } from "@/backend/types";

export const configService = {
  inject(): Promise<InjectConfigResponse> {
    return backendAdapter.getInjectConfig();
  },
};
