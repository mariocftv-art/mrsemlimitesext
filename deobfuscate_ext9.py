import os
import re

EXT_DIR = 'extensions/ext-09/integrated/MR Sem Limite Ext 9/'
FILES_TO_CLEAN = ['sidepanel.js', 'background.js', 'pageHook.js', 'castle-capture.js', 'lv-core.js', 'content.js']

# Subdomínios Supabase conhecidos (ofuscados ou não)
OLD_SUBDOMAINS = [
    'cvbgrjauqjawrsyknhyj',
    'dwpuqewnfibeldegvimp',
    'hckncgrfhedoswsdkyni'
]

NEW_BACKEND = 'mrsemlimitesext.lovable.app'

def clean_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Neutralizar ql_license_valid checks que limpam storage
    # Procuro por chrome.storage.local.remove ou localStorage.clear() dentro de funções de erro
    # No sidepanel.js, a função _n4ce99a limpa tudo.
    
    if 'sidepanel.js' in filepath:
        # Neutralizar a função _n4ce99a (o nome pode mudar, mas o padrão de limpeza é ql_lic...)
        content = re.sub(r'function _n4ce99a\([^)]*\)\{', 'function _n4ce99a(_n46adb7){return; // Neutralizado', content)
        
    # 2. Substituir subdomínios Supabase antigos pelo novo backend ou silenciar
    for sub in OLD_SUBDOMAINS:
        # Tenta achar formas ofuscadas: 'abc'+'def'
        parts = [sub[i:i+3] for i in range(0, len(sub), 3)]
        # Este é um exemplo simples, a ofuscação pode ser mais complexa.
        # Vamos tentar um replace direto na string final se ela for montada.
        
    # 3. Forçar o ql_license_valid para true se houver qualquer ql_lk
    # content = content.replace("ql_license_valid", "true || ql_license_valid") # Perigoso se não for cuidadoso

    # 4. Ajustar manifest.json separadamente
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned {filepath}")

for f in FILES_TO_CLEAN:
    clean_file(os.path.join(EXT_DIR, f))

# Limpar manifest.json
manifest_path = os.path.join(EXT_DIR, 'manifest.json')
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        m = f.read()
    for sub in OLD_SUBDOMAINS:
        m = m.replace(f"{sub}.supabase.co", NEW_BACKEND)
    with open(manifest_path, 'w') as f:
        f.write(m)
    print("Cleaned manifest.json")

