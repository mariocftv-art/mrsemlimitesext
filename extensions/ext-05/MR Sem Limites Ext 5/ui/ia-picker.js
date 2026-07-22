/* MR Sem Limites — Painel IAs (seletor de modo). UI-only, não altera backend/licença. */
(function(){
  var IAS = [
    {group:'auto', id:'auto',      emoji:'✨', title:'AUTO — Melhor para o comando', score:10, power:'A extensão detecta se o pedido é texto, imagem, vídeo ou voz e escolhe SEMPRE o melhor modelo disponível.', tag:'INTELIGENTE', directive:'MODO AUTO: analise o pedido do usuário e escolha SEMPRE o melhor modelo disponível para a tarefa — GPT-5 / Claude Opus 4 para código pesado, Claude Sonnet 4.5 para código sério, Gemini 2.5 Pro para contexto grande, Nano Banana / GPT-Image para imagem premium, Veo 3 para vídeo com áudio, ElevenLabs para voz humana premium, Lovable TTS OpenAI/Gemini para narração rápida. Escolha e execute com a máxima qualidade.'},
    {group:'text', id:'gpt5',      emoji:'🚀', title:'GPT-5 / Claude Opus 4', score:10, power:'Tarefa complexa, código difícil, raciocínio pesado. Máximo poder (mais caro).',      tag:'CÓDIGO PESADO',    directive:'Use o modelo de MAIS ALTO poder disponível (nível 10 — GPT-5 / Claude Opus 4). Tarefa complexa, exige raciocínio profundo e código de altíssima qualidade.'},
    {group:'text', id:'sonnet',    emoji:'🧠', title:'Claude Sonnet 4.5',      score:9,  power:'Código sério, análise longa. Equilíbrio top entre qualidade e custo.',              tag:'EQUILÍBRIO TOP',   directive:'Use o modelo Claude Sonnet 4.5 (nível 9). Ideal para código sério e análise longa com equilíbrio de custo e qualidade.'},
    {group:'text', id:'gempro',    emoji:'🔮', title:'Gemini 2.5 Pro',         score:8,  power:'Raciocínio + contexto gigante. Ótimo para arquivos grandes e análise ampla.',       tag:'CONTEXTO GIGANTE', directive:'Use o modelo Gemini 2.5 Pro (nível 8). Priorize raciocínio profundo com contexto grande.'},
    {group:'text', id:'gpt5mini',  emoji:'⚡', title:'GPT-5 mini',             score:7,  power:'Bom e barato para a maioria das tarefas do dia-a-dia.',                             tag:'CUSTO/BENEFÍCIO',  directive:'Use o modelo GPT-5 mini (nível 7). Bom equilíbrio para tarefas comuns e código médio.'},
    {group:'text', id:'gemflash',  emoji:'💨', title:'Gemini 2.5 Flash',       score:6,  power:'Padrão do Lovable. Rápido, respostas do dia-a-dia. ⭐',                             tag:'PADRÃO',           directive:'Use o modelo Gemini 2.5 Flash (nível 6 — padrão do Lovable). Rápido e barato.'},
    {group:'text', id:'gemlite',   emoji:'🪶', title:'Gemini 2.5 Flash Lite',  score:4,  power:'Ultra rápido, tarefas simples, quase de graça.',                                    tag:'ULTRA RÁPIDO',     directive:'Use o modelo Gemini 2.5 Flash Lite (nível 4). Tarefa simples e resposta rápida.'},
    {group:'text', id:'gpt5nano',  emoji:'🐜', title:'GPT-5 nano',             score:3,  power:'Classificação, respostas curtas e diretas.',                                        tag:'MICRO TAREFAS',    directive:'Use o modelo GPT-5 nano (nível 3). Classificação ou resposta muito curta.'},
    {group:'img',  id:'nano',      emoji:'🍌', title:'Gemini 2.5 Flash Image (Nano Banana)', score:10, power:'Texto legível, marketing e UI. Melhor qualidade em imagem.',       tag:'MARKETING/UI',     directive:'MODO IMAGEM: gere imagem com Gemini 2.5 Flash Image (Nano Banana) — foque em texto legível e qualidade de marketing.'},
    {group:'img',  id:'gptimg',    emoji:'🖼️', title:'GPT-Image',              score:10, power:'Texto legível, marketing, ativos polidos.',                                        tag:'ALTA FIDELIDADE',  directive:'MODO IMAGEM: gere imagem com GPT-Image — foque em texto legível e ativos polidos.'},
    {group:'img',  id:'flux',      emoji:'🎨', title:'Flux',                   score:7,  power:'Imagem geral rápida, boa base para arte conceitual.',                                tag:'RÁPIDO',           directive:'MODO IMAGEM: gere imagem com Flux — imagem geral rápida.'},
    {group:'vid',  id:'veo3',      emoji:'🎬', title:'Veo 3 (Google)',         score:9,  power:'Vídeo com ÁUDIO. Máxima qualidade cinematográfica.',                                 tag:'COM ÁUDIO',        directive:'MODO VÍDEO: gere vídeo com Veo 3 (Google), sempre com ÁUDIO. Máxima qualidade cinematográfica.'},
    {group:'vid',  id:'veo3fast',  emoji:'⚡', title:'Veo 3 Fast',             score:7,  power:'Mais rápido e barato, ainda com áudio.',                                             tag:'RÁPIDO/BARATO',    directive:'MODO VÍDEO: gere vídeo com Veo 3 Fast — mais rápido e barato, com áudio.'},
    {group:'tts',  id:'eleven',    emoji:'🎙️', title:'ElevenLabs (voz humana premium)', score:10, power:'Voz humana ultra-realista PT-BR, entonação natural, ideal para locução profissional e Reels.', tag:'VOZ PREMIUM', directive:'MODO VOZ: gere narração/locução com ElevenLabs (voz humana premium PT-BR). Máxima naturalidade, use para vídeos profissionais e Reels.'},
    {group:'tts',  id:'ttsopenai', emoji:'🗣️', title:'Lovable TTS · OpenAI GPT-4o mini', score:9, power:'TTS premium OpenAI via Lovable AI. Rápido, PT-BR natural, com streaming.', tag:'PREMIUM RÁPIDO', directive:'MODO VOZ: gere narração com Lovable AI TTS (OpenAI gpt-4o-mini-tts). Rápido, PT-BR natural, ótimo para prévias e vídeos.'},
    {group:'tts',  id:'ttsgempro', emoji:'🎧', title:'Lovable TTS · Gemini 2.5 Pro', score:9, power:'TTS Gemini Pro via Lovable AI. Alta qualidade, entonação cinematográfica.', tag:'CINEMATOGRÁFICA', directive:'MODO VOZ: gere narração com Lovable AI TTS (Gemini 2.5 Pro TTS). Entonação cinematográfica, use para trailers e conteúdo premium.'},
    {group:'tts',  id:'ttsgem',    emoji:'💬', title:'Lovable TTS · Gemini 2.5 Flash', score:7, power:'TTS Gemini Flash via Lovable AI. Muito rápido e barato.', tag:'ULTRA RÁPIDO', directive:'MODO VOZ: gere narração com Lovable AI TTS (Gemini 2.5 Flash TTS). Rápido e econômico para prévias.'}
  ];

  // Detecta melhor IA com base no texto do usuário (modo AUTO)
  function detectBest(text){
    var t = String(text||'').toLowerCase();
    if (/\b(voz|narra|locu|fala|áudio|audio|dubl|tts|podcast)\b/.test(t)) return IAS.find(function(x){return x.id==='eleven';});
    if (/\b(reel|v[íi]deo|filme|trailer|cena|clipe|cinemato)\b/.test(t)) return IAS.find(function(x){return x.id==='veo3';});
    if (/\b(imagem|foto|logo|poster|banner|thumb|arte|desenho|ilustra)\b/.test(t)) return IAS.find(function(x){return x.id==='nano';});
    if (/\b(código|codigo|refator|bug|arquitetura|algoritmo|typescript|python|react)\b/.test(t)) return IAS.find(function(x){return x.id==='gpt5';});
    if (/\b(contexto|documento|pdf|planilha|arquivo grande|resumo longo)\b/.test(t)) return IAS.find(function(x){return x.id==='gempro';});
    return IAS.find(function(x){return x.id==='sonnet';});
  }

  var KEY = 'mr_ia_pick_v1';
  function scoreClass(s){ return s>=9?'hi':(s>=6?'mid':''); }
  function getPick(){ try { return JSON.parse(localStorage.getItem(KEY)||'null'); } catch(e){ return null; } }

  function render(){
    var pick = getPick();
    var groups = {
      auto: document.getElementById('mrIaGridAuto'),
      text: document.getElementById('mrIaGridText'),
      img:  document.getElementById('mrIaGridImg'),
      vid:  document.getElementById('mrIaGridVid'),
      tts:  document.getElementById('mrIaGridTts')
    };
    var quick = document.getElementById('mrIaQuick');
    if (!groups.text) return;
    Object.keys(groups).forEach(function(k){ if (groups[k]) groups[k].innerHTML=''; });
    if (quick) quick.innerHTML='';

    var quickPicks = ['auto','sonnet','gpt5','nano','veo3','eleven'];
    if (quick){
      quickPicks.forEach(function(id){
        var ia = IAS.find(function(x){return x.id===id;}); if(!ia) return;
        var b = document.createElement('button');
        b.type='button';
        b.className='mr-ia-qbtn'+(pick&&pick.id===ia.id?' selected':'');
        b.dataset.iaId=ia.id;
        b.innerHTML='<span class="qemj">'+ia.emoji+'</span><span class="qttl">'+ia.title+'<span class="qsub">'+ia.tag+' · '+ia.score+'/10</span></span>';
        b.addEventListener('click', function(){ setPick(ia); goChat(true); });
        quick.appendChild(b);
      });
    }

    IAS.forEach(function(ia){
      var el = document.createElement('div');
      el.className = 'mr-ia-card' + (pick && pick.id===ia.id ? ' selected' : '');
      el.dataset.iaId = ia.id;
      el.innerHTML =
        '<div class="mr-ia-check">✓</div>' +
        '<div class="mr-ia-head">' +
          '<div class="mr-ia-emoji">'+ia.emoji+'</div>' +
          '<div class="mr-ia-title">'+ia.title+'</div>' +
          '<div class="mr-ia-score '+scoreClass(ia.score)+'">'+ia.score+'/10</div>' +
        '</div>' +
        '<div class="mr-ia-power">'+ia.power+'</div>' +
        '<span class="mr-ia-tag">'+ia.tag+'</span>' +
        '<div style="display:flex;gap:6px;margin-top:6px">' +
          '<button class="mr-btn primary" data-act="use" style="flex:1">✅ Usar '+ia.emoji+'</button>' +
        '</div>';
      el.querySelector('[data-act="use"]').addEventListener('click', function(ev){
        ev.stopPropagation(); setPick(ia); goChat(true);
      });
      el.addEventListener('click', function(){ setPick(ia); });
      groups[ia.group].appendChild(el);
    });
    updateBadge();
  }

  function setPick(ia){
    localStorage.setItem(KEY, JSON.stringify({id:ia.id, title:ia.title, emoji:ia.emoji, directive:ia.directive}));
    document.querySelectorAll('.mr-ia-card,.mr-ia-qbtn').forEach(function(c){
      c.classList.toggle('selected', c.dataset.iaId===ia.id);
    });
    updateBadge();
  }

  function clearPick(){
    localStorage.removeItem(KEY);
    document.querySelectorAll('.mr-ia-card,.mr-ia-qbtn').forEach(function(c){ c.classList.remove('selected'); });
    updateBadge();
  }

  function updateBadge(){
    var pick = getPick();
    var badge = document.getElementById('mrIaActiveBadge');
    var chip = document.getElementById('mrIaChip');
    var chipText = document.getElementById('mrIaChipText');
    if (pick){
      if (badge) badge.textContent = 'Modo ativo: '+pick.emoji+' '+pick.title;
      if (chip) chip.classList.add('show');
      if (chipText) chipText.textContent = pick.emoji+' Modo: '+pick.title;
    } else {
      if (badge) badge.textContent = 'Modo ativo: Padrão';
      if (chip) chip.classList.remove('show');
    }
  }

  function goChat(prefill){
    var chatTab = document.querySelector('.mr-tab[data-mrtab="chat"]');
    if (chatTab) chatTab.click();
    if (prefill){
      var pick = getPick();
      var ta = document.getElementById('message');
      if (pick && ta){
        var prefix = '[MR SEM LIMITES — DIRECIONAMENTO IA]\n'+pick.directive+'\n\n';
        if (!ta.value || !ta.value.startsWith('[MR SEM LIMITES — DIRECIONAMENTO IA]')){
          ta.value = prefix + (ta.value||'');
        }
        try { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } catch(e){}
      }
    }
  }

  function init(){
    render();
    var clr = document.getElementById('mrIaClear');
    if (clr) clr.addEventListener('click', clearPick);
    var chipX = document.getElementById('mrIaChipClear');
    if (chipX) chipX.addEventListener('click', clearPick);
    // Re-render quando o usuário abrir a aba IAs (garante que os grids existam no DOM)
    document.querySelectorAll('.mr-tab[data-mrtab="ias"]').forEach(function(t){
      t.addEventListener('click', function(){ setTimeout(render, 30); });
    });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
