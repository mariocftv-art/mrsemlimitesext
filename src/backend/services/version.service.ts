/**
 * Serviço de versão. Somente estrutura.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import { APP_CONFIG } from "@/backend/config/app.config";
import type { VersionInfo } from "@/backend/types";

export const versionService = {
  current(productSlug: string = APP_CONFIG.PRODUCT_ID): Promise<VersionInfo> {
    return backendAdapter.getVersion(productSlug);
  },
};
