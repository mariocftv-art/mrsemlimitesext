/**
 * Serviço de licenças — consome o BackendAdapter, nunca a API direto.
 * Somente estrutura. Nenhuma chamada é executada nesta fase.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import type {
  ValidateLicenseRequest,
  ValidateLicenseResponse,
} from "@/backend/types";

export const licenseService = {
  validate(req: ValidateLicenseRequest): Promise<ValidateLicenseResponse> {
    return backendAdapter.validateLicense(req);
  },
};
