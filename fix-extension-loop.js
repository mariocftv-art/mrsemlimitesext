const fs = require('fs');
const path = require('path');

const EXT_DIR = 'extensions/ext-07/integrated/mr-sem-limites-v17-7';
const files = ['sidepanel.js', 'lv-core.js', 'sidepanel-templates.js', 'background.js', 'i18n.js'];

files.forEach(file => {
  const filePath = path.join(EXT_DIR, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Corrigir o domínio do Supabase externo que pode estar vindo obfuscado
  // O domínio dwpuqewnfibeldegvimp deve ser redirecionado para o nosso proxy
  const OLD_DOMAIN = "dwpuqewnfibeldegvimp";
  const NEW_DOMAIN = "id-preview--44455b56-b609-45e7-8e53-9fd580b3ca9f.lovable.app/api/public/ext";
  
  // 2. Garantir que as URLs de ativação e validação usem o caminho correto
  // A extensão v17.7.0 usa /functions/v1/validate-license-v2 etc.
  
  // 3. Substituir chamadas diretas para o supabase antigo pelo nosso backend integrado
  const regexSupabase = /https?:\/\/[a-z0-9]+\.supabase\.co\/functions\/v1/g;
  content = content.replace(regexSupabase, "https://id-preview--44455b56-b609-45e7-8e53-9fd580b3ca9f.lovable.app/api/public/ext/functions/v1");
  
  // 4. Corrigir o placeholder da chave (se necessário)
  content = content.replace(/LVB-XXXXX-XXXXX-XXXXX/g, "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX");
  
  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}`);
});
