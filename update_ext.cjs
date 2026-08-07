const fs = require('fs');
const path = require('path');

const baseDir = '/tmp/fresh_ext_audit';
const officialBackend = 'https://mrsemlimitesext.lovable.app/api/public/validate-license-v2';

function processFile(filename, replacements) {
    const filePath = path.join(baseDir, filename);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content);
}

// 1. Atualizar lv-core.js (Backend)
// O backend antigo usa o endpoint dinâmico do Supabase. Vamos forçar o MR Sem Limites.
// Procuramos o padrão da URL e injetamos a nossa.
processFile('lv-core.js', [
    [/const _n5321e8=[^;]+;/, `const _n5321e8="${officialBackend}";`],
    [/Lovable/g, 'MR Sem Limites'],
    [/LVB/g, 'MR']
]);

// 2. Atualizar background.js (Proxy e Branding)
processFile('background.js', [
    [/const _BG_PROXY_URL=[^;]+;/, `const _BG_PROXY_URL="${officialBackend}";`],
    [/Lovable/g, 'MR Sem Limites']
]);

// 3. Atualizar sidepanel.html (Título e UI)
processFile('sidepanel.html', [
    [/Lovable ∞/g, 'MR Sem Limites'],
    [/Lovable/g, 'MR Sem Limites']
]);

// 4. Atualizar i18n.js (Branding e Placeholders)
processFile('i18n.js', [
    [/Lovable/g, 'MR Sem Limites'],
    [/LVB/g, 'MR'],
    [/MRC Limit/g, 'MR Sem Limites']
]);

// 5. Atualizar manifest.json
processFile('manifest.json', [
    [/"name": "[^"]+"/, '"name": "MR Sem Limites"'],
    [/"description": "[^"]+"/, '"description": "Extensão Oficial MR Sem Limites"']
]);

console.log('Arquivos da extensão atualizados com sucesso.');
