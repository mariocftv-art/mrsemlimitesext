// Hook React para consumir o scanner com um único ponto.
import { useEffect, useMemo, useState } from "react";
import {
  readAppConfigVersion,
  readManifest,
  readPackageJson,
  scanExtension,
  type ExtensionManifest,
  type ExtensionPackageJson,
  type ScanResult,
} from "./ext-scanner";
import type { ExtensionRecord } from "./types";

export interface ExtensionScanBundle extends ScanResult {
  manifest: ExtensionManifest | null;
  packageJson: ExtensionPackageJson | null;
  appConfigVersion: string | null;
  manifestVersion: string | null;
  versionStatus: "match" | "diverge" | "unknown";
}

export function useExtensionScan(ext: ExtensionRecord): ExtensionScanBundle {
  const scan = useMemo(() => scanExtension(ext.sourceDir), [ext.sourceDir]);
  const [manifest, setManifest] = useState<ExtensionManifest | null>(null);
  const [packageJson, setPackageJson] = useState<ExtensionPackageJson | null>(null);
  const [appVer, setAppVer] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const [m, p, v] = await Promise.all([
        readManifest(ext.sourceDir),
        readPackageJson(ext.sourceDir),
        readAppConfigVersion(ext.sourceDir),
      ]);
      if (!cancel) {
        setManifest(m);
        setPackageJson(p);
        setAppVer(v);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [ext.sourceDir]);

  const manifestVersion = manifest?.version ?? null;
  const versionStatus: "match" | "diverge" | "unknown" =
    !manifestVersion || !appVer
      ? "unknown"
      : manifestVersion === appVer
        ? "match"
        : "diverge";

  return {
    ...scan,
    manifest,
    packageJson,
    appConfigVersion: appVer,
    manifestVersion,
    versionStatus,
  };
}
