// Catálogo de assets da Factory (sem storage remoto).
// Estrutura preparada para futuros uploads.

export type AssetKind = "logo" | "banner" | "icon" | "image" | "sound";

export interface AssetItem {
  id: string;
  kind: AssetKind;
  name: string;
  extensionId?: string;
  url?: string;
  sizeBytes?: number;
  createdAt: string;
}

export const ASSET_KINDS: { kind: AssetKind; label: string }[] = [
  { kind: "logo", label: "Logos" },
  { kind: "banner", label: "Banners" },
  { kind: "icon", label: "Ícones" },
  { kind: "image", label: "Imagens" },
  { kind: "sound", label: "Sons" },
];

// Placeholder: sem itens até que exista upload real.
export function listAssets(): AssetItem[] {
  return [];
}
