// Small reusable helpers for filtering + paginating a mock list.
import { useMemo, useState } from "react";

export function useTable<T>(
  rows: T[],
  opts: {
    search?: (row: T, q: string) => boolean;
    filter?: (row: T) => boolean;
    pageSize?: number;
  } = {},
) {
  const { search, filter, pageSize = 10 } = opts;
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let r = rows;
    if (filter) r = r.filter(filter);
    if (search && q.trim()) {
      const query = q.trim().toLowerCase();
      r = r.filter((row) => search(row, query));
    }
    return r;
  }, [rows, q, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  const toggleRow = (i: number) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  };
  const toggleAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map((_, i) => i)));
  };
  const clearSelection = () => setSelected(new Set());
  const selectedRows = () => Array.from(selected).map((i) => pageRows[i]).filter(Boolean);

  return {
    q,
    setQ,
    page: currentPage,
    setPage,
    totalPages,
    total: filtered.length,
    pageRows,
    selected,
    toggleRow,
    toggleAll,
    clearSelection,
    selectedRows,
  };
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}
export function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const csv = [
    cols.join(","),
    ...rows.map((r) =>
      cols
        .map((c) => {
          const v = String(r[c] ?? "").replace(/"/g, '""');
          return /[",\n]/.test(v) ? `"${v}"` : v;
        })
        .join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
