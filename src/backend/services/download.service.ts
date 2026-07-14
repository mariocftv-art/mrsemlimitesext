/**
 * Serviço de downloads. Somente estrutura.
 */
import { backendAdapter } from "@/backend/adapters/backend-adapter";
import { APP_CONFIG } from "@/backend/config/app.config";
import type { DownloadInfo } from "@/backend/types";

export const downloadService = {
  get(productSlug: string = APP_CONFIG.PRODUCT_ID): Promise<DownloadInfo> {
    return backendAdapter.getDownload(productSlug);
  },
};
