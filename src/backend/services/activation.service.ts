/**
 * Serviço de ativação + registro de HWID. Somente estrutura.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import type {
  ActivationRequest,
  ActivationResponse,
  RegisterHwidRequest,
  RegisterHwidResponse,
} from "@/backend/types";

export const activationService = {
  activate(req: ActivationRequest): Promise<ActivationResponse> {
    return backendAdapter.activate(req);
  },
  registerHwid(req: RegisterHwidRequest): Promise<RegisterHwidResponse> {
    return backendAdapter.registerHwid(req);
  },
};
