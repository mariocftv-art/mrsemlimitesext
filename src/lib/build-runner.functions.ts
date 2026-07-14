// Server function que executa o pipeline REAL da EXT1
// (extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1/build/build.mjs).
// A Factory NÃO altera esse script — apenas o invoca.

import { createServerFn } from "@tanstack/react-start";

export type BuildStepStatus = "pending" | "running" | "ok" | "fail";
export type BuildStep = { key: string; label: string; status: BuildStepStatus; detail?: string };

export type BuildResult = {
  ok: boolean;
  mode: "dev" | "prod";
  ms: number;
  log: string;
  steps: BuildStep[];
  missingDeps: string[];
  zip?: {
    filename: string;
    downloadUrl: string;
    sizeBytes: number;
    sha256: string;
    fileCount: number;
    outputDir: string;
  };
  error?: { message: string; stack?: string; file?: string; line?: number };
};

export const runExtensionBuild = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): { sourceDir: string; mode: "dev" | "prod"; extCode: string } => {
    const d = data as { sourceDir?: unknown; mode?: unknown; extCode?: unknown };
    if (typeof d?.sourceDir !== "string" || !d.sourceDir.startsWith("extensions/")) {
      throw new Error("sourceDir inválido (esperado 'extensions/...').");
    }
    if (d.sourceDir.includes("..")) throw new Error("sourceDir inválido.");
    const mode = d.mode === "prod" ? "prod" : "dev";
    const extCode = typeof d.extCode === "string" && /^[a-zA-Z0-9_-]+$/.test(d.extCode)
      ? d.extCode
      : "ext";
    return { sourceDir: d.sourceDir, mode, extCode };
  })
  .handler(async ({ data }): Promise<BuildResult> => {
    const nodePath = await import("node:path");
    const nodeFs = await import("node:fs/promises");
    const nodeChild = await import("node:child_process");
    const nodeCrypto = await import("node:crypto");

    const t0 = Date.now();
    const cwd = process.cwd();
    const extRoot = nodePath.resolve(cwd, data.sourceDir);
    const buildScript = nodePath.join(extRoot, "build", "build.mjs");
    const distDir = nodePath.join(extRoot, "dist");

    const steps: BuildStep[] = [
      { key: "prepare", label: "Preparando", status: "pending" },
      { key: "structure", label: "Validando estrutura", status: "pending" },
      { key: "manifest", label: "Validando manifest", status: "pending" },
      { key: "assets", label: "Validando assets", status: "pending" },
      { key: "run", label: "Executando build", status: "pending" },
      { key: "optimize", label: "Otimizando", status: "pending" },
      { key: "pack", label: "Gerando pacote", status: "pending" },
      { key: "done", label: "Finalizado", status: "pending" },
    ];
    const setStep = (key: string, status: BuildStepStatus, detail?: string) => {
      const s = steps.find((x) => x.key === key);
      if (s) { s.status = status; if (detail) s.detail = detail; }
    };
    const fail = (
      key: string,
      msg: string,
      extra: Partial<BuildResult> = {},
      err?: Error,
    ): BuildResult => {
      setStep(key, "fail", msg);
      for (const s of steps) if (s.status === "pending") s.status = "pending";
      return {
        ok: false,
        mode: data.mode,
        ms: Date.now() - t0,
        log: extra.log ?? "",
        steps,
        missingDeps: extra.missingDeps ?? [],
        error: { message: msg, stack: err?.stack },
        ...extra,
      };
    };

    // 1. prepare
    setStep("prepare", "running");
    try {
      await nodeFs.access(buildScript);
    } catch {
      return fail("prepare", `Script de build não encontrado em ${buildScript}`);
    }
    setStep("prepare", "ok", buildScript);

    // 2. structure
    setStep("structure", "running");
    const requiredDirs = ["build"];
    for (const d of requiredDirs) {
      try { await nodeFs.access(nodePath.join(extRoot, d)); }
      catch { return fail("structure", `Pasta obrigatória ausente: ${d}`); }
    }
    setStep("structure", "ok");

    // 3. manifest
    setStep("manifest", "running");
    let manifestJson: Record<string, unknown> | null = null;
    try {
      const raw = await nodeFs.readFile(nodePath.join(extRoot, "manifest.json"), "utf8");
      manifestJson = JSON.parse(raw);
    } catch (e) {
      return fail("manifest", `manifest.json inválido: ${(e as Error).message}`);
    }
    if (!manifestJson?.name || !manifestJson?.version) {
      return fail("manifest", "manifest.json sem name/version.");
    }
    setStep("manifest", "ok", `v${manifestJson.version as string}`);

    // 4. assets
    setStep("assets", "running");
    const icons = (manifestJson.icons ?? {}) as Record<string, string>;
    const missingAssets: string[] = [];
    for (const p of Object.values(icons)) {
      try { await nodeFs.access(nodePath.join(extRoot, p)); }
      catch { missingAssets.push(p); }
    }
    if (missingAssets.length) {
      setStep("assets", "ok", `⚠ ${missingAssets.length} ícones ausentes`);
    } else {
      setStep("assets", "ok");
    }

    // 5. run — invoca node build/build.mjs SEM modificar o script
    setStep("run", "running");

    // Checagem simples de dependências opcionais (apenas em prod)
    const missingDeps: string[] = [];
    if (data.mode === "prod") {
      const nm = nodePath.join(extRoot, "node_modules");
      for (const pkg of ["terser", "javascript-obfuscator"]) {
        try { await nodeFs.access(nodePath.join(nm, pkg)); }
        catch { missingDeps.push(pkg); }
      }
    }

    let stdout = "";
    let stderr = "";
    let exitCode = 0;
    try {
      const res = nodeChild.spawnSync(
        process.execPath,
        ["build/build.mjs", `--mode=${data.mode}`],
        { cwd: extRoot, encoding: "utf8", timeout: 120_000 },
      );
      stdout = res.stdout ?? "";
      stderr = res.stderr ?? "";
      exitCode = res.status ?? -1;
      if (res.error) throw res.error;
    } catch (e) {
      const err = e as Error;
      return fail(
        "run",
        `Falha ao executar build.mjs: ${err.message}`,
        { log: [stdout, stderr].filter(Boolean).join("\n"), missingDeps },
        err,
      );
    }
    const fullLog = [stdout, stderr].filter(Boolean).join("\n");

    if (exitCode !== 0) {
      const parsed = parseNodeError(stderr || stdout);
      setStep("run", "fail", `exit ${exitCode}`);
      return {
        ok: false, mode: data.mode, ms: Date.now() - t0,
        log: fullLog, steps, missingDeps,
        error: { message: parsed.message, stack: parsed.stack, file: parsed.file, line: parsed.line },
      };
    }
    setStep("run", "ok", `exit ${exitCode}`);

    // 6. optimize (o próprio pipeline cuida; aqui só reflete o resultado)
    setStep(
      "optimize",
      "ok",
      data.mode === "prod"
        ? missingDeps.length
          ? `⚠ deps ausentes: ${missingDeps.join(", ")}`
          : "terser + obfuscator aplicados"
        : "modo dev (sem minificação)",
    );

    // 7. pack — localiza o ZIP produzido em dist/
    setStep("pack", "running");
    let zipSrc: string | null = null;
    try {
      const entries = await nodeFs.readdir(distDir);
      const zips = entries.filter((f) => f.endsWith(".zip"));
      if (zips.length === 0) {
        // build.mjs pode ter pulado o zip se `zip` faltar
        return fail("pack", "Nenhum .zip encontrado em dist/. Verifique se o binário 'zip' está disponível.", {
          log: fullLog, missingDeps: [...missingDeps, "zip (binário)"],
        });
      }
      zips.sort();
      zipSrc = nodePath.join(distDir, zips[zips.length - 1]);
    } catch (e) {
      return fail("pack", `dist/ não encontrado: ${(e as Error).message}`, { log: fullLog, missingDeps });
    }

    // conta arquivos no diretório de saída
    const outSubdirs = (await nodeFs.readdir(distDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => nodePath.join(distDir, d.name));
    let fileCount = 0;
    let outputDir = "";
    if (outSubdirs.length > 0) {
      outputDir = outSubdirs[0];
      fileCount = await countFiles(nodeFs, outputDir);
    }

    // Copia o ZIP para public/factory-builds/<extCode>/ para servir via Vite
    const publicDir = nodePath.join(cwd, "public", "factory-builds", data.extCode);
    await nodeFs.mkdir(publicDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const version = (manifestJson.version as string) ?? "0.0.0";
    const publicName = `${data.extCode}-${data.mode}-v${version}-${ts}.zip`;
    const publicPath = nodePath.join(publicDir, publicName);
    await nodeFs.copyFile(zipSrc, publicPath);

    const zipBytes = await nodeFs.readFile(publicPath);
    const sha256 = nodeCrypto.createHash("sha256").update(zipBytes).digest("hex");
    setStep("pack", "ok", `${humanSize(zipBytes.byteLength)}`);

    // 8. done
    setStep("done", "ok");

    return {
      ok: true,
      mode: data.mode,
      ms: Date.now() - t0,
      log: fullLog,
      steps,
      missingDeps,
      zip: {
        filename: publicName,
        downloadUrl: `/factory-builds/${data.extCode}/${publicName}`,
        sizeBytes: zipBytes.byteLength,
        sha256,
        fileCount,
        outputDir,
      },
    };
  });

async function countFiles(
  fs: typeof import("node:fs/promises"),
  dir: string,
): Promise<number> {
  let total = 0;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop()!;
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const p = `${d}/${e.name}`;
      if (e.isDirectory()) stack.push(p);
      else total++;
    }
  }
  return total;
}

function humanSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function parseNodeError(text: string): { message: string; stack?: string; file?: string; line?: number } {
  const stack = text.trim();
  const firstLine = stack.split("\n")[0] ?? "erro desconhecido";
  const m = stack.match(/([^\s()]+\.(?:m?js|json)):(\d+)(?::(\d+))?/);
  return {
    message: firstLine,
    stack,
    file: m?.[1],
    line: m ? Number(m[2]) : undefined,
  };
}
