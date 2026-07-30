  (function(){
    const $ = id => document.getElementById(id);
    const overlay = $('mrsemlimites-migrate-overlay');
    const log = m => { const el=$('qm-log'); el.textContent += (el.textContent?'\n':'') + m; el.scrollTop = el.scrollHeight; };
    const err = m => { const el=$('qm-log'); el.innerHTML += (el.textContent?'<br>':'') + '<span style="color:#f87171">✕ '+m+'</span>'; el.scrollTop = el.scrollHeight; };
    const ok = m => { const el=$('qm-log'); el.innerHTML += (el.textContent?'<br>':'') + '<span style="color:#4ade80">✓ '+m+'</span>'; el.scrollTop = el.scrollHeight; };

    $('mrsemlimites-migrate-btn')?.addEventListener('click', () => { overlay.style.display='block'; $('qm-log').innerHTML=''; });
    $('mrsemlimites-migrate-close')?.addEventListener('click', () => overlay.style.display='none');

    function normalizeUrl(u){ return (u||'').trim().replace(/\/+$/,''); }
    function getCreds(){
      const url = normalizeUrl($('qm-url').value);
      const key = $('qm-key').value.trim();
      if(!url || !/^https:\/\/.+\.supabase\.co$/.test(url)) throw new Error('URL inválida (ex: https://xxxx.supabase.co)');
      if(!key || key.length < 40) throw new Error('Service role key inválida');
      return { url, key, h: { 'apikey': key, 'Authorization': 'Bearer '+key, 'Content-Type': 'application/json' } };
    }

    // CSV parser (aceita campos aspados, vírgulas, quebras de linha, "" escape)
    function parseCSV(text){
      const rows=[]; let row=[], field='', inQ=false, i=0;
      while(i<text.length){
        const c=text[i];
        if(inQ){
          if(c==='"' && text[i+1]==='"'){ field+='"'; i+=2; continue; }
          if(c==='"'){ inQ=false; i++; continue; }
          field+=c; i++; continue;
        }
        if(c==='"'){ inQ=true; i++; continue; }
        if(c===','){ row.push(field); field=''; i++; continue; }
        if(c==='\r'){ i++; continue; }
        if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=''; i++; continue; }
        field+=c; i++;
      }
      if(field.length||row.length){ row.push(field); rows.push(row); }
      const header = rows.shift() || [];
      return rows.filter(r => r.length===header.length).map(r => {
        const obj={}; header.forEach((k,j)=>{ let v=r[j]; if(v==='')v=null; obj[k]=v; }); return obj;
      });
    }

    $('qm-test').addEventListener('click', async () => {
      $('qm-log').innerHTML='';
      try{
        const c = getCreds();
        log('→ Testando '+c.url+' ...');
        const r = await fetch(c.url+'/rest/v1/', { headers: c.h });
        if(!r.ok) throw new Error('HTTP '+r.status);
        ok('Conexão OK — REST API respondeu.');
        const r2 = await fetch(c.url+'/auth/v1/admin/users?per_page=1', { headers: c.h });
        if(r2.ok) ok('Admin API OK — service_role válida.');
        else err('Admin API falhou (HTTP '+r2.status+'). Verifique que a key é service_role e não anon.');
      }catch(e){ err(e.message); }
    });

    // Ordem de import respeitando FKs
    const TABLES = ['profiles','user_roles','licenses','license_activations','payment_products','promo_codes','payments','credit_transactions','hero_settings','asaas_settings','integration_settings','automations','automation_runs','automation_step_logs','page_events'];

    async function batchInsert(c, table, rows){
      const CHUNK=200; let done=0;
      for(let i=0;i<rows.length;i+=CHUNK){
        const chunk = rows.slice(i,i+CHUNK);
        const r = await fetch(c.url+'/rest/v1/'+table, {
          method:'POST',
          headers: { ...c.h, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(chunk)
        });
        if(!r.ok){
          const t = await r.text();
          throw new Error(table+' — HTTP '+r.status+' — '+t.slice(0,200));
        }
        done += chunk.length;
      }
      return done;
    }

    async function createUsers(c, profiles){
      let created=0, skipped=0;
      for(const p of profiles){
        if(!p.email) { skipped++; continue; }
        const body = {
          id: p.id,
          email: p.email,
          email_confirm: true,
          user_metadata: { full_name: p.full_name||null, whatsapp: p.whatsapp||null, cpf: p.cpf||null }
        };
        const r = await fetch(c.url+'/auth/v1/admin/users', {
          method:'POST', headers: c.h, body: JSON.stringify(body)
        });
        if(r.ok) created++;
        else if(r.status===422) skipped++;   // já existe
        else { const t=await r.text(); throw new Error('Auth '+p.email+' — '+r.status+' '+t.slice(0,150)); }
      }
      return { created, skipped };
    }

    $('qm-run').addEventListener('click', async () => {
      $('qm-log').innerHTML='';
      const btn = $('qm-run'); btn.disabled=true; btn.textContent='EXECUTANDO...';
      try{
        const c = getCreds();
        const file = $('qm-zip').files[0];
        if(!file) throw new Error('Selecione o arquivo ZIP exportado.');
        if(typeof JSZip==='undefined') throw new Error('JSZip não carregado.');

        log('→ Lendo ZIP...');
        const zip = await JSZip.loadAsync(file);
        const csvs = {};
        for(const name of Object.keys(zip.files)){
          const m = name.match(/(?:^|\/)data\/([a-z_]+)\.csv$/i);
          if(m) csvs[m[1]] = await zip.files[name].async('string');
        }
        const found = Object.keys(csvs);
        if(!found.length) throw new Error('Nenhum arquivo data/*.csv encontrado no ZIP.');
        ok('ZIP lido — '+found.length+' tabelas encontradas: '+found.join(', '));

        // 1) Usuários (via Admin API — preserva UUIDs)
        if($('qm-users').checked && csvs.profiles){
          log('\n→ Recriando usuários no Auth...');
          const profs = parseCSV(csvs.profiles);
          const res = await createUsers(c, profs);
          ok('Usuários: '+res.created+' criados, '+res.skipped+' já existiam.');
        }

        // 2) Dados
        if($('qm-data').checked){
          for(const t of TABLES){
            if(!csvs[t]) continue;
            const rows = parseCSV(csvs[t]);
            if(!rows.length){ log('  · '+t+': vazio'); continue; }
            log('→ Inserindo '+t+' ('+rows.length+' linhas)...');
            try{
              const n = await batchInsert(c, t, rows);
              ok(t+': '+n+' inseridas');
            }catch(e){ err(t+' falhou — '+e.message); }
          }
        }

        ok('\n✔ MIGRAÇÃO CONCLUÍDA');
        log('\nPróximos passos manuais:');
        log('  • Buckets do Storage: recriar em Storage → New bucket e re-upload dos arquivos.');
        log('  • Secrets (ASAAS, META, etc): recadastrar em Settings → Edge Functions → Secrets.');
        log('  • Google OAuth: configurar em Authentication → Providers.');
        log('  • Usuários farão "Esqueci senha" no 1º login (hashes não são migráveis).');
      }catch(e){ err(e.message); }
      finally{ btn.disabled=false; btn.textContent='▶ INICIAR MIGRAÇÃO'; }
    });
  })();
