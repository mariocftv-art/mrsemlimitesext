import fs from 'fs';
import path from 'path';

const SITE_URL = 'id-preview--44455b56-b609-45e7-8e53-9fd580b3ca9f.lovable.app';
const PROXY_PATH = '/api/public/ext';
const FULL_PROXY_URL = `${SITE_URL}${PROXY_PATH}`;

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walk(filepath, callback);
    } else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html'))) {
      callback(filepath);
    }
  });
}

console.log(`Starting URL replacement to: ${FULL_PROXY_URL}`);

walk('extensions', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // 1. Replace manifest host permissions
  content = content.replace(/dwpuqewnfibeldegvimp\.supabase\.co/g, SITE_URL);

  // 2. Replace obfuscated host variables in JS (more flexible regex)
  // Pattern: _n17ce4c='dwp'+'uqe'+'wn'+('fib'+'eld'+'egv'+'imp')
  content = content.replace(/_n17ce4c=['"]dwp['"]\+['"]uqe['"]\+['"]wn['"]\+\(['"]fib['"]\+['"]eld['"]\+['"]egv['"]\+['"]imp['"]\)/g, `_n17ce4c='${FULL_PROXY_URL}'`);
  content = content.replace(/_n17ce4c=['"]dwp['"]\+['"]uqe['"]\+['"]wn['"]\+(['"]fib['"]\+['"]eld['"]\+['"]egv['"]\+['"]imp['"]\)/g, `_n17ce4c='${FULL_PROXY_URL}'`);
  
  content = content.replace(/_n2dfabf=['"]dwp['"]\+['"]uqe['"]\+['"]wn['"]\+\(['"]fib['"]\+['"]eld['"]\+['"]egv['"]\+['"]imp['"]\)/g, `_n2dfabf='${FULL_PROXY_URL}'`);
  content = content.replace(/_n2dfabf=['"]dwp['"]\+['"]uqe['"]\+['"]wn['"]\+(['"]fib['"]\+['"]eld['"]\+['"]egv['"]\+['"]imp['"]\)/g, `_n2dfabf='${FULL_PROXY_URL}'`);

  // 3. Suffixes
  content = content.replace(/\+\(['"]\.su['"]\+['"]pab['"]\+['"]ase['"]\+['"]\.co['"]\)/g, '');
  content = content.replace(/\+['"]\.su['"]\+['"]pab['"]\+['"]ase['"]\+['"]\.co['"]/g, '');

  // 4. Full URL strings
  content = content.replace(/dwpuqewnfibeldegvimp\.supabase\.co\/functions\/v1/g, FULL_PROXY_URL + '/functions/v1');

  if (content !== original) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated: ${filepath}`);
  }
});

