if (typeof window !== 'undefined') {
  const exts = JSON.parse(localStorage.getItem('mr-factory-extensions') || '[]');
  const ext11 = {
    id: "ext-11",
    slug: "ext11-mr-sem-limite-novo-metodo-v4",
    code: "EXT11",
    name: "🚀 EXT11 — MR Sem Limite Ext 11 (Novo Método v4)",
    version: "1.2.0",
    status: "production",
    updatedAt: new Date().toISOString()
  };
  
  const index = exts.findIndex(e => e.id === 'ext-11');
  if (index >= 0) exts[index] = { ...exts[index], ...ext11 };
  else exts.push(ext11);
  
  localStorage.setItem('mr-factory-extensions', JSON.stringify(exts));
  window.location.reload();
}
